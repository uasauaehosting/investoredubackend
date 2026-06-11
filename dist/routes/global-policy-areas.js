"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const GlobalPolicyAreas_1 = require("../models/GlobalPolicyAreas");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const optionalUrl = (field, message) => (0, express_validator_1.body)(field)
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ require_tld: false })
    .withMessage(message);
function parseListParam(value) {
    if (!value)
        return [];
    const raw = Array.isArray(value) ? value.join(',') : value;
    return raw
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.toLowerCase() !== 'all');
}
router.get('/', async (req, res) => {
    try {
        const includeInactive = req.query.is_active === 'all';
        const filters = {
            institutions: parseListParam(req.query.institutions),
            categories: parseListParam(req.query.categories),
            is_active: includeInactive ? undefined : req.query.is_active === 'false' ? false : true,
        };
        const policyAreas = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.getAll(filters);
        res.json(policyAreas);
    }
    catch (error) {
        console.error('Error fetching global policy areas:', error);
        res.status(500).json({ error: 'Failed to fetch global policy areas' });
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('institution').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('category').optional({ values: 'falsy' }),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('file_url', 'File URL must be a valid URL'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const policyArea = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.create({
            title: req.body.title,
            description: req.body.description || 'View Description',
            institution: req.body.institution,
            category: req.body.category,
            file_url: req.body.fileUrl || req.body.file_url || null,
            is_active: req.body.isActive !== undefined ? req.body.isActive : true,
        });
        res.status(201).json(policyArea);
    }
    catch (error) {
        console.error('Error creating global policy area:', error);
        res.status(500).json({ error: 'Failed to create global policy area' });
    }
});
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('title').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('institution').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('category').optional({ values: 'falsy' }),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('file_url', 'File URL must be a valid URL'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const policyArea = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.update(parseInt(req.params.id, 10), {
            title: req.body.title,
            description: req.body.description,
            institution: req.body.institution,
            category: req.body.category,
            file_url: req.body.fileUrl ?? req.body.file_url,
            is_active: req.body.isActive,
        });
        if (!policyArea) {
            return res.status(404).json({ error: 'Global policy area not found' });
        }
        res.json(policyArea);
    }
    catch (error) {
        console.error('Error updating global policy area:', error);
        res.status(500).json({ error: 'Failed to update global policy area' });
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.softDelete(parseInt(req.params.id, 10));
        if (!deleted) {
            return res.status(404).json({ error: 'Global policy area not found' });
        }
        res.json({ message: 'Global policy area deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting global policy area:', error);
        res.status(500).json({ error: 'Failed to delete global policy area' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const policyArea = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.getById(parseInt(req.params.id, 10));
        if (!policyArea) {
            return res.status(404).json({ error: 'Global policy area not found' });
        }
        res.json(policyArea);
    }
    catch (error) {
        console.error('Error fetching global policy area:', error);
        res.status(500).json({ error: 'Failed to fetch global policy area' });
    }
});
exports.default = router;
//# sourceMappingURL=global-policy-areas.js.map