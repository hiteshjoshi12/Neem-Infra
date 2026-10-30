import { generateSitemapIndexXml, createXmlResponse } from '@/lib/sitemap/sitemapService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const xml = await generateSitemapIndexXml();
  return createXmlResponse(xml);
}

