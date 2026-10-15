"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FEATURED_PROPERTIES_DATA } from '../constants';

const CmsContext = createContext(null);

import { DEFAULT_SECTIONS } from '../constants/defaultSections';
export { DEFAULT_SECTIONS };

const CMS_STORAGE_KEY = 'sp_cms_cache_v1';
const CMS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const CmsProvider = ({ children }) => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [properties, setProperties] = useState(FEATURED_PROPERTIES_DATA);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateLocalSection = useCallback((sectionKey, data) => {
    setSections((prev) => {
      const updated = { ...prev, [sectionKey]: data };
      if (typeof window !== 'undefined') {
        try {
          const stored = sessionStorage.getItem(CMS_STORAGE_KEY);
          const parsed = stored ? JSON.parse(stored) : {};
          parsed.sections = { ...(parsed.sections || {}), [sectionKey]: data };
          parsed.timestamp = Date.now();
          sessionStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  const fetchCmsData = useCallback(async (force = false) => {
    if (force && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(CMS_STORAGE_KEY);
      } catch (e) {}
    } else if (!force && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(CMS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Date.now() - parsed.timestamp < CMS_CACHE_TTL) {
            if (parsed.sections) setSections((prev) => ({ ...prev, ...parsed.sections }));
            if (parsed.properties?.length) setProperties(parsed.properties);
            if (parsed.testimonials?.length) setTestimonials(parsed.testimonials);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to network fetch if storage fails
      }
    }

    try {
      const [secResult, propResult, testResult] = await Promise.allSettled([
        api.getSections(force),
        api.getProperties(),
        api.getTestimonials()
      ]);

      let newSections = null;
      let newProps = null;
      let newTests = null;

      if (secResult.status === 'fulfilled' && secResult.value?.success && secResult.value?.data) {
        newSections = secResult.value.data;
        setSections((prev) => ({
          ...prev,
          ...newSections
        }));
      }

      if (propResult.status === 'fulfilled' && propResult.value?.success && Array.isArray(propResult.value?.data) && propResult.value.data.length > 0) {
        newProps = propResult.value.data;
        setProperties(newProps);
      }

      if (testResult.status === 'fulfilled' && testResult.value?.success && Array.isArray(testResult.value?.data) && testResult.value.data.length > 0) {
        newTests = testResult.value.data;
        setTestimonials(newTests);
      }

      // Save to sessionStorage
      if (typeof window !== 'undefined' && (newSections || newProps || newTests)) {
        try {
          sessionStorage.setItem(CMS_STORAGE_KEY, JSON.stringify({
            timestamp: Date.now(),
            sections: newSections,
            properties: newProps,
            testimonials: newTests
          }));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('[CmsContext] Using cached/default data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchCmsData();
  }, [fetchCmsData]);

  return (
    <CmsContext.Provider
      value={{
        sections,
        properties,
        testimonials,
        loading,
        refetch: (force = true) => fetchCmsData(force),
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
