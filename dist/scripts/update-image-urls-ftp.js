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
const REWRITE_RULES = [
    { pattern: /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i, label: 'uasa.ae/galorg' },
    { pattern: /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i, label: 'uasa.ae/galimg' },
    { pattern: /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i, label: 'investoreducation.uasa.ae/uploads' },
    { pattern: /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/(.+)$/i, label: 'ahwuae.com/investoredu/uploads' },
    { pattern: /^https?:\/\/[^/]+\/uploads\/(.+)$/i, label: 'legacy /uploads' },
];
function extractFilename(urlPath) {
    return decodeURIComponent(urlPath.split('/').pop() || urlPath);
}
function rewriteToFtpUrl(oldUrl) {
    if (!oldUrl || !FTP_BASE)
        return null;
    const normalized = oldUrl.trim();
    if (normalized.startsWith(FTP_BASE + '/')) {
        return normalized.replace(/^http:\/\//i, 'https://');
    }
    for (const { pattern } of REWRITE_RULES) {
        const match = normalized.match(pattern);
        if (match) {
            const filename = extractFilename(match[1]);
            return `${FTP_BASE}/${filename}`;
        }
    }
    return null;
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
async function updateImageColumns(mirrored) {
    const columns = await (0, database_1.executeQuery)(`SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND COLUMN_NAME = 'image_url'
     ORDER BY TABLE_NAME`, [process.env.DB_NAME]);
    let updated = 0;
    for (const { TABLE_NAME, COLUMN_NAME } of columns) {
        const rows = await (0, database_1.executeQuery)(`SELECT id, \`${COLUMN_NAME}\` AS image_url FROM \`${TABLE_NAME}\`
       WHERE \`${COLUMN_NAME}\` IS NOT NULL AND \`${COLUMN_NAME}\` != ''`);
        for (const row of rows) {
            const newUrl = rewriteToFtpUrl(row.image_url);
            if (!newUrl || newUrl === row.image_url)
                continue;
            const filename = extractFilename(newUrl);
            if (shouldMirrorToFtp(row.image_url)) {
                await mirrorFile(row.image_url, filename, mirrored);
            }
            await (0, database_1.executeUpdate)(`UPDATE \`${TABLE_NAME}\` SET \`${COLUMN_NAME}\` = ? WHERE id = ?`, [newUrl, row.id]);
            console.log(`[${TABLE_NAME}] #${row.id}`);
            console.log(`  ${row.image_url}`);
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
            if (shouldMirrorToFtp(change.from)) {
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
    const columnUpdates = await updateImageColumns(mirrored);
    const mediaUpdates = await updateMediaUploads(mirrored);
    const siteUpdates = await updateSiteContent(mirrored);
    console.log('\n=== Summary ===');
    console.log(`image_url columns updated: ${columnUpdates}`);
    console.log(`media_uploads updated: ${mediaUpdates}`);
    console.log(`site_content blocks updated: ${siteUpdates}`);
    console.log(`files mirrored to FTP: ${[...mirrored.values()].filter(Boolean).length}`);
}
main().catch((error) => {
    console.error('Update failed:', error.message);
    process.exit(1);
});
//# sourceMappingURL=update-image-urls-ftp.js.map