import { NextResponse } from 'next/server';
import { getGlobalSettings } from '@/lib/dal';
import { submitToIndexNow } from '@/lib/seo/indexNowService';
import { requireAdmin } from '@/lib/auth/authGuard';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const url = new URL(req.url);
  let requestedKey = url.searchParams.get('key')?.trim();
  if (!requestedKey) {
    const match = url.pathname.match(/\/([a-zA-Z0-9_-]{16,64})\.txt/);
    if (match) requestedKey = match[1];
  }

  const settings = await getGlobalSettings();
  const configuredKey = settings?.indexNowKey?.trim() || '';

  const keyToServe = requestedKey || configuredKey || '23c1fd3e813a48e78e6da5a6e2e50550';

  if (!keyToServe) {
    return new NextResponse('IndexNow key not configured', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  }

  return new NextResponse(keyToServe, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
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
