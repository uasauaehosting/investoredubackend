"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/footer/stats', async (_req, res) => {
    try {
        const stats = await models_1.FooterStats.findAll();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/footer/stats', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const stats = req.body.stats;
        if (!Array.isArray(stats)) {
            return res.status(400).json({ message: 'stats array is required' });
        }
        await models_1.FooterStats.upsertAll(stats);
        const updated = await models_1.FooterStats.findAll();
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/', async (_req, res) => {
    try {
        const items = await models_1.SiteContent.findAll();
        const map = {};
        for (const item of items) {
            map[item.contentKey] = item.content;
        }
        res.json(map);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/:key', async (req, res) => {
    try {
        const item = await models_1.SiteContent.findByKey(req.params.key);
        if (!item) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(item.content);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:key', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('content').isObject().withMessage('Content must be a JSON object'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await models_1.SiteContent.upsert(req.params.key, req.body.content);
        const item = await models_1.SiteContent.findByKey(req.params.key, false);
        res.json({ contentKey: req.params.key, content: item?.content });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=site-content.js.map