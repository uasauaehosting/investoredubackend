import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { isReorderResource, reorderRecords } from '../utils/reorder';

const router = express.Router();

router.put('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('resource').isString().notEmpty().withMessage('resource is required'),
  body('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
  body('ids.*').isInt().withMessage('Each id must be an integer'),
  body('section').optional().isString(),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resource, section } = req.body;
    if (!isReorderResource(resource)) {
      return res.status(400).json({ message: `Unknown reorder resource: ${resource}` });
    }

    const ids = req.body.ids.map((id: number | string) => parseInt(String(id), 10));
    await reorderRecords(resource, ids, section);

    res.json({ message: 'Order updated successfully', resource, ids });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
