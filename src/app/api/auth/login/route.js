import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';

// In-memory rate limiting map for login attempts: ip -> { count, lockUntil }
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is missing in production environment');
  }
  return jwt.sign({ id }, secret || 'secret123', {
    expiresIn: '30d'
  });
};

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (record && record.lockUntil && now < record.lockUntil) {
      const waitMinutes = Math.ceil((record.lockUntil - now) / 60000);
      return NextResponse.json(
        { success: false, message: `Too many failed login attempts. Please try again in ${waitMinutes} minute(s).` },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide email and password' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await admin.matchPassword(password))) {
      // Clear failed attempts on successful login
      loginAttempts.delete(ip);
      return NextResponse.json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id)
        }
      });
    } else {
      // Increment failed attempts
      const currentAttempts = (record?.count || 0) + 1;
      const isLocked = currentAttempts >= MAX_ATTEMPTS;
      loginAttempts.set(ip, {
        count: currentAttempts,
        lockUntil: isLocked ? now + LOCKOUT_MS : null
      });

      const message = isLocked
        ? 'Maximum login attempts exceeded. Account access temporarily locked for 15 minutes.'
        : 'Invalid email or password';
      return NextResponse.json({ success: false, message }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

