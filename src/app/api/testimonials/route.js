import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { requireAdmin } from '@/lib/auth/authGuard';
import { getCached, setCached, invalidateCache } from '@/lib/cache/apiCache';
import { revalidateTestimonials } from '@/lib/cache/revalidateHelper';

const CACHE_TTL = 60_000; // 60 seconds — testimonials change very infrequently

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');
    
    const cacheKey = `testimonials:${all || 'active'}`;
    const cached = getCached(cacheKey, CACHE_TTL);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'private, max-age=30',
          'X-Cache': 'HIT',
        }
      });
    }

    await connectDB();
    const filter = all ? {} : { isActive: true };
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).lean();

    const responsePayload = {
      success: true,
      count: testimonials.length,
      data: testimonials
    };

    setCached(cacheKey, responsePayload);

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'private, max-age=30',
        'X-Cache': 'MISS',
      }
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
    const testimonial = await Testimonial.create(body);
    await revalidateTestimonials();
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    }, { status: 201 });
  } catch (error) {
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

