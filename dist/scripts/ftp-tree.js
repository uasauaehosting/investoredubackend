"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const basic_ftp_1 = require("basic-ftp");
const axios_1 = __importDefault(require("axios"));
const ftp_1 = require("../utils/ftp");
async function listTree(client, dir, depth = 0) {
    if (depth > 3)
        return;
    try {
        await client.cd(dir);
        const pwd = await client.pwd();
        const items = await client.list();
        console.log(`${'  '.repeat(depth)}${pwd}/ (${items.length})`);
        for (const item of items.slice(0, 20)) {
            if (item.isDirectory) {
                await listTree(client, item.name, depth + 1);
                await client.cd('..');
            }
            else if (/\.(jpe?g|png|gif|webp|pdf)$/i.test(item.name)) {
                console.log(`${'  '.repeat(depth + 1)}[file] ${item.name} (${item.size})`);
            }
        }
    }
    catch (e) {
        console.log(`${'  '.repeat(depth)}${dir}: ${e.message}`);
    }
}
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
    console.log('=== FTP tree from root ===');
    await client.cd('/');
    console.log('pwd:', await client.pwd());
    await listTree(client, '/');
    console.log('\n=== Working file probe ===');
    const working = '1781035553974-530467091.png';
    for (const dir of [
        '/investoredu/uploads',
        '/investoredu/investoredu/uploads',
        'investoredu/uploads',
        'investoredu/investoredu/uploads',
    ]) {
        try {
            const size = await client.size(`${dir}/${working}`.replace(/\/+/g, '/'));
            console.log(`FOUND ${dir}/${working} (${size}b)`);
        }
        catch {
            console.log(`miss  ${dir}/${working}`);
        }
        await client.cd('/');
    }
    const res = await axios_1.default.get(`https://ahwuae.com/investoredu/investoredu/uploads/${working}`, {
        validateStatus: () => true,
        responseType: 'arraybuffer',
    });
    console.log(`Public ${working}: HTTP ${res.status}, ${res.data?.byteLength}b`);
    client.close();
}
main();
//# sourceMappingURL=ftp-tree.js.map