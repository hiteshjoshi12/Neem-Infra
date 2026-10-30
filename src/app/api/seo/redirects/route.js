import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { requireAdmin } from '@/lib/auth/authGuard';
import { normalizePath } from '@/lib/seo/metadataHelper';
import { invalidateRedirectLookupCache } from '@/app/api/seo/redirects/lookup/route';
import { revalidateRedirects } from '@/lib/cache/revalidateHelper';

/**
 * Validates against circular loops (A -> B -> A) and multi-hop redirect chains (A -> B -> C)
 */
export async function detectLoopOrChain(fromPath, toPath, currentId = null) {
  if (!toPath || toPath.startsWith('http')) return null;

  const visited = new Set([fromPath]);
  let current = toPath;
  let hops = 0;
  const MAX_HOPS = 10;

  while (current && !current.startsWith('http') && hops < MAX_HOPS) {
    if (visited.has(current)) {
      return {
        isLoop: true,
        message: `Redirect loop detected: '${fromPath}' leads circularly back to '${current}'. Aborted.`,
      };
    }
    visited.add(current);

    const filter = { fromPath: current, isActive: true };
    if (currentId) filter._id = { $ne: currentId };

    const chained = await Redirect.findOne(filter).lean();
    if (!chained) break;

    hops++;
    current = chained.toPath;
  }

  if (hops > 0) {
    return {
      isChain: true,
      finalDestination: current,
      hops: hops + 1,
      message: `Redirect chain detected (${hops + 1} hops): '${fromPath}' leads to '${current}'. Avoid chains by redirecting directly to '${current}'.`,
    };
  }

  return null;
}

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
      return NextResponse.json(
        { success: false, message: 'Source (from) and Destination (to) URLs are required' },
        { status: 400 }
      );
    }

    const normFrom = normalizePath(fromPath);
    const normTo = toPath.trim().startsWith('http') ? toPath.trim() : normalizePath(toPath);

    if (normFrom === normTo) {
      return NextResponse.json(
        { success: false, message: 'Source and Destination cannot be the exact same URL (self-redirect loop)' },
        { status: 400 }
      );
    }

    // 1. Check for circular loops and chains
    const loopOrChain = await detectLoopOrChain(normFrom, normTo);
    if (loopOrChain?.isLoop) {
      return NextResponse.json({ success: false, message: loopOrChain.message }, { status: 400 });
    }

    const existing = await Redirect.findOne({ fromPath: normFrom });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `A redirect for '${normFrom}' already exists.` },
        { status: 400 }
      );
    }

    const redirect = await Redirect.create({
      fromPath: normFrom,
      toPath: normTo,
      statusCode: statusCode === 302 ? 302 : (statusCode === 410 ? 410 : 301),
      isActive: isActive !== false,
      notes: notes?.trim() || (loopOrChain?.isChain ? `Chain warning: Leads to ${loopOrChain.finalDestination}` : ''),
      createdBy: admin.name || admin.email || 'Admin',
    });

    invalidateRedirectLookupCache();
    await revalidateRedirects();

    return NextResponse.json(
      {
        success: true,
        message: loopOrChain?.isChain
          ? `Redirect created with chain warning: ${loopOrChain.message}`
          : 'Redirect created successfully',
        data: redirect,
        chainWarning: loopOrChain?.isChain ? loopOrChain : null,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create redirect' },
      { status: error.status || 500 }
    );
  }
}
