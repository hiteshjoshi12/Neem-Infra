import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { normalizePath } from '@/lib/seo/metadataHelper';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPath = searchParams.get('path');

    if (!rawPath) {
      return NextResponse.json({ redirect: null });
    }

    const norm = normalizePath(rawPath);

    await connectDB();
    const doc = await Redirect.findOne({ fromPath: norm, isActive: true }).lean();

    if (!doc) {
      return NextResponse.json({ redirect: null });
    }

    // Increment hit counter asynchronously without blocking response
    Redirect.updateOne({ _id: doc._id }, { $inc: { hits: 1 }, $set: { lastHitAt: new Date() } }).exec().catch(() => {});

    return NextResponse.json({
      redirect: {
        toPath: doc.toPath,
        statusCode: doc.statusCode || 301,
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      }
    });
  } catch (error) {
    return NextResponse.json({ redirect: null, error: error.message }, { status: 500 });
  }
}
