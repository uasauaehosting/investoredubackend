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
const optionalUrl = (field, message, options = {}) => (0, express_validator_1.body)(field)
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ require_tld: options.require_tld ?? false })
    .withMessage(message);
router.get('/authorities', async (req, res) => {
    try {
        const authorities = await models_1.Authority.findAll();
        res.json(authorities);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/authorities', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('type').optional().isIn(['University', 'Hospital', 'Government Body', 'Research Institute', 'Other']).withMessage('Invalid type'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('website').optional().isURL().withMessage('Website must be a valid URL'),
    (0, express_validator_1.body)('logo').optional().isString(),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const authorityData = {
            name: req.body.name,
            type: req.body.type || 'Other',
            description: req.body.description || '',
            website: req.body.website || '',
            logo: req.body.logo || '',
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const authorityId = await models_1.Authority.create(authorityData);
        const authority = await models_1.Authority.findById(authorityId);
        res.status(201).json(authority);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/authorities/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('type').optional().isIn(['University', 'Hospital', 'Government Body', 'Research Institute', 'Other']).withMessage('Invalid type'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('website').optional().isURL().withMessage('Website must be a valid URL'),
    (0, express_validator_1.body)('logo').optional().isString(),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const authorityId = parseInt(req.params.id);
        const success = await models_1.Authority.update(authorityId, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Authority not found' });
        }
        const authority = await models_1.Authority.findById(authorityId);
        res.json(authority);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/authorities/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const authorityId = parseInt(req.params.id);
        const success = await models_1.Authority.delete(authorityId);
        if (!success) {
            return res.status(404).json({ message: 'Authority not found' });
        }
        res.json({ message: 'Authority deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/categories', async (req, res) => {
    try {
        const categories = await models_1.Category.findAll();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/categories/authority/:authorityId', async (req, res) => {
    try {
        const authorityId = parseInt(req.params.authorityId);
        const categories = await models_1.Category.findByAuthority(authorityId);
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/categories', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('authorityId').isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const categoryData = {
            name: req.body.name,
            authorityId: req.body.authorityId,
            description: req.body.description || '',
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const categoryId = await models_1.Category.create(categoryData);
        const category = await models_1.Category.findById(categoryId);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/categories/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('authorityId').optional().isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const categoryId = parseInt(req.params.id);
        const success = await models_1.Category.update(categoryId, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const category = await models_1.Category.findById(categoryId);
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/categories/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const success = await models_1.Category.delete(categoryId);
        if (!success) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/reading-materials', async (req, res) => {
    try {
        const materials = await models_1.ReadingMaterial.findAll();
        res.json(materials);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/reading-materials', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date must be a valid date'),
    (0, express_validator_1.body)('pdfUrl').optional().isURL().withMessage('PDF URL must be a valid URL'),
    (0, express_validator_1.body)('authorityId').optional().isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
    (0, express_validator_1.body)('categoryId').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const materialData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            author: req.body.author || '',
            date: new Date(req.body.date),
            pdfUrl: req.body.pdfUrl || '',
            authorityId: req.body.authorityId || null,
            categoryId: req.body.categoryId || null,
            views: req.body.views || 0,
            downloads: req.body.downloads || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const materialId = await models_1.ReadingMaterial.create(materialData);
        const material = await models_1.ReadingMaterial.findById(materialId);
        res.status(201).json(material);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/reading-materials/:id', async (req, res) => {
    try {
        const materialId = parseInt(req.params.id);
        const material = await models_1.ReadingMaterial.findById(materialId);
        if (!material) {
            return res.status(404).json({ message: 'Reading material not found' });
        }
        res.json(material);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/reading-materials/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional().isISO8601().withMessage('Date must be a valid date'),
    (0, express_validator_1.body)('pdfUrl').optional().isURL().withMessage('PDF URL must be a valid URL'),
    (0, express_validator_1.body)('authorityId').optional().isInt({ min: 1 }).withMessage('Authority ID must be a positive integer'),
    (0, express_validator_1.body)('categoryId').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const materialId = parseInt(req.params.id);
        const updateData = req.body;
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const updated = await models_1.ReadingMaterial.update(materialId, updateData);
        if (!updated) {
            return res.status(404).json({ message: 'Reading material not found' });
        }
        const material = await models_1.ReadingMaterial.findById(materialId);
        res.json(material);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/reading-materials/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const materialId = parseInt(req.params.id);
        const deleted = await models_1.ReadingMaterial.delete(materialId);
        if (!deleted) {
            return res.status(404).json({ message: 'Reading material not found' });
        }
        res.json({ message: 'Reading material deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/frameworks', async (req, res) => {
    try {
        const frameworks = await models_1.FrameworkModel.findAll();
        res.json(frameworks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/frameworks/admin', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const frameworks = await models_1.FrameworkModel.findAllAdmin();
        res.json(frameworks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/frameworks/:id', async (req, res) => {
    try {
        const frameworkId = parseInt(req.params.id);
        const framework = await models_1.FrameworkModel.findById(frameworkId);
        if (!framework) {
            return res.status(404).json({ message: 'Framework not found' });
        }
        res.json(framework);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/frameworks', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date must be a valid date'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('imageUrl', 'Image URL must be a valid URL'),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('authorityId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Authority ID must be a positive integer or null'),
    (0, express_validator_1.body)('categoryId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Category ID must be a positive integer or null'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const frameworkData = {
            title: req.body.title,
            titleAr: req.body.titleAr || null,
            description: req.body.description,
            descriptionAr: req.body.descriptionAr || null,
            author: req.body.author || '',
            date: new Date(req.body.date),
            fileUrl: req.body.fileUrl || '',
            imageUrl: req.body.imageUrl || '',
            content: req.body.content || '',
            contentAr: req.body.contentAr || null,
            authorityId: req.body.authorityId || null,
            categoryId: req.body.categoryId || null,
            views: req.body.views || 0,
            downloads: req.body.downloads || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const frameworkId = await models_1.FrameworkModel.create(frameworkData);
        const framework = await models_1.FrameworkModel.findById(frameworkId);
        res.status(201).json(framework);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/frameworks/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional().isISO8601().withMessage('Date must be a valid date'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('imageUrl', 'Image URL must be a valid URL'),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('authorityId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Authority ID must be a positive integer or null'),
    (0, express_validator_1.body)('categoryId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Category ID must be a positive integer or null'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const frameworkId = parseInt(req.params.id);
        const updateData = req.body;
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const updated = await models_1.FrameworkModel.update(frameworkId, updateData);
        if (!updated) {
            return res.status(404).json({ message: 'Framework not found' });
        }
        const framework = await models_1.FrameworkModel.findById(frameworkId);
        res.json(framework);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/frameworks/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const frameworkId = parseInt(req.params.id);
        const deleted = await models_1.FrameworkModel.delete(frameworkId);
        if (!deleted) {
            return res.status(404).json({ message: 'Framework not found' });
        }
        res.json({ message: 'Framework deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/principles', async (req, res) => {
    try {
        const principles = await models_1.PrincipleModel.findAll();
        res.json(principles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/principles/admin', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const principles = await models_1.PrincipleModel.findAllAdmin();
        res.json(principles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/principles/:id', async (req, res) => {
    try {
        const principleId = parseInt(req.params.id);
        const principle = await models_1.PrincipleModel.findById(principleId);
        if (!principle) {
            return res.status(404).json({ message: 'Principle not found' });
        }
        res.json(principle);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/principles', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date must be a valid date'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('imageUrl', 'Image URL must be a valid URL'),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('authorityId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Authority ID must be a positive integer or null'),
    (0, express_validator_1.body)('categoryId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Category ID must be a positive integer or null'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const principleData = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author || '',
            date: new Date(req.body.date),
            fileUrl: req.body.fileUrl || '',
            imageUrl: req.body.imageUrl || '',
            content: req.body.content || '',
            authorityId: req.body.authorityId || null,
            categoryId: req.body.categoryId || null,
            views: req.body.views || 0,
            downloads: req.body.downloads || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const principleId = await models_1.PrincipleModel.create(principleData);
        const principle = await models_1.PrincipleModel.findById(principleId);
        res.status(201).json(principle);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/principles/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional().isISO8601().withMessage('Date must be a valid date'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('imageUrl', 'Image URL must be a valid URL'),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('authorityId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Authority ID must be a positive integer or null'),
    (0, express_validator_1.body)('categoryId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Category ID must be a positive integer or null'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const principleId = parseInt(req.params.id);
        const success = await models_1.PrincipleModel.update(principleId, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Principle not found' });
        }
        const principle = await models_1.PrincipleModel.findById(principleId);
        res.json(principle);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/principles/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const principleId = parseInt(req.params.id);
        const success = await models_1.PrincipleModel.delete(principleId);
        if (!success) {
            return res.status(404).json({ message: 'Principle not found' });
        }
        res.json({ message: 'Principle deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/investment-products', async (req, res) => {
    try {
        const products = await models_1.InvestmentProductModel.findAll();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/investment-products/slug/:slug', async (req, res) => {
    try {
        const product = await models_1.InvestmentProductModel.findBySlug(req.params.slug);
        if (!product) {
            return res.status(404).json({ message: 'Investment product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/investment-products/admin', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const products = await models_1.InvestmentProductModel.findAllAdmin();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/investment-products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await models_1.InvestmentProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Investment product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/investment-products', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date must be a valid date'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('imageUrl', 'Image URL must be a valid URL'),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('slug').optional().isString(),
    (0, express_validator_1.body)('authorityId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Authority ID must be a positive integer or null'),
    (0, express_validator_1.body)('categoryId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Category ID must be a positive integer or null'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const productData = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author || '',
            date: new Date(req.body.date),
            fileUrl: req.body.fileUrl || '',
            imageUrl: req.body.imageUrl || '',
            content: req.body.content || '',
            slug: req.body.slug || null,
            authorityId: req.body.authorityId || null,
            categoryId: req.body.categoryId || null,
            views: req.body.views || 0,
            downloads: req.body.downloads || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const productId = await models_1.InvestmentProductModel.create(productData);
        const product = await models_1.InvestmentProductModel.findById(productId);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/investment-products/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('date').optional().isISO8601().withMessage('Date must be a valid date'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('imageUrl', 'Image URL must be a valid URL'),
    (0, express_validator_1.body)('content').optional().isString(),
    (0, express_validator_1.body)('slug').optional().isString(),
    (0, express_validator_1.body)('authorityId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Authority ID must be a positive integer or null'),
    (0, express_validator_1.body)('categoryId').optional().custom((value) => {
        if (value === null || value === undefined)
            return true;
        return Number.isInteger(value) && value > 0;
    }).withMessage('Category ID must be a positive integer or null'),
    (0, express_validator_1.body)('views').optional().isInt({ min: 0 }).withMessage('Views must be a non-negative integer'),
    (0, express_validator_1.body)('downloads').optional().isInt({ min: 0 }).withMessage('Downloads must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const productId = parseInt(req.params.id);
        const success = await models_1.InvestmentProductModel.update(productId, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Investment product not found' });
        }
        const product = await models_1.InvestmentProductModel.findById(productId);
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/investment-products/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const success = await models_1.InvestmentProductModel.delete(productId);
        if (!success) {
            return res.status(404).json({ message: 'Investment product not found' });
        }
        res.json({ message: 'Investment product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/member-activities', async (req, res) => {
    try {
        const activities = await models_1.MemberActivity.findAll();
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/member-activities', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('date').optional().isISO8601().withMessage('Date must be a valid date'),
    (0, express_validator_1.body)('status').optional().isString(),
    (0, express_validator_1.body)('participants').optional().isInt({ min: 0 }).withMessage('Participants must be a non-negative integer'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const activityData = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            organization: req.body.organization,
            date: req.body.date ? new Date(req.body.date) : new Date(),
            status: req.body.status || 'Active',
            participants: req.body.participants || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        };
        const activityId = await models_1.MemberActivity.create(activityData);
        const activity = await models_1.MemberActivity.findById(activityId);
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/member-strategies-projects', async (req, res) => {
    try {
        const includeInactive = req.query.is_active === 'all';
        const projects = await models_1.MemberStrategyProject.findAll({ includeInactive });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/member-strategies-projects', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('type').optional({ values: 'falsy' }).isIn(['Strategy', 'Report']).withMessage('Type must be Strategy or Report'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('file_url', 'File URL must be a valid URL'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const projectId = await models_1.MemberStrategyProject.create({
            title: req.body.title,
            description: req.body.description || 'View Description',
            authority_name: req.body.authority_name,
            type: req.body.type,
            file_url: req.body.fileUrl || req.body.file_url || null,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        });
        const project = await models_1.MemberStrategyProject.findById(projectId, true);
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/member-strategies-projects/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('type').optional().isIn(['Strategy', 'Report']).withMessage('Type must be Strategy or Report'),
    optionalUrl('fileUrl', 'File URL must be a valid URL'),
    optionalUrl('file_url', 'File URL must be a valid URL'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updated = await models_1.MemberStrategyProject.update(parseInt(req.params.id), {
            title: req.body.title,
            description: req.body.description,
            authority_name: req.body.authority_name,
            type: req.body.type,
            fileUrl: req.body.fileUrl ?? req.body.file_url,
            isActive: req.body.isActive,
        });
        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const project = await models_1.MemberStrategyProject.findById(parseInt(req.params.id), true);
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/member-strategies-projects/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const deleted = await models_1.MemberStrategyProject.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/content', async (req, res) => {
    try {
        const section = req.query.section;
        if (!section) {
            return res.status(400).json({ message: 'section query parameter is required' });
        }
        const items = await models_1.EducationContent.findBySection(section);
        res.json(items.map((item) => ({
            id: item.id,
            section: item.section,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            content: item.content,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
        })));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/content/admin', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const section = req.query.section;
        const items = await models_1.EducationContent.findAllAdmin(section);
        res.json(items.map((item) => ({
            id: item.id,
            section: item.section,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            content: item.content,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
        })));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/content/:id', async (req, res) => {
    try {
        const item = await models_1.EducationContent.findById(parseInt(req.params.id));
        if (!item) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json({
            id: item.id,
            section: item.section,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            content: item.content,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/content', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const id = await models_1.EducationContent.create({
            section: req.body.section,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl ?? null,
            content: req.body.content ?? null,
            displayOrder: req.body.displayOrder ?? 0,
            isActive: req.body.isActive !== false,
        });
        const item = await models_1.EducationContent.findById(id, false);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/content/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const updated = await models_1.EducationContent.update(parseInt(req.params.id), {
            section: req.body.section,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            content: req.body.content,
            displayOrder: req.body.displayOrder,
            isActive: req.body.isActive,
        });
        if (!updated)
            return res.status(404).json({ message: 'Content not found' });
        const item = await models_1.EducationContent.findById(parseInt(req.params.id), false);
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/content/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.EducationContent.delete(parseInt(req.params.id));
        if (!deleted)
            return res.status(404).json({ message: 'Content not found' });
        res.json({ message: 'Content deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/alerts-bulletins', async (req, res) => {
    try {
        const alerts = await models_1.AlertsBulletinsModel.getAll();
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/alerts-bulletins', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('priority').optional().isString(),
    (0, express_validator_1.body)('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date must be a valid date'),
    (0, express_validator_1.body)('author').optional().isString(),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const bulletinData = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            content: req.body.content || '',
            authority_name: req.body.authority_name || 'System Admin',
            year: req.body.year || new Date().getFullYear().toString(),
            date_published: new Date(req.body.date_published || Date.now()),
            link: req.body.link || '',
            display_order: req.body.display_order || 0
        };
        await models_1.AlertsBulletinsModel.create(bulletinData);
        const alerts = await models_1.AlertsBulletinsModel.getAll();
        res.status(201).json(alerts[alerts.length - 1]);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=investor-education.js.map