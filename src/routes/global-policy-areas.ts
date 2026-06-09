import express from 'express';
import { GlobalPolicyAreasModel, GlobalPolicyAreaFilters } from '../models/GlobalPolicyAreas';

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
    const filters: GlobalPolicyAreaFilters = {
      institutions: parseListParam(req.query.institutions as string | string[] | undefined),
      categories: parseListParam(req.query.categories as string | string[] | undefined),
      is_active: req.query.is_active === 'false' ? false : true,
    };

    const policyAreas = await GlobalPolicyAreasModel.getAll(filters);
    res.json(policyAreas);
  } catch (error) {
    console.error('Error fetching global policy areas:', error);
    res.status(500).json({ error: 'Failed to fetch global policy areas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const policyArea = await GlobalPolicyAreasModel.getById(parseInt(req.params.id, 10));
    if (!policyArea) {
      return res.status(404).json({ error: 'Global policy area not found' });
    }
    res.json(policyArea);
  } catch (error) {
    console.error('Error fetching global policy area:', error);
    res.status(500).json({ error: 'Failed to fetch global policy area' });
  }
});

export default router;
