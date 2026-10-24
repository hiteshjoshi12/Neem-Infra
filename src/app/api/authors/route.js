import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Author from '@/models/Author';
import { requireAdmin } from '@/lib/auth/authGuard';
import { clearBlogCache } from '@/services/blogService';
import { invalidateCache } from '@/lib/cache/apiCache';

export async function GET(req) {
  try {
    await connectDB();
    const authors = await Author.find().sort({ name: 1 }).lean();

    return NextResponse.json({
      success: true,
      count: authors.length,
      data: authors
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
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

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: 'Author name is required' }, { status: 400 });
    }

    if (!body.slug || !body.slug.trim()) {
      body.slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const author = await Author.create(body);

    clearBlogCache();
    invalidateCache('authors');
    try {
      const { revalidateTag, revalidatePath } = await import('next/cache');
      revalidateTag('team');
      revalidateTag('authors');
      revalidatePath('/team');
      revalidatePath('/blog');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Author created successfully',
      data: author
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
