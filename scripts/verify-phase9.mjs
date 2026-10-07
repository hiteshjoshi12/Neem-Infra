import { getBlogPosts } from '../src/services/blogService.js';
import { 
  generateSeoImageFilename, 
  validateAltText, 
  validateFeaturedImage, 
  getSocialImageUrl 
} from '../src/lib/seo/imageSeoHelper.js';
import { buildArticleMetadata } from '../src/lib/seo/metadataHelper.js';

async function runPhase9Verification() {
  console.log('\n=============================================================');
  console.log('📸 SAUDAGAR PROPERTIES — PHASE 9 IMAGE SEO & DISCOVER AUDIT');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Fetch all published articles
  const posts = await getBlogPosts({ status: 'published' });

  // ---------------------------------------------------------------------------
  // Test Suite 1: Featured Image Presence & Discover Readiness
  // ---------------------------------------------------------------------------
  console.log('Test Suite 1: Featured Images Presence & Discover Readiness');
  assert(posts.length >= 6, `Found ${posts.length} published articles for image validation`);

  const imageUrls = new Set();
  posts.forEach(post => {
    const validation = validateFeaturedImage(post);
    assert(validation.isValid, `Article '${post.slug}' featured image is valid`);
    assert(validation.isDiscoverReady, `Article '${post.slug}' is Google Discover ready (width >= 1200px)`);
    assert(validation.width >= 1200, `Article '${post.slug}' width (${validation.width}px) >= 1200px`);
    assert(post.featuredImage && (post.featuredImage.startsWith('https://') || post.featuredImage.startsWith('/')), `Article '${post.slug}' image is crawlable`);
    
    // Check no duplicate image URLs across articles
    assert(!imageUrls.has(post.featuredImage), `Article '${post.slug}' has a distinct image (no stock duplication)`);
    imageUrls.add(post.featuredImage);
  });

  // ---------------------------------------------------------------------------
  // Test Suite 2: Image Accessibility & Alt Text Quality (No Keyword Stuffing)
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 2: Image Accessibility & Anti-Spam Alt Validation');
  posts.forEach(post => {
    const altCheck = validateAltText(post.featuredImageAlt);
    assert(altCheck.isValid, `Article '${post.slug}' has high-quality accessible alt: "${post.featuredImageAlt.slice(0, 45)}..."`);
    assert(!post.featuredImageAlt.toLowerCase().includes('click here'), `Alt text does not contain placeholder words`);
  });

  // Test validator rejecting spam
  const spamCheck = validateAltText('Gurugram property gurugram gurugram best property buy buy buy');
  assert(!spamCheck.isValid, 'Validator catches keyword-stuffed repetitive alt text');
  
  const emptyCheck = validateAltText('');
  assert(!emptyCheck.isValid, 'Validator catches empty alt text');

  const genericCheck = validateAltText('image');
  assert(!genericCheck.isValid, 'Validator catches generic placeholder "image"');

  // ---------------------------------------------------------------------------
  // Test Suite 3: Image Filename Generator (Camera filename to SEO slug)
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 3: SEO Image Filename Transformation');
  const generated1 = generateSeoImageFilename({
    title: 'DLF Phase 5 Luxury Apartments',
    locality: 'Gurugram',
    propertyType: 'Penthouse',
    originalFilename: 'IMG_83929.JPG',
    extension: 'webp'
  });
  assert(
    generated1 === 'dlf-phase-5-luxury-apartments-gurugram.webp',
    `Generated SEO filename replaces camera junk: ${generated1}`
  );

  const generated2 = generateSeoImageFilename({
    title: 'Golf Course Road Ultra Luxury Penthouse',
    locality: 'DLF Phase 5',
    originalFilename: 'DSC_00412.png',
    extension: 'webp'
  });
  assert(
    generated2 === 'golf-course-road-ultra-luxury-penthouse-dlf-phase-5.webp',
    `Generated SEO filename contains corridor context: ${generated2}`
  );

  // ---------------------------------------------------------------------------
  // Test Suite 4: Dedicated Social (OG) Image Resolution
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 4: Dedicated Social (OG) Image Resolution');
  posts.forEach(post => {
    const ogImg = getSocialImageUrl(post);
    assert(!!ogImg && ogImg.startsWith('http'), `Article '${post.slug}' resolves crawlable absolute OG image`);
    if (ogImg.includes('unsplash.com')) {
      assert(ogImg.includes('w=1200') && ogImg.includes('h=630'), `Unsplash OG image contains 1200x630 crop params`);
    }
  });

  // ---------------------------------------------------------------------------
  // Test Suite 5: Social Metadata & OpenGraph Article Tags
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 5: Social Metadata & OpenGraph Article Tags');
  const sampleArticle = posts[0];
  const metadata = buildArticleMetadata(sampleArticle);

  assert(metadata.openGraph.type === 'article', 'og:type is strictly "article"');
  assert(!!metadata.openGraph.title, `og:title populated: "${metadata.openGraph.title.slice(0, 40)}..."`);
  assert(!!metadata.openGraph.description, 'og:description populated');
  assert(metadata.openGraph.url.startsWith('https://'), 'og:url is absolute production canonical URL');
  assert(Array.isArray(metadata.openGraph.images) && metadata.openGraph.images.length > 0, 'og:image array exists');
  assert(metadata.openGraph.images[0].width === 1200, 'og:image width is 1200');
  assert(metadata.openGraph.images[0].height === 630, 'og:image height is 630');
  assert(!!metadata.openGraph.publishedTime, 'article:published_time is populated');
  assert(Array.isArray(metadata.openGraph.authors) && metadata.openGraph.authors[0].includes('/blog/author/'), 'article:author contains canonical author URL');
  assert(!!metadata.openGraph.section, `article:section populated (${metadata.openGraph.section})`);
  assert(Array.isArray(metadata.openGraph.tags) && metadata.openGraph.tags.length > 0, 'article:tag array populated');
  assert(metadata.twitter.card === 'summary_large_image', 'twitter:card is "summary_large_image"');
  assert(metadata.robots['max-image-preview'] === 'large', 'Discover large preview directive enabled at root');
  assert(metadata.robots.googleBot['max-image-preview'] === 'large', 'Discover large preview directive enabled for GoogleBot');

  // ---------------------------------------------------------------------------
  // Test Suite 6: Structured Image Metadata & Credits
  // ---------------------------------------------------------------------------
  console.log('\nTest Suite 6: Structured Image Metadata & Credits');
  posts.forEach(post => {
    assert(!!post.featuredImageCaption, `Article '${post.slug}' has editorial caption`);
    assert(!!post.featuredImageCredit, `Article '${post.slug}' has photographer/team credit (${post.featuredImageCredit})`);
    assert(!!post.featuredImageSource, `Article '${post.slug}' has verified archive source (${post.featuredImageSource})`);
  });

  console.log('\n=============================================================');
  console.log(`📊 PHASE 9 AUDIT SUMMARY:`);
  console.log(`✅ Passed:  ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase9Verification().catch(err => {
  console.error('Audit crashed with error:', err);
  process.exit(1);
});
