import { SITE_URL } from '@/lib/seo/seoConfig';
import { getGlobalSeoSettings } from '@/lib/seo/dynamicSeo';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function robots() {
  const settings = await getGlobalSeoSettings();
  const mode = settings?.robotsTxtMode || 'standard';

  if (mode === 'disallow_all') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  // Parse custom rules if provided
  if (mode === 'custom' && settings?.robotsTxtCustomRules) {
    const raw = settings.robotsTxtCustomRules;
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const disallow = [];
    const allow = [];

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith('disallow:')) {
        const val = line.substring(9).trim();
        if (val) disallow.push(val);
      } else if (line.toLowerCase().startsWith('allow:')) {
        const val = line.substring(6).trim();
        if (val) allow.push(val);
      }
    });

    return {
      rules: {
        userAgent: '*',
        allow: allow.length ? allow : '/',
        disallow: disallow.length ? disallow : ['/admin/', '/api/'],
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  // Standard production rules
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
