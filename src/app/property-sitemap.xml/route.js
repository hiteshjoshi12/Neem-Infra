import { generateChildSitemapXml, createXmlResponse } from '@/lib/sitemap/sitemapService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const xml = await generateChildSitemapXml('property-sitemap.xml');
  return createXmlResponse(xml || '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
}

