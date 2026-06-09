import { Client } from 'basic-ftp';
import axios from 'axios';
import fs from 'fs';
import os from 'os';
import { Readable } from 'stream';
import path from 'path';

export interface FtpConfig {
  host: string;
  user: string;
  password: string;
  port: number;
  secure: boolean;
  remotePath: string;
  publicBaseUrl: string;
}

export function isFtpConfigured(): boolean {
  return Boolean(
    process.env.FTP_HOST &&
    process.env.FTP_USER &&
    process.env.FTP_PASSWORD &&
    process.env.FTP_PUBLIC_BASE_URL
  );
}

export const DEFAULT_FTP_REMOTE_PATH = '/investoredu/uploads';
export const DEFAULT_FTP_PUBLIC_BASE_URL = 'https://ahwuae.com/investoredu/investoredu/uploads';

const WRONG_FTP_REMOTE_PATHS = new Set([
  '/investoredu/investoredu/uploads',
  'investoredu/investoredu/uploads',
]);

const WRONG_SINGLE_UPLOADS_BASE = /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/?$/i;

function resolveRemotePath(): string {
  const configured = normalizeRemotePath(process.env.FTP_REMOTE_PATH || DEFAULT_FTP_REMOTE_PATH);
  if (WRONG_FTP_REMOTE_PATHS.has(configured)) {
    return DEFAULT_FTP_REMOTE_PATH;
  }
  return configured;
}

/** Resolve the public uploads base, correcting legacy single-path Hostinger config. */
export function resolvePublicBaseUrl(): string {
  const envBase = (process.env.FTP_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '');
  if (!envBase) {
    return DEFAULT_FTP_PUBLIC_BASE_URL;
  }
  if (WRONG_SINGLE_UPLOADS_BASE.test(envBase)) {
    return DEFAULT_FTP_PUBLIC_BASE_URL;
  }
  return envBase;
}

const LEGACY_FTP_REMOTE_PATHS = [
  '/investoredu/investoredu/uploads',
  '/home/u827794112/domains/ahwuae.com/public_html/investoredu/investoredu/uploads',
  '/home/u827794112/domains/ahwuae.com/public_html/investoredu/uploads',
];

function normalizeRemotePath(remotePath: string): string {
  return remotePath.replace(/\\/g, '/');
}

function getDownloadRemotePaths(primaryPath: string): string[] {
  const paths = [
    primaryPath,
    process.env.FTP_LEGACY_REMOTE_PATH,
    ...LEGACY_FTP_REMOTE_PATHS,
  ];
  return [...new Set(paths.filter(Boolean).map((p) => normalizeRemotePath(p as string)))];
}

export function getFtpConfig(): FtpConfig {
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const publicBaseUrl = resolvePublicBaseUrl();

  if (!host || !user || !password) {
    throw new Error('FTP is not configured. Set FTP_HOST, FTP_USER, FTP_PASSWORD, and FTP_PUBLIC_BASE_URL.');
  }

  return {
    host,
    user,
    password,
    port: parseInt(process.env.FTP_PORT || '21', 10),
    secure: process.env.FTP_SECURE === 'true',
    remotePath: resolveRemotePath(),
    publicBaseUrl,
  };
}

function getDirectUploadCandidates(): string[] {
  const candidates = [
    process.env.UPLOAD_DIRECT_PATH?.trim(),
    '/home/u827794112/investoredu/uploads',
    '/home/u827794112/domains/ahwuae.com/public_html/investoredu/uploads',
  ].filter(Boolean) as string[];

  return [...new Set(candidates.map((dir) => path.resolve(dir)))];
}

function getFtpUploadCandidates(): string[] {
  return [...new Set([resolveRemotePath(), DEFAULT_FTP_REMOTE_PATH, ...LEGACY_FTP_REMOTE_PATHS].map(normalizeRemotePath))];
}

async function writeDirectUpload(buffer: Buffer, filename: string, dir: string): Promise<void> {
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, filename);
  fs.writeFileSync(target, buffer);
  const written = fs.statSync(target).size;
  if (written !== buffer.length) {
    fs.unlinkSync(target);
    throw new Error(`Direct write size mismatch (expected ${buffer.length}, got ${written})`);
  }
}

async function verifyFtpRoundtrip(buffer: Buffer, filename: string): Promise<void> {
  const downloaded = await downloadFromFtp(filename);
  if (downloaded.length !== buffer.length) {
    throw new Error(
      `FTP roundtrip failed for ${filename} (expected ${buffer.length}, got ${downloaded.length})`
    );
  }
}

/** Verify the uploaded file is reachable at its public URL (Hostinger CDN). */
export async function verifyPublicUploadReachable(filename: string): Promise<boolean> {
  const url = getPublicUploadUrl(filename);
  const attempts = [0, 2000, 5000, 8000];

  for (const delayMs of attempts) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    try {
      const response = await axios.get(url, {
        timeout: 15000,
        validateStatus: () => true,
        responseType: 'arraybuffer',
      });

      if (response.status >= 200 && response.status < 400 && (response.data?.byteLength ?? 0) > 0) {
        return true;
      }
    } catch {
      // retry
    }
  }

  return false;
}

export function getPublicUploadUrl(filename: string): string {
  return `${resolvePublicBaseUrl()}/${filename}`;
}

const MEDIA_URL_REWRITE_RULES: RegExp[] = [
  /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
  /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/([^/]+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/investoredu\/uploads\/([^/]+)$/i,
  /^https?:\/\/[^/]+\/uploads\/(.+)$/i,
];

function extractFilenameFromUrlPath(urlPath: string): string {
  return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}

/** Normalize legacy upload URLs to the configured public uploads base URL. */
export function normalizeMediaUrl(oldUrl: string | null | undefined): string | null {
  if (!oldUrl) return null;

  const base = resolvePublicBaseUrl();
  if (!base) return oldUrl.trim();

  const normalized = oldUrl.trim();
  if (normalized.startsWith(base + '/')) {
    return normalized.replace(/^http:\/\//i, 'https://');
  }

  for (const pattern of MEDIA_URL_REWRITE_RULES) {
    const match = normalized.match(pattern);
    if (match) {
      return `${base}/${extractFilenameFromUrlPath(match[1])}`;
    }
  }

  return normalized;
}

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export function getMimeTypeForFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || 'application/octet-stream';
}

export function isSafeUploadFilename(filename: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(filename) && !filename.includes('..');
}

export async function uploadToFtp(buffer: Buffer, filename: string, remoteDir?: string): Promise<string> {
  const config = getFtpConfig();
  const client = new Client(60000);
  const targetDir = normalizeRemotePath(remoteDir || config.remotePath);

  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      secure: config.secure,
    });

    await client.ensureDir(targetDir);
    const remoteFile = path.posix.join(targetDir, filename);
    await client.uploadFrom(Readable.from(buffer), remoteFile);

    const uploadedSize = await client.size(remoteFile).catch(() => -1);
    if (uploadedSize !== buffer.length) {
      throw new Error(
        `FTP upload size mismatch for ${remoteFile} (expected ${buffer.length}, got ${uploadedSize})`
      );
    }

    return getPublicUploadUrl(filename);
  } finally {
    client.close();
  }
}

/** Upload via direct filesystem and/or FTP; confirm file is stored correctly. */
export async function uploadMediaFile(buffer: Buffer, filename: string): Promise<string> {
  const publicUrl = getPublicUploadUrl(filename);
  const failures: string[] = [];

  for (const dir of getDirectUploadCandidates()) {
    try {
      await writeDirectUpload(buffer, filename, dir);
      if (await verifyPublicUploadReachable(filename)) {
        return publicUrl;
      }
      failures.push(`direct ${dir}: stored but public URL not reachable yet`);
    } catch (error: any) {
      failures.push(`direct ${dir}: ${error.message}`);
    }
  }

  for (const remoteDir of getFtpUploadCandidates()) {
    try {
      await uploadToFtp(buffer, filename, remoteDir);
      await verifyFtpRoundtrip(buffer, filename);

      if (await verifyPublicUploadReachable(filename)) {
        return publicUrl;
      }

      // FTP storage confirmed; CDN may lag or block server-side checks.
      console.warn(
        `Upload stored at FTP ${remoteDir}/${filename} but public URL check failed; returning URL anyway`
      );
      return publicUrl;
    } catch (error: any) {
      failures.push(`ftp ${remoteDir}: ${error.message}`);
    }
  }

  throw new Error(
    `Upload failed for ${filename}. ${failures.join(' | ')}. ` +
      `Set FTP_REMOTE_PATH=${DEFAULT_FTP_REMOTE_PATH} or UPLOAD_DIRECT_PATH on the server.`
  );
}

export async function downloadFromFtp(filename: string): Promise<Buffer> {
  if (!isSafeUploadFilename(filename)) {
    throw new Error('Invalid filename');
  }

  const config = getFtpConfig();
  const client = new Client(30000);

  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      secure: config.secure,
    });

    const remoteDirs = getDownloadRemotePaths(config.remotePath);
    const tmpPath = path.join(os.tmpdir(), `ftp-dl-${Date.now()}-${filename}`);
    let lastError: Error | undefined;

    try {
      for (const remoteDir of remoteDirs) {
        const remoteFile = path.posix.join(remoteDir, filename);
        try {
          await client.downloadTo(tmpPath, remoteFile);
          return fs.readFileSync(tmpPath);
        } catch (error: any) {
          lastError = error;
        }
      }

      throw lastError || new Error(`File not found: ${filename}`);
    } finally {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  } finally {
    client.close();
  }
}
