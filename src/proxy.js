import { NextResponse } from 'next/server';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, internal paths, and API/Admin routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Fast redirect check via internal lookup
  try {
    const lookupUrl = new URL(`/api/seo/redirects/lookup?path=${encodeURIComponent(pathname)}`, request.url);
    const res = await fetch(lookupUrl, {
      headers: { 'x-proxy-lookup': '1' },
      next: { revalidate: 10 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.redirect?.toPath) {
        const dest = data.redirect.toPath;
        const statusCode = data.redirect.statusCode || 301;
        const targetUrl = dest.startsWith('http') ? dest : new URL(dest, request.url);
        return NextResponse.redirect(targetUrl, statusCode);
      }
    }
  } catch (err) {
    // Gracefully proceed if internal lookup is unavailable
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply proxy to all paths except static files, _next, and favicon
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
