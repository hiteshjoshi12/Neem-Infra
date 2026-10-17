import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';
import { connectDB } from '@/lib/mongodb';

// In-memory cache for validated admin sessions: adminId -> { admin, timestamp }
const adminSessionCache = new Map();
const ADMIN_CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Validates the Authorization Bearer JWT token on protected API routes.
 * Throws an Error if no token, invalid signature, or admin not found.
 * Returns the authenticated Admin document (plain object).
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

  // Check in-memory admin cache to eliminate redundant MongoDB lookups
  const cached = adminSessionCache.get(decoded.id);
  if (cached && Date.now() - cached.timestamp < ADMIN_CACHE_TTL_MS) {
    return cached.admin;
  }

  await connectDB();
  const admin = await Admin.findById(decoded.id).select('-password').lean();
  if (!admin) {
    adminSessionCache.delete(decoded.id);
    const error = new Error('Admin not found or deactivated');
    error.status = 401;
    throw error;
  }

  adminSessionCache.set(decoded.id, { admin, timestamp: Date.now() });

  return admin;
}

/**
 * Invalidate an admin's cached session (e.g. on role change or logout)
 */
export function invalidateAdminSession(adminId) {
  if (adminId) {
    adminSessionCache.delete(adminId);
  } else {
    adminSessionCache.clear();
  }
}
