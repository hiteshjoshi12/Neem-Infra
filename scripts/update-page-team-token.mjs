import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const m = await connectDB();
  const db = m.connection.db;
  const doc = await db.collection('sectioncontents').findOne({ sectionKey: 'page_team' });
  const str = JSON.stringify(doc).replace('For more than 25 years', 'For more than {{yearsExperience}} years');
  const parsed = JSON.parse(str);
  delete parsed._id;
  await db.collection('sectioncontents').updateOne({ sectionKey: 'page_team' }, { $set: parsed });
  console.log('Updated page_team subtitle with token');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
