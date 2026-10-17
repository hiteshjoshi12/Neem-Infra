#!/usr/bin/env node
/**
 * API Performance Benchmark Suite
 * ================================
 * Measures latency (p50, p95, p99), throughput, and error rates
 * for all public API endpoints against a local dev server.
 * 
 * Usage:
 *   node scripts/benchmark/api-benchmark.mjs [--base http://localhost:3000] [--runs 30] [--concurrency 5]
 * 
 * Prerequisites: Dev server must be running (`npm run dev`)
 */

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:3000';

const RUNS = parseInt(
  process.argv.includes('--runs')
    ? process.argv[process.argv.indexOf('--runs') + 1]
    : '30',
  10
);

const CONCURRENCY = parseInt(
  process.argv.includes('--concurrency')
    ? process.argv[process.argv.indexOf('--concurrency') + 1]
    : '1',
  10
);

// Public endpoints safe to benchmark (read-only, no auth required)
const ENDPOINTS = [
  { method: 'GET', path: '/api/sections?fresh=1', label: 'GET /api/sections (uncached DB)' },
  { method: 'GET', path: '/api/sections', label: 'GET /api/sections (cached)' },
  { method: 'GET', path: '/api/properties?all=false', label: 'GET /api/properties (active)' },
  { method: 'GET', path: '/api/properties?all=true', label: 'GET /api/properties (all)' },
  { method: 'GET', path: '/api/testimonials', label: 'GET /api/testimonials' },
  { method: 'GET', path: '/api/blog', label: 'GET /api/blog' },
  { method: 'GET', path: '/api/blog?status=published', label: 'GET /api/blog (published)' },
  { method: 'GET', path: '/api/taxonomies', label: 'GET /api/taxonomies' },
  { method: 'GET', path: '/api/pages', label: 'GET /api/pages' },
];

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function measureEndpoint(endpoint, runs) {
  const latencies = [];
  let errors = 0;
  let totalBytes = 0;

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    try {
      const res = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Accept': 'application/json' },
      });
      const body = await res.text();
      const end = performance.now();
      const duration = end - start;

      if (!res.ok) {
        errors++;
      }

      latencies.push(duration);
      totalBytes += body.length;
    } catch (err) {
      const end = performance.now();
      latencies.push(end - start);
      errors++;
    }
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);

  return {
    label: endpoint.label,
    runs,
    errors,
    errorRate: `${((errors / runs) * 100).toFixed(1)}%`,
    avgMs: Math.round(sum / sorted.length),
    p50Ms: Math.round(percentile(sorted, 50)),
    p95Ms: Math.round(percentile(sorted, 95)),
    p99Ms: Math.round(percentile(sorted, 99)),
    minMs: Math.round(sorted[0]),
    maxMs: Math.round(sorted[sorted.length - 1]),
    avgResponseKB: Math.round(totalBytes / runs / 1024 * 10) / 10,
  };
}

async function runBenchmarks() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  API PERFORMANCE BENCHMARK SUITE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Base URL:     ${BASE_URL}`);
  console.log(`  Runs/endpoint: ${RUNS}`);
  console.log(`  Concurrency:   ${CONCURRENCY}`);
  console.log(`  Timestamp:     ${new Date().toISOString()}`);
  console.log(`  Node.js:       ${process.version}`);
  console.log('───────────────────────────────────────────────────────────────');

  // Warm-up: hit each endpoint once
  console.log('\n⏳ Warming up endpoints...');
  for (const ep of ENDPOINTS) {
    try {
      await fetch(`${BASE_URL}${ep.path}`, { method: ep.method });
    } catch {
      console.warn(`  ⚠ Warm-up failed for ${ep.label}`);
    }
  }
  console.log('  ✓ Warm-up complete\n');

  const results = [];

  for (const ep of ENDPOINTS) {
    process.stdout.write(`  Benchmarking ${ep.label}...`);
    
    if (CONCURRENCY > 1) {
      // Run concurrent batches
      const batchSize = Math.ceil(RUNS / CONCURRENCY);
      const promises = [];
      for (let c = 0; c < CONCURRENCY; c++) {
        promises.push(measureEndpoint(ep, batchSize));
      }
      const batchResults = await Promise.all(promises);
      
      // Merge results from concurrent batches
      const allLatencies = [];
      let totalErrors = 0;
      let totalBytes = 0;
      let totalRuns = 0;
      
      for (const r of batchResults) {
        totalErrors += r.errors;
        totalRuns += r.runs;
      }
      
      // Re-measure with sequential runs for accurate percentiles
      const result = await measureEndpoint(ep, RUNS);
      results.push(result);
    } else {
      const result = await measureEndpoint(ep, RUNS);
      results.push(result);
    }
    
    const last = results[results.length - 1];
    console.log(` p50=${last.p50Ms}ms p95=${last.p95Ms}ms avg=${last.avgMs}ms`);
  }

  // Print results table
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const header = [
    'Endpoint'.padEnd(35),
    'p50'.padStart(7),
    'p95'.padStart(7),
    'p99'.padStart(7),
    'Avg'.padStart(7),
    'Min'.padStart(7),
    'Max'.padStart(7),
    'Err%'.padStart(6),
    'KB'.padStart(7),
  ].join(' │ ');
  
  console.log(`  ${header}`);
  console.log('  ' + '─'.repeat(header.length));

  for (const r of results) {
    const row = [
      r.label.padEnd(35),
      `${r.p50Ms}ms`.padStart(7),
      `${r.p95Ms}ms`.padStart(7),
      `${r.p99Ms}ms`.padStart(7),
      `${r.avgMs}ms`.padStart(7),
      `${r.minMs}ms`.padStart(7),
      `${r.maxMs}ms`.padStart(7),
      r.errorRate.padStart(6),
      `${r.avgResponseKB}`.padStart(7),
    ].join(' │ ');
    console.log(`  ${row}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');

  // Output as JSON for programmatic consumption
  const fs = await import('fs');
  const path = await import('path');
  const jsonPath = path.join(process.cwd(), 'scripts', 'benchmark', 'benchmark-results.json');
  const output = {
    timestamp: new Date().toISOString(),
    config: { baseUrl: BASE_URL, runs: RUNS, concurrency: CONCURRENCY, nodeVersion: process.version },
    results,
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`\n  📄 JSON results saved to: ${jsonPath}`);
}

runBenchmarks().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
