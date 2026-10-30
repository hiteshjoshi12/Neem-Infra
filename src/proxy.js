import { NextResponse } from 'next/server';

const VALID_TAGS = new Set([
  'builder-floors',
  'dlf-gurugram',
  'nri-investment',
  'market-trends',
  'capital-appreciation',
  'ultra-luxury',
  'pre-leased-commercial',
  'due-diligence'
]);

const LEGACY_MAP = {
  '/4-bhk-independent-floor-dlf-phase1': '/properties/4-bhk-independent-floor-dlf-phase1',
  '/3-bhk-independent-floor-dlf-phase-2': '/properties/3-bhk-independent-floor-dlf-phase-2',
  '/duplex-villa-in-dlf-phase-1': '/properties/duplex-villa-in-dlf-phase-1',
  '/villa-in-sushant-lok-1': '/properties/villa-in-sushant-lok-1',
  '/4-bhk-independent-floor-dlf-phase-1-gurgaon-2': '/properties/4-bhk-independent-floor-dlf-phase-1-2',
  '/kothi-for-sale-in-dlf-phase-3': '/blog/kothi-for-sale-in-dlf-phase-3',
  '/luxury-duplex-villa-in-dlf-phase-1': '/blog/luxury-duplex-villa-in-dlf-phase-1',
  '/builder-floors-dlf-phase-1-prices-amenities': '/blog/builder-floors-dlf-phase-1-prices-amenities',
  '/property-dealers-in-gurugram-complete-guide': '/blog/property-dealers-in-gurugram-complete-guide',
  '/property-investment': '/blog/category/property-investment',
  '/gurugram-properties': '/properties',
  '/ready-to-move': '/properties',
  '/new-launches': '/properties',
  '/under-construction': '/properties',
  '/developers': '/about',
  '/careers': '/about',
  '/about-us': '/about',
  '/our-team': '/team',
  '/clients': '/about',
  '/property-in-dlf-phase-1': '/property/dlf-phase-1',
  '/property-in-dlf-phase-2': '/property/dlf-phase-2',
  '/property-in-dlf-phase-3': '/property/dlf-phase-3',
  '/property-in-dlf-phase-4': '/property/dlf-phase-4',
  '/property-in-sushant-lok': '/property/shushant-lok',
  '/property-in-udyog-vihar': '/property/udyog-vihar',
  '/services/dlf-phase-1': '/property/dlf-phase-1',
  '/services/dlf-phase-2': '/property/dlf-phase-2',
  '/services/dlf-phase-3': '/property/dlf-phase-3',
  '/services/dlf-phase-4': '/property/dlf-phase-4',
  '/services/sushant-lok': '/property/shushant-lok',
  '/services/udyog-vihar': '/property/udyog-vihar',
  '/property/sushant-lok': '/property/shushant-lok',
};

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';

  // 1. Dead WordPress Feeds & Search Action Templates: return 410 Gone immediately (zero hops)
  if (
    pathname === '/feed' ||
    pathname.startsWith('/feed/') ||
    pathname.endsWith('/feed') ||
    pathname.endsWith('/feed/') ||
    pathname.includes('/feed/') ||
    pathname.includes('search_term_string') ||
    search.includes('search_term_string') ||
    pathname.startsWith('/search/')
  ) {
    return new NextResponse('Resource Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Content-Type': 'text/plain; charset=utf-8'
      },
    });
  }

  // 2. Trailing slash normalization: clean path for evaluation
  const cleanPath = (pathname !== '/' && pathname.endsWith('/'))
    ? pathname.replace(/\/+$/, '')
    : pathname;

  // 2b. Sitemap Route Protection:
  // Never intercept, redirect or 404 any sitemap URL, including requests with or without trailing slash.
  const isSitemap =
    cleanPath === '/sitemap_index.xml' ||
    cleanPath === '/sitemap.xml' ||
    /^\/[a-z0-9_-]+-sitemap(-\d+)?\.xml$/i.test(cleanPath);

  if (isSitemap) {
    if (pathname.endsWith('/') && pathname !== cleanPath) {
      return NextResponse.rewrite(new URL(cleanPath, request.url));
    }
    return NextResponse.next();
  }

  // 3. Legacy WordPress Tag archives (/tag/*)
  if (cleanPath.startsWith('/tag/')) {
    const tagSlug = cleanPath.replace(/^\/tag\//, '');
    if (VALID_TAGS.has(tagSlug)) {
      return NextResponse.redirect(new URL(`/blog/tag/${tagSlug}`, 'https://saudagarproperties.com'), 301);
    } else {
      return new NextResponse('Tag Gone', {
        status: 410,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Content-Type': 'text/plain; charset=utf-8'
        },
      });
    }
  }

  // 4. Resolve Legacy URL destination
  let legacyDestination = LEGACY_MAP[cleanPath];
  if (!legacyDestination && cleanPath.startsWith('/property-investment/page/')) {
    legacyDestination = '/blog/category/property-investment';
  }
  if (!legacyDestination && cleanPath.startsWith('/uncategorized/')) {
    legacyDestination = '/blog';
  }

  // If a legacy mapping is found, redirect directly in ONE single hop to apex canonical
  if (legacyDestination) {
    return NextResponse.redirect(new URL(`${legacyDestination}${search}`, 'https://saudagarproperties.com'), 301);
  }

  // 5. Host Canonicalization & Trailing Slash Resolution (ONE HOP)
  const isNonApexOrHttp =
    host.includes('www.saudagarproperties.com') ||
    (proto === 'http' && host === 'saudagarproperties.com');
  const hasTrailingSlash = pathname !== '/' && pathname.endsWith('/');

  if (isNonApexOrHttp || hasTrailingSlash) {
    return NextResponse.redirect(new URL(`https://saudagarproperties.com${cleanPath}${search}`), 301);
  }

  // 6. Security & Indexing Protection for Admin & API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 7. Ignore static assets and system routes
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

  // Set headers for downstream Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-url', request.url);

  // 8. Dynamic DB Redirect lookup for non-static routes
  const KNOWN_STATIC_ROUTES = new Set([
    '/',
    '/about',
    '/contact',
    '/team',
    '/terms',
    '/privacy-policy',
    '/properties',
    '/services/residential',
    '/services/commercial',
    '/services/industrial',
    '/blog'
  ]);

  if (!KNOWN_STATIC_ROUTES.has(pathname)) {
    try {
      const baseOrigin = request.nextUrl.origin;
      const lookupUrl = new URL(`/api/seo/redirects/lookup?path=${encodeURIComponent(pathname)}`, baseOrigin);

      const res = await fetch(lookupUrl, {
        headers: { 'x-proxy-lookup': '1' },
        signal: AbortSignal.timeout(1500),
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
          const cleanDest = dest.replace(/^https?:\/\/[^\/]+/, '').replace(/\/+$/, '') || '/';
          const cleanCurrent = pathname.replace(/\/+$/, '') || '/';
          if (cleanDest === cleanCurrent) {
            return NextResponse.next({
              request: { headers: requestHeaders },
            });
          }
          const statusCode = data.redirect.statusCode || 301;
          const targetUrl = dest.startsWith('http') ? dest : new URL(`${dest}${search}`, 'https://saudagarproperties.com');
          return NextResponse.redirect(targetUrl, statusCode);
        }
      }
    } catch (err) {
      // Silently fall through to Next.js route handling
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon).*)',
  ],
};
