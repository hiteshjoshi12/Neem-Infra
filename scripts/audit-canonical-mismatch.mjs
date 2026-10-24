import fs from 'fs';

async function runCanonicalAudit() {
  console.log('Fetching sitemap from http://localhost:3000/sitemap.xml...');
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml', {
    headers: { Host: 'saudagarproperties.com' }
  });
  const sitemapXml = await sitemapRes.text();
  const locMatches = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)];
  const urls = locMatches.map(m => m[1]);

  console.log(`Discovered ${urls.length} URLs in sitemap.`);

  const results = [];
  let matchCount = 0;
  let mismatchCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const sitemapUrl = urls[i];
    const path = new URL(sitemapUrl).pathname;
    const fetchUrl = `http://localhost:3000${path}`;

    try {
      const res = await fetch(fetchUrl, {
        headers: {
          Host: 'saudagarproperties.com',
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'x-forwarded-proto': 'https'
        }
      });

      const html = await res.text();
      // Match <link rel="canonical" href="..." /> or href="..." rel="canonical"
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                             html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      const emittedCanonical = canonicalMatch ? canonicalMatch[1] : 'NONE_FOUND';

      // Match og:url
      const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i);
      const emittedOgUrl = ogUrlMatch ? ogUrlMatch[1] : 'NONE_FOUND';

      // Compare: normalise trailing slash
      const cleanSitemap = sitemapUrl.replace(/\/$/, '');
      const cleanCanonical = emittedCanonical.replace(/\/$/, '');

      const isMatch = (cleanSitemap === cleanCanonical);
      if (isMatch) {
        matchCount++;
      } else {
        mismatchCount++;
      }

      results.push({
        index: i + 1,
        path,
        sitemapUrl,
        emittedCanonical,
        emittedOgUrl,
        status: res.status,
        isMatch
      });

      if (!isMatch) {
        console.warn(`[MISMATCH #${i+1}] Path: ${path} | Sitemap: ${sitemapUrl} | Canonical: ${emittedCanonical}`);
      }
    } catch (err) {
      mismatchCount++;
      results.push({
        index: i + 1,
        path,
        sitemapUrl,
        emittedCanonical: 'FETCH_ERROR: ' + err.message,
        emittedOgUrl: 'ERROR',
        status: 0,
        isMatch: false
      });
    }
  }

  console.log('\n===============================================================');
  console.log(`TOTAL SITEMAP URLS AUDITED: ${results.length}`);
  console.log(`MATCHES: ${matchCount}`);
  console.log(`MISMATCHES: ${mismatchCount}`);
  console.log('===============================================================\n');

  // Format Markdown Table
  let mdTable = '| # | Sitemap URL | HTTP | Emitted Canonical | og:url | Canonical Match? |\n';
  mdTable += '|---|---|---|---|---|---|\n';

  results.forEach(r => {
    mdTable += `| ${r.index} | \`${r.sitemapUrl}\` | ${r.status} | \`${r.emittedCanonical}\` | \`${r.emittedOgUrl}\` | ${r.isMatch ? '✅ MATCH' : '❌ MISMATCH'} |\n`;
  });

  fs.writeFileSync('scripts/canonical-audit-output.json', JSON.stringify({ matchCount, mismatchCount, results }, null, 2));
  fs.writeFileSync('scripts/canonical-audit-table.md', mdTable);
  console.log('Saved audit results to scripts/canonical-audit-table.md and JSON.');
}

runCanonicalAudit().catch(console.error);
