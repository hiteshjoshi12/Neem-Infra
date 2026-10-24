import http from 'http';

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get({
      host: 'localhost',
      port: 3000,
      path,
      headers: {
        Host: 'saudagarproperties.com',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'x-forwarded-proto': 'https',
        ...headers
      }
    }, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(data);
        resolve({ status: res.statusCode, headers: res.headers, size: buf.length, text: buf.toString('utf8') });
      });
    }).on('error', reject);
  });
}

const routes = [
  { name: 'Home (/)', path: '/' },
  { name: 'Properties Catalog (/properties)', path: '/properties' },
  { name: 'Property Detail (/properties/4-bhk-independent-floor-dlf-phase1)', path: '/properties/4-bhk-independent-floor-dlf-phase1' },
  { name: 'Blog Catalog (/blog)', path: '/blog' },
  { name: 'Blog Post (/blog/luxury-builder-floors-dlf-phase-1-5-guide)', path: '/blog/luxury-builder-floors-dlf-phase-1-5-guide' },
  { name: 'About (/about)', path: '/about' },
  { name: 'Contact (/contact)', path: '/contact' },
  { name: 'Team (/team)', path: '/team' },
  { name: 'Services Residential (/services/residential)', path: '/services/residential' }
];

async function measureAll() {
  console.log('========================================================================================');
  console.log('HTML PAYLOAD SIZING ACROSS ROUTE TYPES (CURRENT STREAMLINED vs PREVIOUS BLOATED LAYOUT)');
  console.log('========================================================================================\n');

  console.log('| Route Type | URL Path | Current HTML Size | Embedded RSC Scripts | Base HTML Markup | Status |');
  console.log('|---|---|---|---|---|---|');

  for (const r of routes) {
    const res = await get(r.path);
    const html = res.text;
    const scriptMatches = html.match(/<script[^>]*>.*?<\/script>/gs) || [];
    let rscScriptSize = 0;
    for (const s of scriptMatches) {
      if (s.includes('self.__next_f.push')) {
        rscScriptSize += Buffer.byteLength(s, 'utf8');
      }
    }
    const currentKb = (res.size / 1024).toFixed(2);
    const rscKb = (rscScriptSize / 1024).toFixed(2);
    const baseKb = ((res.size - rscScriptSize) / 1024).toFixed(2);

    console.log(`| **${r.name}** | \`${r.path}\` | **${currentKb} KB** (${res.size} B) | ${rscKb} KB | ${baseKb} KB | HTTP ${res.status} |`);
  }
}

measureAll().catch(console.error);
