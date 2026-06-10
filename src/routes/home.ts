import express from 'express';
import { body, validationResult } from 'express-validator';
import { News, Member, HomeStats, Slide } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/slides', async (req: any, res: any) => {
  try {
    const slides = await Slide.findAll();
    res.json(slides);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/slides', authenticate, authorize('Super Admin', 'Admin'), [
  body('title').optional({ values: 'falsy' }),
  body('display_order').optional().isNumeric().withMessage('Display order must be a number'),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const slideId = await Slide.create(req.body);
    const slide = await Slide.findById(slideId);
    res.status(201).json(slide);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/slides/:id', authenticate, authorize('Super Admin', 'Admin'), [
  body('title').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updated = await Slide.update(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    const slide = await Slide.findById(parseInt(req.params.id));
    res.json(slide);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/slides/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await Slide.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.json({ message: 'Slide deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/news', async (req: any, res: any) => {
  try {
    const news = await News.findAll();
    res.json(news);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/news', authenticate, authorize('Super Admin', 'Admin'), [
  body('title').optional({ values: 'falsy' }),
  body('excerpt').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    console.log('POST /news - Request body:', req.body); // Debug log
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ errors: errors.array() });
    }

    const newsId = await News.create(req.body);
    console.log('Created news with ID:', newsId); // Debug log
    
    const news = await News.findById(newsId);
    console.log('Retrieved news:', news); // Debug log
    
    res.status(201).json(news);
  } catch (error: any) {
    console.error('Error creating news:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/news/:id', authenticate, authorize('Super Admin', 'Admin'), [
  body('title').optional({ values: 'falsy' }),
  body('excerpt').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    console.log('PUT /news/:id - Request body:', req.body); // Debug log
    console.log('PUT /news/:id - Params:', req.params); // Debug log
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ errors: errors.array() });
    }

    const updated = await News.update(parseInt(req.params.id), req.body);
    console.log('Updated news result:', updated); // Debug log
    
    if (!updated) {
      return res.status(404).json({ message: 'News not found' });
    }

    const news = await News.findById(parseInt(req.params.id));
    console.log('Retrieved updated news:', news); // Debug log
    
    res.json(news);
  } catch (error: any) {
    console.error('Error updating news:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/news/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await News.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/members', async (req: any, res: any) => {
  try {
    const members = await Member.findAll();
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/members', authenticate, authorize('Super Admin', 'Admin'), [
  body('name').optional({ values: 'falsy' }),
  body('country').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add default isActive value if not provided
    const memberData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const memberId = await Member.create(memberData);
    const member = await Member.findById(memberId);
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/members/:id', authenticate, authorize('Super Admin', 'Admin'), [
  body('name').optional({ values: 'falsy' }),
  body('country').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updated = await Member.update(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const member = await Member.findById(parseInt(req.params.id));
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/members/:id', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const deleted = await Member.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/stats', async (req: any, res: any) => {
  try {
    const stats = await HomeStats.findLatest();
    if (!stats) {
      // Return default stats if no stats exist in database
      return res.json({
        readingMaterials: "1,200+",
        membersActivities: "350+", 
        alertsBulletins: "120+"
      });
    }
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/stats', authenticate, authorize('Super Admin', 'Admin'), [
  body('readingMaterials').optional({ values: 'falsy' }),
  body('membersActivities').optional({ values: 'falsy' }),
  body('alertsBulletins').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const statsId = await HomeStats.create(req.body);
    const stats = await HomeStats.findLatest();
    res.status(201).json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/stats/:id', authenticate, authorize('Super Admin', 'Admin'), [
  body('readingMaterials').optional({ values: 'falsy' }),
  body('membersActivities').optional({ values: 'falsy' }),
  body('alertsBulletins').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updated = await HomeStats.update(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Stats not found' });
    }

    const stats = await HomeStats.findLatest();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
