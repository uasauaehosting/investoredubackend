import { Client } from 'basic-ftp';
import fs from 'fs';
import os from 'os';
import { Readable } from 'stream';
import path from 'path';

export interface FtpConfig {
  host: string;
  user: string;
  password: string;
  port: number;
  secure: boolean;
  remotePath: string;
  publicBaseUrl: string;
}

export function isFtpConfigured(): boolean {
  return Boolean(
    process.env.FTP_HOST &&
    process.env.FTP_USER &&
    process.env.FTP_PASSWORD &&
    process.env.FTP_PUBLIC_BASE_URL
  );
}

export function getFtpConfig(): FtpConfig {
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

export function getPublicUploadUrl(filename: string): string {
  const base = (process.env.FTP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!base) {
    throw new Error('FTP_PUBLIC_BASE_URL is not configured.');
  }
  return `${base}/${filename}`;
}

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export function getMimeTypeForFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || 'application/octet-stream';
}

export function isSafeUploadFilename(filename: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(filename) && !filename.includes('..');
}

export async function uploadToFtp(buffer: Buffer, filename: string): Promise<string> {
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

    const remoteDir = config.remotePath.replace(/\\/g, '/');
    await client.ensureDir(remoteDir);

    const remoteFile = path.posix.join(remoteDir, filename);
    await client.uploadFrom(Readable.from(buffer), remoteFile);

    return getPublicUploadUrl(filename);
  } finally {
    client.close();
  }
}

export async function downloadFromFtp(filename: string): Promise<Buffer> {
  if (!isSafeUploadFilename(filename)) {
    throw new Error('Invalid filename');
  }

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

    const remoteDir = config.remotePath.replace(/\\/g, '/');
    const remoteFile = path.posix.join(remoteDir, filename);
    const tmpPath = path.join(os.tmpdir(), `ftp-dl-${Date.now()}-${filename}`);

    try {
      await client.downloadTo(tmpPath, remoteFile);
      return fs.readFileSync(tmpPath);
    } finally {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  } finally {
    client.close();
  }
}
