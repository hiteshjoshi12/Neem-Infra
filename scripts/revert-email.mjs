import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;

  const result = await db.collection('businessprofiles').updateOne(
    { singletonKey: 'primary_business_profile' },
    { $set: { primaryEmail: 'Saudagar.Properties@Yahoo.In' } }
  );
  console.log('Updated businessprofiles primaryEmail:', result.modifiedCount);

  // Check all collections for info@saudagarproperties.com
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    const docs = await db.collection(col.name).find({
      $text: { $search: 'info@saudagarproperties.com' }
    }).toArray().catch(() => []);
    if (docs.length) {
      console.log(`Found in collection ${col.name}:`, docs.length);
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
