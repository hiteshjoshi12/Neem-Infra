import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Not authorized, no token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        data: admin
      });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Not authorized, token failed' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

