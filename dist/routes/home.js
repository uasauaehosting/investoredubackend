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
router.get('/slides', async (req, res) => {
    try {
        const slides = await models_1.Slide.findAll();
        res.json(slides);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/slides', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('display_order').optional().isNumeric().withMessage('Display order must be a number'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const slideId = await models_1.Slide.create(req.body);
        const slide = await models_1.Slide.findById(slideId);
        res.status(201).json(slide);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/slides/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updated = await models_1.Slide.update(parseInt(req.params.id), req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        const slide = await models_1.Slide.findById(parseInt(req.params.id));
        res.json(slide);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/slides/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.Slide.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        res.json({ message: 'Slide deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/news', async (req, res) => {
    try {
        const news = await models_1.News.findAll();
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/news/:id', async (req, res) => {
    try {
        const news = await models_1.News.findById(parseInt(req.params.id));
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/news/reorder', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
    (0, express_validator_1.body)('ids.*').isInt().withMessage('Each id must be an integer'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const ids = req.body.ids.map((id) => parseInt(String(id), 10));
        await models_1.News.reorder(ids);
        const news = await models_1.News.findAll();
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/news', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('excerpt').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        console.log('POST /news - Request body:', req.body);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        const newsId = await models_1.News.create(req.body);
        console.log('Created news with ID:', newsId);
        const news = await models_1.News.findById(newsId);
        console.log('Retrieved news:', news);
        res.status(201).json(news);
    }
    catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/news/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('excerpt').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        console.log('PUT /news/:id - Request body:', req.body);
        console.log('PUT /news/:id - Params:', req.params);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        const updated = await models_1.News.update(parseInt(req.params.id), req.body);
        console.log('Updated news result:', updated);
        if (!updated) {
            return res.status(404).json({ message: 'News not found' });
        }
        const news = await models_1.News.findById(parseInt(req.params.id));
        console.log('Retrieved updated news:', news);
        res.json(news);
    }
    catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/news/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.News.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json({ message: 'News deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/members', async (req, res) => {
    try {
        const members = await models_1.Member.findAll();
        res.json(members);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/members', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('name').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('country').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const memberData = {
            ...req.body,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const memberId = await models_1.Member.create(memberData);
        const member = await models_1.Member.findById(memberId);
        res.status(201).json(member);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/members/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('name').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('country').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updated = await models_1.Member.update(parseInt(req.params.id), req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Member not found' });
        }
        const member = await models_1.Member.findById(parseInt(req.params.id));
        res.json(member);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/members/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.Member.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json({ message: 'Member deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const stats = await models_1.HomeStats.findLatest();
        if (!stats) {
            return res.json({
                readingMaterials: "1,200+",
                membersActivities: "350+",
                alertsBulletins: "120+"
            });
        }
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/stats', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('readingMaterials').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('membersActivities').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('alertsBulletins').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const statsId = await models_1.HomeStats.create(req.body);
        const stats = await models_1.HomeStats.findLatest();
        res.status(201).json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/stats/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('readingMaterials').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('membersActivities').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('alertsBulletins').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updated = await models_1.HomeStats.update(parseInt(req.params.id), req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        const stats = await models_1.HomeStats.findLatest();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=home.js.map