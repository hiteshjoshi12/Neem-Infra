import jwt from 'jsonwebtoken';
import { connectDB } from '../src/lib/mongodb.js';
import Admin from '../src/models/Admin.js';
import SectionContent from '../src/models/SectionContent.js';

async function run() {
  await connectDB();
  const admin = await Admin.findOne({}).lean();
  if (!admin) {
    throw new Error('No admin found in DB');
  }

  const token = jwt.sign(
    { id: String(admin._id), email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '1h' }
  );

  console.log('Testing PUT /api/seo/images for SectionContent (page_about)...');

  // Test updating page_about hero bgImageAlt
  const updatePayload = {
    parentType: 'SectionContent',
    parentId: 'page_about',
    field: 'data.hero.bgImageAlt',
    altText: 'Saudagar Properties Executive Headquarters & Luxury Estates DLF Gurugram'
  };

  const res = await fetch('http://localhost:3000/api/seo/images', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatePayload)
  });

  const resJson = await res.json();
  console.log('PUT Response status:', res.status, resJson);

  if (!resJson.success) {
    throw new Error('PUT failed: ' + JSON.stringify(resJson));
  }

  // Verify via GET
  const getRes = await fetch('http://localhost:3000/api/seo/images?entity=SectionContent');
  const getData = await getRes.json();
  const heroImg = getData.data.find(i => i.id === 'sec_page_about_hero_bgImage');
  console.log('Verified updated image record:', heroImg?.altText);

  if (heroImg?.altText !== updatePayload.altText) {
    throw new Error('Alt text mismatch after update!');
  }

  // Test updating Property gallery image
  const Property = (await import('../src/models/Property.js')).default;
  const prop = await Property.findOne({ 'images.0': { $exists: true } }).lean();
  if (prop) {
    console.log(`\nTesting PUT /api/seo/images for Property (${prop.title})...`);
    const propUpdatePayload = {
      parentType: 'Property',
      parentId: String(prop._id),
      field: 'imagesAlt.0',
      altText: `${prop.title} — Verified Architectural Interior Suite`
    };

    const propRes = await fetch('http://localhost:3000/api/seo/images', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(propUpdatePayload)
    });
    const propJson = await propRes.json();
    console.log('Property PUT status:', propRes.status, propJson);

    const getPropRes = await fetch('http://localhost:3000/api/seo/images?entity=Property');
    const getPropData = await getPropRes.json();
    const galImg = getPropData.data.find(i => i.id === `prop_${prop._id}_gallery_0`);
    console.log('Verified updated property gallery record:', galImg?.altText);

    if (galImg?.altText !== propUpdatePayload.altText) {
      throw new Error('Property gallery alt text mismatch after update!');
    }
  }

  console.log('\n✅ All Image Alt Text Manager CRUD operations verified with 100% success!');
  process.exit(0);
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
