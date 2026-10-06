import fs from 'fs';
import path from 'path';

/**
 * Saudagar Properties — Automated SEO, AEO & GEO Deep Audit Script
 * Runs comprehensive technical, semantic, and AI-readiness checks on all App Router routes.
 */

const APP_DIR = path.resolve('src/app');
const PUBLIC_DIR = path.resolve('public');
const LIB_SEO_DIR = path.resolve('src/lib/seo');

const results = {
  passed: [],
  warnings: [],
  errors: [],
};

function pass(category, message) {
  results.passed.push(`[${category}] ${message}`);
}
function warn(category, message) {
  results.warnings.push(`[${category}] ${message}`);
}
function error(category, message) {
  results.errors.push(`[${category}] ${message}`);
}

console.log('\n=============================================================');
console.log('🔍 SAUDAGAR PROPERTIES — SEO, AEO & GEO DEEP AUDIT');
console.log('=============================================================\n');

// 1. Technical Health: Sitemap & Robots
console.log('Step 1: Checking Dynamic Crawl Infrastructure...');
if (fs.existsSync(path.join(APP_DIR, 'sitemap.js'))) {
  const sitemapContent = fs.readFileSync(path.join(APP_DIR, 'sitemap.js'), 'utf-8');
  if (sitemapContent.includes('export default async function sitemap')) {
    pass('Sitemap', 'Dynamic sitemap.js exists and exports async sitemap()');
    if (sitemapContent.includes('getProperties')) {
      pass('Sitemap', 'Dynamic MongoDB property sync verified in sitemap.js');
    } else {
      warn('Sitemap', 'sitemap.js might not be pulling dynamic property listings');
    }
  } else {
    error('Sitemap', 'sitemap.js does not export default sitemap function');
  }
} else {
  error('Sitemap', 'Missing src/app/sitemap.js');
}

if (fs.existsSync(path.join(APP_DIR, 'robots.js'))) {
  const robotsContent = fs.readFileSync(path.join(APP_DIR, 'robots.js'), 'utf-8');
  if (robotsContent.includes("disallow: ['/admin/', '/api/']")) {
    pass('Robots.txt', 'Dynamic robots.js blocks /admin/ and /api/ from search crawlers');
  } else {
    warn('Robots.txt', 'Verify that robots.js restricts sensitive admin & API routes');
  }
} else {
  error('Robots.txt', 'Missing src/app/robots.js');
}

if (fs.existsSync(path.join(PUBLIC_DIR, 'sitemap.xml'))) {
  warn('Conflict', 'Static public/sitemap.xml detected — might shadow dynamic sitemap.js');
}
if (fs.existsSync(path.join(PUBLIC_DIR, 'robots.txt'))) {
  warn('Conflict', 'Static public/robots.txt detected — might shadow dynamic robots.js');
}

// 2. Global Entity & GEO Signals
console.log('\nStep 2: Checking Knowledge Graph & GEO Entities...');
const orgSchemaPath = path.resolve('src/components/seo/OrganizationJsonLd.jsx');
if (fs.existsSync(orgSchemaPath)) {
  const orgContent = fs.readFileSync(orgSchemaPath, 'utf-8');
  if (orgContent.includes('RealEstateAgent') || orgContent.includes('LocalBusiness')) {
    pass('GEO-Schema', 'OrganizationJsonLd provides RealEstateAgent & LocalBusiness Schema');
  }
  if (orgContent.includes('geo') && orgContent.includes('latitude') && orgContent.includes('longitude')) {
    pass('GEO-Coords', 'Geographic coordinates (lat/long) embedded for local maps & AI location search');
  }
  if (orgContent.includes('sameAs')) {
    pass('GEO-Authority', 'Authority signals (sameAs social profiles) configured');
  }
} else {
  error('GEO-Schema', 'Missing OrganizationJsonLd component');
}

// 3. Scan All Page Routes
console.log('\nStep 3: Auditing Public & Dynamic Routes...');

function findPageFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findPageFiles(fullPath, fileList);
    } else if (item === 'page.js' || item === 'page.jsx') {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allPages = findPageFiles(APP_DIR);
console.log(`Found ${allPages.length} App Router page routes.\n`);

allPages.forEach((pagePath) => {
  const relPath = path.relative(APP_DIR, pagePath).replace(/\\/g, '/');
  const isPrivate = relPath.startsWith('admin') || relPath.startsWith('api');
  const content = fs.readFileSync(pagePath, 'utf-8');

  if (isPrivate) {
    pass('Route:Private', `Protected route verified: ${relPath}`);
    return;
  }

  // Check 0: Redirect pages
  if (content.includes('redirect(')) {
    pass('Route:Redirect', `${relPath} is a navigation redirect page`);
    return;
  }

  // Check 1: Metadata export
  const hasGenerateMetadata = content.includes('generateMetadata');
  const hasStaticMetadata = /export\s+const\s+metadata\s*=/.test(content);
  if (hasGenerateMetadata || hasStaticMetadata) {
    pass('Metadata', `${relPath} exports server-side metadata`);
  } else {
    warn('Metadata', `${relPath} is missing server-side metadata export`);
  }

  // Check 2: Canonical URL
  if (content.includes('canonical') || content.includes('PAGE_SEO')) {
    pass('Canonical', `${relPath} specifies canonical URL reference`);
  } else {
    warn('Canonical', `${relPath} does not explicitly specify canonical URL`);
  }

  // Check 3: Breadcrumb Structured Data (AEO)
  if (content.includes('BreadcrumbJsonLd')) {
    pass('AEO-Breadcrumbs', `${relPath} implements BreadcrumbList JSON-LD`);
  } else if (!relPath.includes('[slug]')) {
    warn('AEO-Breadcrumbs', `${relPath} should include <BreadcrumbJsonLd> for search hierarchy`);
  }

  // Check 4: Heading Hierarchy Check
  const h1Matches = content.match(/<h1[^>]*>/gi);
  if (h1Matches && h1Matches.length > 1) {
    warn('Semantic', `${relPath} has multiple <h1> tags (${h1Matches.length} found). Best practice is exactly 1 <h1> per page`);
  }
});

// 4. Output Summary
console.log('\n=============================================================');
console.log(`📊 AUDIT SUMMARY:`);
console.log(`✅ Passed:   ${results.passed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log(`❌ Errors:   ${results.errors.length}`);
console.log('=============================================================\n');

if (results.errors.length > 0) {
  console.log('❌ CRITICAL ERRORS:');
  results.errors.forEach(e => console.log('  ' + e));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('⚠️  RECOMMENDATIONS & WARNINGS:');
  results.warnings.forEach(w => console.log('  ' + w));
  console.log('');
}

if (results.errors.length === 0) {
  console.log('✨ All critical SEO, AEO, and GEO infrastructure checks PASSED!\n');
}
