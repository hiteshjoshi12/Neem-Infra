import fs from 'fs';

function summarize(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`\n=========================================`);
  console.log(`LIGHTHOUSE MOBILE AUDIT: ${label}`);
  console.log(`=========================================`);
  for (const [k, v] of Object.entries(data.categories || {})) {
    console.log(`- ${v.title}: ${Math.round(v.score * 100)}/100`);
  }
  const a = data.audits || {};
  console.log(`\nPerformance Metrics:`);
  console.log(`- First Contentful Paint (FCP): ${a['first-contentful-paint']?.displayValue}`);
  console.log(`- Largest Contentful Paint (LCP): ${a['largest-contentful-paint']?.displayValue}`);
  console.log(`- Total Blocking Time (TBT): ${a['total-blocking-time']?.displayValue}`);
  console.log(`- Cumulative Layout Shift (CLS): ${a['cumulative-layout-shift']?.displayValue}`);
  console.log(`- Speed Index: ${a['speed-index']?.displayValue}`);
}

summarize('scripts/benchmark/home-lighthouse.json', 'Homepage (/)');
