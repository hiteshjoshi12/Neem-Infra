"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { DEFAULT_SECTIONS } from '../constants/defaultSections';

export { DEFAULT_SECTIONS };

const CmsContext = createContext(null);
const LEGACY_STORAGE_KEY = 'sp_cms_cache_v1';

export const CmsProvider = ({ children, initialData = {} }) => {
  const [sections, setSections] = useState(() => initialData?.sections || DEFAULT_SECTIONS);
  const [properties, setProperties] = useState(() => initialData?.properties || []);
  const [testimonials, setTestimonials] = useState(() => initialData?.testimonials || []);
  const [loading, setLoading] = useState(() => !initialData?.sections);

  const lastFetchRef = useRef(0);
  const isFetchingRef = useRef(false);

  // Clear any legacy sessionStorage cache on mount to ensure no stale data persists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (e) {}
    }
  }, []);

  const updateLocalSection = useCallback((sectionKey, data) => {
    setSections((prev) => ({ ...prev, [sectionKey]: data }));
  }, []);

  const fetchCmsData = useCallback(async (force = false) => {
    // If on admin route, skip fetching public landing data to avoid unnecessary database queries
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    // Prevent duplicate in-flight requests or rapid re-fetching within 45 seconds (unless forced)
    if (isFetchingRef.current) return;
    if (!force && now - lastFetchRef.current < 45000) return;

    isFetchingRef.current = true;
    try {
      const [secResult, propResult, testResult] = await Promise.allSettled([
        api.getSections(force),
        api.getProperties({ all: false }),
        api.getTestimonials()
      ]);

      lastFetchRef.current = Date.now();

      if (secResult.status === 'fulfilled' && secResult.value?.success && secResult.value?.data) {
        setSections((prev) => ({
          ...prev,
          ...secResult.value.data
        }));
      }

      if (propResult.status === 'fulfilled' && propResult.value?.success && Array.isArray(propResult.value?.data)) {
        setProperties(propResult.value.data);
      }

      if (testResult.status === 'fulfilled' && testResult.value?.success && Array.isArray(testResult.value?.data)) {
        setTestimonials(testResult.value.data);
      }
    } catch (err) {
      console.warn('[CmsContext] Network fetch error, using current state:', err?.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Do not fetch on admin pages
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      setLoading(false);
      return;
    }

    fetchCmsData(false);

    // Re-sync with database only when user returns to this tab and at least 60s elapsed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastFetchRef.current;
        if (elapsed > 60000) {
          fetchCmsData(false);
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCmsData]);

  return (
    <CmsContext.Provider
      value={{
        sections,
        properties,
        testimonials,
        loading,
        refetch: () => fetchCmsData(),
        updateLocalSection
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
