import express from 'express';
import { body, validationResult } from 'express-validator';
import { AdminModel } from '../models';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, authorize('Super Admin'), async (req, res) => {
  try {
    const admins = await AdminModel.findAll();
    res.json(admins);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authenticate, authorize('Super Admin'), [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').isIn(['Super Admin', 'Admin', 'Editor']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;

    const existingAdmin = await AdminModel.findByUsername(username) || await AdminModel.findByEmail(email);

    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const adminId = await AdminModel.create(req.body);
    const admin = await AdminModel.findById(adminId);
    
    if (!admin) {
      return res.status(500).json({ message: 'Failed to create admin' });
    }

    const { password, ...adminResponse } = admin;

    res.status(201).json(adminResponse);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authenticate, authorize('Super Admin'), [
  body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('role').optional().isIn(['Super Admin', 'Admin', 'Editor']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;

    if (username || email) {
      const existingAdmin = await AdminModel.findByUsername(username) || await AdminModel.findByEmail(email);

      if (existingAdmin && existingAdmin.id !== parseInt(req.params.id)) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
    }

    const admin = await AdminModel.findById(parseInt(req.params.id));

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await AdminModel.update(parseInt(req.params.id), req.body);
    const updatedAdmin = await AdminModel.findById(parseInt(req.params.id));

    res.json(updatedAdmin);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Super Admin'), async (req: AuthRequest, res) => {
  try {
    if (req.params.id === req.admin!.id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const admin = await AdminModel.findById(parseInt(req.params.id));

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await AdminModel.delete(parseInt(req.params.id));

    res.json({ message: 'Admin deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/toggle-status', authenticate, authorize('Super Admin'), async (req: AuthRequest, res) => {
  try {
    if (req.params.id === req.admin!.id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own status' });
    }

    const admin = await AdminModel.findById(parseInt(req.params.id));

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await AdminModel.update(parseInt(req.params.id), { isActive: !admin.isActive });
    const updatedAdmin = await AdminModel.findById(parseInt(req.params.id));

    res.json({ 
      message: `Admin ${updatedAdmin?.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: updatedAdmin?.isActive
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
