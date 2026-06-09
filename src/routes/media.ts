import express from 'express';
import fs from 'fs';
import path from 'path';
import {
  downloadFromFtp,
  getMimeTypeForFilename,
  isFtpConfigured,
  isSafeUploadFilename,
} from '../utils/ftp';

const router = express.Router();
const uploadPath = process.env.UPLOAD_PATH || './uploads';

router.get('/:filename', async (req, res) => {
  const filename = path.basename(req.params.filename);

  if (!isSafeUploadFilename(filename)) {
    return res.status(400).json({ message: 'Invalid filename' });
  }

  const localPath = path.join(uploadPath, filename);
  if (fs.existsSync(localPath)) {
    res.set('Cache-Control', 'public, max-age=31536000');
    return res.sendFile(path.resolve(localPath));
  }

  if (!isFtpConfigured()) {
    return res.status(404).json({ message: 'File not found' });
  }

  try {
    const buffer = await downloadFromFtp(filename);
    res.set('Content-Type', getMimeTypeForFilename(filename));
    res.set('Cache-Control', 'public, max-age=31536000');
    return res.send(buffer);
  } catch (error: any) {
    console.error(`Media fetch failed for ${filename}:`, error.message);
    return res.status(404).json({ message: 'File not found' });
  }
});

export default router;
