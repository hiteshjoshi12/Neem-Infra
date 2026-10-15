import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/authGuard';

export async function GET(req) {
  try {
    const admin = await requireAdmin(req);
    return NextResponse.json({
      success: true,
      data: admin
    });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

