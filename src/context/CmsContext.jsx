"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { DEFAULT_SECTIONS } from '../constants/defaultSections';

export { DEFAULT_SECTIONS };

const CmsContext = createContext(null);
const LEGACY_STORAGE_KEY = 'sp_cms_cache_v1';

export const CmsProvider = ({ children }) => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [properties, setProperties] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchCmsData = useCallback(async () => {
    try {
      // Direct, non-cached fetch to ensure immediate reflection of database changes
      const [secResult, propResult, testResult] = await Promise.allSettled([
        api.getSections(true),
        api.getProperties({ all: false }),
        api.getTestimonials()
      ]);

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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCmsData();

    // Re-sync with database whenever user switches tabs or returns to this window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCmsData();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchCmsData);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchCmsData);
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
