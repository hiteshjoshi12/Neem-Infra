import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/authGuard';

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

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    
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
