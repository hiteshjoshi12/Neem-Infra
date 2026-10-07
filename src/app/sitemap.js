import { SITE_URL } from '@/lib/seo/seoConfig';
import { getProperties } from '@/services/propertyService';
import { getBlogPosts, getCategories, getLocations, getAuthors } from '@/services/blogService';

export default async function sitemap() {
  const seenUrls = new Set();
  const sitemapEntries = [];

  const addEntry = (entry) => {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      sitemapEntries.push(entry);
    }
  };

  // 1. Static Indexable Routes
  const staticRoutes = [
    '',
    '/about',
    '/team',
    '/contact',
    '/properties',
    '/blog',
    '/blog/location',
    '/privacy-policy',
    '/terms',
    '/services/residential',
    '/services/commercial',
    '/services/industrial',
  ];

  for (const route of staticRoutes) {
    addEntry({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : route === '/properties' || route === '/about' || route === '/blog' ? 0.9 : 0.8,
    });
  }

  // 2. Dynamic Published Property Routes
  try {
    const properties = await getProperties({ all: false });
    for (const prop of properties || []) {
      const slugOrId = prop.slug || prop._id;
      if (slugOrId) {
        addEntry({
          url: `${SITE_URL}/properties/${slugOrId}`,
          lastModified: new Date(prop.updatedAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch properties for sitemap:', err?.message);
  }

  // 3. Dynamic Published Blog Posts (strictly status = published)
  try {
    const blogPosts = await getBlogPosts({ status: 'published', limit: 200 });
    for (const post of blogPosts || []) {
      if (post.slug && post.status === 'published') {
        addEntry({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
          changeFrequency: 'weekly',
          priority: 0.85,
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch blog posts for sitemap:', err?.message);
  }

  // 4. Dynamic Categories
  try {
    const categories = await getCategories();
    for (const cat of categories || []) {
      if (cat.slug) {
        addEntry({
          url: `${SITE_URL}/blog/category/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch categories for sitemap:', err?.message);
  }

  // 5. Dynamic Locations
  try {
    const locations = await getLocations();
    for (const loc of locations || []) {
      if (loc.slug) {
        addEntry({
          url: `${SITE_URL}/blog/location/${loc.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch locations for sitemap:', err?.message);
  }

  // 6. Dynamic Authors
  try {
    const authors = await getAuthors();
    for (const author of authors || []) {
      if (author.slug) {
        addEntry({
          url: `${SITE_URL}/blog/author/${author.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] Failed to fetch authors for sitemap:', err?.message);
  }

  return sitemapEntries;
}
