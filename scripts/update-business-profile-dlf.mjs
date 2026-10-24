import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const m = await connectDB();
  const db = m.connection.db;

  const result = await db.collection('businessprofiles').updateOne(
    { singletonKey: 'primary_business_profile' },
    {
      $set: {
        isDlfAuthorized: true,
        dlfAuthorizationText: 'DLF Authorized & Verified',
        primaryPhone: '+91 97185 11207',
        secondaryPhone: '+91 98112 21207',
        whatsappNumber: '+91 97185 11207',
        primaryEmail: 'Saudagar.Properties@Yahoo.In',
        foundingYear: 1999,
        address: {
          streetAddress: '38, Akashneem Marg, DLF Phase 2',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122002',
          addressCountry: 'IN',
        },
      },
    },
    { upsert: true }
  );

  console.log('BusinessProfile updated in MongoDB:', result);

  const bp = await db.collection('businessprofiles').findOne({ singletonKey: 'primary_business_profile' });
  console.log('Verified businessprofile in DB:');
  console.log('- isDlfAuthorized:', bp.isDlfAuthorized);
  console.log('- dlfAuthorizationText:', bp.dlfAuthorizationText);
  console.log('- primaryPhone:', bp.primaryPhone);
  console.log('- secondaryPhone:', bp.secondaryPhone);
  console.log('- primaryEmail:', bp.primaryEmail);
  console.log('- address:', bp.address);

  process.exit(0);
}

main().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
