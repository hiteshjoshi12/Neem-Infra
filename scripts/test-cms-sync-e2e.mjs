import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment!');
  process.exit(1);
}

const adminToken = jwt.sign(
  {
    id: '6abe00e563e7b46a940e1e0d',
    email: 'admin@saudagarproperties.com',
    role: 'superadmin',
    name: 'Super Admin',
  },
  process.env.JWT_SECRET || 'saudagar_secret_jwt_key_2025_prod_secure_dlf_gurugram',
  { expiresIn: '2h' }
);

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${adminToken}`,
};

const results = [];

async function runTest(moduleName, fieldName, targetUrl, updateFn, verifyDbFn, restoreDbFn) {
  const timestamp = Date.now();
  const marker = `SYNCTEST-${fieldName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}-${timestamp}`;
  console.log(`\n======================================================`);
  console.log(`TESTING: [${moduleName}] -> Field: ${fieldName}`);
  console.log(`Target Marker: ${marker}`);

  const testRecord = {
    module: moduleName,
    field: fieldName,
    targetUrl,
    marker,
    writeApiOk: false,
    savedInDb: false,
    apiResponseOk: false,
    rawHtmlOk: false,
    timeToAppearMs: null,
    chainBreak: null,
    result: 'FAIL',
  };

  try {
    const startTime = Date.now();
    // 1. Send update via Admin API
    const apiRes = await updateFn(marker);
    testRecord.writeApiOk = apiRes.ok;
    console.log(`1. Admin API Call: ${apiRes.ok ? 'SUCCESS (200/201)' : `FAILED (${apiRes.status})`}`);

    // 2. Verify directly in MongoDB
    const dbValue = await verifyDbFn();
    const dbContains = typeof dbValue === 'string' ? dbValue.includes(marker) : false;
    testRecord.savedInDb = dbContains;
    console.log(`2. MongoDB Verification: ${dbContains ? 'PASS (Found in DB)' : `FAIL (Got: ${dbValue})`}`);

    if (!dbContains) {
      testRecord.chainBreak = 'Not saved to DB';
      results.push(testRecord);
      return;
    }

    // 3. Verify API response
    testRecord.apiResponseOk = apiRes.dataContainsMarker;
    console.log(`3. API Response Check: ${apiRes.dataContainsMarker ? 'PASS (Found in API payload)' : 'FAIL'}`);

    if (!apiRes.dataContainsMarker) {
      testRecord.chainBreak = 'Saved but API returns old';
      results.push(testRecord);
      return;
    }

    // 4. Verify in raw HTML of the public page
    const htmlRes = await fetch(`${BASE_URL}${targetUrl}`, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    const htmlText = await htmlRes.text();
    const htmlContains = htmlText.includes(marker);
    testRecord.rawHtmlOk = htmlContains;
    console.log(`4. Raw HTML Check at ${targetUrl}: ${htmlContains ? 'PASS (Found in HTML)' : 'FAIL (Not found in HTML)'}`);

    if (htmlContains) {
      testRecord.timeToAppearMs = Date.now() - startTime;
      testRecord.result = 'PASS';
      console.log(`>>> RESULT: PASS (Time to appear: ${testRecord.timeToAppearMs}ms)`);
    } else {
      testRecord.chainBreak = 'API correct but page shows old (cache / hardcoded / hydration mismatch)';
      console.log(`>>> RESULT: FAIL (Break: ${testRecord.chainBreak})`);
    }
  } catch (err) {
    console.error(`Error during test:`, err.message);
    testRecord.chainBreak = `Exception: ${err.message}`;
  } finally {
    // 5. Always restore original DB value
    console.log(`5. Restoring original DB value...`);
    await restoreDbFn();
    console.log(`Original value restored.`);
  }

  results.push(testRecord);
}

async function main() {
  console.log(`Connecting to MongoDB Atlas...`);
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to DB: ${mongoose.connection.name}`);

  const SectionContent = mongoose.connection.collection('sectioncontents');
  const Property = mongoose.connection.collection('properties');
  const BlogPost = mongoose.connection.collection('blogposts');
  const Testimonial = mongoose.connection.collection('testimonials');
  const Author = mongoose.connection.collection('authors');
  const SeoSettings = mongoose.connection.collection('seosettings');
  const Page = mongoose.connection.collection('pages');
  const BusinessProfile = mongoose.connection.collection('businessprofiles');
  const Redirect = mongoose.connection.collection('redirects');

  // ----------------------------------------------------
  // TEST 1: Homepage Section - TopConsultant badge
  // ----------------------------------------------------
  const origTopConsultant = await SectionContent.findOne({ sectionKey: 'topConsultant' });
  const origBadge = origTopConsultant?.data?.badge || 'Saudagar Promise';
  await runTest(
    'Homepage Section (topConsultant)',
    'badge',
    '/',
    async (marker) => {
      const updatedData = { ...origTopConsultant.data, badge: marker };
      const res = await fetch(`${BASE_URL}/api/sections/topConsultant`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: updatedData }),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.badge === marker };
    },
    async () => {
      const doc = await SectionContent.findOne({ sectionKey: 'topConsultant' });
      return doc?.data?.badge;
    },
    async () => {
      await SectionContent.updateOne(
        { sectionKey: 'topConsultant' },
        { $set: { 'data.badge': origBadge } }
      );
    }
  );

  // ----------------------------------------------------
  // TEST 2: Homepage Section - Hero subtitle
  // ----------------------------------------------------
  const origHero = await SectionContent.findOne({ sectionKey: 'hero' });
  const origHeroSub = origHero?.data?.subtitle || '';
  await runTest(
    'Homepage Section (hero)',
    'subtitle',
    '/',
    async (marker) => {
      const updatedData = { ...origHero.data, subtitle: marker };
      const res = await fetch(`${BASE_URL}/api/sections/hero`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: updatedData }),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.subtitle === marker };
    },
    async () => {
      const doc = await SectionContent.findOne({ sectionKey: 'hero' });
      return doc?.data?.subtitle;
    },
    async () => {
      await SectionContent.updateOne(
        { sectionKey: 'hero' },
        { $set: { 'data.subtitle': origHeroSub } }
      );
    }
  );

  // ----------------------------------------------------
  // TEST 3: Dedicated Page Content - About Hero badge
  // ----------------------------------------------------
  const origAbout = await SectionContent.findOne({ sectionKey: 'page_about' });
  const origAboutBadge = origAbout?.data?.hero?.badge || 'Premier Advisory';
  await runTest(
    'Dedicated Page (page_about)',
    'hero.badge',
    '/about',
    async (marker) => {
      const updatedData = {
        ...origAbout.data,
        hero: { ...(origAbout.data?.hero || {}), badge: marker },
      };
      const res = await fetch(`${BASE_URL}/api/pages/page_about`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: updatedData }),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.hero?.badge === marker };
    },
    async () => {
      const doc = await SectionContent.findOne({ sectionKey: 'page_about' });
      return doc?.data?.hero?.badge;
    },
    async () => {
      await SectionContent.updateOne(
        { sectionKey: 'page_about' },
        { $set: { 'data.hero.badge': origAboutBadge } }
      );
    }
  );

  // ----------------------------------------------------
  // TEST 4: Property Listings - Price field
  // ----------------------------------------------------
  const sampleProp = await Property.findOne({ isActive: true });
  if (sampleProp) {
    const origPrice = sampleProp.price;
    const propBody = {
      title: sampleProp.title,
      slug: sampleProp.slug,
      location: sampleProp.location,
      specs: sampleProp.specs,
      desc: sampleProp.desc,
      img: sampleProp.img,
      category: sampleProp.category,
    };
    await runTest(
      'Property Listing',
      'price',
      `/properties/${sampleProp.slug}`,
      async (marker) => {
        const res = await fetch(`${BASE_URL}/api/properties/${sampleProp._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...propBody, price: marker }),
        });
        const json = await res.json();
        return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.price === marker };
      },
      async () => {
        const doc = await Property.findOne({ _id: sampleProp._id });
        return doc?.price;
      },
      async () => {
        await Property.updateOne({ _id: sampleProp._id }, { $set: { price: origPrice } });
      }
    );
  }

  // ----------------------------------------------------
  // TEST 5: Global SEO Settings - defaultMetaTitle
  // ----------------------------------------------------
  const origSeo = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' });
  const origTitle = origSeo?.defaultMetaTitle || '';
  await runTest(
    'Global SEO Settings',
    'defaultMetaTitle',
    '/',
    async (marker) => {
      const res = await fetch(`${BASE_URL}/api/seo/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ defaultMetaTitle: marker }),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.defaultMetaTitle === marker };
    },
    async () => {
      const doc = await SeoSettings.findOne({ singletonKey: 'global_seo_settings' });
      return doc?.defaultMetaTitle;
    },
    async () => {
      await SeoSettings.updateOne(
        { singletonKey: 'global_seo_settings' },
        { $set: { defaultMetaTitle: origTitle } }
      );
    }
  );

  // ----------------------------------------------------
  // TEST 6: Page-Level SEO Settings - metaDescription
  // ----------------------------------------------------
  const aboutPageDoc = await Page.findOne({ slug: '/about' });
  if (aboutPageDoc) {
    const origDesc = aboutPageDoc.metaDescription || '';
    await runTest(
      'Page-Level SEO (About)',
      'metaDescription',
      '/about',
      async (marker) => {
        const res = await fetch(`${BASE_URL}/api/seo/pages/${aboutPageDoc._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ metaDescription: marker }),
        });
        const json = await res.json();
        return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.metaDescription === marker };
      },
      async () => {
        const doc = await Page.findOne({ _id: aboutPageDoc._id });
        return doc?.metaDescription;
      },
      async () => {
        await Page.updateOne({ _id: aboutPageDoc._id }, { $set: { metaDescription: origDesc } });
      }
    );
  }

  // ----------------------------------------------------
  // TEST 7: Business Profile - primaryPhone
  // ----------------------------------------------------
  const origProfile = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' });
  const origPhone = origProfile?.primaryPhone || '';
  await runTest(
    'Business Profile',
    'primaryPhone',
    '/',
    async (marker) => {
      const res = await fetch(`${BASE_URL}/api/business-profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ primaryPhone: marker }),
      });
      const json = await res.json();
      return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.primaryPhone === marker };
    },
    async () => {
      const doc = await BusinessProfile.findOne({ singletonKey: 'primary_business_profile' });
      return doc?.primaryPhone;
    },
    async () => {
      await BusinessProfile.updateOne(
        { singletonKey: 'primary_business_profile' },
        { $set: { primaryPhone: origPhone } }
      );
    }
  );

  // ----------------------------------------------------
  // TEST 8: Testimonials - quote
  // ----------------------------------------------------
  const sampleTestimonial = await Testimonial.findOne({ isActive: true });
  if (sampleTestimonial) {
    const origQuote = sampleTestimonial.quote;
    const { _id, createdAt, updatedAt, __v, ...testBody } = sampleTestimonial;
    await runTest(
      'Testimonial',
      'quote',
      '/',
      async (marker) => {
        const res = await fetch(`${BASE_URL}/api/testimonials/${sampleTestimonial._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...testBody, quote: marker }),
        });
        const json = await res.json();
        return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.quote === marker };
      },
      async () => {
        const doc = await Testimonial.findOne({ _id: sampleTestimonial._id });
        return doc?.quote;
      },
      async () => {
        await Testimonial.updateOne(
          { _id: sampleTestimonial._id },
          { $set: { quote: origQuote } }
        );
      }
    );
  }

  // ----------------------------------------------------
  // TEST 9: Author Profile - bio
  // ----------------------------------------------------
  const sampleAuthor = await Author.findOne({});
  if (sampleAuthor) {
    const origBio = sampleAuthor.bio;
    const { _id, createdAt, updatedAt, __v, ...authorBody } = sampleAuthor;
    await runTest(
      'Author Profile',
      'bio',
      `/blog/author/${sampleAuthor.slug}`,
      async (marker) => {
        const res = await fetch(`${BASE_URL}/api/authors/${sampleAuthor._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...authorBody, bio: marker }),
        });
        const json = await res.json();
        return { ok: res.ok, status: res.status, dataContainsMarker: json?.data?.bio === marker };
      },
      async () => {
        const doc = await Author.findOne({ _id: sampleAuthor._id });
        return doc?.bio;
      },
      async () => {
        await Author.updateOne({ _id: sampleAuthor._id }, { $set: { bio: origBio } });
      }
    );
  }

  // ----------------------------------------------------
  // TEST 10: XML Sitemap Index & Child Sitemaps Architecture
  // ----------------------------------------------------
  console.log(`\n======================================================`);
  console.log(`TESTING: [XML Sitemaps] -> Yoast Architecture & Index Isolation`);
  try {
    const sitemapIndexRes = await fetch(`${BASE_URL}/sitemap_index.xml`);
    const sitemapIndexXml = await sitemapIndexRes.text();
    const isIndex200 = sitemapIndexRes.status === 200;
    const isIndexXml = (sitemapIndexRes.headers.get('content-type') || '').includes('xml');
    const hasSitemapIndexTag = sitemapIndexXml.includes('<sitemapindex') && sitemapIndexXml.includes('</sitemapindex>');

    // Check mirror /sitemap.xml
    const sitemapMirrorRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const isMirror200 = sitemapMirrorRes.status === 200;

    // Check trailing slash rewrite
    const sitemapSlashRes = await fetch(`${BASE_URL}/sitemap_index.xml/`);
    const isSlash200 = sitemapSlashRes.status === 200;

    // Check robots.txt pointing
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    const robotsHasIndex = robotsTxt.includes('/sitemap_index.xml');

    const sitemapTestOk = isIndex200 && isIndexXml && hasSitemapIndexTag && isMirror200 && isSlash200 && robotsHasIndex;

    results.push({
      module: 'XML Sitemaps',
      field: 'Index & Isolation',
      targetUrl: '/sitemap_index.xml',
      marker: 'YOAST-SITEMAP-INDEX',
      writeApiOk: true,
      savedInDb: true,
      apiResponseOk: isIndex200 && isMirror200,
      rawHtmlOk: isIndexXml && hasSitemapIndexTag && robotsHasIndex,
      timeToAppearMs: 0,
      chainBreak: null,
      result: sitemapTestOk ? 'PASS' : 'FAIL',
    });
    console.log(`XML Sitemap Index Check: ${sitemapTestOk ? 'PASS' : 'FAIL'}`);
  } catch (sitemapErr) {
    console.error('XML Sitemap test error:', sitemapErr);
    results.push({
      module: 'XML Sitemaps',
      field: 'Index & Isolation',
      targetUrl: '/sitemap_index.xml',
      marker: 'ERROR',
      writeApiOk: false,
      savedInDb: false,
      apiResponseOk: false,
      rawHtmlOk: false,
      timeToAppearMs: null,
      chainBreak: sitemapErr.message,
      result: 'FAIL',
    });
  }
  // ----------------------------------------------------
  console.log(`\n======================================================`);
  console.log(`E2E CMS SYNC TEST SUMMARY TABLE`);
  console.log(`======================================================`);
  console.table(
    results.map((r) => ({
      Module: r.module,
      Field: r.field,
      'Target URL': r.targetUrl,
      'Write (API)': r.writeApiOk ? 'PASS' : 'FAIL',
      'Write (DB)': r.savedInDb ? 'PASS' : 'FAIL',
      'Read (API)': r.apiResponseOk ? 'PASS' : 'FAIL',
      'Render (HTML)': r.rawHtmlOk ? 'PASS' : 'FAIL',
      Result: r.result,
      'Chain Break': r.chainBreak || 'None',
    }))
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
