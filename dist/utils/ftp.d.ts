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
export declare function getFtpConfig(): FtpConfig;
export declare function getPublicUploadUrl(filename: string): string;
export declare function normalizeMediaUrl(oldUrl: string | null | undefined): string | null;
export declare function getMimeTypeForFilename(filename: string): string;
export declare function isSafeUploadFilename(filename: string): boolean;
export declare function uploadToFtp(buffer: Buffer, filename: string): Promise<string>;
export declare function downloadFromFtp(filename: string): Promise<Buffer>;
//# sourceMappingURL=ftp.d.ts.map