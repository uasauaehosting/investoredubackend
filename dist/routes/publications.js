"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Publications_1 = require("../models/Publications");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
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
        const filters = {
            authorities: parseListParam(req.query.authorities),
            categories: parseListParam(req.query.categories),
            is_active: req.query.is_active === 'false' ? false : true,
        };
        const publications = await Publications_1.PublicationsModel.getAll(filters);
        res.json(publications);
    }
    catch (error) {
        console.error('Error fetching publications:', error);
        res.status(500).json({ error: 'Failed to fetch publications' });
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const publication = await Publications_1.PublicationsModel.create(req.body);
        res.status(201).json(publication);
    }
    catch (error) {
        console.error('Error creating publication:', error);
        res.status(500).json({ error: 'Failed to create publication' });
    }
});
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const publication = await Publications_1.PublicationsModel.update(parseInt(req.params.id, 10), req.body);
        if (!publication)
            return res.status(404).json({ error: 'Publication not found' });
        res.json(publication);
    }
    catch (error) {
        console.error('Error updating publication:', error);
        res.status(500).json({ error: 'Failed to update publication' });
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await Publications_1.PublicationsModel.softDelete(parseInt(req.params.id, 10));
        if (!deleted)
            return res.status(404).json({ error: 'Publication not found' });
        res.json({ message: 'Publication deleted' });
    }
    catch (error) {
        console.error('Error deleting publication:', error);
        res.status(500).json({ error: 'Failed to delete publication' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const publication = await Publications_1.PublicationsModel.getById(parseInt(req.params.id, 10));
        if (!publication) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.json(publication);
    }
    catch (error) {
        console.error('Error fetching publication:', error);
        res.status(500).json({ error: 'Failed to fetch publication' });
    }
});
exports.default = router;
//# sourceMappingURL=publications.js.map