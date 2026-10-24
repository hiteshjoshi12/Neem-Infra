import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import NotFoundLog from '@/models/NotFoundLog';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';

export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const resolved = searchParams.get('resolved') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

    const logs = await NotFoundLog.find({ resolved })
      .sort({ hits: -1, lastHitAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch 404 logs' },
      { status: error.status || 500 }
    );
  }
}

/**
 * Resolve a 404 by creating a 301 Redirect or marking as 410 Gone
 */
export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    const body = await req.json();
    const { path, toPath, statusCode = 301 } = body;

    if (!path) {
      return NextResponse.json({ success: false, message: 'Missing 404 path' }, { status: 400 });
    }

    if (statusCode !== 410 && !toPath) {
      return NextResponse.json({ success: false, message: 'Missing destination toPath for redirect' }, { status: 400 });
    }

    // Create or update Redirect
    await Redirect.findOneAndUpdate(
      { fromPath: path.toLowerCase() },
      {
        $set: {
          fromPath: path.toLowerCase(),
          toPath: statusCode === 410 ? '' : toPath,
          statusCode,
          isActive: true,
          notes: `Created from 404 Log resolution`,
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Mark 404 log as resolved
    await NotFoundLog.updateMany(
      { path: path },
      {
        $set: {
          resolved: true,
          resolvedRedirectTo: statusCode === 410 ? '410 Gone' : toPath,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `404 path '${path}' resolved with status ${statusCode}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to resolve 404' },
      { status: error.status || 500 }
    );
  }
}
