import mongoose from 'mongoose';
import NotFoundLog from '../src/models/NotFoundLog.js';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to: ${mongoose.connection.name}`);

  const col = mongoose.connection.collection('notfoundlogs');
  let indexesBefore = [];
  try {
    indexesBefore = await col.indexes();
  } catch (err) {
    console.log('Collection might not exist yet:', err.message);
  }
  console.log('Indexes before sync:', JSON.stringify(indexesBefore, null, 2));

  console.log('Syncing indexes for NotFoundLog...');
  await NotFoundLog.syncIndexes();

  const indexesAfter = await col.indexes();
  console.log('Indexes after sync:', JSON.stringify(indexesAfter, null, 2));

  const stats = await mongoose.connection.db.command({ collStats: 'notfoundlogs' }).catch(err => ({ error: err.message }));
  console.log('Collection stats:', {
    count: stats.count || 0,
    size: stats.size || 0,
    storageSize: stats.storageSize || 0,
    totalIndexSize: stats.totalIndexSize || 0,
  });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
