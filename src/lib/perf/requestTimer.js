/**
 * Request-Level Performance Instrumentation Middleware for Next.js API Routes
 * 
 * Provides high-resolution timing for API handlers with normalized route labels,
 * database duration tracking, and structured performance logging.
 * 
 * Usage:
 *   import { withTiming } from '@/lib/perf/requestTimer';
 *   export const GET = withTiming('GET /api/properties', async (req) => { ... });
 */

const ENABLE_PERF_LOGGING = process.env.PERF_LOG !== '0';

// In-memory histogram for collecting latency samples per route
const routeHistograms = new Map();
const MAX_SAMPLES = 500;

/**
 * Record a latency sample for a normalized route label
 */
function recordSample(routeLabel, durationMs) {
  if (!routeHistograms.has(routeLabel)) {
    routeHistograms.set(routeLabel, []);
  }
  const samples = routeHistograms.get(routeLabel);
  samples.push(durationMs);
  // Circular buffer: keep only the latest MAX_SAMPLES
  if (samples.length > MAX_SAMPLES) {
    samples.shift();
  }
}

/**
 * Calculate percentile from sorted array
 */
function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, idx)];
}

/**
 * Get performance statistics for all tracked routes
 */
export function getPerformanceStats() {
  const stats = {};
  for (const [route, samples] of routeHistograms.entries()) {
    const sorted = [...samples].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    stats[route] = {
      count: sorted.length,
      avg: Math.round(sum / sorted.length),
      p50: Math.round(percentile(sorted, 50)),
      p95: Math.round(percentile(sorted, 95)),
      p99: Math.round(percentile(sorted, 99)),
      min: Math.round(sorted[0]),
      max: Math.round(sorted[sorted.length - 1]),
    };
  }
  return stats;
}

/**
 * Reset all collected performance data
 */
export function resetPerformanceStats() {
  routeHistograms.clear();
}

/**
 * Wrap a Next.js API route handler with performance instrumentation.
 * 
 * @param {string} routeLabel - Normalized route label (e.g. "GET /api/properties")
 * @param {Function} handler - The actual route handler function
 * @returns {Function} Instrumented handler
 */
export function withTiming(routeLabel, handler) {
  return async function instrumentedHandler(...args) {
    const startNs = process.hrtime.bigint();
    let status = 200;
    let error = null;

    try {
      const response = await handler(...args);
      status = response?.status || 200;
      return response;
    } catch (err) {
      error = err;
      status = err.status || 500;
      throw err;
    } finally {
      const endNs = process.hrtime.bigint();
      const durationMs = Number(endNs - startNs) / 1_000_000;

      recordSample(routeLabel, durationMs);

      if (ENABLE_PERF_LOGGING) {
        const logEntry = {
          route: routeLabel,
          status,
          durationMs: Math.round(durationMs * 100) / 100,
          timestamp: new Date().toISOString(),
        };
        if (error) {
          logEntry.error = error.message;
        }
        // Log slow requests (>500ms) at warn level for visibility
        if (durationMs > 500) {
          console.warn(`[PERF SLOW] ${routeLabel} ${status} ${logEntry.durationMs}ms`);
        }
      }
    }
  };
}
