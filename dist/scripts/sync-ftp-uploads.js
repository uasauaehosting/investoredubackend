"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const basic_ftp_1 = require("basic-ftp");
const stream_1 = require("stream");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const ftp_1 = require("../utils/ftp");
const TARGET_DIR = process.env.FTP_REMOTE_PATH || ftp_1.DEFAULT_FTP_REMOTE_PATH;
const SOURCE_DIRS = [
    process.env.FTP_SYNC_SOURCE_PATH,
    '/investoredu/investoredu/uploads',
    '/home/u827794112/domains/ahwuae.com/public_html/investoredu/uploads',
].filter(Boolean);
async function main() {
    const config = (0, ftp_1.getFtpConfig)();
    const client = new basic_ftp_1.Client(60000);
    await client.access({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port,
        secure: config.secure,
    });
    console.log('=== Sync FTP uploads ===');
    console.log(`Sources: ${SOURCE_DIRS.join(', ')}`);
    console.log(`Target: ${TARGET_DIR}`);
    console.log(`Public: ${config.publicBaseUrl}\n`);
    let copied = 0;
    let skipped = 0;
    let verified = 0;
    const seen = new Set();
    for (const sourceDir of SOURCE_DIRS) {
        try {
            await client.cd(sourceDir);
        }
        catch {
            console.log(`Skip missing source: ${sourceDir}`);
            continue;
        }
        const sourceFiles = await client.list();
        const imageFiles = sourceFiles.filter((f) => !f.isDirectory && /\.(jpe?g|png|gif|webp|svg|pdf)$/i.test(f.name) && !seen.has(f.name));
        for (const file of imageFiles) {
            seen.add(file.name);
            const targetPath = `${TARGET_DIR}/${file.name}`.replace(/\/+/g, '/');
            try {
                await client.cd('/');
                await client.size(targetPath);
                skipped++;
                continue;
            }
            catch {
            }
            const tmpPath = path_1.default.join(os_1.default.tmpdir(), `sync-${file.name}`);
            try {
                await client.cd('/');
                await client.downloadTo(tmpPath, `${sourceDir}/${file.name}`);
                const buffer = fs_1.default.readFileSync(tmpPath);
                await client.cd('/');
                await client.ensureDir(TARGET_DIR);
                await client.uploadFrom(stream_1.Readable.from(buffer), targetPath);
                const publicUrl = `${config.publicBaseUrl}/${file.name}`;
                const response = await axios_1.default.get(publicUrl, {
                    timeout: 15000,
                    validateStatus: () => true,
                    responseType: 'arraybuffer',
                });
                const ok = response.status >= 200 && response.status < 400;
                console.log(`${ok ? 'OK' : 'WARN'} copied ${file.name} -> HTTP ${response.status}`);
                copied++;
                if (ok)
                    verified++;
            }
            catch (error) {
                console.error(`FAIL ${file.name}: ${error.message}`);
            }
            finally {
                if (fs_1.default.existsSync(tmpPath))
                    fs_1.default.unlinkSync(tmpPath);
            }
        }
    }
    client.close();
    console.log(`\nDone: ${copied} copied, ${skipped} already present, ${verified} verified reachable`);
}
main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
//# sourceMappingURL=sync-ftp-uploads.js.map