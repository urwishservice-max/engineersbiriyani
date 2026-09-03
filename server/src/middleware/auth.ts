import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized, no token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    (req as any).admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized, invalid token' });
  }
};
