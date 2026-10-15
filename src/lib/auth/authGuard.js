import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';
import { connectDB } from '@/lib/mongodb';

/**
 * Validates the Authorization Bearer JWT token on protected API routes.
 * Throws an Error if no token, invalid signature, or admin not found.
 * Returns the authenticated Admin document.
 */
export async function requireAdmin(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Not authorized, missing or invalid Bearer token');
    error.status = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret && process.env.NODE_ENV === 'production') {
    const error = new Error('Server configuration error: JWT_SECRET is not set');
    error.status = 500;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret || 'secret123');
  } catch (err) {
    const error = new Error('Not authorized, token signature invalid or expired');
    error.status = 401;
    throw error;
  }

  await connectDB();
  const admin = await Admin.findById(decoded.id).select('-password');
  if (!admin) {
    const error = new Error('Admin not found or deactivated');
    error.status = 401;
    throw error;
  }

  return admin;
}
