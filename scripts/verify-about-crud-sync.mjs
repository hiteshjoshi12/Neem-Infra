import http from 'http';
import { connectDB } from '../src/lib/mongodb.js';
import SectionContent from '../src/models/SectionContent.js';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function run() {
  console.log('=== VERIFYING FRONTEND & BACKEND DATA SYNC + CRUD OPERATIONS ===\n');

  // 1. Verify API endpoint GET /api/pages/page_about
  console.log('1. Checking GET /api/pages/page_about ...');
  const apiRes = await fetchUrl('http://localhost:3000/api/pages/page_about');
  if (apiRes.status !== 200) {
    throw new Error(`API returned status ${apiRes.status}: ${apiRes.body}`);
  }
  const apiData = JSON.parse(apiRes.body);
  console.log(`   API success: ${apiData.success}`);
  const about = apiData.data;

  console.log(`   - Hero metrics: ${about?.hero?.stats?.length || 0}`);
  console.log(`   - Offerings items (cards): ${about?.offerings?.items?.length || 0}`);
  console.log(`   - Proposition pillars: ${about?.proposition?.pillars?.length || 0}`);
  console.log(`   - Founders: ${about?.leadership?.founders?.length || 0}`);
  console.log(`   - Team members: ${about?.leadership?.teamMembers?.length || 0}`);
  console.log(`   - Leadership impact stats: ${about?.leadership?.impactStats?.length || 0}`);
  console.log(`   - WhyChooseUs pillars: ${about?.whyChooseUs?.pillars?.length || 0}`);
  console.log(`   - WhyChooseUs comparisonMatrix rows: ${about?.whyChooseUs?.comparisonMatrix?.length || 0}`);

  // 2. Verify SSR HTML rendering on GET /about
  console.log('\n2. Checking SSR HTML on GET /about ...');
  const pageRes = await fetchUrl('http://localhost:3000/about');
  const html = pageRes.body;
  console.log(`   Response status: ${pageRes.status}`);

  const checks = [
    { name: 'Hero Main Title', found: html.includes('Saudagar Properties') },
    { name: 'Video Showcase MP4', found: html.includes('saudagar-hero.mp4') },
    { name: 'Category Card 1: Kothis / Flats', found: html.includes('Kothis / Flats') },
    { name: 'Category Card 2: Office Spaces', found: html.includes('Office Spaces') },
    {name: 'Category Card 3: Plots & Strategic Land', found: html.includes('Strategic Land') },
    { name: 'Proposition Tab: residential', found: html.includes('residential') },
    { name: 'Proposition Tab: commercial', found: html.includes('commercial') },
    { name: 'Proposition Tab: industrial', found: html.includes('industrial') },
    { name: 'Founder 1: Mr. Arun Sharma', found: html.includes('Arun Sharma') },
    { name: 'Founder 2: Mrs. Suneeta Chawla', found: html.includes('Suneeta Chawla') },
    { name: 'Lead Distinction Pillar #1: Founder-Led', found: html.includes('Founder-Led') },
    { name: 'Distinction Pillar: Tehsil Chain', found: html.includes('Tehsil') },
    { name: 'Benchmark: Volume brokers chasing', found: html.includes('Volume brokers chasing quick turnover') },
    { name: 'Benchmark: Founders personally attend', found: html.includes('Founders personally attend every transaction') },
    { name: 'Consultation CTA Phone', found: html.includes('97185') || html.includes('98112') }
  ];

  let passedAll = true;
  for (const c of checks) {
    const status = c.found ? '✓ PASS' : '✗ FAIL';
    console.log(`   [${status}] ${c.name}`);
    if (!c.found) passedAll = false;
  }

  if (!passedAll) {
    throw new Error('Some SSR checks failed!');
  }

  // 3. Test Dynamic CRUD Simulation via Database
  console.log('\n3. Testing Dynamic Card Addition & Reversion in MongoDB ...');
  await connectDB();
  const originalDoc = await SectionContent.findOne({ sectionKey: 'page_about' }).lean();
  const originalItemsCount = originalDoc.data.offerings.items.length;
  console.log(`   Original offerings count in MongoDB: ${originalItemsCount}`);

  // Add a 4th offering card to simulate Admin "+ Add Category Card"
  const modifiedData = JSON.parse(JSON.stringify(originalDoc.data));
  const testCardTitle = 'LIVE TEST CRUD CARD ' + Date.now();
  modifiedData.offerings.items.push({
    title: testCardTitle,
    tag: 'Ultra Luxury Test',
    description: 'Dynamic verification card added during administrative CRUD verification.',
    features: ['Dynamic Mapping Tested', 'Zero Hardcoded Fallback', 'CRUD Verified'],
    ctaText: 'Test Action',
    ctaLink: '/properties',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  });

  // Save to DB
  await SectionContent.updateOne({ sectionKey: 'page_about' }, { $set: { data: modifiedData } });
  console.log('   Saved modified page_about with 4th offering card to MongoDB.');

  // Fetch via API to verify persistence
  const verifyApiRes = await fetchUrl('http://localhost:3000/api/pages/page_about');
  const verifyApiData = JSON.parse(verifyApiRes.body);
  console.log(`   API Offerings count after add: ${verifyApiData.data.offerings.items.length}`);
  if (verifyApiData.data.offerings.items.length !== originalItemsCount + 1) {
    throw new Error('CRUD Addition verification failed!');
  }

  // Revert back immediately to keep clean data
  await SectionContent.updateOne({ sectionKey: 'page_about' }, { $set: { data: originalDoc.data } });
  console.log('   Reverted MongoDB page_about back to pristine 3-card structure.');

  const finalApiRes = await fetchUrl('http://localhost:3000/api/pages/page_about');
  const finalApiData = JSON.parse(finalApiRes.body);
  console.log(`   Final API Offerings count after revert: ${finalApiData.data.offerings.items.length}`);
  if (finalApiData.data.offerings.items.length !== originalItemsCount) {
    throw new Error('Reversion check failed!');
  }

  console.log('\n=== ALL DATA SYNC & CRUD CHECKS PASSED WITH 100% SUCCESS ===');
  process.exit(0);
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
