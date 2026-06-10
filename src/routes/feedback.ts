import express from 'express';
import { body, validationResult } from 'express-validator';
import { Feedback } from '../models';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', [
  body('name').optional({ values: 'falsy' }),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
  body('subject').optional({ values: 'falsy' }),
  body('message').optional({ values: 'falsy' }),
], async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const feedbackId = await Feedback.create(req.body);
    const feedback = await Feedback.findById(feedbackId);
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', authenticate, authorize('Super Admin', 'Admin'), async (req: any, res: any) => {
  try {
    const { status, category, search } = req.query;
    let query: any = { isActive: true };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const feedback = await Feedback.findAll();
    const filteredFeedback = feedback.filter(item => {
      const matchStatus = !status || status === 'all' || item.status === status;
      const matchCategory = !category || category === 'all' || item.category === category;
      const matchSearch = !search || [
        item.name,
        item.email,
        item.subject,
        item.message
      ].some(field => field.toLowerCase().includes(search.toString().toLowerCase()));
      return matchStatus && matchCategory && matchSearch;
    });
    const sortedFeedback = filteredFeedback.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
    res.json(sortedFeedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findById(parseInt(req.params.id));
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/respond', authenticate, authorize('Super Admin', 'Admin'), [
  body('response').optional({ values: 'falsy' }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const success = await Feedback.respondToFeedback(
      parseInt(req.params.id),
      req.body.response,
      req.admin.username
    );

    if (!success) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const feedback = await Feedback.findById(parseInt(req.params.id));

    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', authenticate, authorize('Super Admin', 'Admin'), [
  body('status').isIn(['Pending', 'In Progress', 'Resolved', 'Closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const success = await Feedback.updateStatus(parseInt(req.params.id), req.body.status);

    if (!success) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const feedback = await Feedback.findById(parseInt(req.params.id));

    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const success = await Feedback.delete(parseInt(req.params.id));

    if (!success) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/stats/summary', authenticate, authorize('Super Admin', 'Admin'), async (req, res) => {
  try {
    const allFeedback = await Feedback.findAll();
    const activeFeedback = allFeedback.filter(f => f.isActive);
    const total = activeFeedback.length;
    const pending = activeFeedback.filter(f => f.status === 'Pending').length;
    const inProgress = activeFeedback.filter(f => f.status === 'In Progress').length;
    const resolved = activeFeedback.filter(f => f.status === 'Resolved').length;
    const closed = activeFeedback.filter(f => f.status === 'Closed').length;

    const categoryStats = activeFeedback.reduce((acc: any[], feedback) => {
      const existing = acc.find(item => item._id === feedback.category);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ _id: feedback.category, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.count - a.count);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      closed,
      categoryStats
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
