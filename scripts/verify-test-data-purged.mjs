import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hitesh:hitesh@mom.ba5lcxw.mongodb.net/saudagar_properties';

async function checkPurgedData() {
  console.log('Connecting to database:', MONGO_URI.split('@')[1]);
  await mongoose.connect(MONGO_URI);
  console.log('Connected to Database:', mongoose.connection.name);

  // 1. Check DB collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  const searchTerms = ['Live Test', '11999', 'test-custom-crawl-path-999'];

  console.log('\n--- Checking MongoDB Collections for lingering test strings ---');
  for (const collInfo of collections) {
    const collName = collInfo.name;
    const coll = mongoose.connection.db.collection(collName);
    for (const term of searchTerms) {
      const count = await coll.countDocuments({
        $or: [
          { title: { $regex: term, $options: 'i' } },
          { name: { $regex: term, $options: 'i' } },
          { phone: { $regex: term, $options: 'i' } },
          { primaryPhone: { $regex: term, $options: 'i' } },
          { content: { $regex: term, $options: 'i' } },
          { customContent: { $regex: term, $options: 'i' } },
          { robotsTxtCustomRules: { $regex: term, $options: 'i' } }
        ]
      });
      if (count > 0) {
        console.error(`❌ FOUND ${count} matches for "${term}" in collection ${collName}!`);
      }
    }
  }
  console.log('✓ MongoDB Collections Clean: Zero lingering test data found.');

  // 2. Check Live Endpoints
  console.log('\n--- Checking Live Preview Endpoints ---');
  const endpoints = [
    'http://localhost:3000/robots.txt',
    'http://localhost:3000/llms.txt',
    'http://localhost:3000/llms-full.txt',
    'http://localhost:3000/',
    'http://localhost:3000/contact',
    'http://localhost:3000/about',
    'http://localhost:3000/properties'
  ];

  for (const url of endpoints) {
    const res = await fetch(url, { headers: { Host: 'saudagarproperties.com' } });
    const text = await res.text();
    for (const term of searchTerms) {
      const found = text.includes(term);
      if (found) {
        console.error(`❌ FOUND "${term}" in live endpoint ${url}!`);
      } else {
        console.log(`✓ Clean: "${term}" NOT present in ${url}`);
      }
    }
  }

  await mongoose.disconnect();
}

checkPurgedData().catch(console.error);
