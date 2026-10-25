import { NextResponse } from 'next/server';

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';

  // 1. Host Canonicalization: Single-hop 301 to apex https://saudagarproperties.com
  if (
    host.includes('www.saudagarproperties.com') ||
    (proto === 'http' && host === 'saudagarproperties.com')
  ) {
    const targetUrl = new URL(`https://saudagarproperties.com${pathname}${search}`);
    return NextResponse.redirect(targetUrl, 301);
  }

  // 2. Trailing slash normalization (single-hop 301 redirect for non-root paths)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const cleanPath = pathname.replace(/\/+$/, '');
    const targetUrl = new URL(`${cleanPath}${search}`, request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // 3. Security & Indexing Protection for Admin & API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 4. Ignore static assets and system routes
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt'
  ) {
    return NextResponse.next();
  }

  // Set headers for downstream Server Components (e.g. not-found.js, logging)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-url', request.url);

  // 5. Fast redirect check via internal lookup
  try {
    const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https') ? 'https' : 'http');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const baseOrigin = host ? `${proto}://${host}` : request.nextUrl.origin;
    const lookupUrl = new URL(`/api/seo/redirects/lookup?path=${encodeURIComponent(pathname)}`, baseOrigin);

    const res = await fetch(lookupUrl, {
      headers: { 'x-proxy-lookup': '1' },
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.redirect?.statusCode === 410) {
        return new NextResponse('Resource Gone', {
          status: 410,
          headers: { 'X-Robots-Tag': 'noindex, nofollow' },
        });
      }
      if (data?.redirect?.toPath) {
        const dest = data.redirect.toPath;
        // Strip protocol, host, and trailing slashes to prevent self-redirect loops
        const cleanDest = dest.replace(/^https?:\/\/[^\/]+/, '').replace(/\/+$/, '') || '/';
        const cleanCurrent = pathname.replace(/\/+$/, '') || '/';
        if (cleanDest === cleanCurrent) {
          // Abort self-redirect loop
          return NextResponse.next({
            request: { headers: requestHeaders },
          });
        }
        const statusCode = data.redirect.statusCode || 301;
        const targetUrl = dest.startsWith('http') ? dest : new URL(`${dest}${search}`, request.url);
        return NextResponse.redirect(targetUrl, statusCode);
      }
    }
  } catch (err) {
    // If internal loopback fetch fails (e.g. host firewall blocking self-call),
    // downstream not-found.js Server Component will catch and execute redirect via MongoDB directly
    console.warn('[Proxy Redirect Lookup Fallback]:', err?.message || err);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Apply proxy to all paths except static files, _next, favicon, and app icons
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon).*)',
  ],
};
