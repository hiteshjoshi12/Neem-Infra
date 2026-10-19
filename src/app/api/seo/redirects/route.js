import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { normalizePath } from '@/lib/seo/metadataHelper';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'all';

    const filter = {};
    if (search) {
      filter.$or = [
        { fromPath: { $regex: search, $options: 'i' } },
        { toPath: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const redirects = await Redirect.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: redirects,
      total: redirects.length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    await connectDB();
    const body = await req.json();

    const { fromPath, toPath, statusCode, isActive, notes } = body;

    if (!fromPath || !toPath) {
      return NextResponse.json({ success: false, message: 'Source (from) and Destination (to) URLs are required' }, { status: 400 });
    }

    const normFrom = normalizePath(fromPath);
    const normTo = toPath.trim().startsWith('http') ? toPath.trim() : normalizePath(toPath);

    if (normFrom === normTo) {
      return NextResponse.json({ success: false, message: 'Source and Destination cannot be the exact same URL' }, { status: 400 });
    }

    const existing = await Redirect.findOne({ fromPath: normFrom });
    if (existing) {
      return NextResponse.json({ success: false, message: `A redirect for '${normFrom}' already exists.` }, { status: 400 });
    }

    const redirect = await Redirect.create({
      fromPath: normFrom,
      toPath: normTo,
      statusCode: statusCode === 302 ? 302 : 301,
      isActive: isActive !== false,
      notes: notes?.trim() || '',
      createdBy: admin.name || admin.email || 'Admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Redirect created successfully',
      data: redirect,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create redirect' },
      { status: error.status || 500 }
    );
  }
}
