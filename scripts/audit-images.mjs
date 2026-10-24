import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;

  console.log('=== AUDITING PROPERTIES IMAGES ===');
  const properties = await db.collection('properties').find({}).toArray();
  for (const p of properties) {
    console.log(`Property: "${p.title}" (slug: ${p.slug})`);
    console.log(`  img:`, p.img);
    if (p.images && p.images.length) {
      console.log(`  images (${p.images.length}):`, p.images);
    }
  }

  console.log('\n=== AUDITING TEAM IMAGES ===');
  const team = await db.collection('teams').find({}).toArray().catch(() => []);
  for (const t of team) {
    console.log(`Team member: "${t.name}" (role: ${t.role})`);
    console.log(`  image:`, t.image || t.photo || t.avatar);
  }

  console.log('\n=== AUDITING AUTHORS IMAGES ===');
  const authors = await db.collection('authors').find({}).toArray().catch(() => []);
  for (const a of authors) {
    console.log(`Author: "${a.name}"`);
    console.log(`  image:`, a.image || a.avatar);
  }

  console.log('\n=== AUDITING SECTION CONTENTS WITH WP-CONTENT OR UNVERIFIED IMAGES ===');
  const sections = await db.collection('sectioncontents').find({}).toArray();
  for (const sec of sections) {
    const str = JSON.stringify(sec.data);
    if (str.includes('wp-content') || str.includes('unsplash') || str.includes('c2.jpg') || str.includes('c1.jpg')) {
      console.log(`Section: ${sec.sectionKey}`);
      const matches = str.match(/https?:\/\/[^\s"',)]+/g) || [];
      const suspicious = matches.filter(m => m.includes('wp-content') || m.includes('unsplash') || m.includes('c2.jpg') || m.includes('c1.jpg'));
      console.log(`  Suspicious URLs:`, suspicious);
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
