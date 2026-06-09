import express from 'express';
import { body, validationResult } from 'express-validator';
import { GlobalPolicyAreasModel, GlobalPolicyAreaFilters } from '../models/GlobalPolicyAreas';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

const optionalUrl = (field: string, message: string) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ require_tld: false })
    .withMessage(message);

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
    const includeInactive = req.query.is_active === 'all';
    const filters: GlobalPolicyAreaFilters = {
      institutions: parseListParam(req.query.institutions as string | string[] | undefined),
      categories: parseListParam(req.query.categories as string | string[] | undefined),
      is_active: includeInactive ? undefined : req.query.is_active === 'false' ? false : true,
    };

    const policyAreas = await GlobalPolicyAreasModel.getAll(filters);
    res.json(policyAreas);
  } catch (error) {
    console.error('Error fetching global policy areas:', error);
    res.status(500).json({ error: 'Failed to fetch global policy areas' });
  }
});

router.post('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('institution').notEmpty().withMessage('Institution is required'),
  body('category').notEmpty().withMessage('Category is required'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('file_url', 'File URL must be a valid URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const policyArea = await GlobalPolicyAreasModel.create({
      title: req.body.title,
      description: req.body.description || 'View Description',
      institution: req.body.institution,
      category: req.body.category,
      file_url: req.body.fileUrl || req.body.file_url || null,
      is_active: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    res.status(201).json(policyArea);
  } catch (error) {
    console.error('Error creating global policy area:', error);
    res.status(500).json({ error: 'Failed to create global policy area' });
  }
});

router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional(),
  body('institution').optional().notEmpty().withMessage('Institution cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  optionalUrl('fileUrl', 'File URL must be a valid URL'),
  optionalUrl('file_url', 'File URL must be a valid URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const policyArea = await GlobalPolicyAreasModel.update(parseInt(req.params.id, 10), {
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
  } catch (error) {
    console.error('Error updating global policy area:', error);
    res.status(500).json({ error: 'Failed to update global policy area' });
  }
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const deleted = await GlobalPolicyAreasModel.softDelete(parseInt(req.params.id, 10));
    if (!deleted) {
      return res.status(404).json({ error: 'Global policy area not found' });
    }
    res.json({ message: 'Global policy area deleted successfully' });
  } catch (error) {
    console.error('Error deleting global policy area:', error);
    res.status(500).json({ error: 'Failed to delete global policy area' });
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
