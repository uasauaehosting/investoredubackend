export interface MediaUploadRecord {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    file_url: string;
    storage_type: 'ftp' | 'local';
    file_size: number | null;
    uploaded_by: number | null;
    created_at: Date;
}
export declare class MediaUploadModel {
    static ensureTable(): Promise<void>;
    static create(data: {
        filename: string;
        originalName: string;
        mimeType: string;
        fileUrl: string;
        storageType: 'ftp' | 'local';
        fileSize?: number;
        uploadedBy?: number;
    }): Promise<number>;
}
//# sourceMappingURL=MediaUpload.d.ts.map