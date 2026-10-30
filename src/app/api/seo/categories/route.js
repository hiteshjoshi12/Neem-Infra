import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/authGuard';
import { revalidateCategory } from '@/lib/cache/revalidateHelper';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Attach blog count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await BlogPost.countDocuments({ category: cat._id });
        return {
          ...cat,
          postCount: count,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
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

    const { name, slug, description } = body;
    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    const existing = await Category.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json({ success: false, message: `Category with slug '${cleanSlug}' already exists` }, { status: 400 });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: cleanSlug,
      description: description?.trim() || '',
      excludeFromSitemap: Boolean(body.excludeFromSitemap),
    });

    await revalidateCategory(category);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: category,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: error.status || 500 }
    );
  }
}
