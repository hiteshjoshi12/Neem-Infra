/**
 * Lightweight in-memory cache helper for API endpoints.
 * 
 * Provides TTL-based caching for frequently-read, relatively-stable data
 * like CMS sections, taxonomies, and testimonials. Cache is automatically
 * invalidated when admin writes occur.
 * 
 * Cache entries are bounded: maximum 100 keys to prevent unbounded memory growth.
 * Each entry stores data + timestamp for TTL expiry.
 */

const cacheStore = new Map();
const MAX_ENTRIES = 100;
const DEFAULT_TTL_MS = 30_000; // 30 seconds

/**
 * Get cached data if it exists and hasn't expired.
 * @param {string} key - Cache key
 * @param {number} ttlMs - Time-to-live in milliseconds (default: 30s)
 * @returns {*} Cached data or null if miss/expired
 */
export function getCached(key, ttlMs = DEFAULT_TTL_MS) {
  if (!key) return null;
  const entry = cacheStore.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > ttlMs) {
    cacheStore.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * Store data in cache with timestamp.
 * Enforces bounded size by evicting oldest entries when limit exceeded.
 * @param {string} key - Cache key
 * @param {*} data - Data to cache (should be serializable)
 */
export function setCached(key, data) {
  if (!key) return;
  
  // Evict oldest entries if at capacity
  if (cacheStore.size >= MAX_ENTRIES && !cacheStore.has(key)) {
    const oldestKey = cacheStore.keys().next().value;
    cacheStore.delete(oldestKey);
  }
  
  cacheStore.set(key, { data, timestamp: Date.now() });
}

/**
 * Invalidate cache entries.
 * @param {string} [pattern] - If provided, delete entries whose key includes this pattern.
 *                             If empty/falsy, clear the entire cache.
 */
export function invalidateCache(pattern = '') {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
}

/**
 * Get cache statistics for monitoring.
 */
export function getCacheStats() {
  return {
    size: cacheStore.size,
    maxEntries: MAX_ENTRIES,
    defaultTtlMs: DEFAULT_TTL_MS,
    keys: [...cacheStore.keys()],
  };
}
