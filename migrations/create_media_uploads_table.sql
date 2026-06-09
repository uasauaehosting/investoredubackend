-- Track uploaded media files (FTP or local storage)
USE u827794112_investoredudb;

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
);
