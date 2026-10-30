import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { requireAdmin } from '@/lib/auth/authGuard';
import { triggerRevalidation } from '@/lib/cache/revalidateHelper';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();
    
    const body = await req.json();
    const tag = await Tag.create(body);

    await triggerRevalidation({ tags: ['taxonomies', 'taxonomies_all'] });
    
    return NextResponse.json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
