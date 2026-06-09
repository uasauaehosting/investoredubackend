"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AlertsBulletins_1 = require("../models/AlertsBulletins");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const filters = {
            type: req.query.type,
            authority: req.query.authority,
            year: req.query.year,
            is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined
        };
        const alertsBulletins = await AlertsBulletins_1.AlertsBulletinsModel.getAll(filters);
        res.json(alertsBulletins);
    }
    catch (error) {
        console.error('Error fetching alerts/bulletins:', error);
        res.status(500).json({ error: 'Failed to fetch alerts/bulletins' });
    }
});
router.get('/authorities', async (req, res) => {
    try {
        const authorities = await AlertsBulletins_1.AlertsBulletinsModel.getUniqueAuthorities();
        res.json(authorities);
    }
    catch (error) {
        console.error('Error fetching authorities:', error);
        res.status(500).json({ error: 'Failed to fetch authorities' });
    }
});
router.get('/years', async (req, res) => {
    try {
        const years = await AlertsBulletins_1.AlertsBulletinsModel.getUniqueYears();
        res.json(years);
    }
    catch (error) {
        console.error('Error fetching years:', error);
        res.status(500).json({ error: 'Failed to fetch years' });
    }
});
router.get('/types', async (req, res) => {
    try {
        const types = await AlertsBulletins_1.AlertsBulletinsModel.getUniqueTypes();
        res.json(types);
    }
    catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({ error: 'Failed to fetch types' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid alert/bulletin ID' });
        }
        const alertBulletin = await AlertsBulletins_1.AlertsBulletinsModel.getById(id);
        if (!alertBulletin) {
            return res.status(404).json({ error: 'Alert/Bulletin not found' });
        }
        res.json(alertBulletin);
    }
    catch (error) {
        console.error('Error fetching alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to fetch alert/bulletin' });
    }
});
router.post('/', async (req, res) => {
    try {
        const alertBulletinData = req.body;
        if (!alertBulletinData.title || !alertBulletinData.type || !alertBulletinData.authority_name) {
            return res.status(400).json({
                error: 'Missing required fields: title, type, authority_name'
            });
        }
        if (!['Alert', 'Bulletin'].includes(alertBulletinData.type)) {
            return res.status(400).json({
                error: 'Type must be either Alert or Bulletin'
            });
        }
        const newAlertBulletin = await AlertsBulletins_1.AlertsBulletinsModel.create(alertBulletinData);
        res.status(201).json(newAlertBulletin);
    }
    catch (error) {
        console.error('Error creating alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to create alert/bulletin' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid alert/bulletin ID' });
        }
        const updateData = req.body;
        if (updateData.type && !['Alert', 'Bulletin'].includes(updateData.type)) {
            return res.status(400).json({
                error: 'Type must be either Alert or Bulletin'
            });
        }
        const updatedAlertBulletin = await AlertsBulletins_1.AlertsBulletinsModel.update(id, updateData);
        if (!updatedAlertBulletin) {
            return res.status(404).json({ error: 'Alert/Bulletin not found' });
        }
        res.json(updatedAlertBulletin);
    }
    catch (error) {
        console.error('Error updating alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to update alert/bulletin' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid alert/bulletin ID' });
        }
        const success = await AlertsBulletins_1.AlertsBulletinsModel.delete(id);
        if (!success) {
            return res.status(404).json({ error: 'Alert/Bulletin not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to delete alert/bulletin' });
    }
});
exports.default = router;
//# sourceMappingURL=alerts-bulletins.js.map