"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Portals_1 = require("../models/Portals");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const filters = {
            authority: req.query.authority,
            country: req.query.country,
            is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined
        };
        const portals = await Portals_1.PortalModel.getAll(filters);
        res.json(portals);
    }
    catch (error) {
        console.error('Error fetching portals:', error);
        res.status(500).json({ error: 'Failed to fetch portals' });
    }
});
router.get('/authorities', async (req, res) => {
    try {
        const authorities = await Portals_1.PortalModel.getUniqueAuthorities();
        res.json(authorities);
    }
    catch (error) {
        console.error('Error fetching authorities:', error);
        res.status(500).json({ error: 'Failed to fetch authorities' });
    }
});
router.get('/countries', async (req, res) => {
    try {
        const countries = await Portals_1.PortalModel.getUniqueCountries();
        res.json(countries);
    }
    catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid portal ID' });
        }
        const portal = await Portals_1.PortalModel.getById(id);
        if (!portal) {
            return res.status(404).json({ error: 'Portal not found' });
        }
        res.json(portal);
    }
    catch (error) {
        console.error('Error fetching portal:', error);
        res.status(500).json({ error: 'Failed to fetch portal' });
    }
});
router.post('/', async (req, res) => {
    try {
        const portalData = req.body;
        const newPortal = await Portals_1.PortalModel.create(portalData);
        res.status(201).json(newPortal);
    }
    catch (error) {
        console.error('Error creating portal:', error);
        res.status(500).json({ error: 'Failed to create portal' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid portal ID' });
        }
        const updateData = req.body;
        const updatedPortal = await Portals_1.PortalModel.update(id, updateData);
        if (!updatedPortal) {
            return res.status(404).json({ error: 'Portal not found' });
        }
        res.json(updatedPortal);
    }
    catch (error) {
        console.error('Error updating portal:', error);
        res.status(500).json({ error: 'Failed to update portal' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid portal ID' });
        }
        const success = await Portals_1.PortalModel.delete(id);
        if (!success) {
            return res.status(404).json({ error: 'Portal not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting portal:', error);
        res.status(500).json({ error: 'Failed to delete portal' });
    }
});
exports.default = router;
//# sourceMappingURL=portals.js.map