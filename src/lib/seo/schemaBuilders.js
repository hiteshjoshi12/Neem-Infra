import { SITE_URL, SITE_NAME, BUSINESS_INFO } from './seoConfig.js';

/**
 * Normalizes any relative or absolute URL to an absolute URL with SITE_URL.
 * Ensures no duplicate slashes and clean protocol.
 */
export function buildAbsoluteUrl(path = '') {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Clean Schema Helper
 * Recursively strips undefined, null, empty strings, and empty objects/arrays
 * ensuring 100% clean, valid schema objects with zero undefined fields.
 */
export function cleanSchema(obj) {
  if (obj === null || obj === undefined || obj === '') return undefined;
  if (Array.isArray(obj)) {
    const cleanedArr = obj
      .map(cleanSchema)
      .filter((item) => item !== undefined && item !== null && item !== '');
    return cleanedArr.length > 0 ? cleanedArr : undefined;
  }
  if (typeof obj === 'object') {
    const cleanedObj = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val === undefined || val === null || val === '') continue;
      const cleanedVal = cleanSchema(val);
      if (cleanedVal !== undefined) {
        cleanedObj[key] = cleanedVal;
      }
    }
    return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
  }
  return obj;
}

/**
 * Filter verified social profiles (excluding '#' or placeholders)
 */
export function getVerifiedSocialProfiles() {
  if (!BUSINESS_INFO.socialProfiles) return [];
  return Object.values(BUSINESS_INFO.socialProfiles).filter(
    (url) => url && typeof url === 'string' && url.trim() !== '' && url !== '#' && !url.includes('example.com')
  );
}

/**
 * 1. WebSite Schema
 * Represents the website entity with canonical name and alternate name.
 */
export function buildWebSiteSchema() {
  return cleanSchema({
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: BUSINESS_INFO.shortName || BUSINESS_INFO.name,
    url: SITE_URL,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-IN',
  });
}

/**
 * 2 & 3. Organization & LocalBusiness (RealEstateAgent subtype) Schema
 * Uses real, verified Saudagar Properties data already in the project.
 */
export function buildOrganizationSchema() {
  const verifiedSameAs = getVerifiedSocialProfiles();

  return cleanSchema({
    '@type': ['RealEstateAgent', 'LocalBusiness', 'Organization'],
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.shortName,
    description: BUSINESS_INFO.description,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: buildAbsoluteUrl(BUSINESS_INFO.logo || '/logo.png'),
      caption: BUSINESS_INFO.name,
    },
    image: buildAbsoluteUrl(BUSINESS_INFO.logo || '/logo.png'),
    telephone: BUSINESS_INFO.phone?.[0] || '+91 97185 11207',
    email: BUSINESS_INFO.email,
    address: BUSINESS_INFO.address ? {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.addressCountry || 'IN',
    } : undefined,
    geo: BUSINESS_INFO.geo ? {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    } : undefined,
    priceRange: BUSINESS_INFO.priceRange,
    foundingDate: BUSINESS_INFO.foundingYear ? String(BUSINESS_INFO.foundingYear) : undefined,
    founder: BUSINESS_INFO.founders?.map((name) => ({
      '@type': 'Person',
      name,
    })),
    areaServed: BUSINESS_INFO.areaServed?.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    sameAs: verifiedSameAs.length > 0 ? verifiedSameAs : undefined,
    hasOfferCatalog: BUSINESS_INFO.services ? {
      '@type': 'OfferCatalog',
      name: 'Real Estate Advisory & Brokerage Services',
      itemListElement: BUSINESS_INFO.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    } : undefined,
  });
}

/**
 * 5. Author Schema (Person)
 * References a real author profile URL when available.
 */
export function buildAuthorSchema(author) {
  if (!author) return undefined;

  const authorName = typeof author === 'string' ? author : author.name;
  if (!authorName) return undefined;

  const authorSlug = typeof author === 'object' ? author.slug : undefined;
  const authorUrl = authorSlug ? buildAbsoluteUrl(`/blog/author/${authorSlug}`) : undefined;
  const authorId = authorSlug ? `${buildAbsoluteUrl(`/blog/author/${authorSlug}`)}#author` : undefined;

  const socialProfiles = author.socialProfiles
    ? Object.values(author.socialProfiles).filter(
        (url) => url && typeof url === 'string' && url.trim() !== '' && url !== '#'
      )
    : undefined;

  return cleanSchema({
    '@type': 'Person',
    '@id': authorId,
    name: authorName,
    url: authorUrl,
    jobTitle: author.jobTitle,
    image: author.image ? buildAbsoluteUrl(author.image) : undefined,
    description: author.bio,
    sameAs: socialProfiles && socialProfiles.length > 0 ? socialProfiles : undefined,
  });
}

/**
 * 6. Breadcrumb Schema
 * Generates BreadcrumbList from real breadcrumb hierarchy.
 */
export function buildBreadcrumbSchema(items = [], pageUrl = '') {
  if (!Array.isArray(items) || items.length === 0) return undefined;

  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: buildAbsoluteUrl(item.url === '/' ? '' : item.url),
  }));

  const breadcrumbId = pageUrl ? `${buildAbsoluteUrl(pageUrl)}#breadcrumb` : undefined;

  return cleanSchema({
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement,
  });
}

/**
 * 7. FAQ Schema
 * ONLY generated when visible, real questions and answers are present.
 */
export function buildFAQSchema(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) return undefined;

  const realFaqs = faqs.filter(
    (faq) => faq && faq.question && faq.answer && faq.question.trim() !== '' && faq.answer.trim() !== ''
  );

  if (realFaqs.length === 0) return undefined;

  return cleanSchema({
    '@type': 'FAQPage',
    mainEntity: realFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  });
}

/**
 * 4. BlogPosting Schema
 * Generates valid BlogPosting representation for published articles.
 */
export function buildBlogPostingSchema(post) {
  if (!post || !post.title) return undefined;

  const articleUrl = buildAbsoluteUrl(`/blog/${post.slug}`);
  const authorObj = buildAuthorSchema(post.author);
  const categoryName = post.category?.name || (typeof post.category === 'string' ? post.category : undefined);

  // Extract crawlable absolute image URLs
  let imageList;
  if (post.featuredImage) {
    imageList = [buildAbsoluteUrl(post.featuredImage)];
  }

  // Keywords formatting (deduplicated)
  const keywordCandidates = [
    post.focusKeyword,
    ...(post.secondaryKeywords || []),
    ...(post.tags || []).map((t) => (typeof t === 'string' ? t : t.name)),
  ].filter(Boolean);
  const keywords = Array.from(new Set(keywordCandidates)).join(', ') || undefined;

  return cleanSchema({
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#article`,
    isPartOf: {
      '@id': `${articleUrl}#webpage`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${articleUrl}#webpage`,
    },
    headline: post.title,
    description: post.excerpt || post.seoDescription,
    url: articleUrl,
    image: imageList,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: authorObj?.['@id'] ? { '@id': authorObj['@id'] } : authorObj || {
      '@type': 'Person',
      name: 'Saudagar Advisory Desk',
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    articleSection: categoryName || 'Real Estate Advisory',
    keywords,
    inLanguage: 'en-IN',
  });
}

/**
 * 9. Connected JSON-LD Graph for Blog Articles
 * Creates a cohesive semantic graph linking:
 * - WebSite (#website)
 * - Organization (#organization)
 * - WebPage (#webpage)
 * - BreadcrumbList (#breadcrumb)
 * - Person (#author)
 * - BlogPosting (#article)
 * - FAQPage (if visible FAQs exist)
 */
export function buildArticleGraph({ post, breadcrumbs = [], faqs = [] }) {
  if (!post || !post.slug) return null;

  const articleUrl = buildAbsoluteUrl(`/blog/${post.slug}`);
  const website = buildWebSiteSchema();
  const organization = buildOrganizationSchema();
  const author = buildAuthorSchema(post.author);
  const breadcrumbList = buildBreadcrumbSchema(breadcrumbs, `/blog/${post.slug}`);
  const blogPosting = buildBlogPostingSchema(post);
  const faqPage = buildFAQSchema(faqs);

  const webPage = cleanSchema({
    '@type': 'WebPage',
    '@id': `${articleUrl}#webpage`,
    url: articleUrl,
    name: post.title,
    description: post.excerpt || post.seoDescription,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': `${SITE_URL}/#organization`,
    },
    breadcrumb: breadcrumbList?.['@id'] ? { '@id': breadcrumbList['@id'] } : undefined,
    inLanguage: 'en-IN',
  });

  const graphElements = [
    website,
    organization,
    webPage,
    breadcrumbList,
    author,
    blogPosting,
    faqPage,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': graphElements,
  };
}

/**
 * Connected JSON-LD Graph for Standard Pages
 */
export function buildPageGraph({ path, title, description, breadcrumbs = [], faqs = [] }) {
  const pageUrl = buildAbsoluteUrl(path);
  const website = buildWebSiteSchema();
  const organization = buildOrganizationSchema();
  const breadcrumbList = buildBreadcrumbSchema(breadcrumbs, path);
  const faqPage = buildFAQSchema(faqs);

  const webPage = cleanSchema({
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    breadcrumb: breadcrumbList?.['@id'] ? { '@id': breadcrumbList['@id'] } : undefined,
    inLanguage: 'en-IN',
  });

  const graphElements = [
    website,
    organization,
    webPage,
    breadcrumbList,
    faqPage,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': graphElements,
  };
}

/**
 * 10. Location Schema (Place entity)
 * Generates verified Place node with geo coordinates and parent city containment.
 */
export function buildLocationSchema(location) {
  if (!location) return undefined;

  const locSlug = location.slug || '';
  const locationUrl = buildAbsoluteUrl(`/blog/location/${locSlug}`);

  return cleanSchema({
    '@type': 'Place',
    '@id': `${locationUrl}#place`,
    name: location.name,
    description: location.description,
    url: locationUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: location.state || 'Haryana',
      addressCountry: location.country || 'IN',
    },
    geo: location.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
    } : undefined,
    containedInPlace: {
      '@type': 'City',
      name: location.city || 'Gurugram',
    },
  });
}

/**
 * 11. Connected JSON-LD Graph for Location Pages
 * Semantically interlinks:
 * - WebSite (#website)
 * - RealEstateAgent (#organization)
 * - Place (#place)
 * - WebPage (#webpage)
 * - BreadcrumbList (#breadcrumb)
 * - FAQPage (if visible FAQs exist)
 */
export function buildLocationGraph({ location, breadcrumbs = [], faqs = [] }) {
  if (!location) return null;

  const locSlug = location.slug || '';
  const pageUrl = buildAbsoluteUrl(`/blog/location/${locSlug}`);
  const website = buildWebSiteSchema();
  const organization = buildOrganizationSchema();
  const placeEntity = buildLocationSchema(location);
  const breadcrumbList = buildBreadcrumbSchema(breadcrumbs, `/blog/location/${locSlug}`);
  const faqPage = buildFAQSchema(faqs);

  const webPage = cleanSchema({
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: location.seoTitle || `${location.name} Real Estate & Property Advisory | Saudagar Properties`,
    description: location.seoDescription || location.description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': `${pageUrl}#place`,
    },
    breadcrumb: breadcrumbList?.['@id'] ? { '@id': breadcrumbList['@id'] } : undefined,
    inLanguage: 'en-IN',
  });

  const graphElements = [
    website,
    organization,
    webPage,
    placeEntity,
    breadcrumbList,
    faqPage,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': graphElements,
  };
}

/**
 * 12. Connected JSON-LD Graph for Author Profile Pages
 * Interlinks:
 * - WebSite (#website)
 * - RealEstateAgent (#organization)
 * - ProfilePage (#profilepage)
 * - Person (#author)
 * - BreadcrumbList (#breadcrumb)
 */
export function buildProfilePageSchema(author, breadcrumbs = []) {
  if (!author) return null;

  const authorSlug = author.slug || '';
  const pageUrl = buildAbsoluteUrl(`/blog/author/${authorSlug}`);
  const authorEntity = buildAuthorSchema(author);
  const breadcrumbList = buildBreadcrumbSchema(breadcrumbs, `/blog/author/${authorSlug}`);

  const profilePage = cleanSchema({
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#profilepage`,
    url: pageUrl,
    name: `${author.name || 'Author'} — Editorial & Advisory Profile | Saudagar Properties`,
    description: author.bio,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    mainEntity: authorEntity?.['@id'] ? { '@id': authorEntity['@id'] } : authorEntity,
    breadcrumb: breadcrumbList?.['@id'] ? { '@id': breadcrumbList['@id'] } : undefined,
    inLanguage: 'en-IN',
  });

  const graphElements = [
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    profilePage,
    authorEntity,
    breadcrumbList,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': graphElements,
  };
}


