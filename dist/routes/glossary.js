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
router.get('/', async (req, res) => {
    try {
        const terms = await models_1.GlossaryTerm.findAll();
        res.json(terms);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('term').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('definition').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('language').optional().isIn(['English', 'Arabic', 'French']).withMessage('Invalid language'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const termId = await models_1.GlossaryTerm.create(req.body);
        const term = await models_1.GlossaryTerm.findById(termId);
        res.status(201).json(term);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const success = await models_1.GlossaryTerm.update(parseInt(req.params.id), req.body);
        if (!success) {
            return res.status(404).json({ message: 'Glossary term not found' });
        }
        const term = await models_1.GlossaryTerm.findById(parseInt(req.params.id));
        res.json(term);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const success = await models_1.GlossaryTerm.delete(parseInt(req.params.id));
        if (!success) {
            return res.status(404).json({ message: 'Glossary term not found' });
        }
        res.json({ message: 'Glossary term deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/categories', async (req, res) => {
    try {
        const allTerms = await models_1.GlossaryTerm.findAll();
        const activeTerms = allTerms.filter(term => term.isActive);
        const categories = [...new Set(activeTerms.map(term => term.category))];
        res.json(['All', ...categories]);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/languages', async (req, res) => {
    try {
        const allTerms = await models_1.GlossaryTerm.findAll();
        const activeTerms = allTerms.filter(term => term.isActive);
        const languages = [...new Set(activeTerms.map(term => term.language))];
        res.json(['All', ...languages]);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=glossary.js.map