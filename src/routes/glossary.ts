import express from 'express';
import { body, validationResult } from 'express-validator';
import { GlossaryTerm } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req: any, res: any) => {
  try {
    const terms = await GlossaryTerm.findAll();
    res.json(terms);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('term').notEmpty().withMessage('Term is required'),
  body('definition').notEmpty().withMessage('Definition is required'),
  body('language').isIn(['English', 'Arabic', 'French']).withMessage('Invalid language')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const termId = await GlossaryTerm.create(req.body);
    const term = await GlossaryTerm.findById(termId);
    res.status(201).json(term);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req, res) => {
  try {
    const success = await GlossaryTerm.update(parseInt(req.params.id), req.body);

    if (!success) {
      return res.status(404).json({ message: 'Glossary term not found' });
    }

    const term = await GlossaryTerm.findById(parseInt(req.params.id));

    res.json(term);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const success = await GlossaryTerm.delete(parseInt(req.params.id));

    if (!success) {
      return res.status(404).json({ message: 'Glossary term not found' });
    }

    res.json({ message: 'Glossary term deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const allTerms = await GlossaryTerm.findAll();
    const activeTerms = allTerms.filter(term => term.isActive);
    const categories = [...new Set(activeTerms.map(term => term.category))];
    res.json(['All', ...categories]);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const allTerms = await GlossaryTerm.findAll();
    const activeTerms = allTerms.filter(term => term.isActive);
    const languages = [...new Set(activeTerms.map(term => term.language))];
    res.json(['All', ...languages]);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
