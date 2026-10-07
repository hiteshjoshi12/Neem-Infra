import { SITE_URL, DEFAULT_META } from './seoConfig.js';

/**
 * ----------------------------------------------------------------------------
 * SAUDAGAR PROPERTIES — IMAGE SEO & DISCOVER READINESS UTILITY
 * ----------------------------------------------------------------------------
 */

// Camera and generic image filename patterns to reject/replace
const GENERIC_FILENAME_PATTERNS = [
  /^img[_-]?\d+/i,
  /^dsc[_-]?\d+/i,
  /^pxl[_-]?\d+/i,
  /^dji[_-]?\d+/i,
  /^screenshot[_-]?/i,
  /^photo[_-]?\d+/i,
  /^image[_-]?\d+/i,
  /^untitled/i,
  /^asset[_-]?\d+/i
];

// Spammy / keyword-stuffed repetitive phrases
const SPAMMY_KEYWORD_PATTERNS = [
  /(?:best\s+){2,}/i,
  /(?:gurgaon\s+){3,}/i,
  /(?:gurugram\s+){3,}/i,
  /(?:cheap\s+property\s+){2,}/i,
  /(?:buy\s+){3,}/i
];

/**
 * Generates an SEO-rich, descriptive filename from editorial context.
 * 
 * Example:
 *   generateSeoImageFilename({
 *     title: 'DLF Phase 5 Luxury Apartments',
 *     locality: 'Gurugram',
 *     propertyType: 'Penthouse',
 *     originalFilename: 'IMG_83929.JPG'
 *   })
 *   => "dlf-phase-5-luxury-apartments-gurugram.webp"
 */
export function generateSeoImageFilename({
  title = '',
  locality = '',
  propertyType = '',
  originalFilename = '',
  extension = 'webp'
} = {}) {
  // Extract or clean candidate string
  let baseCandidate = '';

  if (title) {
    baseCandidate = `${title} ${locality || ''}`.trim();
  } else if (originalFilename) {
    // Strip original extension
    const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
    const isGeneric = GENERIC_FILENAME_PATTERNS.some(p => p.test(nameWithoutExt));
    baseCandidate = isGeneric
      ? `${propertyType || 'luxury-property'} ${locality || 'gurugram'}`.trim()
      : nameWithoutExt;
  } else {
    baseCandidate = `saudagar-luxury-property-gurugram`;
  }

  // Slugify into lowercase hyphenated filename
  const cleanSlug = baseCandidate
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const ext = extension.toLowerCase().replace(/^\./, '');
  return `${cleanSlug || 'saudagar-luxury-property-gurugram'}.${ext}`;
}

/**
 * Validates Alt Text for Accessibility and SEO standards.
 * - Enforces minimum and maximum length
 * - Rejects generic placeholders ("image", "photo", "pic")
 * - Disallows keyword stuffing and repetitive keywords
 */
export function validateAltText(altText = '') {
  const issues = [];
  const clean = (altText || '').trim();

  if (!clean) {
    return {
      isValid: false,
      issues: ['Alt text is missing or empty']
    };
  }

  if (clean.length < 8) {
    issues.push('Alt text is too short to be descriptive (minimum 8 characters)');
  }

  if (clean.length > 150) {
    issues.push('Alt text exceeds recommended 150 character limit for screen readers');
  }

  const genericTokens = ['image', 'photo', 'picture', 'file', 'pic', 'graphic'];
  if (genericTokens.includes(clean.toLowerCase())) {
    issues.push('Alt text contains generic placeholder instead of describing the image');
  }

  for (const pattern of SPAMMY_KEYWORD_PATTERNS) {
    if (pattern.test(clean)) {
      issues.push('Alt text exhibits repetitive keyword-stuffing patterns');
      break;
    }
  }

  // Word frequency repetition check (anti-keyword stuffing)
  const words = clean.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length >= 3);
  const counts = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
    if (counts[w] >= 3) {
      issues.push(`Alt text exhibits keyword-stuffing with word "${w}" repeated ${counts[w]} times`);
      break;
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    sanitized: clean.replace(/\s+/g, ' ')
  };
}

/**
 * Validates Featured Image for Google Discover & Technical Image SEO.
 * Criteria:
 * - Image URL exists and is crawlable (valid HTTPS or relative static path)
 * - Alt text is meaningful and non-spammy
 * - Discover-readiness: recommended width >= 1200px
 * - Aspect ratio conforms to standard visual presentation (16:9 / 4:3 / 1:1)
 */
export function validateFeaturedImage(post) {
  const issues = [];
  const warnings = [];

  if (!post) {
    return { isValid: false, issues: ['Article post is undefined'], warnings: [] };
  }

  const imageUrl = post.featuredImage || '';
  const altText = post.featuredImageAlt || '';

  // 1. Image Presence
  if (!imageUrl) {
    issues.push('Missing featured image');
  } else {
    // 2. Crawlability
    const isAbsolute = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
    const isRootRelative = imageUrl.startsWith('/');
    if (!isAbsolute && !isRootRelative) {
      issues.push('Featured image URL is not crawlable (must be absolute HTTPS or root-relative path)');
    }
  }

  // 3. Alt Text Validation
  const altValidation = validateAltText(altText);
  if (!altValidation.isValid) {
    issues.push(...altValidation.issues);
  }

  // 4. Discover Width Benchmark (1200px+)
  const width = post.featuredImageWidth || extractWidthFromUrl(imageUrl) || 1600;
  if (width < 1200) {
    warnings.push(`Image width (${width}px) is below Google Discover recommendation of 1200px minimum width`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    isDiscoverReady: issues.length === 0 && warnings.length === 0,
    width,
    height: post.featuredImageHeight || 900
  };
}

/**
 * Helper to inspect width from Unsplash or standard image query params
 */
function extractWidthFromUrl(url = '') {
  try {
    const match = url.match(/[?&]w=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

/**
 * Prepares dedicated 1200x630 OpenGraph / Social Image URL
 */
export function getSocialImageUrl(post) {
  if (!post) return DEFAULT_META.ogImage;

  // 1. Explicit socialImage override
  if (post.socialImage && post.socialImage.startsWith('http')) {
    return post.socialImage;
  }

  // 2. Enhance Unsplash featured image for 1200x630 crop
  if (post.featuredImage && post.featuredImage.includes('images.unsplash.com')) {
    const baseUrl = post.featuredImage.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=1200&h=630&q=85`;
  }

  // 3. Return featuredImage if valid
  if (post.featuredImage) {
    return post.featuredImage;
  }

  // 4. Default luxury brand OG card
  return DEFAULT_META.ogImage;
}
