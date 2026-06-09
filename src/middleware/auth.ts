import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models';

export interface AuthRequest extends Request {
  admin?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const admin = await AdminModel.findById(decoded.id);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid token or admin not found.' });
    }

    // Remove password from admin object before attaching to request
    const { password, ...adminWithoutPassword } = admin;
    req.admin = adminWithoutPassword;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Access denied.' });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    next();
  };
};
