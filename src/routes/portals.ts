import express from 'express';
import { PortalModel, CreatePortalData, UpdatePortalData, PortalFilters } from '../models/Portals';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// GET /api/portals - Get all portals with optional filters (public)
router.get('/', async (req, res) => {
    try {
        const filters: PortalFilters = {
            authority: req.query.authority as string | undefined,
            country: req.query.country as string | undefined,
            is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
        };

        const portals = await PortalModel.getAll(filters);
        res.json(portals);
    } catch (error) {
        console.error('Error fetching portals:', error);
        res.status(500).json({ error: 'Failed to fetch portals' });
    }
});

// GET /api/portals/authorities - Get unique authorities (public)
router.get('/authorities', async (req, res) => {
    try {
        const authorities = await PortalModel.getUniqueAuthorities();
        res.json(authorities);
    } catch (error) {
        console.error('Error fetching authorities:', error);
        res.status(500).json({ error: 'Failed to fetch authorities' });
    }
});

// GET /api/portals/countries - Get unique countries (public)
router.get('/countries', async (req, res) => {
    try {
        const countries = await PortalModel.getUniqueCountries();
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// GET /api/portals/:id - Get portal by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid portal ID' });
        }

        const portal = await PortalModel.getById(id);
        if (!portal) {
            return res.status(404).json({ error: 'Portal not found' });
        }

        res.json(portal);
    } catch (error) {
        console.error('Error fetching portal:', error);
        res.status(500).json({ error: 'Failed to fetch portal' });
    }
});

// POST /api/portals - Create new portal (admin only)
router.post('/', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
    try {
        const portalData: CreatePortalData = req.body;
        const newPortal = await PortalModel.create(portalData);
        res.status(201).json(newPortal);
    } catch (error) {
        console.error('Error creating portal:', error);
        res.status(500).json({ error: 'Failed to create portal' });
    }
});

// PUT /api/portals/:id - Update portal (admin only)
router.put('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid portal ID' });
        }

        const updateData: UpdatePortalData = req.body;
        const updatedPortal = await PortalModel.update(id, updateData);

        if (!updatedPortal) {
            return res.status(404).json({ error: 'Portal not found' });
        }

        res.json(updatedPortal);
    } catch (error) {
        console.error('Error updating portal:', error);
        res.status(500).json({ error: 'Failed to update portal' });
    }
});

// DELETE /api/portals/:id - Delete portal (admin only)
router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid portal ID' });
        }

        const success = await PortalModel.delete(id);
        if (!success) {
            return res.status(404).json({ error: 'Portal not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting portal:', error);
        res.status(500).json({ error: 'Failed to delete portal' });
    }
});

export default router;
