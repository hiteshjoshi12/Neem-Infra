import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TARGET_PAGES = [
  { key: 'home', label: 'Homepage', url: 'http://localhost:3000/' },
  { key: 'property', label: 'Property Detail Page', url: 'http://localhost:3000/properties/4-bhk-independent-floor-dlf-phase1' },
  { key: 'blog', label: 'Blog Post Page', url: 'http://localhost:3000/blog/luxury-builder-floors-dlf-phase-1-5-guide' }
];

const RUNS = 3;
const OUT_DIR = path.resolve('scripts/benchmark/runs');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function runAudit() {
  console.log('===============================================================');
  console.log('STARTING MOBILE LIGHTHOUSE AUDITS (MEDIAN OF 3 RUNS PER URL)');
  console.log('===============================================================\n');

  const summary = {};

  for (const page of TARGET_PAGES) {
    console.log(`\nAuditing: ${page.label} (${page.url})`);
    const results = [];

    for (let r = 1; r <= RUNS; r++) {
      const outPath = path.join(OUT_DIR, `${page.key}-run${r}.json`);
      console.log(`  -> Running pass ${r}/${RUNS}...`);
      
      const cmd = `npx lighthouse ${page.url} --only-categories=performance --form-factor=mobile --screenEmulation.mobile=true --output=json --output-path="${outPath}" --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;
      try {
        execSync(cmd, { stdio: 'pipe' });
        const report = JSON.parse(fs.readFileSync(outPath, 'utf8'));
        const audits = report.audits || {};
        const perfScore = Math.round((report.categories?.performance?.score || 0) * 100);
        const fcp = audits['first-contentful-paint']?.numericValue || 0;
        const lcp = audits['largest-contentful-paint']?.numericValue || 0;
        const tbt = audits['total-blocking-time']?.numericValue || 0;
        const cls = audits['cumulative-layout-shift']?.numericValue || 0;
        const si = audits['speed-index']?.numericValue || 0;

        results.push({
          run: r,
          score: perfScore,
          fcp,
          lcp,
          tbt,
          cls,
          si
        });
        console.log(`     Pass ${r}: Score = ${perfScore}/100 | FCP = ${(fcp/1000).toFixed(2)}s | LCP = ${(lcp/1000).toFixed(2)}s | TBT = ${Math.round(tbt)}ms | CLS = ${cls.toFixed(3)}`);
      } catch (err) {
        console.error(`     Error on run ${r}:`, err.message);
      }
    }

    if (results.length > 0) {
      summary[page.key] = {
        label: page.label,
        url: page.url,
        runs: results,
        median: {
          score: Math.round(median(results.map(r => r.score))),
          fcp: (median(results.map(r => r.fcp)) / 1000).toFixed(2) + 's',
          lcp: (median(results.map(r => r.lcp)) / 1000).toFixed(2) + 's',
          tbt: Math.round(median(results.map(r => r.tbt))) + 'ms',
          cls: median(results.map(r => r.cls)).toFixed(3),
          si: (median(results.map(r => r.si)) / 1000).toFixed(2) + 's',
        }
      };
    }
  }

  console.log('\n===============================================================');
  console.log('MOBILE LIGHTHOUSE MEDIAN OF 3 SUMMARY REPORT');
  console.log('===============================================================');
  console.log(JSON.stringify(summary, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, 'median-summary.json'), JSON.stringify(summary, null, 2));
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
