"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const basic_ftp_1 = require("basic-ftp");
const axios_1 = __importDefault(require("axios"));
const ftp_1 = require("../utils/ftp");
const SAMPLE_JPEG = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=', 'base64');
async function checkPublicUrl(url) {
    try {
        const res = await axios_1.default.get(url, {
            timeout: 15000,
            validateStatus: () => true,
            responseType: 'arraybuffer',
        });
        const preview = Buffer.from(res.data || '').toString('utf8').slice(0, 40);
        return `HTTP ${res.status}, ${res.data?.byteLength ?? 0} bytes${res.status >= 400 ? ` — ${preview}` : ''}`;
    }
    catch (error) {
        return `ERROR: ${error.message}`;
    }
}
async function probePaths(client, filename) {
    const candidates = [
        ftp_1.DEFAULT_FTP_REMOTE_PATH,
        '/investoredu/uploads',
        '/investoredu/investoredu/uploads',
        'investoredu/uploads',
        'investoredu/investoredu/uploads',
        '/public_html/investoredu/uploads',
        '/public_html/investoredu/investoredu/uploads',
    ];
    console.log('\n--- FTP file locations ---');
    for (const dir of candidates) {
        const remote = `${dir}/${filename}`.replace(/\/+/g, '/');
        try {
            const size = await client.size(remote);
            console.log(`  FOUND ${remote} (${size} bytes)`);
        }
        catch {
            console.log(`  miss  ${remote}`);
        }
    }
}
async function main() {
    const checkFilename = process.argv[2] || '1781037026688-988363433.jpg';
    const config = (0, ftp_1.getFtpConfig)();
    console.log('=== FTP Upload Diagnosis ===\n');
    console.log(`FTP host:     ${config.host}:${config.port}`);
    console.log(`FTP user:     ${config.user}`);
    console.log(`Remote path:  ${config.remotePath}`);
    console.log(`Public base:  ${(0, ftp_1.resolvePublicBaseUrl)()}`);
    console.log(`Check file:   ${checkFilename}`);
    const client = new basic_ftp_1.Client(60000);
    await client.access({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port,
        secure: config.secure,
    });
    const pwd = await client.pwd();
    console.log(`FTP pwd:      ${pwd}`);
    const root = await client.list();
    console.log(`FTP listing:  ${root.map((i) => (i.isDirectory ? `[dir] ${i.name}` : i.name)).join(', ')}`);
    await probePaths(client, checkFilename);
    console.log('\n--- Public URL checks ---');
    const urls = [
        (0, ftp_1.getPublicUploadUrl)(checkFilename),
        `https://ahwuae.com/investoredu/uploads/${checkFilename}`,
        `https://ahwuae.com/investoredu/investoredu/uploads/${checkFilename}`,
    ];
    for (const url of [...new Set(urls)]) {
        console.log(`  ${url}`);
        console.log(`    -> ${await checkPublicUrl(url)}`);
    }
    console.log('\n--- Fresh upload test ---');
    const testName = `diag-${Date.now()}.jpg`;
    const uploadedUrl = await (0, ftp_1.uploadToFtp)(SAMPLE_JPEG, testName);
    console.log(`Uploaded as: ${testName}`);
    console.log(`Returned URL: ${uploadedUrl}`);
    console.log(`Public check: ${await checkPublicUrl(uploadedUrl)}`);
    await client.cd('/');
    await probePaths(client, testName);
    client.close();
    console.log('\n=== Done ===');
}
main().catch((error) => {
    console.error('Diagnosis failed:', error.message);
    process.exit(1);
});
//# sourceMappingURL=diagnose-ftp-upload.js.map