import { getGlobalSeoSettings } from '@/lib/seo/dynamicSeo';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function robots() {
  const settings = await getGlobalSeoSettings();
  const baseUrl = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com').replace(/\/+$/, '');
  const mode = settings?.robotsTxtMode || 'standard';

  // 1. Staging or Non-Production Protection: block all crawlers outside production
  if (
    (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') ||
    mode === 'disallow_all'
  ) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // 2. Parse custom rules if configured in admin
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
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // 3. Modern Production Rules: Explicitly permit search & AI answer bots while protecting private paths
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        // OpenAI Search & ChatGPT retrieval for AEO
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        // Anthropic Claude
        userAgent: ['ClaudeBot', 'Claude-SearchBot'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        // Perplexity AI
        userAgent: ['PerplexityBot'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        // Applebot & Bingbot
        userAgent: ['Applebot', 'Applebot-Extended', 'bingbot'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
