import fs from 'fs';

const pages = [
  { file: 'scripts/benchmark/home-lighthouse.json', label: 'Homepage (/)' },
  { file: 'scripts/benchmark/property-lighthouse.json', label: 'Property Page (/properties/4-bhk-independent-floor-dlf-phase1)' },
  { file: 'scripts/benchmark/blog-lighthouse.json', label: 'Blog Post (/blog/luxury-builder-floors-dlf-phase-1-5-guide)' }
];

for (const p of pages) {
  if (!fs.existsSync(p.file)) {
    console.log('Missing:', p.file);
    continue;
  }
  const report = JSON.parse(fs.readFileSync(p.file, 'utf8'));
  const audits = report.audits || {};
  
  console.log(`\n===============================================================`);
  console.log(`PAGE: ${p.label}`);
  console.log(`===============================================================`);
  console.log(`- Performance Score: ${Math.round((report.categories?.performance?.score || 0) * 100)}/100`);
  console.log(`- FCP: ${audits['first-contentful-paint']?.displayValue}`);
  console.log(`- LCP: ${audits['largest-contentful-paint']?.displayValue}`);
  console.log(`- TBT: ${audits['total-blocking-time']?.displayValue}`);
  console.log(`- CLS: ${audits['cumulative-layout-shift']?.displayValue}`);
  console.log(`- Speed Index: ${audits['speed-index']?.displayValue}`);

  // LCP Element
  const lcpAudit = audits['largest-contentful-paint-element'];
  if (lcpAudit && lcpAudit.details && lcpAudit.details.items) {
    console.log(`\nLCP Element:`);
    for (const item of lcpAudit.details.items) {
      console.log(`  - Selector: ${item.node?.selector}`);
      console.log(`  - Node Snippet: ${item.node?.snippet}`);
      console.log(`  - Node Label: ${item.node?.nodeLabel}`);
    }
  }

  // Top Long Tasks
  const longTasksAudit = audits['long-tasks'];
  if (longTasksAudit && longTasksAudit.details && longTasksAudit.details.items) {
    console.log(`\nTop Long Tasks (Count: ${longTasksAudit.details.items.length}):`);
    const top5 = longTasksAudit.details.items.slice(0, 5);
    top5.forEach((t, i) => {
      console.log(`  ${i+1}. Duration: ${Math.round(t.duration)}ms | Start: ${Math.round(t.startTime)}ms | URL: ${t.url || 'Main Thread / Evaluation'}`);
    });
  }

  // Main Thread Work Breakdown
  const mainThreadAudit = audits['mainthread-work-breakdown'];
  if (mainThreadAudit && mainThreadAudit.details && mainThreadAudit.details.items) {
    console.log(`\nTop Main Thread Categories:`);
    const topItems = mainThreadAudit.details.items.slice(0, 5);
    topItems.forEach(item => {
      console.log(`  - ${item.groupLabel || item.group}: ${Math.round(item.duration)}ms`);
    });
  }
}
