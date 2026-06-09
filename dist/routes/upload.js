"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const ftp_1 = require("../utils/ftp");
const MediaUpload_1 = require("../models/MediaUpload");
const router = express_1.default.Router();
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
const uploadPath = process.env.UPLOAD_PATH || './uploads';
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDFs are allowed'));
};
const memoryUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: maxFileSize },
    fileFilter,
});
const diskStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const localUpload = (0, multer_1.default)({
    storage: diskStorage,
    limits: { fileSize: maxFileSize },
    fileFilter,
});
function buildFilename(originalName) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    return uniqueSuffix + path_1.default.extname(originalName);
}
router.post('/', auth_1.authenticate, (req, res, next) => {
    const handler = (0, ftp_1.isFtpConfigured)() ? memoryUpload.single('file') : localUpload.single('file');
    handler(req, res, next);
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const filename = (0, ftp_1.isFtpConfigured)()
            ? buildFilename(req.file.originalname)
            : req.file.filename;
        let publicUrl;
        let storageType;
        if ((0, ftp_1.isFtpConfigured)()) {
            const buffer = req.file.buffer;
            if (!buffer) {
                return res.status(500).json({ message: 'File buffer missing for FTP upload' });
            }
            publicUrl = await (0, ftp_1.uploadMediaFile)(buffer, filename);
            storageType = 'ftp';
        }
        else {
            publicUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
            storageType = 'local';
        }
        publicUrl = (0, ftp_1.normalizeMediaUrl)(publicUrl) || publicUrl;
        const uploadId = await MediaUpload_1.MediaUploadModel.create({
            filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileUrl: publicUrl,
            storageType,
            fileSize: req.file.size,
            uploadedBy: req.admin?.id,
        });
        res.json({
            message: 'File uploaded successfully',
            url: publicUrl,
            filename,
            storageType,
            id: uploadId,
        });
    }
    catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({
            message: 'Failed to upload file',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map