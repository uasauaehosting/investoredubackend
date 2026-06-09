"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFtpConfigured = isFtpConfigured;
exports.getFtpConfig = getFtpConfig;
exports.getPublicUploadUrl = getPublicUploadUrl;
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
        remotePath: process.env.FTP_REMOTE_PATH || '/public_html/uploads',
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
        const remoteDir = config.remotePath.replace(/\\/g, '/');
        await client.ensureDir(remoteDir);
        const remoteFile = path_1.default.posix.join(remoteDir, filename);
        await client.uploadFrom(stream_1.Readable.from(buffer), remoteFile);
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
        const remoteDir = config.remotePath.replace(/\\/g, '/');
        const remoteFile = path_1.default.posix.join(remoteDir, filename);
        const tmpPath = path_1.default.join(os_1.default.tmpdir(), `ftp-dl-${Date.now()}-${filename}`);
        try {
            await client.downloadTo(tmpPath, remoteFile);
            return fs_1.default.readFileSync(tmpPath);
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