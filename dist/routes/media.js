"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ftp_1 = require("../utils/ftp");
const router = express_1.default.Router();
const uploadPath = process.env.UPLOAD_PATH || './uploads';
router.get('/:filename', async (req, res) => {
    const filename = path_1.default.basename(req.params.filename);
    if (!(0, ftp_1.isSafeUploadFilename)(filename)) {
        return res.status(400).json({ message: 'Invalid filename' });
    }
    const localPath = path_1.default.join(uploadPath, filename);
    if (fs_1.default.existsSync(localPath)) {
        res.set('Cache-Control', 'public, max-age=31536000');
        return res.sendFile(path_1.default.resolve(localPath));
    }
    if (!(0, ftp_1.isFtpConfigured)()) {
        return res.status(404).json({ message: 'File not found' });
    }
    try {
        const buffer = await (0, ftp_1.downloadFromFtp)(filename);
        res.set('Content-Type', (0, ftp_1.getMimeTypeForFilename)(filename));
        res.set('Cache-Control', 'public, max-age=31536000');
        return res.send(buffer);
    }
    catch (error) {
        console.error(`Media fetch failed for ${filename}:`, error.message);
        return res.status(404).json({ message: 'File not found' });
    }
});
exports.default = router;
//# sourceMappingURL=media.js.map