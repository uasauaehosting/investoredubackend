/**
 * Copy uploads from wrong FTP paths into the web-served directory (/investoredu/uploads).
 * Public URL: https://ahwuae.com/investoredu/investoredu/uploads/
 * Run: npm run sync-ftp-uploads
 */
import 'dotenv/config';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import { DEFAULT_FTP_REMOTE_PATH, getFtpConfig } from '../utils/ftp';

const TARGET_DIR = process.env.FTP_REMOTE_PATH || DEFAULT_FTP_REMOTE_PATH;
const SOURCE_DIRS = [
  process.env.FTP_SYNC_SOURCE_PATH,
  '/investoredu/investoredu/uploads',
  '/home/u827794112/domains/ahwuae.com/public_html/investoredu/uploads',
].filter(Boolean) as string[];

async function main() {
  const config = getFtpConfig();
  const client = new Client(60000);

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
  const seen = new Set<string>();

  for (const sourceDir of SOURCE_DIRS) {
    try {
      await client.cd(sourceDir);
    } catch {
      console.log(`Skip missing source: ${sourceDir}`);
      continue;
    }

    const sourceFiles = await client.list();
    const imageFiles = sourceFiles.filter(
      (f) => !f.isDirectory && /\.(jpe?g|png|gif|webp|svg|pdf)$/i.test(f.name) && !seen.has(f.name)
    );

    for (const file of imageFiles) {
      seen.add(file.name);
      const targetPath = `${TARGET_DIR}/${file.name}`.replace(/\/+/g, '/');

      try {
        await client.cd('/');
        await client.size(targetPath);
        skipped++;
        continue;
      } catch {
        // not in target yet
      }

      const tmpPath = path.join(os.tmpdir(), `sync-${file.name}`);
      try {
        await client.cd('/');
        await client.downloadTo(tmpPath, `${sourceDir}/${file.name}`);
        const buffer = fs.readFileSync(tmpPath);

        await client.cd('/');
        await client.ensureDir(TARGET_DIR);
        await client.uploadFrom(Readable.from(buffer), targetPath);

        const publicUrl = `${config.publicBaseUrl}/${file.name}`;
        const response = await axios.get(publicUrl, {
          timeout: 15000,
          validateStatus: () => true,
          responseType: 'arraybuffer',
        });

        const ok = response.status >= 200 && response.status < 400;
        console.log(`${ok ? 'OK' : 'WARN'} copied ${file.name} -> HTTP ${response.status}`);
        copied++;
        if (ok) verified++;
      } catch (error: any) {
        console.error(`FAIL ${file.name}: ${error.message}`);
      } finally {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
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
