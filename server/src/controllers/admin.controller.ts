import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      res.status(500).json({ success: false, message: 'Admin credentials not configured on server' });
      return;
    }

    // Basic string comparison since it's an env setup for this MVP
    // In production, we'd hash the env password and compare with bcrypt if stored in DB
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token, // For this architecture we can send the token for the frontend to store in HTTPOnly Cookie or localStorage
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong during login' });
  }
};
