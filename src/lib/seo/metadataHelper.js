import { SITE_URL, SITE_NAME, DEFAULT_META } from '@/lib/seo/seoConfig';

/**
 * Normalizes a URL path:
 * - strips trailing slash (unless root "/")
 * - ensures leading slash
 * - strips query strings and hash fragments
 */
export function normalizePath(path = '/') {
  if (!path) return '/';
  let clean = path.split('?')[0].split('#')[0].trim();
  if (!clean.startsWith('/')) clean = `/${clean}`;
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean.toLowerCase();
}

/**
 * Builds canonical URL strictly on the production domain
 */
export function getCanonicalUrl(path = '/') {
  const norm = normalizePath(path);
  return norm === '/' ? SITE_URL : `${SITE_URL}${norm}`;
}

/**
 * Formats page title ensuring brand suffix without duplicate brand names
 */
export function formatMetaTitle(rawTitle) {
  if (!rawTitle) return `${SITE_NAME} — Premier Real Estate Consultant DLF Gurugram`;
  const clean = rawTitle.trim();
  if (clean.includes(SITE_NAME)) return clean;
  return `${clean} | ${SITE_NAME}`;
}

/**
 * Truncates meta description to ideal search snippet length (150-160 characters)
 */
export function formatMetaDescription(rawDescription, maxLength = 160) {
  if (!rawDescription) return DEFAULT_META.description;
  const clean = rawDescription.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  // Truncate at previous word boundary
  const truncated = clean.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 110 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
}

/**
 * Centralized Metadata Builder for all Public Pages
 */
export function buildPageMetadata({
  title,
  description,
  path = '/',
  canonical: explicitCanonical,
  ogType = 'website',
  image,
  imageAlt,
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
  keywords = [],
  extra = {}
}) {
  const canonical = explicitCanonical 
    ? (explicitCanonical.startsWith('http') ? explicitCanonical : getCanonicalUrl(explicitCanonical))
    : getCanonicalUrl(path);
  const formattedTitle = formatMetaTitle(title);
  const formattedDescription = formatMetaDescription(description);
  const ogImageUrl = image || DEFAULT_META.ogImage;
  const ogImageAlt = imageAlt || formattedTitle;

  const robots = noindex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      };

  return {
    title: formattedTitle,
    description: formattedDescription,
    alternates: {
      canonical,
    },
    robots,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title: formattedTitle,
      description: formattedDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      ...(ogType === 'article' && {
        publishedTime,
        modifiedTime,
        authors: Array.isArray(authors) ? authors : authors ? [authors] : undefined,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description: formattedDescription,
      images: [ogImageUrl],
    },
    ...extra,
  };
}

/**
 * Scalable Article Metadata Generator
 * Generates editorial SEO metadata directly from the BlogPost model
 */
export function buildArticleMetadata(post) {
  if (!post) {
    return buildPageMetadata({
      title: 'Article Not Found',
      description: 'The requested luxury real estate analysis could not be found.',
      path: '/blog',
      noindex: true,
    });
  }

  const isPublished = post.status === 'published';
  const path = `/blog/${post.slug}`;
  
  // Editorial override takes precedence, fallback to clean title
  const title = post.seoTitle || post.title;
  
  // Editorial description override takes precedence, fallback to excerpt, fallback to intro
  const description = post.seoDescription || post.excerpt;

  // Genuine dates: only set modifiedTime if updatedAt is strictly distinct from publishedAt
  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
  const isModified = post.updatedAt && post.publishedAt && 
    Math.abs(new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime()) > 60000;
  const modifiedDate = isModified ? new Date(post.updatedAt).toISOString() : publishedDate;

  const authorName = post.author?.name || 'Saudagar Properties';
  const image = post.socialImage || post.featuredImage || DEFAULT_META.ogImage;
  const imageAlt = post.featuredImageAlt || post.title;

  const keywords = [
    post.focusKeyword,
    ...(post.secondaryKeywords || []),
    ...(post.tags || []).map(t => (typeof t === 'string' ? t : t.name)),
    post.category?.name,
    'DLF Gurugram',
    'Luxury Real Estate'
  ].filter(Boolean);

  const canonical = post.canonicalUrl || path;

  return buildPageMetadata({
    title,
    description,
    path,
    canonical,
    ogType: 'article',
    image,
    imageAlt,
    noindex: !isPublished,
    publishedTime: publishedDate,
    modifiedTime: modifiedDate,
    authors: [authorName],
    keywords,
  });
}
