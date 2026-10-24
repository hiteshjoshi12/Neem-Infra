import { NextResponse } from 'next/server';
import { getGlobalSettings } from '@/lib/dal';
import { submitToIndexNow } from '@/lib/seo/indexNowService';
import { requireAdmin } from '@/lib/auth/authGuard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getGlobalSettings();
  const key = settings?.indexNowKey?.trim() || '';

  return new NextResponse(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}

export async function POST(req) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { urls } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ success: false, message: 'Please provide an array of URLs' }, { status: 400 });
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit to IndexNow' },
      { status: error.status || 500 }
    );
  }
}
