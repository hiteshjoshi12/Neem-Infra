import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import BlogPost from '@/models/BlogPost';
import { requireAdmin } from '@/lib/auth/authGuard';
import { revalidateCategory } from '@/lib/cache/revalidateHelper';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    const { name, slug, description, excludeFromSitemap } = body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (excludeFromSitemap !== undefined) updateData.excludeFromSitemap = Boolean(excludeFromSitemap);
    if (slug) {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      const duplicate = await Category.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json({ success: false, message: `Category slug '${cleanSlug}' already in use` }, { status: 400 });
      }
      updateData.slug = cleanSlug;
    }

    const updated = await Category.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' });
    await revalidateCategory(updated);

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    // Check if blog posts are linked to this category
    const linkedPostsCount = await BlogPost.countDocuments({ category: id });
    if (linkedPostsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category because ${linkedPostsCount} article(s) are assigned to it. Please reassign them first.`,
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);
    await revalidateCategory(category);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: error.status || 500 }
    );
  }
}
