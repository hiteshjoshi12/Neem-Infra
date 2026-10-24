import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;

  // 1. Sanitize authors collection - remove stock Unsplash portraits
  const authorsRes = await db.collection('authors').updateMany(
    { image: { $regex: 'unsplash.com' } },
    { $set: { image: '' } }
  );
  console.log('Sanitized authors stock images:', authorsRes.modifiedCount);

  // 2. Sanitize sectioncontents page_team - replace broken 404 wp-content URLs with empty string for neutral silhouette
  const pageTeam = await db.collection('sectioncontents').findOne({ sectionKey: 'page_team' });
  if (pageTeam && pageTeam.data) {
    let data = pageTeam.data;
    if (Array.isArray(data.founders)) {
      data.founders = data.founders.map(f => ({
        ...f,
        image: f.image && f.image.includes('wp-content') ? '' : f.image
      }));
    }
    if (Array.isArray(data.teamMembers)) {
      data.teamMembers = data.teamMembers.map(t => ({
        ...t,
        image: t.image && t.image.includes('wp-content') ? '' : t.image
      }));
    }
    await db.collection('sectioncontents').updateOne(
      { sectionKey: 'page_team' },
      { $set: { data } }
    );
    console.log('Sanitized page_team broken wp-content images in MongoDB');
  }

  // 3. Verify no wp-content remains in sectioncontents
  const allSections = await db.collection('sectioncontents').find({}).toArray();
  let remainingWp = 0;
  for (const s of allSections) {
    const sStr = JSON.stringify(s.data);
    if (sStr.includes('wp-content')) {
      remainingWp++;
      console.log('Warning: wp-content still in section:', s.sectionKey);
    }
  }
  console.log('Total sections with remaining wp-content:', remainingWp);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
