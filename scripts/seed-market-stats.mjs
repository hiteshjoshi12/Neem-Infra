import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const m = await connectDB();
  const db = m.connection.db;
  await db.collection('businessprofiles').updateOne(
    { singletonKey: 'primary_business_profile' },
    { $set: { marketStats: [] } }
  );
  const bp = await db.collection('businessprofiles').findOne({ singletonKey: 'primary_business_profile' });
  console.log('Verified marketStats seeded empty:', bp.marketStats);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
