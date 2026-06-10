import express from 'express';
import { AlertsBulletinsModel, CreateAlertBulletinData, UpdateAlertBulletinData, AlertBulletinFilters } from '../models/AlertsBulletins';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// GET /api/alerts-bulletins - Get all alerts/bulletins with optional filters
router.get('/', async (req, res) => {
    try {
        const isActiveParam = req.query.is_active as string | undefined;
        const filters: AlertBulletinFilters = {
            type: req.query.type as 'Alert' | 'Bulletin',
            authority: req.query.authority as string,
            year: req.query.year as string,
            is_active:
                isActiveParam === 'all'
                    ? null
                    : isActiveParam === 'false'
                        ? false
                        : true,
        };

        const alertsBulletins = await AlertsBulletinsModel.getAll(filters);
        res.json(alertsBulletins);
    } catch (error) {
        console.error('Error fetching alerts/bulletins:', error);
        res.status(500).json({ error: 'Failed to fetch alerts/bulletins' });
    }
});

// GET /api/alerts-bulletins/authorities - Get unique authorities
router.get('/authorities', async (req, res) => {
    try {
        const authorities = await AlertsBulletinsModel.getUniqueAuthorities();
        res.json(authorities);
    } catch (error) {
        console.error('Error fetching authorities:', error);
        res.status(500).json({ error: 'Failed to fetch authorities' });
    }
});

// GET /api/alerts-bulletins/years - Get unique years
router.get('/years', async (req, res) => {
    try {
        const years = await AlertsBulletinsModel.getUniqueYears();
        res.json(years);
    } catch (error) {
        console.error('Error fetching years:', error);
        res.status(500).json({ error: 'Failed to fetch years' });
    }
});

// GET /api/alerts-bulletins/types - Get unique types
router.get('/types', async (req, res) => {
    try {
        const types = await AlertsBulletinsModel.getUniqueTypes();
        res.json(types);
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({ error: 'Failed to fetch types' });
    }
});

// GET /api/alerts-bulletins/:id - Get alert/bulletin by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid alert/bulletin ID' });
        }

        const alertBulletin = await AlertsBulletinsModel.getById(id);
        if (!alertBulletin) {
            return res.status(404).json({ error: 'Alert/Bulletin not found' });
        }

        res.json(alertBulletin);
    } catch (error) {
        console.error('Error fetching alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to fetch alert/bulletin' });
    }
});

// POST /api/alerts-bulletins - Create new alert/bulletin
router.post('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const alertBulletinData: CreateAlertBulletinData = req.body;

        // Validate type when provided
        if (alertBulletinData.type && !['Alert', 'Bulletin'].includes(alertBulletinData.type)) {
            return res.status(400).json({ 
                error: 'Type must be either Alert or Bulletin' 
            });
        }

        const newAlertBulletin = await AlertsBulletinsModel.create(alertBulletinData);
        res.status(201).json(newAlertBulletin);
    } catch (error) {
        console.error('Error creating alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to create alert/bulletin' });
    }
});

// PUT /api/alerts-bulletins/:id - Update alert/bulletin
router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid alert/bulletin ID' });
        }

        const updateData: UpdateAlertBulletinData = req.body;
        
        // Validate type if provided
        if (updateData.type && !['Alert', 'Bulletin'].includes(updateData.type)) {
            return res.status(400).json({ 
                error: 'Type must be either Alert or Bulletin' 
            });
        }

        const updatedAlertBulletin = await AlertsBulletinsModel.update(id, updateData);

        if (!updatedAlertBulletin) {
            return res.status(404).json({ error: 'Alert/Bulletin not found' });
        }

        res.json(updatedAlertBulletin);
    } catch (error) {
        console.error('Error updating alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to update alert/bulletin' });
    }
});

// DELETE /api/alerts-bulletins/:id - Delete alert/bulletin
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid alert/bulletin ID' });
        }

        const success = await AlertsBulletinsModel.delete(id);
        if (!success) {
            return res.status(404).json({ error: 'Alert/Bulletin not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting alert/bulletin:', error);
        res.status(500).json({ error: 'Failed to delete alert/bulletin' });
    }
});

export default router;
