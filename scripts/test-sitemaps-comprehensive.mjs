import http from 'http';
import { connectDB } from '../src/lib/mongodb.js';
import Page from '../src/models/Page.js';
import Property from '../src/models/Property.js';
import BlogPost from '../src/models/BlogPost.js';
import Category from '../src/models/Category.js';
import Tag from '../src/models/Tag.js';
import Author from '../src/models/Author.js';
import Redirect from '../src/models/Redirect.js';
import SeoSettings from '../src/models/SeoSettings.js';

const PORT = 5000;
const BASE_FETCH_URL = `http://localhost:${PORT}`;

function fetchText(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_FETCH_URL}${urlPath}`;
    const req = http.request(fullUrl, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function parseXmlTags(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function extractTagValue(xmlBlock, tagName) {
  const match = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i').exec(xmlBlock);
  return match ? match[1].trim() : null;
}

function validateBasicXml(xml) {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    return { valid: false, reason: 'Missing or invalid XML declaration' };
  }
  // Check matching root tag
  if (xml.includes('<sitemapindex') && !xml.includes('</sitemapindex>')) {
    return { valid: false, reason: 'Unclosed sitemapindex' };
  }
  if (xml.includes('<urlset') && !xml.includes('</urlset>')) {
    return { valid: false, reason: 'Unclosed urlset' };
  }
  // Check basic unescaped &
  const rawAmp = /&(?!(amp|lt|gt|quot|apos);)/.test(xml);
  if (rawAmp) {
    return { valid: false, reason: 'Unescaped ampersand in XML' };
  }
  return { valid: true };
}

async function main() {
  console.log('====================================================');
  console.log('   SAUDAGAR PROPERTIES — SITEMAP SYSTEM TEST SUITE  ');
  console.log('====================================================\n');

  await connectDB();
  const settings = await SeoSettings.findOne().lean();
  const canonicalBase = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com').replace(/\/+$/, '');
  console.log(`Canonical Base URL from DB: ${canonicalBase}\n`);

  let allPassed = true;

  // ----------------------------------------------------
  // TEST 1: Fetch and Validate /sitemap_index.xml and /sitemap.xml
  // ----------------------------------------------------
  console.log('--- TEST 1: SITEMAP INDEX & MIRROR CHECKS ---');
  for (const path of ['/sitemap_index.xml', '/sitemap.xml', '/sitemap_index.xml/']) {
    const res = await fetchText(path);
    const contentType = res.headers['content-type'] || '';
    const xmlCheck = validateBasicXml(res.body);

    const is200 = res.statusCode === 200;
    const isXml = contentType.includes('application/xml');
    const isValid = xmlCheck.valid;

    console.log(`[${path}] Status: ${res.statusCode} | Content-Type: ${contentType} | Valid XML: ${isValid}`);
    if (!is200 || !isXml || !isValid) {
      console.error(`  FAIL: ${path} (status: ${is200}, xml: ${isXml}, valid: ${isValid}, reason: ${xmlCheck.reason})`);
      allPassed = false;
    }
  }

  // ----------------------------------------------------
  // TEST 2: Inspect Index and Discover All Child Sitemaps
  // ----------------------------------------------------
  console.log('\n--- TEST 2: CHILD SITEMAPS IN INDEX & ISOLATION ---');
  const indexRes = await fetchText('/sitemap_index.xml');
  const sitemapBlocks = parseXmlTags(indexRes.body, 'sitemap');
  console.log(`Discovered ${sitemapBlocks.length} child sitemaps in index:`);

  const childSitemaps = [];
  for (const block of sitemapBlocks) {
    const loc = extractTagValue(block, 'loc');
    const lastmod = extractTagValue(block, 'lastmod');
    console.log(`  -> ${loc} (lastmod: ${lastmod})`);
    childSitemaps.push({ loc, lastmod });
  }

  // ----------------------------------------------------
  // TEST 3: Fetch Every Child Sitemap & Verify URL Type Isolation
  // ----------------------------------------------------
  console.log('\n--- TEST 3: CHILD SITEMAP CONTENT & ZERO DUPLICATION ---');
  const allUrlsMap = new Map(); // url -> sitemapLoc
  const childCounts = {};

  const EXPECTED_PREFIXES = {
    'page-sitemap.xml': {
      allowed: (path) => !path.startsWith('/property/') && !path.startsWith('/services/') && !path.startsWith('/blog/category/') && !path.startsWith('/blog/tag/') && !path.startsWith('/blog/author/') && !/^\/blog\/[^\/]+$/.test(path) && !/^\/properties\/[^\/]+$/.test(path),
      desc: 'Main & Custom Pages only',
    },
    'service-sitemap.xml': {
      allowed: (path) => path.startsWith('/services/'),
      desc: 'Service pages only (/services/*)',
    },
    'property-sitemap.xml': {
      allowed: (path) => path.startsWith('/properties/') && path !== '/properties',
      desc: 'Individual property listings only (/properties/[slug])',
    },
    'corridor-sitemap.xml': {
      allowed: (path) => path.startsWith('/property/'),
      desc: 'Corridor / area pages only (/property/[slug])',
    },
    'blog-sitemap.xml': {
      allowed: (path) => path.startsWith('/blog/') && !path.startsWith('/blog/category/') && !path.startsWith('/blog/tag/') && !path.startsWith('/blog/author/'),
      desc: 'Blog post articles only (/blog/[slug])',
    },
    'blog-category-sitemap.xml': {
      allowed: (path) => path.startsWith('/blog/category/'),
      desc: 'Blog categories only (/blog/category/[slug])',
    },
    'blog-tag-sitemap.xml': {
      allowed: (path) => path.startsWith('/blog/tag/'),
      desc: 'Blog tags only (/blog/tag/[slug])',
    },
    'author-sitemap.xml': {
      allowed: (path) => path.startsWith('/blog/author/'),
      desc: 'Author pages only (/blog/author/[slug])',
    },
  };

  for (const child of childSitemaps) {
    const filename = child.loc.split('/').pop();
    const res = await fetchText(`/${filename}`);
    const xmlCheck = validateBasicXml(res.body);

    const is200 = res.statusCode === 200;
    const isXml = (res.headers['content-type'] || '').includes('application/xml');
    console.log(`Checking ${filename}: Status: ${res.statusCode} | XML: ${xmlCheck.valid}`);

    if (!is200 || !isXml || !xmlCheck.valid) {
      console.error(`  FAIL: ${filename} fetch failed or returned invalid XML`);
      allPassed = false;
      continue;
    }

    const urlBlocks = parseXmlTags(res.body, 'url');
    childCounts[filename] = urlBlocks.length;
    console.log(`  Count: ${urlBlocks.length} URLs`);

    const rule = EXPECTED_PREFIXES[filename];

    let newestDateInChild = null;

    for (const uBlock of urlBlocks) {
      const loc = extractTagValue(uBlock, 'loc');
      const lastmod = extractTagValue(uBlock, 'lastmod');

      if (!loc) {
        console.error(`  FAIL: Missing <loc> in ${filename}`);
        allPassed = false;
        continue;
      }

      // Check date format
      if (lastmod) {
        const d = new Date(lastmod);
        if (isNaN(d.getTime())) {
          console.error(`  FAIL: Invalid lastmod date format in ${filename}: ${lastmod}`);
          allPassed = false;
        } else if (!newestDateInChild || d > newestDateInChild) {
          newestDateInChild = d;
        }
      }

      // Check Duplication across sitemaps
      if (allUrlsMap.has(loc)) {
        console.error(`  FAIL: Duplicate URL detected! "${loc}" is in both ${allUrlsMap.get(loc)} and ${filename}`);
        allPassed = false;
      } else {
        allUrlsMap.set(loc, filename);
      }

      // Check URL belongs to this sitemap type
      const urlPath = loc.replace(canonicalBase, '') || '/';
      if (rule && !rule.allowed(urlPath)) {
        console.error(`  FAIL: Type isolation violation! "${loc}" (${urlPath}) is not allowed in ${filename} (${rule.desc})`);
        allPassed = false;
      }
    }

    // Check that child lastmod in index matches newest inside child
    if (newestDateInChild && child.lastmod) {
      const indexChildDate = new Date(child.lastmod).getTime();
      const actualNewestDate = newestDateInChild.getTime();
      if (indexChildDate !== actualNewestDate) {
        console.error(`  FAIL: Index lastmod (${child.lastmod}) does not match newest lastmod in ${filename} (${newestDateInChild.toISOString()})`);
        allPassed = false;
      } else {
        console.log(`  ✓ Index lastmod (${child.lastmod}) perfectly matches newest child document date`);
      }
    }
  }

  // ----------------------------------------------------
  // TEST 4: Compare Sitemap Counts with Database Collections
  // ----------------------------------------------------
  console.log('\n--- TEST 4: DATABASE COUNTS RECONCILIATION ---');
  const dbPagesCount = await Page.countDocuments({
    status: 'published',
    'robots.index': { $ne: false },
    excludeFromSitemap: { $ne: true },
    slug: { $not: { $regex: '^/property/|^/services/' } }
  });
  const dbServicesCount = await Page.countDocuments({
    status: 'published',
    'robots.index': { $ne: false },
    excludeFromSitemap: { $ne: true },
    slug: { $regex: '^/services/' }
  });
  const dbCorridorsCount = await Page.countDocuments({
    status: 'published',
    'robots.index': { $ne: false },
    excludeFromSitemap: { $ne: true },
    slug: { $regex: '^/property/' }
  });
  const dbPropsCount = await Property.countDocuments({
    isActive: { $ne: false },
    excludeFromSitemap: { $ne: true }
  });
  const dbBlogsCount = await BlogPost.countDocuments({
    status: 'published',
    excludeFromSitemap: { $ne: true }
  });
  const dbCategoriesCount = await Category.countDocuments({
    excludeFromSitemap: { $ne: true }
  });

  console.log(`Pages:      Sitemap = ${childCounts['page-sitemap.xml'] || 0} | DB = ${dbPagesCount} | Match: ${childCounts['page-sitemap.xml'] === dbPagesCount ? '✓' : '✗'}`);
  console.log(`Services:   Sitemap = ${childCounts['service-sitemap.xml'] || 0} | DB = ${dbServicesCount} | Match: ${childCounts['service-sitemap.xml'] === dbServicesCount ? '✓' : '✗'}`);
  console.log(`Properties: Sitemap = ${childCounts['property-sitemap.xml'] || 0} | DB = ${dbPropsCount} | Match: ${childCounts['property-sitemap.xml'] === dbPropsCount ? '✓' : '✗'}`);
  console.log(`Corridors:  Sitemap = ${childCounts['corridor-sitemap.xml'] || 0} | DB = ${dbCorridorsCount} | Match: ${childCounts['corridor-sitemap.xml'] === dbCorridorsCount ? '✓' : '✗'}`);
  console.log(`Blogs:      Sitemap = ${childCounts['blog-sitemap.xml'] || 0} | DB = ${dbBlogsCount} | Match: ${childCounts['blog-sitemap.xml'] === dbBlogsCount ? '✓' : '✗'}`);
  console.log(`Categories: Sitemap = ${childCounts['blog-category-sitemap.xml'] || 0} | DB = ${dbCategoriesCount} | Match: ${childCounts['blog-category-sitemap.xml'] === dbCategoriesCount ? '✓' : '✗'}`);

  if (childCounts['page-sitemap.xml'] !== dbPagesCount ||
      childCounts['service-sitemap.xml'] !== dbServicesCount ||
      childCounts['property-sitemap.xml'] !== dbPropsCount ||
      childCounts['corridor-sitemap.xml'] !== dbCorridorsCount ||
      childCounts['blog-sitemap.xml'] !== dbBlogsCount ||
      childCounts['blog-category-sitemap.xml'] !== dbCategoriesCount) {
    console.error('FAIL: Database count mismatch detected');
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 5: HTTP Verification of EVERY URL in All Sitemaps
  // ----------------------------------------------------
  console.log(`\n--- TEST 5: HTTP 200 & INDEXABILITY CHECK (${allUrlsMap.size} TOTAL URLS) ---`);
  let testedUrls = 0;
  let failedUrls = 0;

  for (const [fullUrl, sitemapName] of allUrlsMap.entries()) {
    testedUrls++;
    const path = fullUrl.replace(canonicalBase, '') || '/';
    const res = await fetchText(path);

    const is200 = res.statusCode === 200;
    const isRedirect = res.statusCode >= 300 && res.statusCode < 400;

    // Check noindex in header
    const robotsHeader = res.headers['x-robots-tag'] || '';
    const hasHeaderNoindex = robotsHeader.toLowerCase().includes('noindex');

    // Check noindex in HTML body
    const hasMetaNoindex = res.body.toLowerCase().includes('content="noindex') || res.body.toLowerCase().includes("content='noindex");

    if (!is200 || isRedirect || hasHeaderNoindex || hasMetaNoindex) {
      console.error(`  FAIL [${res.statusCode}]: ${fullUrl} in ${sitemapName} (redirect: ${isRedirect}, noindex: ${hasHeaderNoindex || hasMetaNoindex})`);
      failedUrls++;
      allPassed = false;
    }
  }

  console.log(`✓ Tested ${testedUrls} URLs: ${testedUrls - failedUrls} Passed, ${failedUrls} Failed`);

  // ----------------------------------------------------
  // TEST 6: Robots.txt Pointing & Safety Check
  // ----------------------------------------------------
  console.log('\n--- TEST 6: ROBOTS.TXT VERIFICATION ---');
  const robotsRes = await fetchText('/robots.txt');
  const hasSitemapIndex = robotsRes.body.includes(`Sitemap: ${canonicalBase}/sitemap_index.xml`);
  const sitemapLines = robotsRes.body.split('\n').filter(l => l.trim().toLowerCase().startsWith('sitemap:'));

  console.log(`Sitemap lines in robots.txt (${sitemapLines.length}):\n${sitemapLines.join('\n')}`);
  if (!hasSitemapIndex || sitemapLines.length !== 1) {
    console.error('FAIL: robots.txt does not have exactly one Sitemap line pointing to /sitemap_index.xml');
    allPassed = false;
  } else {
    console.log('✓ robots.txt points exclusively to the sitemap index');
  }

  // ----------------------------------------------------
  // TEST 7: ADMIN FRESHNESS & MUTATION LIFE-CYCLE TEST
  // ----------------------------------------------------
  console.log('\n--- TEST 7: ADMIN FRESHNESS & MUTATION LIFECYCLE ---');

  // 7A: BLOG POST LIFECYCLE
  console.log('\n[7A: Blog Post Lifecycle]');
  const testBlogSlug = 'sitemap-automated-test-article';
  const testBlogUrl = `${canonicalBase}/blog/${testBlogSlug}`;

  // 1. Create Blog Post
  const createdPost = await BlogPost.create({
    title: 'Sitemap Automated Test Article',
    slug: testBlogSlug,
    content: 'This is an automated test post for verifying real-time sitemap updates.',
    status: 'published',
    publishedAt: new Date(),
    excludeFromSitemap: false,
  });

  // Fetch immediately (1st request)
  let blogXml = (await fetchText('/blog-sitemap.xml')).body;
  const inSitemapAfterCreate = blogXml.includes(`<loc>${testBlogUrl}</loc>`);
  console.log(`1. Post Created -> In /blog-sitemap.xml on first fetch: ${inSitemapAfterCreate ? '✓ YES' : '✗ NO'}`);
  if (!inSitemapAfterCreate) allPassed = false;

  // 2. Slug Change
  const newBlogSlug = 'sitemap-automated-test-article-renamed';
  const newBlogUrl = `${canonicalBase}/blog/${newBlogSlug}`;
  createdPost.slug = newBlogSlug;
  await createdPost.save();

  blogXml = (await fetchText('/blog-sitemap.xml')).body;
  const oldGone = !blogXml.includes(`<loc>${testBlogUrl}</loc>`);
  const newPresent = blogXml.includes(`<loc>${newBlogUrl}</loc>`);
  console.log(`2. Slug Changed -> Old URL gone: ${oldGone ? '✓' : '✗'} | New URL present: ${newPresent ? '✓' : '✗'}`);
  if (!oldGone || !newPresent) allPassed = false;

  // 3. Exclude from Sitemap Toggle
  createdPost.excludeFromSitemap = true;
  await createdPost.save();

  blogXml = (await fetchText('/blog-sitemap.xml')).body;
  const excludedSuccessfully = !blogXml.includes(`<loc>${newBlogUrl}</loc>`);
  console.log(`3. Exclude Toggle ON -> URL excluded: ${excludedSuccessfully ? '✓' : '✗'}`);
  if (!excludedSuccessfully) allPassed = false;

  // 4. Delete Post
  await BlogPost.findByIdAndDelete(createdPost._id);
  blogXml = (await fetchText('/blog-sitemap.xml')).body;
  const deletedGone = !blogXml.includes(`<loc>${newBlogUrl}</loc>`);
  console.log(`4. Post Deleted -> Cleaned from sitemap: ${deletedGone ? '✓' : '✗'}`);
  if (!deletedGone) allPassed = false;

  // 7B: PROPERTY LIFECYCLE
  console.log('\n[7B: Property Listing Lifecycle]');
  const testPropSlug = 'test-sitemap-luxury-penthouse';
  const testPropUrl = `${canonicalBase}/properties/${testPropSlug}`;

  const createdProp = await Property.create({
    title: 'Test Sitemap Luxury Penthouse',
    slug: testPropSlug,
    price: '₹ 15.5 Cr',
    location: 'DLF Phase 2',
    specs: '4 BHK Ultra Luxury',
    desc: 'Automated test property for sitemap lifecycle testing.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    isActive: true,
    excludeFromSitemap: false,
  });

  let propXml = (await fetchText('/property-sitemap.xml')).body;
  const propInSitemap = propXml.includes(`<loc>${testPropUrl}</loc>`);
  console.log(`1. Property Created -> In /property-sitemap.xml: ${propInSitemap ? '✓ YES' : '✗ NO'}`);
  if (!propInSitemap) allPassed = false;

  // Toggle Exclude
  createdProp.excludeFromSitemap = true;
  await createdProp.save();

  propXml = (await fetchText('/property-sitemap.xml')).body;
  const propExcluded = !propXml.includes(`<loc>${testPropUrl}</loc>`);
  console.log(`2. Property Exclude Toggle ON -> Excluded: ${propExcluded ? '✓ YES' : '✗ NO'}`);
  if (!propExcluded) allPassed = false;

  // Deactivate
  createdProp.excludeFromSitemap = false;
  createdProp.isActive = false;
  await createdProp.save();

  propXml = (await fetchText('/property-sitemap.xml')).body;
  const propDeactivatedGone = !propXml.includes(`<loc>${testPropUrl}</loc>`);
  console.log(`3. Property Deactivated (isActive=false) -> Excluded: ${propDeactivatedGone ? '✓ YES' : '✗ NO'}`);
  if (!propDeactivatedGone) allPassed = false;

  // Delete
  await Property.findByIdAndDelete(createdProp._id);

  // 7C: AUTHOR QUALITY GATING & LIFECYCLE
  console.log('\n[7C: Author Gating & Lifecycle]');
  const testAuthorSlug = 'test-sitemap-senior-partner';
  const testAuthorUrl = `${canonicalBase}/blog/author/${testAuthorSlug}`;

  // Temporarily enable includeAuthors in settings
  const originalAuthorsToggle = settings?.sitemapConfig?.includeAuthors || false;
  const originalAuthorRobots = settings?.authorArchiveRobots || 'noindex,follow';
  await SeoSettings.updateOne(
    { singletonKey: 'global_seo_settings' },
    {
      $set: {
        'sitemapConfig.includeAuthors': true,
        authorArchiveRobots: 'index,follow',
      },
    }
  );

  // 1. Author with photo, bio >= 50, and post
  const createdAuthor = await Author.create({
    name: 'Test Sitemap Senior Partner',
    slug: testAuthorSlug,
    jobTitle: 'Senior Advisory Partner',
    bio: 'Advising institutional capital and private offices on premier residential portfolios across DLF Phase 1–5 Gurugram.',
    image: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/team/test.avif',
    publishedPostCount: 1,
    excludeFromSitemap: false,
  });
  // Create a linked published post so author is not thin
  const authorPost = await BlogPost.create({
    title: 'Author Advisory Test Article',
    slug: 'author-advisory-test-article',
    content: 'Test content for author verification.',
    author: createdAuthor._id,
    status: 'published',
    publishedAt: new Date(),
  });

  let authorXml = (await fetchText('/author-sitemap.xml')).body;
  const authorIncluded = authorXml.includes(`<loc>${testAuthorUrl}</loc>`);
  console.log(`1. Quality Author Created (Photo + Bio + Post) -> In /author-sitemap.xml: ${authorIncluded ? '✓ YES' : '✗ NO'}`);
  if (!authorIncluded) allPassed = false;

  // Check that /sitemap_index.xml now lists /author-sitemap.xml because it's no longer empty!
  let freshIndexXml = (await fetchText('/sitemap_index.xml')).body;
  const authorSitemapInIndex = freshIndexXml.includes('author-sitemap.xml');
  console.log(`2. Non-empty Author Sitemap now visible in /sitemap_index.xml: ${authorSitemapInIndex ? '✓ YES' : '✗ NO'}`);
  if (!authorSitemapInIndex) allPassed = false;

  // Toggle Exclude
  createdAuthor.excludeFromSitemap = true;
  await createdAuthor.save();

  authorXml = (await fetchText('/author-sitemap.xml')).body;
  const authorExcluded = !authorXml.includes(`<loc>${testAuthorUrl}</loc>`);
  console.log(`3. Author Exclude Toggle ON -> Excluded: ${authorExcluded ? '✓ YES' : '✗ NO'}`);
  if (!authorExcluded) allPassed = false;

  // Cleanup Author & Post
  await BlogPost.findByIdAndDelete(authorPost._id);
  await Author.findByIdAndDelete(createdAuthor._id);
  await SeoSettings.updateOne(
    { singletonKey: 'global_seo_settings' },
    {
      $set: {
        'sitemapConfig.includeAuthors': originalAuthorsToggle,
        authorArchiveRobots: originalAuthorRobots,
      },
    }
  );

  freshIndexXml = (await fetchText('/sitemap_index.xml')).body;
  const authorSitemapOmittedAgain = !freshIndexXml.includes('author-sitemap.xml');
  console.log(`4. Author Cleanup -> Empty child omitted from index: ${authorSitemapOmittedAgain ? '✓ YES' : '✗ NO'}`);
  if (!authorSitemapOmittedAgain) allPassed = false;

  // 7D: CATEGORY LIFECYCLE
  console.log('\n[7D: Category Lifecycle]');
  const testCatSlug = 'test-sitemap-cat';
  const testCatUrl = `${canonicalBase}/blog/category/${testCatSlug}`;

  const createdCat = await Category.create({
    name: 'Test Sitemap Category',
    slug: testCatSlug,
    description: 'A test category for sitemap verification',
    excludeFromSitemap: false,
  });
  // Assign a published post so it is not thin
  const catPost = await BlogPost.create({
    title: 'Category Test Article',
    slug: 'category-test-article',
    content: 'Test content for category verification.',
    category: createdCat._id,
    status: 'published',
    publishedAt: new Date(),
  });

  let catXml = (await fetchText('/blog-category-sitemap.xml')).body;
  const catInSitemap = catXml.includes(`<loc>${testCatUrl}</loc>`);
  console.log(`1. Category Created (with post) -> In /blog-category-sitemap.xml: ${catInSitemap ? '✓ YES' : '✗ NO'}`);
  if (!catInSitemap) allPassed = false;

  // Toggle Exclude
  createdCat.excludeFromSitemap = true;
  await createdCat.save();

  catXml = (await fetchText('/blog-category-sitemap.xml')).body;
  const catExcluded = !catXml.includes(`<loc>${testCatUrl}</loc>`);
  console.log(`2. Category Exclude Toggle ON -> Excluded: ${catExcluded ? '✓ YES' : '✗ NO'}`);
  if (!catExcluded) allPassed = false;

  // Cleanup Category & Post
  await BlogPost.findByIdAndDelete(catPost._id);
  await Category.findByIdAndDelete(createdCat._id);

  catXml = (await fetchText('/blog-category-sitemap.xml')).body;
  const catDeletedGone = !catXml.includes(`<loc>${testCatUrl}</loc>`);
  console.log(`3. Category Deleted -> Cleaned from sitemap: ${catDeletedGone ? '✓ YES' : '✗ NO'}`);
  if (!catDeletedGone) allPassed = false;

  // ----------------------------------------------------
  // SUMMARY RESULTS
  // ----------------------------------------------------
  console.log('\n====================================================');
  if (allPassed) {
    console.log('  ALL SITEMAP SPECIFICATION TESTS PASSED (100% OK)  ');
  } else {
    console.log('  SOME SITEMAP SPECIFICATION TESTS FAILED           ');
  }
  console.log('====================================================\n');

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
