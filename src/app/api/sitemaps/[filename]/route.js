import { generateChildSitemapXml, createXmlResponse } from '@/lib/sitemap/sitemapService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req, { params }) {
  const { filename } = await params;
  if (!filename || !filename.endsWith('.xml')) {
    return new Response('Not Found', { status: 404 });
  }

  const xml = await generateChildSitemapXml(filename);
  if (!xml) {
    return new Response('Sitemap Not Found', { status: 404 });
  }

  return createXmlResponse(xml);
}

