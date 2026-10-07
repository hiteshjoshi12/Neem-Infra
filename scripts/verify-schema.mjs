import { 
  buildAbsoluteUrl, 
  cleanSchema, 
  buildWebSiteSchema, 
  buildOrganizationSchema, 
  buildAuthorSchema, 
  buildBreadcrumbSchema, 
  buildFAQSchema, 
  buildBlogPostingSchema, 
  buildArticleGraph,
  buildLocationSchema,
  buildLocationGraph
} from '../src/lib/seo/schemaBuilders.js';
import { SITE_URL, BUSINESS_INFO } from '../src/lib/seo/seoConfig.js';

/**
 * Saudagar Properties — Schema.org & JSON-LD Validation Test Utility
 * ====================================================================
 * Verifies that all schema builders produce strictly valid, non-fabricated,
 * connected JSON-LD graphs with crawlable absolute URLs and no undefined fields.
 */

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

console.log('\n=============================================================');
console.log('🧪 SAUDAGAR PROPERTIES — JSON-LD STRUCTURED DATA VERIFICATION');
console.log('=============================================================\n');

// ---------------------------------------------------------------------------
// TEST 1: URL Normalization
// ---------------------------------------------------------------------------
console.log('Test Suite 1: URL Normalization & Crawlability');
const testRelUrl = buildAbsoluteUrl('/blog/sample-post');
const testAbsUrl = buildAbsoluteUrl('https://images.unsplash.com/photo-1545324418');
assert(testRelUrl.startsWith('https://'), 'Relative path converted to absolute HTTPS URL');
assert(!testRelUrl.includes('//blog'), 'No double slashes created during normalization');
assert(testAbsUrl.startsWith('https://images.unsplash.com'), 'Absolute URL preserved untouched');

// ---------------------------------------------------------------------------
// TEST 2: Schema Sanitization (cleanSchema)
// ---------------------------------------------------------------------------
console.log('\nTest Suite 2: Schema Sanitization (No Undefined/Null/Empty)');
const dirtyInput = {
  '@type': 'Thing',
  name: 'Clean Name',
  invalidProp: undefined,
  nullProp: null,
  emptyString: '',
  emptyArray: [],
  nested: {
    valid: 'Yes',
    empty: undefined,
  },
};
const cleaned = cleanSchema(dirtyInput);
assert(cleaned.name === 'Clean Name', 'Valid properties retained');
assert(!('invalidProp' in cleaned), 'Undefined properties removed');
assert(!('nullProp' in cleaned), 'Null properties removed');
assert(!('emptyString' in cleaned), 'Empty string properties removed');
assert(!('emptyArray' in cleaned), 'Empty arrays removed');
assert(!('empty' in cleaned.nested), 'Nested undefined properties removed');

// ---------------------------------------------------------------------------
// TEST 3: WebSite Schema (Homepage / Root Entity)
// ---------------------------------------------------------------------------
console.log('\nTest Suite 3: WebSite Schema');
const websiteSchema = buildWebSiteSchema();
assert(websiteSchema['@type'] === 'WebSite', 'Correct @type "WebSite"');
assert(websiteSchema['@id'] === `${SITE_URL}/#website`, 'Consistent @id "#website"');
assert(typeof websiteSchema.name === 'string' && websiteSchema.name.length > 0, 'Website name is populated');
assert(typeof websiteSchema.alternateName === 'string' && websiteSchema.alternateName.length > 0, 'Website alternateName is populated');
assert(websiteSchema.url === SITE_URL, 'Canonical site URL specified');
assert(websiteSchema.publisher['@id'] === `${SITE_URL}/#organization`, 'Publisher links to #organization');

// ---------------------------------------------------------------------------
// TEST 4: Organization & LocalBusiness (RealEstateAgent) Schema
// ---------------------------------------------------------------------------
console.log('\nTest Suite 4: Organization & LocalBusiness (RealEstateAgent) Schema');
const orgSchema = buildOrganizationSchema();
assert(Array.isArray(orgSchema['@type']) && orgSchema['@type'].includes('RealEstateAgent'), '@type includes "RealEstateAgent" subtype');
assert(orgSchema['@type'].includes('Organization'), '@type includes "Organization"');
assert(orgSchema['@id'] === `${SITE_URL}/#organization`, 'Consistent @id "#organization"');
assert(orgSchema.name === BUSINESS_INFO.name, 'Real legal name matches BUSINESS_INFO');
assert(orgSchema.telephone === BUSINESS_INFO.phone[0], 'Real telephone matches verified phone');
assert(orgSchema.address?.streetAddress === BUSINESS_INFO.address.streetAddress, 'Real verified street address');
assert(typeof orgSchema.geo?.latitude === 'number', 'Numeric latitude present for GEO entity');
assert(typeof orgSchema.geo?.longitude === 'number', 'Numeric longitude present for GEO entity');
assert(orgSchema.logo?.url.startsWith('https://'), 'Logo URL is absolute');
if (orgSchema.sameAs) {
  assert(orgSchema.sameAs.every(url => url.startsWith('http') && url !== '#'), 'sameAs only contains valid HTTP/HTTPS URLs (no placeholders)');
}

// ---------------------------------------------------------------------------
// TEST 5: Author Schema (Person)
// ---------------------------------------------------------------------------
console.log('\nTest Suite 5: Author Schema');
const sampleAuthor = {
  name: 'Mr. Arun Sharma',
  slug: 'arun-sharma',
  jobTitle: 'Co-Founder & Senior Luxury Property Consultant',
  bio: 'Advising high-net-worth investors across DLF Phase 1–5.',
  image: '/images/authors/arun-sharma.jpg',
  socialProfiles: { linkedin: 'https://linkedin.com/in/arunsharma', twitter: '#' }
};
const authorSchema = buildAuthorSchema(sampleAuthor);
assert(authorSchema['@type'] === 'Person', 'Correct @type "Person"');
assert(authorSchema['@id'] === `${SITE_URL}/blog/author/arun-sharma#author`, 'Author @id links to real author profile URI');
assert(authorSchema.url === `${SITE_URL}/blog/author/arun-sharma`, 'Author profile URL is absolute and canonical');
assert(authorSchema.image.startsWith('https://'), 'Author image URL is absolute');
assert(authorSchema.sameAs.length === 1 && authorSchema.sameAs[0].includes('linkedin'), 'Filters out placeholder "#" social profiles');

// ---------------------------------------------------------------------------
// TEST 6: BreadcrumbList Schema
// ---------------------------------------------------------------------------
console.log('\nTest Suite 6: BreadcrumbList Schema');
const sampleBreadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Buyer Guides', url: '/blog/category/buyer-guides' },
  { name: 'DLF Phase 1 Guide', url: '/blog/dlf-phase-1-guide' }
];
const breadcrumbSchema = buildBreadcrumbSchema(sampleBreadcrumbs, '/blog/dlf-phase-1-guide');
assert(breadcrumbSchema['@type'] === 'BreadcrumbList', 'Correct @type "BreadcrumbList"');
assert(breadcrumbSchema.itemListElement.length === 4, 'All breadcrumb items included');
assert(breadcrumbSchema.itemListElement[0].position === 1, '1-based index position for first item');
assert(breadcrumbSchema.itemListElement[3].position === 4, '1-based index position for last item');
assert(breadcrumbSchema.itemListElement.every(item => item.item.startsWith('https://')), 'All breadcrumb item URLs are absolute');

// ---------------------------------------------------------------------------
// TEST 7: FAQ Schema (Only Real & Visible Questions)
// ---------------------------------------------------------------------------
console.log('\nTest Suite 7: FAQ Schema');
const sampleFaqs = [
  { question: 'What is the price of builder floors in DLF Phase 1?', answer: 'Prices range from ₹4 Cr to ₹12 Cr depending on plot size.' },
  { question: 'Is registry allowed for independent floors in Gurugram?', answer: 'Yes, stilt + 4 floors with independent registry are permitted under DTCP guidelines.' }
];
const faqSchema = buildFAQSchema(sampleFaqs);
assert(faqSchema['@type'] === 'FAQPage', 'Correct @type "FAQPage"');
assert(faqSchema.mainEntity.length === 2, 'Both questions mapped');
assert(faqSchema.mainEntity[0]['@type'] === 'Question', 'Child is Question');
assert(faqSchema.mainEntity[0].acceptedAnswer['@type'] === 'Answer', 'Answer is Answer');

// Test that empty / invalid FAQs are NOT emitted
const emptyFaqs = [];
const invalidFaqs = [{ question: '', answer: '' }, { question: 'Only question?', answer: '' }];
assert(buildFAQSchema(emptyFaqs) === undefined, 'Empty FAQ array returns undefined (never emits empty schema)');
assert(buildFAQSchema(invalidFaqs) === undefined, 'FAQs with empty answers return undefined (never emits fake schema)');

// ---------------------------------------------------------------------------
// TEST 8: BlogPosting Schema
// ---------------------------------------------------------------------------
console.log('\nTest Suite 8: BlogPosting Schema');
const samplePost = {
  title: 'DLF Phase 5 Luxury Builder Floors vs High-Rise Apartments: 2026 Analysis',
  slug: 'dlf-phase-5-builder-floors-vs-high-rise-apartments-analysis',
  excerpt: 'A comprehensive capital appreciation and rental yield breakdown comparing independent floors in DLF Phase 5 against The Camellias & The Aralias.',
  content: 'Article body text...',
  featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  publishedAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-03-05T12:00:00.000Z',
  author: sampleAuthor,
  category: { name: 'Buyer Guides', slug: 'buyer-guides' },
  focusKeyword: 'DLF Phase 5 Builder Floors',
  secondaryKeywords: ['Luxury Apartments Gurugram', 'Golf Course Road Real Estate'],
  tags: [{ name: 'Builder Floors', slug: 'builder-floors' }, { name: 'DLF Gurugram', slug: 'dlf-gurugram' }],
  faq: sampleFaqs
};
const blogPosting = buildBlogPostingSchema(samplePost);
assert(blogPosting['@type'] === 'BlogPosting', 'Correct @type "BlogPosting"');
assert(blogPosting.headline === samplePost.title, 'Headline matches article title');
assert(blogPosting.description === samplePost.excerpt, 'Description matches article excerpt');
assert(blogPosting.url.startsWith('https://'), 'Article URL is absolute');
assert(Array.isArray(blogPosting.image) && blogPosting.image[0].startsWith('https://'), 'Featured image is crawlable absolute URL array');
assert(blogPosting.datePublished === '2026-03-01T10:00:00.000Z', 'Valid ISO datePublished');
assert(blogPosting.dateModified === '2026-03-05T12:00:00.000Z', 'Valid ISO dateModified');
assert(blogPosting.publisher['@id'] === `${SITE_URL}/#organization`, 'Publisher references organization ID');
assert(blogPosting.author['@id'] === `${SITE_URL}/blog/author/arun-sharma#author`, 'Author references author Person ID');
assert(blogPosting.articleSection === 'Buyer Guides', 'ArticleSection matches category');
assert(blogPosting.keywords.includes('DLF Phase 5 Builder Floors'), 'Keywords contain focus keyword');

// ---------------------------------------------------------------------------
// TEST 9: Connected Article Graph (@graph)
// ---------------------------------------------------------------------------
console.log('\nTest Suite 9: Connected JSON-LD Graph (@graph)');
const articleGraph = buildArticleGraph({
  post: samplePost,
  breadcrumbs: sampleBreadcrumbs,
  faqs: sampleFaqs
});

assert(articleGraph['@context'] === 'https://schema.org', 'Root @context is "https://schema.org"');
assert(Array.isArray(articleGraph['@graph']), '@graph is an array of interconnected nodes');

const graphTypes = articleGraph['@graph'].map(node => Array.isArray(node['@type']) ? node['@type'][0] : node['@type']);
assert(graphTypes.includes('WebSite'), 'Graph contains WebSite node');
assert(graphTypes.includes('RealEstateAgent'), 'Graph contains RealEstateAgent node');
assert(graphTypes.includes('WebPage'), 'Graph contains WebPage node');
assert(graphTypes.includes('BreadcrumbList'), 'Graph contains BreadcrumbList node');
assert(graphTypes.includes('Person'), 'Graph contains Person (Author) node');
assert(graphTypes.includes('BlogPosting'), 'Graph contains BlogPosting node');
assert(graphTypes.includes('FAQPage'), 'Graph contains FAQPage node');

// Verify Node Interconnectedness
const postNode = articleGraph['@graph'].find(n => n['@type'] === 'BlogPosting');
const pageNode = articleGraph['@graph'].find(n => n['@type'] === 'WebPage');
assert(postNode.isPartOf['@id'] === pageNode['@id'], 'BlogPosting connects to WebPage via isPartOf');
assert(postNode.publisher['@id'] === `${SITE_URL}/#organization`, 'BlogPosting connects to Organization via publisher');
assert(postNode.author['@id'] === `${SITE_URL}/blog/author/arun-sharma#author`, 'BlogPosting connects to Person via author');
assert(pageNode.breadcrumb['@id'] === `${SITE_URL}/blog/dlf-phase-5-builder-floors-vs-high-rise-apartments-analysis#breadcrumb`, 'WebPage connects to BreadcrumbList via breadcrumb');

// ---------------------------------------------------------------------------
// TEST 10: JSON Serialization & Syntax Validity
// ---------------------------------------------------------------------------
console.log('\nTest Suite 10: JSON Serialization & Parsing Validity');
const jsonString = JSON.stringify(articleGraph);
assert(typeof jsonString === 'string' && jsonString.length > 500, 'Serialized graph string is non-empty');
assert(!jsonString.includes('undefined'), 'Zero "undefined" tokens in serialized JSON string');
assert(!jsonString.includes('null'), 'Zero "null" tokens in serialized JSON string');
assert(!jsonString.includes('[object Object]'), 'Zero "[object Object]" coercion bugs');

let parsedBack;
try {
  parsedBack = JSON.parse(jsonString);
  assert(true, 'JSON.parse() succeeds with zero syntax errors');
} catch (e) {
  assert(false, `JSON.parse() failed: ${e.message}`);
}

// ---------------------------------------------------------------------------
// TEST 11: Location Entity & Connected Location Graph
// ---------------------------------------------------------------------------
console.log('\nTest Suite 11: Location Schema & Connected Location Graph');
const mockLocation = {
  name: 'DLF Phase 2',
  slug: 'dlf-phase-2',
  city: 'Gurugram',
  state: 'Haryana',
  country: 'India',
  description: 'The corporate and executive heartbeat of DLF Gurugram on Akashneem Marg.',
  coordinates: {
    latitude: 28.4848,
    longitude: 77.0843,
  },
  faqs: [
    {
      question: 'What are the best property options in DLF Phase 2?',
      answer: 'Brand-new 4 BHK independent floors built on 400 and 502 sq. yd. plots.',
    },
  ],
};

const locSchema = buildLocationSchema(mockLocation);
assert(locSchema['@type'] === 'Place', 'Location @type is "Place"');
assert(locSchema['@id'] === `${SITE_URL}/blog/location/dlf-phase-2#place`, 'Location @id matches "#place" URL');
assert(locSchema.name === 'DLF Phase 2', 'Location name populated correctly');
assert(locSchema.geo?.latitude === 28.4848, 'Verified latitude mapped to GeoCoordinates');
assert(locSchema.geo?.longitude === 77.0843, 'Verified longitude mapped to GeoCoordinates');
assert(locSchema.containedInPlace?.name === 'Gurugram', 'Contained in parent city Gurugram');

const locationBreadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Locations', url: '/blog/location' },
  { name: 'Gurugram', url: '/blog/location/gurugram' },
  { name: 'DLF Phase 2', url: '/blog/location/dlf-phase-2' },
];

const locationGraph = buildLocationGraph({
  location: mockLocation,
  breadcrumbs: locationBreadcrumbs,
  faqs: mockLocation.faqs,
});

assert(locationGraph['@context'] === 'https://schema.org', 'Location graph @context is valid');
assert(Array.isArray(locationGraph['@graph']), 'Location graph @graph is an array');

const locGraphTypes = locationGraph['@graph'].map(n => Array.isArray(n['@type']) ? n['@type'][0] : n['@type']);
assert(locGraphTypes.includes('WebSite'), 'Location graph includes WebSite');
assert(locGraphTypes.includes('RealEstateAgent'), 'Location graph includes RealEstateAgent');
assert(locGraphTypes.includes('Place'), 'Location graph includes Place entity');
assert(locGraphTypes.includes('WebPage'), 'Location graph includes WebPage');
assert(locGraphTypes.includes('BreadcrumbList'), 'Location graph includes BreadcrumbList');
assert(locGraphTypes.includes('FAQPage'), 'Location graph includes FAQPage');

const locPageNode = locationGraph['@graph'].find(n => n['@type'] === 'WebPage');
assert(locPageNode.about['@id'] === `${SITE_URL}/blog/location/dlf-phase-2#place`, 'WebPage connects to Place entity via about');
assert(locPageNode.breadcrumb['@id'] === `${SITE_URL}/blog/location/dlf-phase-2#breadcrumb`, 'WebPage connects to BreadcrumbList');

// ---------------------------------------------------------------------------
// Final Audit Summary
// ---------------------------------------------------------------------------

console.log('\n=============================================================');
console.log(`📊 STRUCTURED DATA TEST SUMMARY:`);
console.log(`✅ Passed:  ${passCount}`);
console.log(`❌ Failed:  ${failCount}`);
console.log('=============================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✨ All Schema.org and JSON-LD structured data validations PASSED!\n');
  process.exit(0);
}
