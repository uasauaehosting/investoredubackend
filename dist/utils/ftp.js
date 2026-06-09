"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFtpConfigured = isFtpConfigured;
exports.getFtpConfig = getFtpConfig;
exports.uploadToFtp = uploadToFtp;
const basic_ftp_1 = require("basic-ftp");
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
        return `${config.publicBaseUrl}/${filename}`;
    }
    finally {
        client.close();
    }
}
//# sourceMappingURL=ftp.js.map