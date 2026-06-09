import express from 'express';
import { body, validationResult } from 'express-validator';
import { SiteContent, FooterStats } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/footer/stats', async (_req, res) => {
  try {
    const stats = await FooterStats.findAll();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/footer/stats', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const stats = req.body.stats;
    if (!Array.isArray(stats)) {
      return res.status(400).json({ message: 'stats array is required' });
    }
    await FooterStats.upsertAll(stats);
    const updated = await FooterStats.findAll();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const items = await SiteContent.findAll();
    const map: Record<string, unknown> = {};
    for (const item of items) {
      map[item.contentKey] = item.content;
    }
    res.json(map);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const item = await SiteContent.findByKey(req.params.key);
    if (!item) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(item.content);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:key', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('content').isObject().withMessage('Content must be a JSON object'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await SiteContent.upsert(req.params.key, req.body.content);
    const item = await SiteContent.findByKey(req.params.key, false);
    res.json({ contentKey: req.params.key, content: item?.content });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
