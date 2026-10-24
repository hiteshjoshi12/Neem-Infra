import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const mongoose = await connectDB();
  const db = mongoose.connection.db;

  await db.collection('businessprofiles').updateOne(
    { singletonKey: 'primary_business_profile' },
    { $set: { isDlfAuthorized: false, dlfAuthorizedVerified: false } }
  );

  const bp = await db.collection('businessprofiles').findOne({ singletonKey: 'primary_business_profile' });
  console.log('MongoDB businessprofile isDlfAuthorized:', bp?.isDlfAuthorized);
  console.log('MongoDB businessprofile primaryEmail:', bp?.primaryEmail);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
