/**
 * Lightweight in-memory cache helper for API endpoints.
 * Configured for real-time live database synchronization.
 * getCached returns null to ensure immediate database visibility across all UI touchpoints.
 */

const cacheStore = new Map();

export function getCached(_key, _ttlMs = 0) {
  // Always return null to guarantee immediate reflection of database updates on the UI
  return null;
}

export function setCached(_key, _data) {
  // No-op for real-time live mode
}

export function invalidateCache(_pattern = '') {
  cacheStore.clear();
}
