var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ftp_exports = {};
__export(ftp_exports, {
  DEFAULT_FTP_PUBLIC_BASE_URL: () => DEFAULT_FTP_PUBLIC_BASE_URL,
  DEFAULT_FTP_REMOTE_PATH: () => DEFAULT_FTP_REMOTE_PATH,
  downloadFromFtp: () => downloadFromFtp,
  getFtpConfig: () => getFtpConfig,
  getMimeTypeForFilename: () => getMimeTypeForFilename,
  getPublicUploadUrl: () => getPublicUploadUrl,
  isFtpConfigured: () => isFtpConfigured,
  isSafeUploadFilename: () => isSafeUploadFilename,
  normalizeMediaUrl: () => normalizeMediaUrl,
  resolvePublicBaseUrl: () => resolvePublicBaseUrl,
  uploadMediaFile: () => uploadMediaFile,
  uploadToFtp: () => uploadToFtp,
  verifyPublicUploadReachable: () => verifyPublicUploadReachable
});
module.exports = __toCommonJS(ftp_exports);
var import_basic_ftp = require("basic-ftp");
var import_axios = __toESM(require("axios"));
var import_fs = __toESM(require("fs"));
var import_os = __toESM(require("os"));
var import_stream = require("stream");
var import_path = __toESM(require("path"));
function isFtpConfigured() {
  return Boolean(
    process.env.FTP_HOST && process.env.FTP_USER && process.env.FTP_PASSWORD && process.env.FTP_PUBLIC_BASE_URL
  );
}
const DEFAULT_FTP_REMOTE_PATH = "uploads";
const DEFAULT_FTP_PUBLIC_BASE_URL = "https://ahwuae.com/investorupload/uploads";
const WRONG_FTP_REMOTE_PATHS = /* @__PURE__ */ new Set([
  "/investoredu/investoredu/uploads",
  "investoredu/investoredu/uploads",
  "/investoredu/uploads",
  "investoredu/uploads",
  // Absolute paths are wrong for this chrooted FTP account (see above).
  "/investorupload",
  "investorupload",
  "/investorupload/uploads",
  "/uploads"
]);
const LEGACY_PUBLIC_BASE_URLS = [
  "https://ahwuae.com/investoredu/uploads",
  "https://ahwuae.com/investoredu/investoredu/uploads"
];
function resolveRemotePath() {
  const configured = normalizeRemotePath(process.env.FTP_REMOTE_PATH || DEFAULT_FTP_REMOTE_PATH);
  if (WRONG_FTP_REMOTE_PATHS.has(configured)) {
    return DEFAULT_FTP_REMOTE_PATH;
  }
  return configured;
}
function resolvePublicBaseUrl() {
  const envBase = (process.env.FTP_PUBLIC_BASE_URL || "").trim().replace(/\/$/, "");
  if (!envBase || LEGACY_PUBLIC_BASE_URLS.includes(envBase)) {
    return DEFAULT_FTP_PUBLIC_BASE_URL;
  }
  return envBase;
}
const LEGACY_FTP_REMOTE_PATHS = [
  "/investoredu/investoredu/uploads",
  "/investoredu/uploads"
];
function normalizeRemotePath(remotePath) {
  return remotePath.replace(/\\/g, "/");
}
function getDownloadRemotePaths(primaryPath) {
  const paths = [
    primaryPath,
    process.env.FTP_LEGACY_REMOTE_PATH,
    ...LEGACY_FTP_REMOTE_PATHS
  ];
  return [...new Set(paths.filter(Boolean).map((p) => normalizeRemotePath(p)))];
}
function getFtpConfig() {
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const publicBaseUrl = resolvePublicBaseUrl();
  if (!host || !user || !password) {
    throw new Error("FTP is not configured. Set FTP_HOST, FTP_USER, FTP_PASSWORD, and FTP_PUBLIC_BASE_URL.");
  }
  return {
    host,
    user,
    password,
    port: parseInt(process.env.FTP_PORT || "21", 10),
    secure: process.env.FTP_SECURE === "true",
    remotePath: resolveRemotePath(),
    publicBaseUrl
  };
}
function getDirectUploadCandidates() {
  const candidates = [
    process.env.UPLOAD_DIRECT_PATH?.trim(),
    "/home/u827794112/domains/ahwuae.com/public_html/investorupload/uploads"
  ].filter(Boolean);
  return [...new Set(candidates.map((dir) => import_path.default.resolve(dir)))];
}
function getFtpUploadCandidates() {
  return [...new Set([resolveRemotePath(), DEFAULT_FTP_REMOTE_PATH].map(normalizeRemotePath))];
}
async function writeDirectUpload(buffer, filename, dir) {
  import_fs.default.mkdirSync(dir, { recursive: true });
  const target = import_path.default.join(dir, filename);
  import_fs.default.writeFileSync(target, buffer);
  const written = import_fs.default.statSync(target).size;
  if (written !== buffer.length) {
    import_fs.default.unlinkSync(target);
    throw new Error(`Direct write size mismatch (expected ${buffer.length}, got ${written})`);
  }
}
async function verifyPublicUploadReachable(filename) {
  const url = getPublicUploadUrl(filename);
  const attempts = [0, 2e3, 5e3, 8e3];
  for (const delayMs of attempts) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    try {
      const response = await import_axios.default.get(url, {
        timeout: 15e3,
        validateStatus: () => true,
        responseType: "arraybuffer"
      });
      if (response.status >= 200 && response.status < 400 && (response.data?.byteLength ?? 0) > 0) {
        return true;
      }
    } catch {
    }
  }
  return false;
}
function getPublicUploadUrl(filename) {
  return `${resolvePublicBaseUrl()}/${filename}`;
}
const MEDIA_URL_REWRITE_RULES = [
  /^https?:\/\/uasa\.ae\/en\/galorg\/(.+)$/i,
  /^https?:\/\/uasa\.ae\/en\/galimg\/(.+)$/i,
  /^https?:\/\/investoreducation\.uasa\.ae\/uploads\/(.+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/investoredu\/uploads\/([^/]+)$/i,
  /^https?:\/\/ahwuae\.com\/investoredu\/uploads\/([^/]+)$/i,
  /^https?:\/\/ahwuae\.com\/investorupload\/uploads\/([^/]+)$/i,
  /^https?:\/\/[^/]+\/uploads\/(.+)$/i
];
function extractFilenameFromUrlPath(urlPath) {
  return decodeURIComponent(urlPath.split("?")[0].split("/").pop() || urlPath);
}
function normalizeMediaUrl(oldUrl) {
  if (!oldUrl) return null;
  const base = resolvePublicBaseUrl();
  if (!base) return oldUrl.trim();
  const normalized = oldUrl.trim();
  if (normalized.startsWith(base + "/")) {
    return normalized.replace(/^http:\/\//i, "https://");
  }
  for (const pattern of MEDIA_URL_REWRITE_RULES) {
    const match = normalized.match(pattern);
    if (match) {
      return `${base}/${extractFilenameFromUrlPath(match[1])}`;
    }
  }
  return normalized;
}
const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf"
};
function getMimeTypeForFilename(filename) {
  const ext = import_path.default.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}
function isSafeUploadFilename(filename) {
  return /^[a-zA-Z0-9._-]+$/.test(filename) && !filename.includes("..");
}
async function uploadToFtp(buffer, filename, remoteDir) {
  const config = getFtpConfig();
  const client = new import_basic_ftp.Client(6e4);
  const configuredDir = normalizeRemotePath(remoteDir || config.remotePath);
  const targetDir = configuredDir.startsWith("/") ? configuredDir : `/${configuredDir}`;
  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      secure: config.secure
    });
    await client.ensureDir(targetDir);
    const remoteFile = import_path.default.posix.join(targetDir, filename);
    await client.uploadFrom(import_stream.Readable.from(buffer), remoteFile);
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
async function uploadMediaFile(buffer, filename) {
  const publicUrl = getPublicUploadUrl(filename);
  const failures = [];
  const warnIfUnreachable = () => {
    verifyPublicUploadReachable(filename).then((ok) => {
      if (!ok) {
        console.warn(
          `Uploaded ${filename} but its public URL is not reachable \u2014 check that the uploads folder is web-served.`
        );
      }
    }).catch(() => {
    });
  };
  for (const remoteDir of getFtpUploadCandidates()) {
    try {
      await uploadToFtp(buffer, filename, remoteDir);
      console.log(`FTP upload succeeded: ${remoteDir}/${filename}`);
      warnIfUnreachable();
      return publicUrl;
    } catch (error) {
      failures.push(`ftp ${remoteDir}: ${error.message}`);
    }
  }
  for (const dir of getDirectUploadCandidates()) {
    try {
      await writeDirectUpload(buffer, filename, dir);
      console.log(`Direct upload succeeded: ${dir}/${filename}`);
      warnIfUnreachable();
      return publicUrl;
    } catch (error) {
      failures.push(`direct ${dir}: ${error.message}`);
    }
  }
  throw new Error(
    `Upload failed for ${filename}. ${failures.join(" | ")}. Check FTP_HOST/FTP_USER/FTP_PASSWORD, or set UPLOAD_DIRECT_PATH to the absolute path of the web-served uploads folder on the server.`
  );
}
async function downloadFromFtp(filename) {
  if (!isSafeUploadFilename(filename)) {
    throw new Error("Invalid filename");
  }
  const config = getFtpConfig();
  const client = new import_basic_ftp.Client(3e4);
  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      secure: config.secure
    });
    const remoteDirs = getDownloadRemotePaths(config.remotePath);
    const tmpPath = import_path.default.join(import_os.default.tmpdir(), `ftp-dl-${Date.now()}-${filename}`);
    let lastError;
    try {
      for (const remoteDir of remoteDirs) {
        const absDir = remoteDir.startsWith("/") ? remoteDir : `/${remoteDir}`;
        const remoteFile = import_path.default.posix.join(absDir, filename);
        try {
          await client.downloadTo(tmpPath, remoteFile);
          return import_fs.default.readFileSync(tmpPath);
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error(`File not found: ${filename}`);
    } finally {
      if (import_fs.default.existsSync(tmpPath)) {
        import_fs.default.unlinkSync(tmpPath);
      }
    }
  } finally {
    client.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_FTP_PUBLIC_BASE_URL,
  DEFAULT_FTP_REMOTE_PATH,
  downloadFromFtp,
  getFtpConfig,
  getMimeTypeForFilename,
  getPublicUploadUrl,
  isFtpConfigured,
  isSafeUploadFilename,
  normalizeMediaUrl,
  resolvePublicBaseUrl,
  uploadMediaFile,
  uploadToFtp,
  verifyPublicUploadReachable
});
