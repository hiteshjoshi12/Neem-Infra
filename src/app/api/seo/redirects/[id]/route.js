import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { normalizePath } from '@/lib/seo/metadataHelper';
import { invalidateRedirectLookupCache } from '@/app/api/seo/redirects/lookup/route';
import { detectLoopOrChain } from '@/app/api/seo/redirects/route';

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
        return NextResponse.json(
          { success: false, message: `A redirect for '${normFrom}' already exists.` },
          { status: 400 }
        );
      }
    }

    let normTo = redirect.toPath;
    if (body.toPath) {
      normTo = body.toPath.trim().startsWith('http') ? body.toPath.trim() : normalizePath(body.toPath);
    }

    if (normFrom === normTo) {
      return NextResponse.json(
        { success: false, message: 'Source and Destination cannot be identical (self-redirect loop)' },
        { status: 400 }
      );
    }

    // Check for circular loop
    const loopOrChain = await detectLoopOrChain(normFrom, normTo, id);
    if (loopOrChain?.isLoop) {
      return NextResponse.json({ success: false, message: loopOrChain.message }, { status: 400 });
    }

    const updated = await Redirect.findByIdAndUpdate(
      id,
      {
        $set: {
          fromPath: normFrom,
          toPath: normTo,
          statusCode: body.statusCode === 302 ? 302 : (body.statusCode === 410 ? 410 : 301),
          isActive: body.isActive !== undefined ? body.isActive : redirect.isActive,
          notes: body.notes !== undefined ? body.notes.trim() : redirect.notes,
        },
      },
      { returnDocument: 'after', runValidators: true }
    );

    invalidateRedirectLookupCache();
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag('redirects');
    } catch {}

    return NextResponse.json({
      success: true,
      message: loopOrChain?.isChain
        ? `Redirect updated with chain warning: ${loopOrChain.message}`
        : 'Redirect updated successfully',
      data: updated,
      chainWarning: loopOrChain?.isChain ? loopOrChain : null,
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

    const deleted = await Redirect.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Redirect not found' }, { status: 404 });
    }

    invalidateRedirectLookupCache();
    try {
      const { revalidateTag } = await import('next/cache');
      revalidateTag('redirects');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Redirect deleted successfully',
      data: deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete redirect' },
      { status: error.status || 500 }
    );
  }
}
