import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;

  const collections = ['sectioncontents', 'pages', 'blogposts', 'categories', 'authors', 'businessprofiles'];
  const targets = ['25+', '11+', '20+', '25 years', '20 years', '11 years', '25 Years', '20 Years', '11 Years'];

  const results = [];

  for (const colName of collections) {
    const docs = await db.collection(colName).find({}).toArray();
    for (const doc of docs) {
      const docStr = JSON.stringify(doc);
      for (const target of targets) {
        if (docStr.includes(target)) {
          // Find which field has it
          const id = doc.slug || doc.sectionKey || doc.name || doc.title || doc._id;
          results.push({
            collection: colName,
            id: String(id),
            target,
          });
        }
      }
    }
  }

  console.log(`=== HARDCODED YEAR CLAIMS IN SEEDED DB (Total matches: ${results.length}) ===`);
  const grouped = {};
  for (const r of results) {
    const key = `${r.collection} -> ${r.id}`;
    if (!grouped[key]) grouped[key] = new Set();
    grouped[key].add(r.target);
  }

  for (const [key, targetsSet] of Object.entries(grouped)) {
    console.log(`- ${key}: [${Array.from(targetsSet).join(', ')}]`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
