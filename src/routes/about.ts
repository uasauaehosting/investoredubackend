import express from 'express';
import { body, validationResult } from 'express-validator';
import { AboutSection, ContactInfo } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/sections', async (req: any, res: any) => {
  try {
    const sections = await AboutSection.findAll();
    res.json(sections);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/sections', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sectionId = await AboutSection.create(req.body);
    const section = await AboutSection.findById(sectionId);
    res.status(201).json(section);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/sections/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const updated = await AboutSection.update(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'About section not found' });
    }

    const section = await AboutSection.findById(parseInt(req.params.id));
    res.json(section);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/sections/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await AboutSection.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'About section not found' });
    }

    res.json({ message: 'About section deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/contact', async (req: any, res: any) => {
  try {
    const contactInfo = await ContactInfo.findAll();
    res.json(contactInfo);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/contact', authenticate, authorize('Super Admin', 'Admin', 'Editor'), [
  body('type').isIn(['headquarters', 'contact']).withMessage('Invalid type'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactId = await ContactInfo.create(req.body);
    const contact = await ContactInfo.findById(contactId);
    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/contact/:id', authenticate, authorize('Super Admin', 'Admin', 'Editor'), async (req: any, res: any) => {
  try {
    const updated = await ContactInfo.update(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Contact info not found' });
    }

    const contact = await ContactInfo.findById(parseInt(req.params.id));
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/contact/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await ContactInfo.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Contact info not found' });
    }

    res.json({ message: 'Contact info deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
