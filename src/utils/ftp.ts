import { Client } from 'basic-ftp';
import axios from 'axios';
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

// The FTP account is chrooted to the uploads web root: the FTP session starts
// already inside "/investorupload", so the web-served uploads folder is simply
// "uploads" relative to the FTP root. Using an absolute path here would create a
// nested duplicate folder that is never served over the web.
export const DEFAULT_FTP_REMOTE_PATH = 'uploads';
export const DEFAULT_FTP_PUBLIC_BASE_URL = 'https://ahwuae.com/investorupload/uploads';

const WRONG_FTP_REMOTE_PATHS = new Set([
  '/investoredu/investoredu/uploads',
  'investoredu/investoredu/uploads',
  '/investoredu/uploads',
  'investoredu/uploads',
  // Absolute paths are wrong for this chrooted FTP account (see above).
  '/investorupload',
  'investorupload',
  '/investorupload/uploads',
  '/uploads',
]);

const LEGACY_PUBLIC_BASE_URLS = [
  'https://ahwuae.com/investoredu/uploads',
  'https://ahwuae.com/investoredu/investoredu/uploads',
];

function resolveRemotePath(): string {
  const configured = normalizeRemotePath(process.env.FTP_REMOTE_PATH || DEFAULT_FTP_REMOTE_PATH);
  if (WRONG_FTP_REMOTE_PATHS.has(configured)) {
    return DEFAULT_FTP_REMOTE_PATH;
  }
  return configured;
}

/** Resolve the public uploads base, correcting legacy single-path Hostinger config. */
export function resolvePublicBaseUrl(): string {
  const envBase = (process.env.FTP_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '');
  if (!envBase || LEGACY_PUBLIC_BASE_URLS.includes(envBase)) {
    return DEFAULT_FTP_PUBLIC_BASE_URL;
  }
  return envBase;
}

// FTP-relative legacy folders only — absolute server paths are not valid here
// because the FTP account is chrooted to the uploads web root.
const LEGACY_FTP_REMOTE_PATHS = [
  '/investoredu/investoredu/uploads',
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
  const publicBaseUrl = resolvePublicBaseUrl();

  if (!host || !user || !password) {
    throw new Error('FTP is not configured. Set FTP_HOST, FTP_USER, FTP_PASSWORD, and FTP_PUBLIC_BASE_URL.');
  }

  return {
    host,
    user,
    password,
    port: parseInt(process.env.FTP_PORT || '21', 10),
    secure: process.env.FTP_SECURE === 'true',
    remotePath: resolveRemotePath(),
    publicBaseUrl,
  };
}

function getDirectUploadCandidates(): string[] {
  // Only folders that the web server actually serves belong here. Writing to any
  // other location produces a URL that 404s (an upload that "succeeds" but never
  // shows up), which is exactly the bug this list used to cause.
  const candidates = [
    process.env.UPLOAD_DIRECT_PATH?.trim(),
    '/home/u827794112/domains/ahwuae.com/public_html/investorupload/uploads',
  ].filter(Boolean) as string[];

  return [...new Set(candidates.map((dir) => path.resolve(dir)))];
}

function getFtpUploadCandidates(): string[] {
  // The FTP session starts inside the uploads web root, so files go into
  // "uploads" relative to that root in order to be publicly served.
  return [...new Set([resolveRemotePath(), DEFAULT_FTP_REMOTE_PATH].map(normalizeRemotePath))];
}

async function writeDirectUpload(buffer: Buffer, filename: string, dir: string): Promise<void> {
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, filename);
  fs.writeFileSync(target, buffer);
  const written = fs.statSync(target).size;
  if (written !== buffer.length) {
    fs.unlinkSync(target);
    throw new Error(`Direct write size mismatch (expected ${buffer.length}, got ${written})`);
  }
}

async function verifyFtpRoundtrip(buffer: Buffer, filename: string): Promise<void> {
  const downloaded = await downloadFromFtp(filename);
  if (downloaded.length !== buffer.length) {
    throw new Error(
      `FTP roundtrip failed for ${filename} (expected ${buffer.length}, got ${downloaded.length})`
    );
  }
}

/** Verify the uploaded file is reachable at its public URL (Hostinger CDN). */
export async function verifyPublicUploadReachable(filename: string): Promise<boolean> {
  const url = getPublicUploadUrl(filename);
  const attempts = [0, 2000, 5000, 8000];

  for (const delayMs of attempts) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    try {
      const response = await axios.get(url, {
        timeout: 15000,
        validateStatus: () => true,
        responseType: 'arraybuffer',
      });

      if (response.status >= 200 && response.status < 400 && (response.data?.byteLength ?? 0) > 0) {
        return true;
      }
    } catch {
      // retry
    }
  }

  return false;
}

export function getPublicUploadUrl(filename: string): string {
  return `${resolvePublicBaseUrl()}/${filename}`;
}

const MEDIA_URL_REWRITE_RULES: RegExp[] = [
  /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
  /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/investoredu\/uploads\/([^/]+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/([^/]+)$/i,
  /^https?:\/\/ahwuae\.com\/investorupload\/uploads\/([^/]+)$/i,
  /^https?:\/\/[^/]+\/uploads\/(.+)$/i,
];

function extractFilenameFromUrlPath(urlPath: string): string {
  return decodeURIComponent(urlPath.split('?')[0].split('/').pop() || urlPath);
}

/** Normalize legacy upload URLs to the configured public uploads base URL. */
export function normalizeMediaUrl(oldUrl: string | null | undefined): string | null {
  if (!oldUrl) return null;

  const base = resolvePublicBaseUrl();
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

export async function uploadToFtp(buffer: Buffer, filename: string, remoteDir?: string): Promise<string> {
  const config = getFtpConfig();
  const client = new Client(60000);
  const configuredDir = normalizeRemotePath(remoteDir || config.remotePath);
  // ensureDir() changes the FTP working directory, so always address the file with
  // an absolute path — a relative path would resolve inside the folder twice.
  const targetDir = configuredDir.startsWith('/') ? configuredDir : `/${configuredDir}`;

  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      secure: config.secure,
    });

    await client.ensureDir(targetDir);
    const remoteFile = path.posix.join(targetDir, filename);
    await client.uploadFrom(Readable.from(buffer), remoteFile);

    const uploadedSize = await client.size(remoteFile).catch(() => -1);
    if (uploadedSize !== buffer.length) {
      throw new Error(
        `FTP upload size mismatch for ${remoteFile} (expected ${buffer.length}, got ${uploadedSize})`
      );
    }

    return getPublicUploadUrl(filename);
  } finally {
    client.close();
  }
}

/** Upload via FTP (verified) with a direct-filesystem fallback. */
export async function uploadMediaFile(buffer: Buffer, filename: string): Promise<string> {
  const publicUrl = getPublicUploadUrl(filename);
  const failures: string[] = [];

  // Best-effort and non-blocking: Hostinger sometimes blocks server-to-server
  // HTTP, so this only logs a warning and never fails the upload itself.
  const warnIfUnreachable = () => {
    verifyPublicUploadReachable(filename)
      .then((ok) => {
        if (!ok) {
          console.warn(
            `Uploaded ${filename} but its public URL is not reachable — check that the uploads folder is web-served.`
          );
        }
      })
      .catch(() => {/* ignore */});
  };

  // 1) FTP first. The FTP account is chrooted to the uploads web root, so a
  //    roundtrip-verified upload into "uploads" is guaranteed to be web-served.
  for (const remoteDir of getFtpUploadCandidates()) {
    try {
      await uploadToFtp(buffer, filename, remoteDir);
      await verifyFtpRoundtrip(buffer, filename);
      console.log(`FTP upload succeeded: ${remoteDir}/${filename}`);
      warnIfUnreachable();
      return publicUrl;
    } catch (error: any) {
      failures.push(`ftp ${remoteDir}: ${error.message}`);
    }
  }

  // 2) Fall back to writing straight into the web-served uploads folder on disk.
  for (const dir of getDirectUploadCandidates()) {
    try {
      await writeDirectUpload(buffer, filename, dir);
      console.log(`Direct upload succeeded: ${dir}/${filename}`);
      warnIfUnreachable();
      return publicUrl;
    } catch (error: any) {
      failures.push(`direct ${dir}: ${error.message}`);
    }
  }

  throw new Error(
    `Upload failed for ${filename}. ${failures.join(' | ')}. ` +
      `Check FTP_HOST/FTP_USER/FTP_PASSWORD, or set UPLOAD_DIRECT_PATH to the absolute path ` +
      `of the web-served uploads folder on the server.`
  );
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
        const absDir = remoteDir.startsWith('/') ? remoteDir : `/${remoteDir}`;
        const remoteFile = path.posix.join(absDir, filename);
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
