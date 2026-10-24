import { GET, PUT } from '../src/app/api/seo/images/route.js';

async function run() {
  console.log('Testing GET /api/seo/images locally...');
  const req = {
    url: 'http://localhost:3000/api/seo/images?type=all&entity=all'
  };

  const res = await GET(req);
  const data = await res.json();

  console.log('Success:', data.success);
  console.log('Summary:', data.summary);
  console.log('First 5 records:');
  data.data.slice(0, 5).forEach((item, idx) => {
    console.log(`  ${idx + 1}. [${item.parentType}] ${item.parentTitle} | alt: "${item.altText}" | field: ${item.field}`);
  });

  // Verify filter by entity: SectionContent
  const secReq = {
    url: 'http://localhost:3000/api/seo/images?type=all&entity=SectionContent'
  };
  const secRes = await GET(secReq);
  const secData = await secRes.json();
  console.log(`\nFiltered SectionContent count: ${secData.data.length}`);

  // Verify filter by entity: Property
  const propReq = {
    url: 'http://localhost:3000/api/seo/images?type=all&entity=Property'
  };
  const propRes = await GET(propReq);
  const propData = await propRes.json();
  console.log(`Filtered Property count: ${propData.data.length}`);

  process.exit(0);
}

run().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
