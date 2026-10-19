import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { normalizePath } from '@/lib/seo/metadataHelper';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const redirect = await Redirect.findById(id);
    if (!redirect) {
      return NextResponse.json({ success: false, message: 'Redirect not found' }, { status: 404 });
    }

    let normFrom = redirect.fromPath;
    if (body.fromPath) {
      normFrom = normalizePath(body.fromPath);
      const duplicate = await Redirect.findOne({ fromPath: normFrom, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json({ success: false, message: `A redirect for '${normFrom}' already exists.` }, { status: 400 });
      }
    }

    let normTo = redirect.toPath;
    if (body.toPath) {
      normTo = body.toPath.trim().startsWith('http') ? body.toPath.trim() : normalizePath(body.toPath);
    }

    if (normFrom === normTo) {
      return NextResponse.json({ success: false, message: 'Source and Destination cannot be identical' }, { status: 400 });
    }

    const updated = await Redirect.findByIdAndUpdate(
      id,
      {
        $set: {
          fromPath: normFrom,
          toPath: normTo,
          statusCode: body.statusCode === 302 ? 302 : 301,
          isActive: body.isActive !== undefined ? body.isActive : redirect.isActive,
          notes: body.notes !== undefined ? body.notes.trim() : redirect.notes,
        },
      },
      { returnDocument: 'after', runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Redirect updated successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update redirect' },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { id } = await params;

    const redirect = await Redirect.findByIdAndDelete(id);
    if (!redirect) {
      return NextResponse.json({ success: false, message: 'Redirect not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Redirect deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete redirect' },
      { status: error.status || 500 }
    );
  }
}
