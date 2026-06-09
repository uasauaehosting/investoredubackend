"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaUploadModel = void 0;
const database_1 = require("../utils/database");
class MediaUploadModel {
    static async ensureTable() {
        await (0, database_1.executeQuery)(`
      CREATE TABLE IF NOT EXISTS media_uploads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        storage_type ENUM('ftp', 'local') NOT NULL DEFAULT 'ftp',
        file_size INT DEFAULT NULL,
        uploaded_by INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_media_uploads_storage (storage_type),
        INDEX idx_media_uploads_created (created_at)
      )
    `);
    }
    static async create(data) {
        await this.ensureTable();
        return (0, database_1.executeInsert)(`INSERT INTO media_uploads
        (filename, original_name, mime_type, file_url, storage_type, file_size, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            data.filename,
            data.originalName,
            data.mimeType,
            data.fileUrl,
            data.storageType,
            data.fileSize ?? null,
            data.uploadedBy ?? null,
        ]);
    }
}
exports.MediaUploadModel = MediaUploadModel;
//# sourceMappingURL=MediaUpload.js.map