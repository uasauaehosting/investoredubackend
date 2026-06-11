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
router.get('/sections', async (req, res) => {
    try {
        const sections = await models_1.AboutSection.findAll();
        res.json(sections);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/sections', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('content').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const sectionId = await models_1.AboutSection.create(req.body);
        const section = await models_1.AboutSection.findById(sectionId);
        res.status(201).json(section);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/sections/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const updated = await models_1.AboutSection.update(parseInt(req.params.id), req.body);
        if (!updated) {
            return res.status(404).json({ message: 'About section not found' });
        }
        const section = await models_1.AboutSection.findById(parseInt(req.params.id));
        res.json(section);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/sections/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.AboutSection.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'About section not found' });
        }
        res.json({ message: 'About section deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/contact', async (req, res) => {
    try {
        const contactInfo = await models_1.ContactInfo.findAll();
        res.json(contactInfo);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/contact', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('type').optional().isIn(['headquarters', 'contact']).withMessage('Invalid type'),
    (0, express_validator_1.body)('address').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('phone').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const contactId = await models_1.ContactInfo.create(req.body);
        const contact = await models_1.ContactInfo.findById(contactId);
        res.status(201).json(contact);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/contact/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const updated = await models_1.ContactInfo.update(parseInt(req.params.id), req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Contact info not found' });
        }
        const contact = await models_1.ContactInfo.findById(parseInt(req.params.id));
        res.json(contact);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/contact/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.ContactInfo.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Contact info not found' });
        }
        res.json({ message: 'Contact info deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=about.js.map