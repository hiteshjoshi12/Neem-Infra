import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';

const checkAuth = async (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Not authorized, no token');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
  const admin = await Admin.findById(decoded.id).select('-password');
  if (!admin) throw new Error('Admin not found');
  return admin;
};

export async function POST(req) {
  try {
    await connectDB();
    await checkAuth(req);
    
    const body = await req.json();
    const tag = await Tag.create(body);
    
    return NextResponse.json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
