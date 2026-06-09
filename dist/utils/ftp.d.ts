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
export declare function uploadToFtp(buffer: Buffer, filename: string): Promise<string>;
//# sourceMappingURL=ftp.d.ts.map