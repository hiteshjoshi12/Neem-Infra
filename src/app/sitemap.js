import { SITE_URL } from '@/lib/seo/seoConfig';
import { getProperties } from '@/services/propertyService';

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/ready-to-move',
    '/new-launches',
    '/under-construction',
    '/developers',
    '/properties',
    '/blog',
    '/privacy-policy',
    '/terms',
    '/services/residential',
    '/services/commercial',
    '/services/industrial',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : route === '/properties' || route === '/about' ? 0.9 : 0.8,
  }));

  // Fetch dynamic property routes
  const properties = await getProperties({ all: false });
  const propertyRoutes = properties.map((prop) => ({
    url: `${SITE_URL}/properties/${prop.slug || prop._id}`,
    lastModified: new Date(prop.updatedAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
