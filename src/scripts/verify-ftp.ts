/**
 * Verify FTP upload + database record with a sample image.
 * Run: npm run verify-ftp
 */
import 'dotenv/config';
import axios from 'axios';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import path from 'path';
import { initConnection, executeQuery } from '../utils/database';
import { getFtpConfig, isFtpConfigured, uploadToFtp } from '../utils/ftp';
import { MediaUploadModel } from '../models/MediaUpload';

// Small valid JPEG (Hostinger CDN rejects tiny 1x1 PNG with HTTP 422)
const SAMPLE_IMAGE = Buffer.from(
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEhUQEhIVFhUXFxUYFxgXGBgXGBgYGBgXGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYH/xAAbEAACAgMBAAAAAAAAAAAAAAABAgMEBQYH/8QANxAAAgEDAwIEBQMEAwAAAAAAAAECAwQRBRIhMQYTQVFhcYGRobHB0fAjQuEUUmLx/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAHhEAAgICAgMAAAAAAAAAAAAAAQIRAxITITFBUWH/2gAMAwEAAhEDEEA/ALuKKKKAOUKKKKAP/2Q==',
  'base64'
);
const SAMPLE_EXT = 'jpg';
const SAMPLE_MIME = 'image/jpeg';

async function probeFtp(): Promise<void> {
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

    const pwd = await client.pwd();
    console.log(`FTP connected to ${config.host}`);
    console.log(`FTP working directory: ${pwd}`);

    const listing = await client.list();
    console.log(`FTP root listing (${listing.length} items):`);
    for (const item of listing.slice(0, 10)) {
      console.log(`  ${item.isDirectory ? '[dir]' : '[file]'} ${item.name}`);
    }
    if (listing.length > 10) {
      console.log(`  ... and ${listing.length - 10} more`);
    }
  } finally {
    client.close();
  }
}

async function verifyPublicUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      validateStatus: () => true,
      responseType: 'arraybuffer',
    });
    if (response.status >= 200 && response.status < 400 && (response.data?.byteLength ?? 0) > 0) {
      console.log(`Public URL reachable (HTTP ${response.status}, ${response.data.byteLength} bytes)`);
      return true;
    }
    const preview = Buffer.from(response.data || '').toString('utf8').slice(0, 80);
    console.log(`Public URL returned HTTP ${response.status}${preview ? ` — ${preview}` : ''}`);
    return false;
  } catch (error: any) {
    console.log(`Public URL check failed: ${error.message}`);
    return false;
  }
}

async function main() {
  if (!isFtpConfigured()) {
    console.error('FTP is not configured. Set FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_PUBLIC_BASE_URL in .env');
    process.exit(1);
  }

  const config = getFtpConfig();
  console.log('=== FTP Verification ===\n');
  console.log(`Host:       ${config.host}:${config.port}`);
  console.log(`User:       ${config.user}`);
  console.log(`Remote dir: ${config.remotePath}`);
  console.log(`Public URL: ${config.publicBaseUrl}\n`);

  await probeFtp();
  console.log('');

  const filename = `ftp-test-${Date.now()}.${SAMPLE_EXT}`;
  let fileUrl = '';
  let usedPath = config.remotePath;

  try {
    fileUrl = await uploadToFtp(SAMPLE_IMAGE, filename);
    console.log(`Upload OK via configured path`);
  } catch (primaryError: any) {
    console.log(`Upload failed with configured path: ${primaryError.message}`);

    const relativePath = 'uploads';
    console.log(`Retrying with relative path: ${relativePath}`);
    process.env.FTP_REMOTE_PATH = relativePath;
    usedPath = relativePath;

    try {
      fileUrl = await uploadToFtp(SAMPLE_IMAGE, filename);
      console.log(`Upload OK via relative path "${relativePath}"`);
      console.log(`Tip: set FTP_REMOTE_PATH=${relativePath} in .env`);
    } catch (retryError: any) {
      console.error(`Retry also failed: ${retryError.message}`);
      process.exit(1);
    }
  }

  console.log(`File URL: ${fileUrl}\n`);

  await initConnection();
  const uploadId = await MediaUploadModel.create({
    filename,
    originalName: `ftp-verify-sample.${SAMPLE_EXT}`,
    mimeType: SAMPLE_MIME,
    fileUrl,
    storageType: 'ftp',
    fileSize: SAMPLE_IMAGE.length,
  });

  const record = await executeQuery(
    'SELECT id, filename, file_url, storage_type, created_at FROM media_uploads WHERE id = ?',
    [uploadId]
  );

  console.log('Database record:');
  console.log(record[0]);
  console.log('');

  await verifyPublicUrl(fileUrl);

  console.log('\n=== Verification complete ===');
  console.log(`Sample image: ${fileUrl}`);
  console.log(`Remote path used: ${usedPath}/${filename}`);
}

main().catch((error) => {
  console.error('Verification failed:', error.message);
  process.exit(1);
});
