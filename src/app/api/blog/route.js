import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/authGuard';
import { getCached, setCached, invalidateCache } from '@/lib/cache/apiCache';
import { revalidatePath } from 'next/cache';
import { clearBlogCache } from '@/services/blogService';

const CACHE_TTL = 30_000; // 30 seconds

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const forceFresh = searchParams.get('fresh') === '1';
    
    const cacheKey = `blog:${status || 'all'}`;
    if (!forceFresh) {
      const cached = getCached(cacheKey, CACHE_TTL);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'private, max-age=15',
            'X-Cache': 'HIT',
          }
        });
      }
    }

    await connectDB();
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const posts = await BlogPost.find(filter)
      .select('title slug excerpt featuredImage featuredImageAlt status publishedAt readingTime author category tags location propertyType seoTitle seoDescription featured createdAt updatedAt categorySlug authorSlug')
      .populate('author', 'name slug avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('location', 'name slug')
      .populate('propertyType', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    const responsePayload = {
      success: true,
      count: posts.length,
      data: posts
    };

    setCached(cacheKey, responsePayload);

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'private, max-age=15',
        'X-Cache': 'MISS',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

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
    invalidateCache('blog');
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
