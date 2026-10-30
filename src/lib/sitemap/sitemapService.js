import { connectDB } from '../mongodb.js';
import Page from '../../models/Page.js';
import Property from '../../models/Property.js';
import BlogPost from '../../models/BlogPost.js';
import Category from '../../models/Category.js';
import Tag from '../../models/Tag.js';
import Author from '../../models/Author.js';
import Redirect from '../../models/Redirect.js';
import SeoSettings from '../../models/SeoSettings.js';

const MAX_URLS_PER_SITEMAP = 50000;
const FALLBACK_CANONICAL = 'https://saudagarproperties.com';

/**
 * Escape XML special characters
 */
export function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format a Date to ISO 8601 string with timezone (+00:00)
 */
export function formatIsoDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

/**
 * Retrieve global SEO settings and canonical base URL
 */
export async function getSitemapConfig() {
  await connectDB();
  const settings = await SeoSettings.findOne().lean();

  let baseUrl = (settings?.canonicalBaseUrl || FALLBACK_CANONICAL).trim();
  // Ensure absolute https URL, strip trailing slash
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }
  baseUrl = baseUrl.replace(/^http:\/\//, 'https://').replace(/\/+$/, '');

  const config = settings?.sitemapConfig || {};

  return {
    baseUrl,
    settings,
    includePages: config.includePages ?? config.includeCustomPages ?? true,
    includeServices: config.includeServices ?? true,
    includeProperties: config.includeProperties ?? true,
    includeCorridors: config.includeCorridors ?? true,
    includeBlogs: config.includeBlogs ?? true,
    includeCategories: config.includeCategories ?? true,
    includeTags: config.includeTags ?? false,
    includeAuthors: config.includeAuthors ?? false,
    tagArchiveRobots: settings?.tagArchiveRobots || 'noindex,follow',
    authorArchiveRobots: settings?.authorArchiveRobots || 'noindex,follow',
  };
}

/**
 * Load active redirect source paths to avoid putting redirected URLs into sitemaps
 */
async function getActiveRedirectSet() {
  try {
    const redirects = await Redirect.find({ isActive: true }).select('fromPath').lean();
    return new Set(redirects.map(r => (r.fromPath || '').trim().toLowerCase()));
  } catch {
    return new Set();
  }
}

/**
 * 1. Collect Main Pages
 * Includes: home, about, contact, team, terms, privacy-policy, /properties, /blog, and custom published pages.
 * Excludes: corridors (/property/*) and service pages (/services/*).
 */
export async function getPageSitemapUrls(baseUrl, redirectSet) {
  const pages = await Page.find({
    status: 'published',
    'robots.index': { $ne: false },
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seenPaths = new Set();

  for (const page of pages) {
    const rawSlug = page.slug || '';
    const normSlug = rawSlug === '/' ? '' : (rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`);

    // Exclude corridors and service subpages
    if (normSlug.startsWith('/property/') || normSlug.startsWith('/services/')) {
      continue;
    }

    const pathForCheck = normSlug || '/';
    if (redirectSet.has(pathForCheck.toLowerCase())) continue;
    if (seenPaths.has(pathForCheck.toLowerCase())) continue;

    // Check canonical override
    if (page.canonicalUrl && page.canonicalUrl.trim()) {
      let canonical = page.canonicalUrl.trim();
      if (!canonical.startsWith('http://') && !canonical.startsWith('https://')) {
        canonical = `${baseUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
      }
      canonical = canonical.replace(/\/+$/, '');
      const expectedUrl = (`${baseUrl}${normSlug}`.replace(/\/+$/, '')) || baseUrl;
      if (canonical !== expectedUrl) {
        // Canonical points elsewhere -> exclude
        continue;
      }
    }

    const fullUrl = `${baseUrl}${normSlug}`;
    const lastmod = formatIsoDate(page.updatedAt || page.publishedAt || page.createdAt);

    seenPaths.add(pathForCheck.toLowerCase());
    entries.push({
      url: fullUrl,
      lastmod,
      dateObj: page.updatedAt ? new Date(page.updatedAt) : new Date(page.publishedAt || 0),
    });
  }

  // Sort deterministically (home first, then alphabetical)
  entries.sort((a, b) => {
    if (a.url === baseUrl || a.url === `${baseUrl}/`) return -1;
    if (b.url === baseUrl || b.url === `${baseUrl}/`) return 1;
    return a.url.localeCompare(b.url);
  });

  return entries;
}

/**
 * 2. Collect Service Pages
 * Only /services/residential, /services/commercial, /services/industrial
 * (/services redirects to /#services, so it is strictly excluded)
 */
export async function getServiceSitemapUrls(baseUrl, redirectSet) {
  const pages = await Page.find({
    slug: { $regex: '^/services/' },
    status: 'published',
    'robots.index': { $ne: false },
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const page of pages) {
    const normSlug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`;
    if (redirectSet.has(normSlug.toLowerCase())) continue;
    if (seen.has(normSlug.toLowerCase())) continue;

    // Verify canonical points to self
    if (page.canonicalUrl && page.canonicalUrl.trim()) {
      let canonical = page.canonicalUrl.trim();
      if (!canonical.startsWith('http://') && !canonical.startsWith('https://')) {
        canonical = `${baseUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
      }
      canonical = canonical.replace(/\/+$/, '');
      const expectedUrl = `${baseUrl}${normSlug}`.replace(/\/+$/, '');
      if (canonical !== expectedUrl) continue;
    }

    seen.add(normSlug.toLowerCase());
    entries.push({
      url: `${baseUrl}${normSlug}`,
      lastmod: formatIsoDate(page.updatedAt || page.publishedAt),
      dateObj: new Date(page.updatedAt || page.publishedAt || 0),
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * 3. Collect Property Listings (/properties/[slug])
 */
export async function getPropertySitemapUrls(baseUrl, redirectSet) {
  const properties = await Property.find({
    isActive: { $ne: false },
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const prop of properties) {
    const slug = (prop.slug || '').trim();
    if (!slug) continue;

    const path = `/properties/${slug}`;
    if (redirectSet.has(path.toLowerCase())) continue;
    if (seen.has(slug.toLowerCase())) continue;

    seen.add(slug.toLowerCase());
    entries.push({
      url: `${baseUrl}${path}`,
      lastmod: formatIsoDate(prop.updatedAt || prop.createdAt),
      dateObj: new Date(prop.updatedAt || prop.createdAt || 0),
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * 4. Collect Corridor Pages (/property/[slug])
 */
export async function getCorridorSitemapUrls(baseUrl, redirectSet) {
  const pages = await Page.find({
    slug: { $regex: '^/property/' },
    status: 'published',
    'robots.index': { $ne: false },
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const page of pages) {
    const normSlug = page.slug.startsWith('/') ? page.slug : `/${page.slug}`;
    if (redirectSet.has(normSlug.toLowerCase())) continue;
    if (seen.has(normSlug.toLowerCase())) continue;

    if (page.canonicalUrl && page.canonicalUrl.trim()) {
      let canonical = page.canonicalUrl.trim();
      if (!canonical.startsWith('http://') && !canonical.startsWith('https://')) {
        canonical = `${baseUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
      }
      canonical = canonical.replace(/\/+$/, '');
      const expectedUrl = `${baseUrl}${normSlug}`.replace(/\/+$/, '');
      if (canonical !== expectedUrl) continue;
    }

    seen.add(normSlug.toLowerCase());
    entries.push({
      url: `${baseUrl}${normSlug}`,
      lastmod: formatIsoDate(page.updatedAt || page.publishedAt),
      dateObj: new Date(page.updatedAt || page.publishedAt || 0),
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * 5. Collect Blog Posts (/blog/[slug])
 */
export async function getBlogSitemapUrls(baseUrl, redirectSet) {
  const posts = await BlogPost.find({
    status: 'published',
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const post of posts) {
    const slug = (post.slug || '').trim();
    if (!slug) continue;

    const path = `/blog/${slug}`;
    if (redirectSet.has(path.toLowerCase())) continue;
    if (seen.has(slug.toLowerCase())) continue;

    // Check canonical override
    if (post.canonicalUrl && post.canonicalUrl.trim()) {
      let canonical = post.canonicalUrl.trim();
      if (!canonical.startsWith('http://') && !canonical.startsWith('https://')) {
        canonical = `${baseUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
      }
      canonical = canonical.replace(/\/+$/, '');
      const expected = `${baseUrl}${path}`.replace(/\/+$/, '');
      if (canonical !== expected) continue;
    }

    seen.add(slug.toLowerCase());
    const dateObj = new Date(post.updatedAt || post.publishedAt || post.createdAt || 0);

    entries.push({
      url: `${baseUrl}${path}`,
      lastmod: formatIsoDate(post.updatedAt || post.publishedAt || post.createdAt),
      dateObj,
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * 6. Collect Blog Categories (/blog/category/[slug])
 * Exclude thin categories (categories with 0 published posts)
 */
export async function getBlogCategorySitemapUrls(baseUrl, redirectSet) {
  const categories = await Category.find({
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const cat of categories) {
    const slug = (cat.slug || '').trim();
    if (!slug) continue;

    const path = `/blog/category/${slug}`;
    if (redirectSet.has(path.toLowerCase())) continue;
    if (seen.has(slug.toLowerCase())) continue;

    // Ensure category has at least 1 published blog post (not thin)
    const latestPost = await BlogPost.findOne({
      category: cat._id,
      status: 'published',
    })
      .sort({ updatedAt: -1 })
      .select('updatedAt publishedAt')
      .lean();

    if (!latestPost) continue;

    const catDate = new Date(cat.updatedAt || cat.createdAt || 0);
    const postDate = new Date(latestPost.updatedAt || latestPost.publishedAt || 0);
    const newestDate = postDate > catDate ? postDate : catDate;

    seen.add(slug.toLowerCase());
    entries.push({
      url: `${baseUrl}${path}`,
      lastmod: formatIsoDate(newestDate),
      dateObj: newestDate,
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * 7. Collect Blog Tags (/blog/tag/[slug])
 * Only included if admin toggle is ON, tagArchiveRobots is indexable, and tag has published articles.
 */
export async function getBlogTagSitemapUrls(baseUrl, redirectSet, config) {
  if (!config.includeTags) return [];
  if (config.tagArchiveRobots && config.tagArchiveRobots.includes('noindex')) return [];

  const tags = await Tag.find({
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const tag of tags) {
    const slug = (tag.slug || '').trim();
    if (!slug) continue;

    const path = `/blog/tag/${slug}`;
    if (redirectSet.has(path.toLowerCase())) continue;
    if (seen.has(slug.toLowerCase())) continue;

    // Must have at least 1 published post
    const latestPost = await BlogPost.findOne({
      tags: tag._id,
      status: 'published',
    })
      .sort({ updatedAt: -1 })
      .select('updatedAt publishedAt')
      .lean();

    if (!latestPost) continue;

    const tagDate = new Date(tag.updatedAt || tag.createdAt || 0);
    const postDate = new Date(latestPost.updatedAt || latestPost.publishedAt || 0);
    const newestDate = postDate > tagDate ? postDate : tagDate;

    seen.add(slug.toLowerCase());
    entries.push({
      url: `${baseUrl}${path}`,
      lastmod: formatIsoDate(newestDate),
      dateObj: newestDate,
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * 8. Collect Author Pages (/blog/author/[slug])
 * Only included if enabled AND author satisfies indexability rules:
 * - verified photo (image non-empty)
 * - bio length >= 50 chars
 * - has published articles
 */
export async function getAuthorSitemapUrls(baseUrl, redirectSet, config) {
  if (!config.includeAuthors) return [];
  if (config.authorArchiveRobots && config.authorArchiveRobots.includes('noindex')) return [];

  const authors = await Author.find({
    excludeFromSitemap: { $ne: true },
  }).lean();

  const entries = [];
  const seen = new Set();

  for (const author of authors) {
    const slug = (author.slug || '').trim();
    if (!slug) continue;

    const path = `/blog/author/${slug}`;
    if (redirectSet.has(path.toLowerCase())) continue;
    if (seen.has(slug.toLowerCase())) continue;

    const hasPhoto = Boolean(author.image && author.image.trim().length > 0);
    const hasBio = Boolean(author.bio && author.bio.trim().length >= 50);
    if (!hasPhoto || !hasBio) continue;

    const latestPost = await BlogPost.findOne({
      author: author._id,
      status: 'published',
    })
      .sort({ updatedAt: -1 })
      .select('updatedAt publishedAt')
      .lean();

    if (!latestPost) continue;

    const authorDate = new Date(author.updatedAt || author.createdAt || 0);
    const postDate = new Date(latestPost.updatedAt || latestPost.publishedAt || 0);
    const newestDate = postDate > authorDate ? postDate : authorDate;

    seen.add(slug.toLowerCase());
    entries.push({
      url: `${baseUrl}${path}`,
      lastmod: formatIsoDate(newestDate),
      dateObj: newestDate,
    });
  }

  entries.sort((a, b) => a.url.localeCompare(b.url));
  return entries;
}

/**
 * Split an array of URLs into chunks of MAX_URLS_PER_SITEMAP
 */
export function chunkUrls(urls, chunkSize = MAX_URLS_PER_SITEMAP) {
  if (!urls || urls.length === 0) return [];
  const chunks = [];
  for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Build valid XML for a single child sitemap (<urlset>)
 */
export function buildUrlsetXml(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const entry of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

/**
 * Build valid XML for the sitemap index (<sitemapindex>)
 */
export function buildIndexXml(sitemaps) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const item of sitemaps) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${escapeXml(item.url)}</loc>\n`;
    if (item.lastmod) {
      xml += `    <lastmod>${escapeXml(item.lastmod)}</lastmod>\n`;
    }
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;
  return xml;
}

/**
 * Fetch all child sitemaps with their URLs, counts, and newest lastmod
 */
export async function getAllChildSitemapsData() {
  const config = await getSitemapConfig();
  const redirectSet = await getActiveRedirectSet();

  const childDefinitions = [
    {
      id: 'page',
      filename: 'page-sitemap.xml',
      title: 'Main Pages',
      enabled: config.includePages,
      fetcher: () => getPageSitemapUrls(config.baseUrl, redirectSet),
    },
    {
      id: 'service',
      filename: 'service-sitemap.xml',
      title: 'Service Pages',
      enabled: config.includeServices,
      fetcher: () => getServiceSitemapUrls(config.baseUrl, redirectSet),
    },
    {
      id: 'property',
      filename: 'property-sitemap.xml',
      title: 'Property Listings',
      enabled: config.includeProperties,
      fetcher: () => getPropertySitemapUrls(config.baseUrl, redirectSet),
    },
    {
      id: 'corridor',
      filename: 'corridor-sitemap.xml',
      title: 'Area / Corridor Pages',
      enabled: config.includeCorridors,
      fetcher: () => getCorridorSitemapUrls(config.baseUrl, redirectSet),
    },
    {
      id: 'blog',
      filename: 'blog-sitemap.xml',
      title: 'Blog Articles',
      enabled: config.includeBlogs,
      fetcher: () => getBlogSitemapUrls(config.baseUrl, redirectSet),
    },
    {
      id: 'blog-category',
      filename: 'blog-category-sitemap.xml',
      title: 'Blog Categories',
      enabled: config.includeCategories,
      fetcher: () => getBlogCategorySitemapUrls(config.baseUrl, redirectSet),
    },
    {
      id: 'blog-tag',
      filename: 'blog-tag-sitemap.xml',
      title: 'Blog Tags',
      enabled: config.includeTags,
      fetcher: () => getBlogTagSitemapUrls(config.baseUrl, redirectSet, config),
    },
    {
      id: 'author',
      filename: 'author-sitemap.xml',
      title: 'Editorial Authors',
      enabled: config.includeAuthors,
      fetcher: () => getAuthorSitemapUrls(config.baseUrl, redirectSet, config),
    },
  ];

  const results = [];

  for (const def of childDefinitions) {
    if (!def.enabled) {
      results.push({
        ...def,
        enabled: false,
        urls: [],
        count: 0,
        lastmod: null,
        parts: [],
      });
      continue;
    }

    const urls = await def.fetcher();
    const count = urls.length;

    // Find the newest lastmod inside this child
    let newestDate = null;
    for (const u of urls) {
      if (u.dateObj && !isNaN(u.dateObj.getTime())) {
        if (!newestDate || u.dateObj > newestDate) {
          newestDate = u.dateObj;
        }
      }
    }
    const lastmod = formatIsoDate(newestDate);

    // Split if > 50k
    const chunks = chunkUrls(urls);
    const parts = chunks.map((chunk, idx) => {
      const partNumber = idx + 1;
      const partFilename = partNumber === 1
        ? def.filename
        : def.filename.replace('.xml', `-${partNumber}.xml`);
      let partNewest = null;
      for (const u of chunk) {
        if (u.dateObj && (!partNewest || u.dateObj > partNewest)) {
          partNewest = u.dateObj;
        }
      }
      return {
        filename: partFilename,
        url: `${config.baseUrl}/${partFilename}`,
        urls: chunk,
        count: chunk.length,
        lastmod: formatIsoDate(partNewest),
      };
    });

    results.push({
      ...def,
      enabled: true,
      urls,
      count,
      lastmod,
      parts,
    });
  }

  return {
    baseUrl: config.baseUrl,
    config,
    children: results,
  };
}

/**
 * Generate XML for /sitemap_index.xml
 * Omit empty child sitemaps and disabled child sitemaps.
 */
export async function generateSitemapIndexXml() {
  const { baseUrl, children } = await getAllChildSitemapsData();

  const indexEntries = [];

  for (const child of children) {
    if (!child.enabled || child.count === 0) {
      // Do not list an empty or disabled child sitemap in the index
      continue;
    }

    for (const part of child.parts) {
      indexEntries.push({
        url: part.url,
        lastmod: part.lastmod || child.lastmod,
      });
    }
  }

  return buildIndexXml(indexEntries);
}

/**
 * Generate XML for a specific child sitemap filename
 * E.g., 'page-sitemap.xml', 'blog-sitemap.xml', 'blog-sitemap-2.xml'
 */
export async function generateChildSitemapXml(filename) {
  const { children } = await getAllChildSitemapsData();

  for (const child of children) {
    if (child.filename === filename) {
      if (!child.enabled || child.count === 0) {
        return buildUrlsetXml([]);
      }
      const primaryPart = child.parts[0];
      return buildUrlsetXml(primaryPart ? primaryPart.urls : child.urls);
    }

    // Check split parts
    for (const part of child.parts) {
      if (part.filename === filename) {
        return buildUrlsetXml(part.urls);
      }
    }
  }

  return null;
}

/**
 * Helper to return a standard XML Response
 */
export function createXmlResponse(xmlString, status = 200) {
  return new Response(xmlString, {
    status,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/**
 * Return summary data for Admin Sitemaps UI
 */
export async function getSitemapSummary() {
  const { baseUrl, config, children } = await getAllChildSitemapsData();
  
  const activeChildren = children.filter(c => c.enabled && c.count > 0);
  const totalUrls = activeChildren.reduce((acc, c) => acc + c.count, 0);

  let newestIndexDate = null;
  for (const c of activeChildren) {
    if (c.lastmod) {
      const d = new Date(c.lastmod);
      if (!newestIndexDate || d > newestIndexDate) {
        newestIndexDate = d;
      }
    }
  }

  const sitemaps = children.map(c => ({
    id: c.id,
    title: c.title,
    filename: c.filename,
    url: `${baseUrl}/${c.filename}`,
    enabled: c.enabled,
    count: c.count,
    lastmod: c.lastmod,
    inIndex: c.enabled && c.count > 0,
    parts: c.parts.map(p => ({
      filename: p.filename,
      url: p.url,
      count: p.count,
      lastmod: p.lastmod,
    })),
  }));

  return {
    baseUrl,
    indexUrl: `${baseUrl}/sitemap_index.xml`,
    indexLastmod: formatIsoDate(newestIndexDate),
    totalChildSitemaps: activeChildren.length,
    totalUrls,
    sitemaps,
    config: {
      includePages: config.includePages,
      includeServices: config.includeServices,
      includeProperties: config.includeProperties,
      includeCorridors: config.includeCorridors,
      includeBlogs: config.includeBlogs,
      includeCategories: config.includeCategories,
      includeTags: config.includeTags,
      includeAuthors: config.includeAuthors,
    },
  };
}
