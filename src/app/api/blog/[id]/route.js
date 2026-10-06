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

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await BlogPost.findById(id).populate('author category tags location propertyType');
    
    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: post
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { revalidatePath } from 'next/cache';
import { clearBlogCache } from '@/services/blogService';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    await checkAuth(req);
    
    const { id } = await params;
    const body = await req.json();
    
    const post = await BlogPost.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }
    
    clearBlogCache();
    try {
      revalidatePath('/blog');
      if (post.slug) revalidatePath(`/blog/${post.slug}`);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await checkAuth(req);
    
    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }
    
    clearBlogCache();
    try {
      revalidatePath('/blog');
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
