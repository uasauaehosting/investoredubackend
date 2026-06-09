import express from 'express';
import { Benchmarking } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const years = req.query.years
      ? String(req.query.years).split(',').map((y) => y.trim()).filter(Boolean)
      : undefined;
    const authority = req.query.authority ? String(req.query.authority) : undefined;
    const records = await Benchmarking.findAll({ years, authority });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/filters', async (_req, res) => {
  try {
    const filters = await Benchmarking.getFilterOptions();
    res.json(filters);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const id = await Benchmarking.create(req.body);
    const record = await Benchmarking.findById(id);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const updated = await Benchmarking.update(parseInt(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    const record = await Benchmarking.findById(parseInt(req.params.id));
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const deleted = await Benchmarking.delete(parseInt(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
