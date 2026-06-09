"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFtpConfigured = isFtpConfigured;
exports.getFtpConfig = getFtpConfig;
exports.getPublicUploadUrl = getPublicUploadUrl;
exports.normalizeMediaUrl = normalizeMediaUrl;
exports.getMimeTypeForFilename = getMimeTypeForFilename;
exports.isSafeUploadFilename = isSafeUploadFilename;
exports.uploadToFtp = uploadToFtp;
exports.downloadFromFtp = downloadFromFtp;
const basic_ftp_1 = require("basic-ftp");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
function isFtpConfigured() {
    return Boolean(process.env.FTP_HOST &&
        process.env.FTP_USER &&
        process.env.FTP_PASSWORD &&
        process.env.FTP_PUBLIC_BASE_URL);
}
const LEGACY_FTP_REMOTE_PATH = '/home/u827794112/domains/ahwuae.com/public_html/investoredu/uploads';
function normalizeRemotePath(remotePath) {
    return remotePath.replace(/\\/g, '/');
}
function getDownloadRemotePaths(primaryPath) {
    const legacy = process.env.FTP_LEGACY_REMOTE_PATH || LEGACY_FTP_REMOTE_PATH;
    return [...new Set([primaryPath, legacy].map(normalizeRemotePath))];
}
function getFtpConfig() {
    const host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;
    const publicBaseUrl = process.env.FTP_PUBLIC_BASE_URL;
    if (!host || !user || !password || !publicBaseUrl) {
        throw new Error('FTP is not configured. Set FTP_HOST, FTP_USER, FTP_PASSWORD, and FTP_PUBLIC_BASE_URL.');
    }
    return {
        host,
        user,
        password,
        port: parseInt(process.env.FTP_PORT || '21', 10),
        secure: process.env.FTP_SECURE === 'true',
        remotePath: normalizeRemotePath(process.env.FTP_REMOTE_PATH || '/investoredu/uploads'),
        publicBaseUrl: publicBaseUrl.replace(/\/$/, ''),
    };
}
function getPublicUploadUrl(filename) {
    const base = (process.env.FTP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    if (!base) {
        throw new Error('FTP_PUBLIC_BASE_URL is not configured.');
    }
    return `${base}/${filename}`;
}
const MEDIA_URL_REWRITE_RULES = [
    /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
    /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
    /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
    /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/(.+)$/i,
    /^https?:\/\/[^/]+\/uploads\/(.+)$/i,
];
function extractFilenameFromUrlPath(urlPath) {
    return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}
function normalizeMediaUrl(oldUrl) {
    if (!oldUrl)
        return null;
    const base = (process.env.FTP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    if (!base)
        return oldUrl.trim();
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
const MIME_BY_EXT = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
};
function getMimeTypeForFilename(filename) {
    const ext = path_1.default.extname(filename).toLowerCase();
    return MIME_BY_EXT[ext] || 'application/octet-stream';
}
function isSafeUploadFilename(filename) {
    return /^[a-zA-Z0-9._-]+$/.test(filename) && !filename.includes('..');
}
async function uploadToFtp(buffer, filename) {
    const config = getFtpConfig();
    const client = new basic_ftp_1.Client(30000);
    try {
        await client.access({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port,
            secure: config.secure,
        });
        const remoteDir = normalizeRemotePath(config.remotePath);
        await client.ensureDir(remoteDir);
        await client.uploadFrom(stream_1.Readable.from(buffer), path_1.default.posix.join(remoteDir, filename));
        return getPublicUploadUrl(filename);
    }
    finally {
        client.close();
    }
}
async function downloadFromFtp(filename) {
    if (!isSafeUploadFilename(filename)) {
        throw new Error('Invalid filename');
    }
    const config = getFtpConfig();
    const client = new basic_ftp_1.Client(30000);
    try {
        await client.access({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port,
            secure: config.secure,
        });
        const remoteDirs = getDownloadRemotePaths(config.remotePath);
        const tmpPath = path_1.default.join(os_1.default.tmpdir(), `ftp-dl-${Date.now()}-${filename}`);
        let lastError;
        try {
            for (const remoteDir of remoteDirs) {
                const remoteFile = path_1.default.posix.join(remoteDir, filename);
                try {
                    await client.downloadTo(tmpPath, remoteFile);
                    return fs_1.default.readFileSync(tmpPath);
                }
                catch (error) {
                    lastError = error;
                }
            }
            throw lastError || new Error(`File not found: ${filename}`);
        }
        finally {
            if (fs_1.default.existsSync(tmpPath)) {
                fs_1.default.unlinkSync(tmpPath);
            }
        }
    }
    finally {
        client.close();
    }
}
//# sourceMappingURL=ftp.js.map