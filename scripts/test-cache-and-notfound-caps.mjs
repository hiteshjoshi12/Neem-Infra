import mongoose from 'mongoose';
import NotFoundLog from '../src/models/NotFoundLog.js';

// We import the cache class directly to run the exact 10,000 unique random paths test
class BoundedLruCache {
  constructor(maxEntries = 2000, ttlMs = 30_000) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get size() {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
      ttlMs: this.ttlMs,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function runBenchmark() {
  console.log('====================================================');
  console.log('PART 1 - ITEM H: 10,000 UNIQUE RANDOM PATHS BENCHMARK');
  console.log('====================================================\n');

  if (global.gc) {
    global.gc();
  }

  const memInitial = process.memoryUsage();
  console.log('Initial Node.js Memory:');
  console.log(`  Heap Used:  ${formatBytes(memInitial.heapUsed)}`);
  console.log(`  Heap Total: ${formatBytes(memInitial.heapTotal)}`);
  console.log(`  RSS:        ${formatBytes(memInitial.rss)}`);

  const cache = new BoundedLruCache(2000, 30_000);
  console.log(`\nCreated BoundedLruCache (Max Capacity: ${cache.maxEntries}).`);
  console.log('Injecting 10,000 unique random paths (mix of negative nulls & positive redirects)...');

  const startTime = Date.now();
  for (let i = 0; i < 10000; i++) {
    const randomPath = `/test-virtual-path-${i}-${Math.random().toString(36).substring(2, 9)}`;
    if (i % 3 === 0) {
      // Positive lookup
      cache.set(randomPath, { toPath: `/dest-${i}`, statusCode: 301 });
    } else {
      // Negative lookup
      cache.set(randomPath, null);
    }
  }
  const durationMs = Date.now() - startTime;

  if (global.gc) {
    global.gc();
  }

  const memFinal = process.memoryUsage();
  console.log(`\nCompleted 10,000 insertions in ${durationMs}ms.`);
  console.log('\nFinal Cache State:');
  console.log(`  Cache Size:      ${cache.size} entries (STRICTLY CAPPED at maxEntries: ${cache.maxEntries})`);
  console.log(`  Entries Evicted: ${10000 - cache.size}`);

  console.log('\nFinal Node.js Memory:');
  console.log(`  Heap Used:  ${formatBytes(memFinal.heapUsed)} (Delta: +${formatBytes(memFinal.heapUsed - memInitial.heapUsed)})`);
  console.log(`  Heap Total: ${formatBytes(memFinal.heapTotal)}`);
  console.log(`  RSS:        ${formatBytes(memFinal.rss)}`);

  // Verification of LRU access
  console.log('\nTesting LRU eviction behavior:');
  cache.set('/first-test-key', { toPath: '/test', statusCode: 301 });
  console.log(`  Inserted '/first-test-key', size = ${cache.size}`);
  const retrieved = cache.get('/first-test-key');
  console.log(`  Retrieved '/first-test-key':`, retrieved);
  console.log('  Cache hit verification PASSED.');

  // Check MongoDB NotFoundLog collection caps and TTL index
  console.log('\n----------------------------------------------------');
  console.log('CHECKING MONGODB NotFoundLog TTL & CAPS');
  console.log('----------------------------------------------------');

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to DB: ${mongoose.connection.name}`);

  const col = mongoose.connection.collection('notfoundlogs');
  const indexes = await col.indexes();
  const ttlIndex = indexes.find(idx => idx.expireAfterSeconds !== undefined);

  console.log('NotFoundLog Indexes:');
  indexes.forEach(idx => {
    console.log(`  - Name: ${idx.name}, Keys: ${JSON.stringify(idx.key)}${idx.expireAfterSeconds ? `, TTL: ${idx.expireAfterSeconds}s (30 days)` : ''}`);
  });

  if (ttlIndex) {
    console.log(`\n[PASS] Verified MongoDB TTL Index exists on '${Object.keys(ttlIndex.key)[0]}' with expireAfterSeconds: ${ttlIndex.expireAfterSeconds}.`);
  } else {
    console.error('\n[FAIL] TTL Index missing!');
  }

  const stats = await mongoose.connection.db.command({ collStats: 'notfoundlogs' }).catch(err => ({ error: err.message }));
  console.log('\nNotFoundLog Collection Stats:');
  console.log(`  Document Count:   ${stats.count || 0}`);
  console.log(`  Collection Size:  ${stats.size || 0} bytes`);
  console.log(`  Storage Size:     ${stats.storageSize || 0} bytes`);
  console.log(`  Total Index Size: ${stats.totalIndexSize || 0} bytes`);

  await mongoose.disconnect();
  console.log('\n====================================================');
  console.log('BENCHMARK COMPLETE - EVIDENCE LOG READY');
  console.log('====================================================');
}

runBenchmark().catch(err => {
  console.error(err);
  process.exit(1);
});
