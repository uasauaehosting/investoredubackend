export interface FtpConfig {
    host: string;
    user: string;
    password: string;
    port: number;
    secure: boolean;
    remotePath: string;
    publicBaseUrl: string;
}
export declare function isFtpConfigured(): boolean;
export declare const DEFAULT_FTP_REMOTE_PATH = "/investoredu/investoredu/uploads";
export declare const DEFAULT_FTP_PUBLIC_BASE_URL = "https://ahwuae.com/investoredu/investoredu/uploads";
export declare function resolvePublicBaseUrl(): string;
export declare function getFtpConfig(): FtpConfig;
export declare function getPublicUploadUrl(filename: string): string;
export declare function normalizeMediaUrl(oldUrl: string | null | undefined): string | null;
export declare function getMimeTypeForFilename(filename: string): string;
export declare function isSafeUploadFilename(filename: string): boolean;
export declare function uploadToFtp(buffer: Buffer, filename: string): Promise<string>;
export declare function downloadFromFtp(filename: string): Promise<Buffer>;
//# sourceMappingURL=ftp.d.ts.map