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

export const DEFAULT_FTP_REMOTE_PATH = '/investoredu/investoredu/uploads';
export const DEFAULT_FTP_PUBLIC_BASE_URL = 'https://ahwuae.com/investoredu/investoredu/uploads';

const LEGACY_FTP_REMOTE_PATHS = [
  '/home/u827794112/domains/ahwuae.com/public_html/investoredu/investoredu/uploads',
  '/home/u827794112/domains/ahwuae.com/public_html/investoredu/uploads',
  '/investoredu/uploads',
];

function normalizeRemotePath(remotePath: string): string {
  return remotePath.replace(/\\/g, '/');
}

function getDownloadRemotePaths(primaryPath: string): string[] {
  const paths = [
    primaryPath,
    process.env.FTP_LEGACY_REMOTE_PATH,
    ...LEGACY_FTP_REMOTE_PATHS,
  ];
  return [...new Set(paths.filter(Boolean).map((p) => normalizeRemotePath(p as string)))];
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
    remotePath: normalizeRemotePath(process.env.FTP_REMOTE_PATH || DEFAULT_FTP_REMOTE_PATH),
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

const MEDIA_URL_REWRITE_RULES: RegExp[] = [
  /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
  /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/(.+)$/i,
  /^https?:\/\/[^/]+\/uploads\/(.+)$/i,
];

function extractFilenameFromUrlPath(urlPath: string): string {
  return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}

/** Normalize legacy upload URLs to the configured public uploads base URL. */
export function normalizeMediaUrl(oldUrl: string | null | undefined): string | null {
  if (!oldUrl) return null;

  const base = (process.env.FTP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!base) return oldUrl.trim();

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

    const remoteDir = normalizeRemotePath(config.remotePath);
    await client.ensureDir(remoteDir);
    await client.uploadFrom(Readable.from(buffer), path.posix.join(remoteDir, filename));

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

    const remoteDirs = getDownloadRemotePaths(config.remotePath);
    const tmpPath = path.join(os.tmpdir(), `ftp-dl-${Date.now()}-${filename}`);
    let lastError: Error | undefined;

    try {
      for (const remoteDir of remoteDirs) {
        const remoteFile = path.posix.join(remoteDir, filename);
        try {
          await client.downloadTo(tmpPath, remoteFile);
          return fs.readFileSync(tmpPath);
        } catch (error: any) {
          lastError = error;
        }
      }

      throw lastError || new Error(`File not found: ${filename}`);
    } finally {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  } finally {
    client.close();
  }
}
