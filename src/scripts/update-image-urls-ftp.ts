/**
 * Mirror legacy image URLs to FTP and update database paths.
 * Run: npm run update-image-urls
 */
import 'dotenv/config';
import axios from 'axios';
import path from 'path';
import { initConnection, executeQuery, executeUpdate } from '../utils/database';
import { isFtpConfigured, normalizeMediaUrl, uploadToFtp } from '../utils/ftp';

const FTP_BASE = (process.env.FTP_PUBLIC_BASE_URL || '').replace(/\/$/, '');

const URL_COLUMN_NAMES = ['image_url', 'file_url', 'image', 'thumbnail_url', 'cover_image'];

function extractFilename(urlPath: string): string {
  return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}

export function rewriteToFtpUrl(oldUrl: string): string | null {
  const next = normalizeMediaUrl(oldUrl);
  if (!next || next === oldUrl.trim()) return null;
  return next;
}

function isBrokenCdnUrl(url: string): boolean {
  return /ahwuae\.com\/investoredu\/uploads\//i.test(url);
}

function shouldMirrorToFtp(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|svg|pdf)(\?|$)/i.test(url) || /uasa\.ae\/en\/gal(img|org)\//i.test(url);
}

async function mirrorFile(sourceUrl: string, filename: string, cache: Map<string, boolean>): Promise<void> {
  if (cache.has(filename)) return;

  try {
    const response = await axios.get(sourceUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: { 'User-Agent': 'UASA-InvestorEdu-Migration/1.0' },
    });
    await uploadToFtp(Buffer.from(response.data), filename);
    cache.set(filename, true);
    console.log(`  mirrored: ${filename}`);
  } catch (error: any) {
    console.warn(`  skip mirror ${filename}: ${error.message}`);
    cache.set(filename, false);
  }
}

function rewriteJsonValue(value: unknown, changes: Array<{ from: string; to: string }>): unknown {
  if (typeof value === 'string') {
    const next = rewriteToFtpUrl(value);
    if (next && next !== value) {
      changes.push({ from: value, to: next });
      return next;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteJsonValue(item, changes));
  }

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = rewriteJsonValue(val, changes);
    }
    return out;
  }

  return value;
}

async function updateUrlColumns(mirrored: Map<string, boolean>): Promise<number> {
  const placeholders = URL_COLUMN_NAMES.map(() => '?').join(', ');
  const columns = await executeQuery<{ TABLE_NAME: string; COLUMN_NAME: string }>(
    `SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND COLUMN_NAME IN (${placeholders})
     ORDER BY TABLE_NAME, COLUMN_NAME`,
    [process.env.DB_NAME, ...URL_COLUMN_NAMES]
  );

  let updated = 0;

  for (const { TABLE_NAME, COLUMN_NAME } of columns) {
    const rows = await executeQuery<{ id: number; url_value: string }>(
      `SELECT id, \`${COLUMN_NAME}\` AS url_value FROM \`${TABLE_NAME}\`
       WHERE \`${COLUMN_NAME}\` IS NOT NULL AND \`${COLUMN_NAME}\` != ''`
    );

    for (const row of rows) {
      const newUrl = rewriteToFtpUrl(row.url_value);
      if (!newUrl || newUrl === row.url_value) continue;

      const filename = extractFilename(newUrl);
      if (shouldMirrorToFtp(row.url_value) && !isBrokenCdnUrl(row.url_value)) {
        await mirrorFile(row.url_value, filename, mirrored);
      }

      await executeUpdate(
        `UPDATE \`${TABLE_NAME}\` SET \`${COLUMN_NAME}\` = ? WHERE id = ?`,
        [newUrl, row.id]
      );
      console.log(`[${TABLE_NAME}.${COLUMN_NAME}] #${row.id}`);
      console.log(`  ${row.url_value}`);
      console.log(`  -> ${newUrl}`);
      updated++;
    }
  }

  return updated;
}

async function updateMediaUploads(mirrored: Map<string, boolean>): Promise<number> {
  const rows = await executeQuery<{ id: number; file_url: string }>(
    `SELECT id, file_url FROM media_uploads WHERE file_url IS NOT NULL AND file_url != ''`
  );

  let updated = 0;
  for (const row of rows) {
    const newUrl = rewriteToFtpUrl(row.file_url);
    if (!newUrl || newUrl === row.file_url) continue;

    await executeUpdate(`UPDATE media_uploads SET file_url = ? WHERE id = ?`, [newUrl, row.id]);
    console.log(`[media_uploads] #${row.id} -> ${newUrl}`);
    updated++;
  }

  return updated;
}

async function updateSiteContent(mirrored: Map<string, boolean>): Promise<number> {
  const rows = await executeQuery<{ id: number; content_key: string; content: unknown }>(
    `SELECT id, content_key, content FROM site_content`
  );

  let updated = 0;

  for (const row of rows) {
    const raw = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    const changes: Array<{ from: string; to: string }> = [];
    const next = rewriteJsonValue(raw, changes);

    if (!changes.length) continue;

    for (const change of changes) {
      if (shouldMirrorToFtp(change.from) && !isBrokenCdnUrl(change.from)) {
        const filename = extractFilename(change.to);
        await mirrorFile(change.from, filename, mirrored);
      }
    }

    await executeUpdate(`UPDATE site_content SET content = ? WHERE id = ?`, [
      JSON.stringify(next),
      row.id,
    ]);

    console.log(`[site_content:${row.content_key}] ${changes.length} URL(s) updated`);
    changes.forEach((c) => console.log(`  ${c.from} -> ${c.to}`));
    updated++;
  }

  return updated;
}

async function main() {
  if (!isFtpConfigured()) {
    console.error('FTP is not configured in .env');
    process.exit(1);
  }

  console.log(`FTP base URL: ${FTP_BASE}\n`);
  await initConnection();

  const mirrored = new Map<string, boolean>();
  const columnUpdates = await updateUrlColumns(mirrored);
  const mediaUpdates = await updateMediaUploads(mirrored);
  const siteUpdates = await updateSiteContent(mirrored);

  console.log('\n=== Summary ===');
  console.log(`url columns updated: ${columnUpdates}`);
  console.log(`media_uploads updated: ${mediaUpdates}`);
  console.log(`site_content blocks updated: ${siteUpdates}`);
  console.log(`files mirrored to FTP: ${[...mirrored.values()].filter(Boolean).length}`);
}

main().catch((error) => {
  console.error('Update failed:', error.message);
  process.exit(1);
});
