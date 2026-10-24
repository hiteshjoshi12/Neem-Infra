import { SITE_URL } from '@/lib/seo/seoConfig';
import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import { getGlobalSeoSettings, ensureDefaultSeoData } from '@/lib/seo/dynamicSeo';
import { getProperties } from '@/services/propertyService';
import { getBlogPosts, getCategories, getAuthors } from '@/services/blogService';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache sitemap for 5 minutes

export default async function sitemap() {
  const seenUrls = new Set();
  const sitemapEntries = [];

  const addEntry = (entry) => {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      sitemapEntries.push(entry);
    }
  };

  try {
    await connectDB();
    await ensureDefaultSeoData();
    const settings = await getGlobalSeoSettings();
    const sitemapConfig = settings?.sitemapConfig || {
      includeProperties: true,
      includeBlogs: true,
      includeCategories: true,
      includeAuthors: true,
      includeCustomPages: true,
      extraUrls: [],
    };

    // 1. Dynamic Pages from MongoDB (System + Custom Landing Pages)
    const pages = await Page.find({
      status: 'published',
      'robots.index': { $ne: false },
    }).lean();

    for (const page of pages) {
      const cleanSlug = page.slug === '/' ? '' : (page.slug.startsWith('/') ? page.slug : `/${page.slug}`);
      const priority = page.slug === '/' ? 1.0 : (page.slug === '/properties' || page.slug === '/about' || page.slug === '/blog' ? 0.9 : 0.8);
      const changeFrequency = page.slug === '/' || page.slug === '/properties' || page.slug === '/blog' ? 'daily' : 'weekly';

      addEntry({
        url: `${SITE_URL}${cleanSlug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency,
        priority,
      });
    }

    // 2. Dynamic Published Property Routes
    if (sitemapConfig.includeProperties !== false) {
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
        console.warn('[sitemap] Error fetching properties for sitemap:', err?.message);
      }
    }

    // 3. Dynamic Published Blog Posts (strictly status = published)
    if (sitemapConfig.includeBlogs !== false) {
      try {
        const blogPosts = await getBlogPosts({ status: 'published', limit: 1000 });
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
        console.warn('[sitemap] Error fetching blog posts for sitemap:', err?.message);
      }
    }

    // 4. Dynamic Categories
    if (sitemapConfig.includeCategories !== false) {
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
        console.warn('[sitemap] Error fetching categories for sitemap:', err?.message);
      }
    }

    // 5. Dynamic Authors
    if (sitemapConfig.includeAuthors !== false) {
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
        console.warn('[sitemap] Error fetching authors for sitemap:', err?.message);
      }
    }

    // 6. Custom extra URLs from SeoSettings
    if (Array.isArray(sitemapConfig.extraUrls)) {
      for (const extra of sitemapConfig.extraUrls) {
        if (extra?.url) {
          const fullUrl = extra.url.startsWith('http') ? extra.url : `${SITE_URL}${extra.url.startsWith('/') ? extra.url : `/${extra.url}`}`;
          addEntry({
            url: fullUrl,
            lastModified: new Date(),
            changeFrequency: extra.changeFrequency || 'weekly',
            priority: Number(extra.priority) || 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.error('[sitemap] Critical sitemap generation failure:', err?.message);
  }

  return sitemapEntries;
}
