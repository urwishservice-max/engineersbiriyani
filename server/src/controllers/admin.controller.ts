import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@biriyani.com').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();

    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    if (inputEmail === adminEmail && inputPassword === adminPassword) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong during login' });
  }
};
