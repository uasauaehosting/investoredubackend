"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteToFtpUrl = rewriteToFtpUrl;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../utils/database");
const ftp_1 = require("../utils/ftp");
const FTP_BASE = (process.env.FTP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
const URL_COLUMN_NAMES = ['image_url', 'file_url', 'image', 'thumbnail_url', 'cover_image'];
function extractFilename(urlPath) {
    return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}
function rewriteToFtpUrl(oldUrl) {
    const next = (0, ftp_1.normalizeMediaUrl)(oldUrl);
    if (!next || next === oldUrl.trim())
        return null;
    return next;
}
function isBrokenCdnUrl(url) {
    return /ahwuae\.com\/investoredu\/uploads\//i.test(url);
}
function shouldMirrorToFtp(url) {
    return /\.(jpe?g|png|gif|webp|svg|pdf)(\?|$)/i.test(url) || /uasa\.ae\/en\/gal(img|org)\//i.test(url);
}
async function mirrorFile(sourceUrl, filename, cache) {
    if (cache.has(filename))
        return;
    try {
        const response = await axios_1.default.get(sourceUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: { 'User-Agent': 'UASA-InvestorEdu-Migration/1.0' },
        });
        await (0, ftp_1.uploadToFtp)(Buffer.from(response.data), filename);
        cache.set(filename, true);
        console.log(`  mirrored: ${filename}`);
    }
    catch (error) {
        console.warn(`  skip mirror ${filename}: ${error.message}`);
        cache.set(filename, false);
    }
}
function rewriteJsonValue(value, changes) {
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
        const out = {};
        for (const [key, val] of Object.entries(value)) {
            out[key] = rewriteJsonValue(val, changes);
        }
        return out;
    }
    return value;
}
async function updateUrlColumns(mirrored) {
    const placeholders = URL_COLUMN_NAMES.map(() => '?').join(', ');
    const columns = await (0, database_1.executeQuery)(`SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND COLUMN_NAME IN (${placeholders})
     ORDER BY TABLE_NAME, COLUMN_NAME`, [process.env.DB_NAME, ...URL_COLUMN_NAMES]);
    let updated = 0;
    for (const { TABLE_NAME, COLUMN_NAME } of columns) {
        const rows = await (0, database_1.executeQuery)(`SELECT id, \`${COLUMN_NAME}\` AS url_value FROM \`${TABLE_NAME}\`
       WHERE \`${COLUMN_NAME}\` IS NOT NULL AND \`${COLUMN_NAME}\` != ''`);
        for (const row of rows) {
            const newUrl = rewriteToFtpUrl(row.url_value);
            if (!newUrl || newUrl === row.url_value)
                continue;
            const filename = extractFilename(newUrl);
            if (shouldMirrorToFtp(row.url_value) && !isBrokenCdnUrl(row.url_value)) {
                await mirrorFile(row.url_value, filename, mirrored);
            }
            await (0, database_1.executeUpdate)(`UPDATE \`${TABLE_NAME}\` SET \`${COLUMN_NAME}\` = ? WHERE id = ?`, [newUrl, row.id]);
            console.log(`[${TABLE_NAME}.${COLUMN_NAME}] #${row.id}`);
            console.log(`  ${row.url_value}`);
            console.log(`  -> ${newUrl}`);
            updated++;
        }
    }
    return updated;
}
async function updateMediaUploads(mirrored) {
    const rows = await (0, database_1.executeQuery)(`SELECT id, file_url FROM media_uploads WHERE file_url IS NOT NULL AND file_url != ''`);
    let updated = 0;
    for (const row of rows) {
        const newUrl = rewriteToFtpUrl(row.file_url);
        if (!newUrl || newUrl === row.file_url)
            continue;
        await (0, database_1.executeUpdate)(`UPDATE media_uploads SET file_url = ? WHERE id = ?`, [newUrl, row.id]);
        console.log(`[media_uploads] #${row.id} -> ${newUrl}`);
        updated++;
    }
    return updated;
}
async function updateSiteContent(mirrored) {
    const rows = await (0, database_1.executeQuery)(`SELECT id, content_key, content FROM site_content`);
    let updated = 0;
    for (const row of rows) {
        const raw = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
        const changes = [];
        const next = rewriteJsonValue(raw, changes);
        if (!changes.length)
            continue;
        for (const change of changes) {
            if (shouldMirrorToFtp(change.from) && !isBrokenCdnUrl(change.from)) {
                const filename = extractFilename(change.to);
                await mirrorFile(change.from, filename, mirrored);
            }
        }
        await (0, database_1.executeUpdate)(`UPDATE site_content SET content = ? WHERE id = ?`, [
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
    if (!(0, ftp_1.isFtpConfigured)()) {
        console.error('FTP is not configured in .env');
        process.exit(1);
    }
    console.log(`FTP base URL: ${FTP_BASE}\n`);
    await (0, database_1.initConnection)();
    const mirrored = new Map();
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
//# sourceMappingURL=update-image-urls-ftp.js.map