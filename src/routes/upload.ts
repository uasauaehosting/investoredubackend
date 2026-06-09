import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/auth';
import { isFtpConfigured, normalizeMediaUrl, uploadToFtp } from '../utils/ftp';
import { MediaUploadModel } from '../models/MediaUpload';

const router = express.Router();

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
const uploadPath = process.env.UPLOAD_PATH || './uploads';

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, gif, webp) and PDFs are allowed'));
};

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
  fileFilter,
});

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const localUpload = multer({
  storage: diskStorage,
  limits: { fileSize: maxFileSize },
  fileFilter,
});

function buildFilename(originalName: string): string {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return uniqueSuffix + path.extname(originalName);
}

router.post('/', authenticate, (req: AuthRequest, res, next) => {
  const handler = isFtpConfigured() ? memoryUpload.single('file') : localUpload.single('file');
  handler(req, res, next);
}, async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filename = isFtpConfigured()
      ? buildFilename(req.file.originalname)
      : req.file.filename;

    let fileUrl: string;
    let storageType: 'ftp' | 'local';

    if (isFtpConfigured()) {
      const buffer = req.file.buffer;
      if (!buffer) {
        return res.status(500).json({ message: 'File buffer missing for FTP upload' });
      }

      fileUrl = await uploadToFtp(buffer, filename);
      storageType = 'ftp';
    } else {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      storageType = 'local';
    }

    const publicUrl = normalizeMediaUrl(fileUrl) || fileUrl;

    const uploadId = await MediaUploadModel.create({
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
  } catch (error: any) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      message: 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
