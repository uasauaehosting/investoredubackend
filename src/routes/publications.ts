import express from 'express';
import { PublicationsModel, PublicationFilters } from '../models/Publications';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

function parseListParam(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(',') : value;
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.toLowerCase() !== 'all');
}

router.get('/', async (req, res) => {
  try {
    const filters: PublicationFilters = {
      authorities: parseListParam(req.query.authorities as string | string[] | undefined),
      categories: parseListParam(req.query.categories as string | string[] | undefined),
      is_active: req.query.is_active === 'false' ? false : true,
    };

    const publications = await PublicationsModel.getAll(filters);
    res.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    res.status(500).json({ error: 'Failed to fetch publications' });
  }
});

router.post('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const publication = await PublicationsModel.create(req.body);
    res.status(201).json(publication);
  } catch (error) {
    console.error('Error creating publication:', error);
    res.status(500).json({ error: 'Failed to create publication' });
  }
});

router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const publication = await PublicationsModel.update(parseInt(req.params.id, 10), req.body);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json(publication);
  } catch (error) {
    console.error('Error updating publication:', error);
    res.status(500).json({ error: 'Failed to update publication' });
  }
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const deleted = await PublicationsModel.softDelete(parseInt(req.params.id, 10));
    if (!deleted) return res.status(404).json({ error: 'Publication not found' });
    res.json({ message: 'Publication deleted' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ error: 'Failed to delete publication' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const publication = await PublicationsModel.getById(parseInt(req.params.id, 10));
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    res.json(publication);
  } catch (error) {
    console.error('Error fetching publication:', error);
    res.status(500).json({ error: 'Failed to fetch publication' });
  }
});

export default router;
