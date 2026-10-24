import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const m = await connectDB();
  const db = m.connection.db;

  console.log('--- PURGING SECTOR 25 FROM MONGODB ---');

  // 1. Update seosettings
  const seoDocs = await db.collection('seosettings').find({}).toArray();
  for (const doc of seoDocs) {
    const updateFields = {};
    if (doc.organizationSchema) {
      const org = { ...doc.organizationSchema };
      if (org.streetAddress && org.streetAddress.includes('Sector 25')) {
        org.streetAddress = '38, Akashneem Marg, DLF Phase 2';
      }
      if (org.priceRange) {
        delete org.priceRange;
      }
      updateFields.organizationSchema = org;
    }
    if (Object.keys(updateFields).length > 0) {
      await db.collection('seosettings').updateOne(
        { _id: doc._id },
        {
          $set: updateFields,
        }
      );
      console.log(`Updated seosettings ${doc._id}`);
    }
  }

  // 2. Scan all collections to ensure zero "Sector 25" remain
  const cols = await db.listCollections().toArray();
  let remaining = 0;
  for (const c of cols) {
    const allDocs = await db.collection(c.name).find({}).toArray();
    for (const d of allDocs) {
      const s = JSON.stringify(d);
      if (s.includes('Sector 25')) {
        console.warn(`Still found Sector 25 in ${c.name} ${d._id}`);
        remaining++;
      }
    }
  }

  console.log(`Purge complete. Remaining Sector 25 in DB: ${remaining}`);
  process.exit(remaining === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
