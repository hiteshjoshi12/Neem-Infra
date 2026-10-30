import { revalidateTag, revalidatePath } from 'next/cache';
import { invalidateCache } from '@/lib/cache/apiCache';
import { invalidateSeoCache } from '@/lib/seo/dynamicSeo';

/**
 * Universal safe revalidation runner for Next.js 16 App Router.
 * Handles both tag-based Data Cache invalidation and route-based Full Route Cache invalidation.
 */
export async function triggerRevalidation({ tags = [], paths = [] } = {}) {
  // 1. Invalidate in-memory DAL & API caches
  invalidateCache();
  invalidateSeoCache();

  // 2. Invalidate Next.js Data Cache tags (with { expire: 0 } for instant purge on first subsequent request)
  for (const tag of tags) {
    if (!tag) continue;
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      try {
        revalidateTag(tag, 'max');
      } catch {
        try {
          revalidateTag(tag);
        } catch {
          // Safe fallback in edge/isolated environments
        }
      }
    }
  }

  // 3. Invalidate Next.js ISR / Full Route Cache
  for (const item of paths) {
    if (!item) continue;
    try {
      if (typeof item === 'object' && item.path) {
        revalidatePath(item.path, item.type || 'page');
      } else if (typeof item === 'string') {
        revalidatePath(item);
      }
    } catch {
      // Safe fallback
    }
  }
}

/**
 * Revalidates all XML Sitemap files (Index and Child Sitemaps)
 * Uses revalidateTag(tag, { expire: 0 }) and path purging for instant update on first subsequent request.
 */
export async function revalidateSitemaps() {
  const sitemapPaths = [
    '/sitemap_index.xml',
    '/sitemap.xml',
    '/page-sitemap.xml',
    '/service-sitemap.xml',
    '/property-sitemap.xml',
    '/corridor-sitemap.xml',
    '/blog-sitemap.xml',
    '/blog-category-sitemap.xml',
    '/blog-tag-sitemap.xml',
    '/author-sitemap.xml',
  ];

  await triggerRevalidation({
    tags: [
      'sitemaps',
      'sitemap_index',
      'sitemap_pages',
      'sitemap_services',
      'sitemap_properties',
      'sitemap_corridors',
      'sitemap_blogs',
      'sitemap_categories',
      'sitemap_tags',
      'sitemap_authors',
    ],
    paths: sitemapPaths.map((p) => ({ path: p, type: 'page' })),
  });
}

/**
 * Revalidates Section & Page content
 */
export async function revalidateSectionContent(sectionKey) {
  const PAGE_ROUTE_MAP = {
    page_about: '/about',
    page_properties: '/properties',
    page_residential: '/services/residential',
    page_commercial: '/services/commercial',
    page_industrial: '/services/industrial',
    page_team: '/team',
    page_contact: '/contact',
    page_blog: '/blog',
    page_terms: '/terms',
    page_privacy: '/privacy-policy',
    'corridor_dlf-phase-1': '/property/dlf-phase-1',
    'corridor_dlf-phase-2': '/property/dlf-phase-2',
    'corridor_dlf-phase-3': '/property/dlf-phase-3',
    'corridor_dlf-phase-4': '/property/dlf-phase-4',
    'corridor_shushant-lok': '/property/shushant-lok',
    'corridor_udyog-vihar': '/property/udyog-vihar',
  };

  const targetPath = PAGE_ROUTE_MAP[sectionKey] || null;

  const paths = [
    { path: '/', type: 'layout' },
    { path: '/', type: 'page' },
  ];

  if (targetPath) {
    paths.push({ path: targetPath, type: 'page' });
  }

  await triggerRevalidation({
    tags: ['sections', 'dal_all_sections', 'dal_single_section'],
    paths,
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Property Listings
 */
export async function revalidateProperty(property) {
  const paths = [
    { path: '/', type: 'layout' },
    { path: '/', type: 'page' },
    { path: '/properties', type: 'page' },
    { path: '/sitemap_index.xml', type: 'page' },
    { path: '/sitemap.xml', type: 'page' },
    { path: '/property-sitemap.xml', type: 'page' },
  ];

  if (property?.slug) {
    paths.push({ path: `/properties/${property.slug}`, type: 'page' });
    paths.push({ path: `/property/${property.slug}`, type: 'page' });
  }

  await triggerRevalidation({
    tags: ['properties', 'dal_featured_properties', 'redirects'],
    paths,
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Testimonials
 */
export async function revalidateTestimonials() {
  await triggerRevalidation({
    tags: ['testimonials', 'dal_testimonials'],
    paths: [
      { path: '/', type: 'layout' },
      { path: '/', type: 'page' },
    ],
  });
}

/**
 * Revalidates Blog Posts
 */
export async function revalidateBlogPost(post) {
  const paths = [
    { path: '/blog', type: 'page' },
    { path: '/sitemap_index.xml', type: 'page' },
    { path: '/sitemap.xml', type: 'page' },
    { path: '/blog-sitemap.xml', type: 'page' },
  ];

  if (post?.slug) {
    paths.push({ path: `/blog/${post.slug}`, type: 'page' });
  }

  await triggerRevalidation({
    tags: ['blog', 'redirects'],
    paths,
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Authors
 */
export async function revalidateAuthor(author) {
  const paths = [
    { path: '/team', type: 'page' },
    { path: '/blog', type: 'page' },
    { path: '/sitemap_index.xml', type: 'page' },
    { path: '/sitemap.xml', type: 'page' },
    { path: '/author-sitemap.xml', type: 'page' },
  ];

  if (author?.slug) {
    paths.push({ path: `/blog/author/${author.slug}`, type: 'page' });
  }

  await triggerRevalidation({
    tags: ['authors', 'team', 'taxonomies_all'],
    paths,
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Global SEO Settings
 */
export async function revalidateSeoSettings() {
  await triggerRevalidation({
    tags: ['settings', 'dal_global_settings'],
    paths: [
      { path: '/', type: 'layout' },
      { path: '/', type: 'page' },
      { path: '/sitemap_index.xml', type: 'page' },
      { path: '/sitemap.xml', type: 'page' },
      { path: '/robots.txt', type: 'page' },
      { path: '/llms.txt', type: 'page' },
      { path: '/llms-full.txt', type: 'page' },
    ],
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Page-level SEO
 */
export async function revalidatePageSeo(slug) {
  const cleanSlug = slug?.startsWith('/') ? slug : `/${slug || ''}`;
  const paths = [
    { path: '/', type: 'layout' },
    { path: '/sitemap_index.xml', type: 'page' },
    { path: '/sitemap.xml', type: 'page' },
    { path: '/page-sitemap.xml', type: 'page' },
  ];

  if (cleanSlug) {
    paths.push({ path: cleanSlug, type: 'page' });
  }

  await triggerRevalidation({
    tags: ['pages', 'dal_page_by_slug'],
    paths,
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Business Profile
 */
export async function revalidateBusinessProfile() {
  await triggerRevalidation({
    tags: ['business_profile', 'dal_business_profile'],
    paths: [
      { path: '/', type: 'layout' },
      { path: '/', type: 'page' },
      { path: '/about', type: 'page' },
      { path: '/contact', type: 'page' },
      { path: '/team', type: 'page' },
      { path: '/services/residential', type: 'page' },
      { path: '/properties', type: 'page' },
      { path: '/blog', type: 'page' },
      { path: '/sitemap_index.xml', type: 'page' },
      { path: '/sitemap.xml', type: 'page' },
      { path: '/llms.txt', type: 'page' },
      { path: '/llms-full.txt', type: 'page' },
    ],
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Blog Categories
 */
export async function revalidateCategory(category) {
  const paths = [
    { path: '/blog', type: 'page' },
    { path: '/sitemap_index.xml', type: 'page' },
    { path: '/sitemap.xml', type: 'page' },
    { path: '/blog-category-sitemap.xml', type: 'page' },
  ];

  if (category?.slug) {
    paths.push({ path: `/blog/category/${category.slug}`, type: 'page' });
  }

  await triggerRevalidation({
    tags: ['taxonomies', 'taxonomies_all', 'blog'],
    paths,
  });
  await revalidateSitemaps();
}

/**
 * Revalidates Redirects
 */
export async function revalidateRedirects() {
  await triggerRevalidation({
    tags: ['redirects'],
    paths: [
      { path: '/', type: 'layout' },
    ],
  });
}
