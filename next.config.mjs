/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose', 'bcryptjs', 'nodemailer', 'imagekit'],
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [25, 50, 75, 80, 88, 90, 92, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/saudagarproperties/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'saudagarproperties.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000',
          },
        ],
      },
      // Strictly prevent search engines from indexing or archiving any admin panel or API route
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/search/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      beforeFiles: [
        // Split sitemaps support (e.g. /blog-sitemap-2.xml -> /api/sitemaps/blog-sitemap-2.xml)
        {
          source: '/:sitemap([a-z0-9_-]+-sitemap-\\d+\\.xml)',
          destination: '/api/sitemaps/:sitemap',
        },
        // IndexNow root verification key file (e.g. /23c1fd3e813a48e78e6da5a6e2e50550.txt)
        // Maps directly to IndexNow route handler before filesystem checking, preventing collision with [slug]
        {
          source: '/:key([a-zA-Z0-9_-]{16,64})\\.txt',
          destination: '/api/seo/indexnow?key=:key',
        },
      ],
    };
  },
  async redirects() {
    return [
      // Legacy WordPress category archives
      {
        source: '/category/:slug*',
        destination: '/blog/category/:slug*',
        permanent: true,
      },
      // Blog aliases
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blogs/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/post/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/article/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Team and clients aliases
      {
        source: '/our-team',
        destination: '/team',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/clients',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/careers',
        destination: '/about',
        permanent: true,
      },
      // Micro-market & corridor landing page redirects
      {
        source: '/services/dlf-phase-1',
        destination: '/property/dlf-phase-1',
        permanent: true,
      },
      {
        source: '/services/dlf-phase-2',
        destination: '/property/dlf-phase-2',
        permanent: true,
      },
      {
        source: '/services/dlf-phase-3',
        destination: '/property/dlf-phase-3',
        permanent: true,
      },
      {
        source: '/services/dlf-phase-4',
        destination: '/property/dlf-phase-4',
        permanent: true,
      },
      {
        source: '/services/sushant-lok',
        destination: '/property/shushant-lok',
        permanent: true,
      },
      {
        source: '/services/udyog-vihar',
        destination: '/property/udyog-vihar',
        permanent: true,
      },
      {
        source: '/property/sushant-lok',
        destination: '/property/shushant-lok',
        permanent: true,
      },
      {
        source: '/property-in-dlf-phase-1',
        destination: '/property/dlf-phase-1',
        permanent: true,
      },
      {
        source: '/property-in-dlf-phase-2',
        destination: '/property/dlf-phase-2',
        permanent: true,
      },
      {
        source: '/property-in-dlf-phase-3',
        destination: '/property/dlf-phase-3',
        permanent: true,
      },
      {
        source: '/property-in-dlf-phase-4',
        destination: '/property/dlf-phase-4',
        permanent: true,
      },
      {
        source: '/property-in-sushant-lok',
        destination: '/property/shushant-lok',
        permanent: true,
      },
      {
        source: '/property-in-udyog-vihar',
        destination: '/property/udyog-vihar',
        permanent: true,
      },
      // Direct Property legacy & discovered root URLs redirected to canonical /properties/[slug]
      {
        source: '/4-bhk-independent-floor-dlf-phase1',
        destination: '/properties/4-bhk-independent-floor-dlf-phase1',
        permanent: true,
      },
      {
        source: '/3-bhk-independent-floor-dlf-phase-2',
        destination: '/properties/3-bhk-independent-floor-dlf-phase-2',
        permanent: true,
      },
      {
        source: '/duplex-villa-in-dlf-phase-1',
        destination: '/properties/duplex-villa-in-dlf-phase-1',
        permanent: true,
      },
      {
        source: '/villa-in-sushant-lok-1',
        destination: '/properties/villa-in-sushant-lok-1',
        permanent: true,
      },
      {
        source: '/4-bhk-independent-floor-dlf-phase-1-gurgaon-2',
        destination: '/properties/4-bhk-independent-floor-dlf-phase-1-2',
        permanent: true,
      },
      // Direct Blog legacy root URLs redirected to canonical /blog/[slug]
      {
        source: '/kothi-for-sale-in-dlf-phase-3',
        destination: '/blog/kothi-for-sale-in-dlf-phase-3',
        permanent: true,
      },
      {
        source: '/luxury-duplex-villa-in-dlf-phase-1',
        destination: '/blog/luxury-duplex-villa-in-dlf-phase-1',
        permanent: true,
      },
      {
        source: '/builder-floors-dlf-phase-1-prices-amenities',
        destination: '/blog/builder-floors-dlf-phase-1-prices-amenities',
        permanent: true,
      },
      {
        source: '/property-dealers-in-gurugram-complete-guide',
        destination: '/blog/property-dealers-in-gurugram-complete-guide',
        permanent: true,
      },
      // Category & Pagination redirects
      {
        source: '/property-investment/page/:page*',
        destination: '/blog/category/property-investment',
        permanent: true,
      },
      {
        source: '/property-investment',
        destination: '/blog/category/property-investment',
        permanent: true,
      },
      {
        source: '/uncategorized/:slug*',
        destination: '/blog',
        permanent: true,
      },
      // Legacy property catalog routes redirected to active counterparts
      {
        source: '/gurugram-properties',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/ready-to-move',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/new-launches',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/under-construction',
        destination: '/properties',
        permanent: true,
      },
      {
        source: '/developers',
        destination: '/about',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;