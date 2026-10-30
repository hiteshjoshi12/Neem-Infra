import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Author from '@/models/Author';
import { requireAdmin } from '@/lib/auth/authGuard';
import { clearBlogCache } from '@/services/blogService';
import { revalidateAuthor } from '@/lib/cache/revalidateHelper';

function getFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { slug: id }] };
  }
  return { slug: id };
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const author = await Author.findOne(getFilter(id)).lean();

    if (!author) {
      return NextResponse.json({ success: false, message: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: author
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    // Ensure slug is formatted if name or slug provided
    if (body.slug) {
      body.slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    } else if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const updatedAuthor = await Author.findOneAndUpdate(
      getFilter(id),
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return NextResponse.json({ success: false, message: 'Author not found' }, { status: 404 });
    }

    clearBlogCache();
    await revalidateAuthor(updatedAuthor);

    return NextResponse.json({
      success: true,
      message: 'Author profile updated successfully',
      data: updatedAuthor
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { id } = await params;
    const deleted = await Author.findOneAndDelete(getFilter(id));

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Author not found' }, { status: 404 });
    }

    clearBlogCache();
    await revalidateAuthor(deleted);

    return NextResponse.json({
      success: true,
      message: 'Author deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
