import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
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

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const posts = await BlogPost.find(filter)
      .populate('author category tags location propertyType')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { revalidatePath } from 'next/cache';
import { clearBlogCache } from '@/services/blogService';

export async function POST(req) {
  try {
    await connectDB();
    await checkAuth(req); // authorize every mutation server-side
    
    const body = await req.json();
    const post = await BlogPost.create(body);
    
    // Invalidate caches
    clearBlogCache();
    try {
      revalidatePath('/blog');
    } catch {
      // ignore outside request lifecycle
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
