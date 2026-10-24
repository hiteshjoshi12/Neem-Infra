import mongoose from 'mongoose';

async function checkTestStrings() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const cols = await db.listCollections().toArray();
  let foundAny = false;
  for (const col of cols) {
    const docs = await db.collection(col.name).find({}).toArray();
    const s = JSON.stringify(docs);
    if (s.includes('1777')) {
      console.log('Found 1777 in collection:', col.name);
      foundAny = true;
    }
    if (s.includes('11999')) {
      console.log('Found 11999 in collection:', col.name);
      foundAny = true;
    }
    if (s.includes('test-custom-crawl-path-999')) {
      console.log('Found test-custom-crawl-path-999 in collection:', col.name);
      foundAny = true;
    }
  }
  if (!foundAny) {
    console.log('PROVEN: None of the test strings (1777, 11999, test-custom-crawl-path-999) exist in ANY collection in MongoDB database:', db.databaseName);
  }
  await mongoose.disconnect();
}

checkTestStrings();
