import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Redirect from '@/models/Redirect';
import { normalizePath } from '@/lib/seo/metadataHelper';

// Bounded LRU Cache implementation for positive and negative redirect resolution
class BoundedLruCache {
  constructor(maxEntries = 2000, ttlMs = 30_000) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }
    // Refresh LRU order: delete and re-set to end of map
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (least recently used)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  get size() {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
      ttlMs: this.ttlMs,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

const redirectLookupCache = new BoundedLruCache(2000, 30_000);

export function invalidateRedirectLookupCache() {
  redirectLookupCache.clear();
}

export function getRedirectLookupCacheStats() {
  return redirectLookupCache.getStats();
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Support diagnostic query for cache monitoring
    if (searchParams.get('debug') === 'cache_stats') {
      return NextResponse.json({
        success: true,
        stats: redirectLookupCache.getStats(),
      });
    }

    const rawPath = searchParams.get('path');

    if (!rawPath) {
      return NextResponse.json({ redirect: null });
    }

    const norm = normalizePath(rawPath);

    // 1. Check bounded in-memory cache (handles both positive and negative lookups)
    const cached = redirectLookupCache.get(norm);
    if (cached !== undefined) {
      return NextResponse.json({ redirect: cached }, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Redirect-Cache': 'HIT',
        },
      });
    }

    await connectDB();
    const doc = await Redirect.findOne({ fromPath: norm, isActive: true }).lean();

    if (!doc) {
      // Store negative cache result
      redirectLookupCache.set(norm, null);
      return NextResponse.json({ redirect: null }, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Redirect-Cache': 'MISS',
        },
      });
    }

    // Guard against self-redirect loops
    const normTo = normalizePath(doc.toPath);
    if (normTo === norm && doc.statusCode !== 410) {
      redirectLookupCache.set(norm, null);
      return NextResponse.json({ redirect: null });
    }

    const redirectData = {
      toPath: doc.toPath,
      statusCode: doc.statusCode || 301,
    };

    // Store positive cache result
    redirectLookupCache.set(norm, redirectData);

    // Increment hit counter asynchronously without blocking response
    Redirect.updateOne({ _id: doc._id }, { $inc: { hits: 1 }, $set: { lastHitAt: new Date() } }).exec().catch(() => {});

    return NextResponse.json({
      redirect: redirectData,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Redirect-Cache': 'MISS',
      },
    });
  } catch (error) {
    return NextResponse.json({ redirect: null, error: error.message }, { status: 500 });
  }
}
