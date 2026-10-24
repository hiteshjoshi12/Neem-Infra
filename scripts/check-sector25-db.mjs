import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const m = await connectDB();
  const db = m.connection.db;
  const cols = await db.listCollections().toArray();
  let found = 0;
  for (const c of cols) {
    const allDocs = await db.collection(c.name).find({}).toArray();
    for (const d of allDocs) {
      const s = JSON.stringify(d);
      if (s.includes('Sector 25')) {
        console.log(`Found "Sector 25" in collection: ${c.name}, id: ${d._id}`);
        found++;
      }
    }
  }
  console.log(`Scan completed. Found ${found} occurrences of "Sector 25".`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
