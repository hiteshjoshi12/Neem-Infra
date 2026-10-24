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
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'saudagarproperties.com',
      },
      {
        protocol: 'https',
        hostname: 'www.saudagarproperties.com',
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
            value: 'max-age=63072000; includeSubDomains; preload',
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
    ];
  },
  trailingSlash: false,
  async redirects() {
    return [
      // Legacy WordPress category and tag archives
      {
        source: '/category/:slug*',
        destination: '/blog/category/:slug*',
        permanent: true,
      },
      {
        source: '/tag/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/feed/:slug*',
        destination: '/blog',
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
        source: '/clients',
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
        source: '/4-bhk-independent-floor-dlf-phase1',
        destination: '/properties',
        permanent: true,
      },
      // Legacy property catalog routes redirected to active counterparts
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