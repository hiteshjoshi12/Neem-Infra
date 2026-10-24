import { SITE_NAME, DEFAULT_META } from './seoConfig.js';
import { getSocialImageUrl } from './imageSeoHelper.js';

const CANONICAL_FALLBACK = 'https://saudagarproperties.com';

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
export function getCanonicalUrl(path = '/', baseUrl = CANONICAL_FALLBACK) {
  const cleanBase = (baseUrl || CANONICAL_FALLBACK).replace(/\/+$/, '');
  const norm = normalizePath(path);
  return norm === '/' ? cleanBase : `${cleanBase}${norm}`;
}

/**
 * Server-side token resolution for company years of experience
 * Resolves {{yearsExperience}} from foundingYear (default: 1999).
 */
export function resolveYearsToken(text, years = null) {
  if (!text || typeof text !== 'string') return text;
  const y = years || Math.max(1, new Date().getFullYear() - 1999);
  return text
    .replace(/\{\{yearsExperience\}\}\+/g, `${y}+`)
    .replace(/\{\{yearsExperience\}\}/g, `${y}`)
    .replace(/\b25\+\s*Years/gi, `${y}+ Years`)
    .replace(/\b25\+\s*years/gi, `${y}+ years`)
    .replace(/\b25\+/g, `${y}+`);
}

/**
 * Formats page title ensuring brand suffix without duplicate brand names
 */
export function formatMetaTitle(rawTitle, years = null) {
  if (!rawTitle) return `${SITE_NAME} — Premier Real Estate Consultant DLF Gurugram`;
  const resolved = resolveYearsToken(rawTitle, years).trim();
  if (resolved.includes(SITE_NAME)) return resolved;
  return `${resolved} | ${SITE_NAME}`;
}

/**
 * Truncates meta description to ideal search snippet length (150-160 characters)
 */
export function formatMetaDescription(rawDescription, maxLength = 160, years = null) {
  if (!rawDescription) return resolveYearsToken(DEFAULT_META.description, years);
  const resolved = resolveYearsToken(rawDescription, years);
  const clean = resolved.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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
  section,
  tags,
  keywords = [],
  baseUrl = CANONICAL_FALLBACK,
  extra = {}
}) {
  const cleanBase = (baseUrl || CANONICAL_FALLBACK).replace(/\/+$/, '');
  let canonical = explicitCanonical || path;
  if (canonical.startsWith('http')) {
    try {
      const u = new URL(canonical);
      const cleanPath = u.pathname.length > 1 && u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname;
      canonical = cleanPath === '/' ? cleanBase : `${cleanBase}${cleanPath}`;
    } catch {
      canonical = getCanonicalUrl(canonical, cleanBase);
    }
  } else {
    canonical = getCanonicalUrl(canonical, cleanBase);
  }
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
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      };

  return {
    title: {
      absolute: formattedTitle,
    },
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
        section,
        tags: Array.isArray(tags) && tags.length > 0 ? tags : undefined,
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
  const authorProfileUrl = post.author?.slug 
    ? `${CANONICAL_FALLBACK}/blog/author/${post.author.slug}` 
    : authorName;

  // Dedicated social image with Discover & OG 1200x630 resolution
  const image = getSocialImageUrl(post);
  const imageAlt = post.featuredImageAlt || post.title;

  const categoryName = post.category?.name || 'Real Estate Advisory';
  const tagNames = (post.tags || []).map(t => (typeof t === 'string' ? t : t.name)).filter(Boolean);

  const keywords = [
    post.focusKeyword,
    ...(post.secondaryKeywords || []),
    ...tagNames,
    categoryName,
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
    authors: [authorProfileUrl],
    section: categoryName,
    tags: tagNames,
    keywords,
  });
}
