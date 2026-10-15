import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/authGuard';

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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { revalidatePath } from 'next/cache';
import { clearBlogCache } from '@/services/blogService';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const { id } = await params;
    const body = await req.json();
    
    // Ensure slug is never empty
    if ((!body.slug || !body.slug.trim()) && body.title) {
      body.slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

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
    const status = error.status || 400;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    
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
