"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
// Clean runtime export without importing static constants
export const DEFAULT_SECTIONS = {};

const CmsContext = createContext(null);
const LEGACY_STORAGE_KEY = 'sp_cms_cache_v1';

export const CmsProvider = ({ children, initialData = {} }) => {
  const [sections, setSections] = useState(() => initialData?.sections || {});
  const [properties, setProperties] = useState(() => initialData?.properties || []);
  const [testimonials, setTestimonials] = useState(() => initialData?.testimonials || []);
  const [businessProfile, setBusinessProfile] = useState(() => initialData?.businessProfile || null);
  const [loading, setLoading] = useState(() => !initialData?.sections);

  const lastFetchRef = useRef(0);
  const isFetchingRef = useRef(false);

  // Sync state if initialData is provided/updated
  useEffect(() => {
    if (initialData?.sections && Object.keys(initialData.sections).length > 0) {
      setSections(initialData.sections);
    }
    if (initialData?.properties && initialData.properties.length > 0) {
      setProperties(initialData.properties);
    }
    if (initialData?.testimonials && initialData.testimonials.length > 0) {
      setTestimonials(initialData.testimonials);
    }
    if (initialData?.businessProfile) {
      setBusinessProfile(initialData.businessProfile);
    }
  }, [initialData]);

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
    // Prevent duplicate in-flight requests or rapid re-fetching within 10 seconds (unless forced)
    if (isFetchingRef.current) return;
    if (!force && now - lastFetchRef.current < 10000) return;

    isFetchingRef.current = true;
    try {
      const [secResult, propResult, testResult, profileResult] = await Promise.allSettled([
        api.getSections(force),
        api.getProperties({ all: false }),
        api.getTestimonials(),
        api.getBusinessProfile(),
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

      if (profileResult.status === 'fulfilled' && profileResult.value?.success && profileResult.value?.data) {
        setBusinessProfile(profileResult.value.data);
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
        businessProfile,
        loading,
        refetch: () => fetchCmsData(true),
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

export const useBusinessProfile = () => {
  const context = useContext(CmsContext);
  const profile = context?.businessProfile || {};
  const sections = context?.sections || {};
  const nav = sections?.navbar || {};
  const footer = sections?.footer || {};
  const loc = sections?.location || {};
  const widgets = sections?.floatingWidgets || {};

  const primaryPhone = profile.primaryPhone || loc.phones?.[0] || '+91 97185 11207';
  const secondaryPhone = profile.secondaryPhone || nav.phone || loc.phones?.[1] || '+91 98112 21207';
  const whatsappNumber = profile.whatsappNumber || widgets.whatsappNumber || '919718511207';
  const primaryEmail = profile.primaryEmail || loc.email || footer.email || 'Saudagar.Properties@Yahoo.In';
  const address = profile.address || loc.address || '38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002';
  const founders = Array.isArray(profile.founders) && profile.founders.length > 0
    ? profile.founders
    : [
        { name: 'Arun Sharma', role: 'Founder & Managing Director' },
        { name: 'Suneeta Chawla', role: 'Co-Founder & Director' },
      ];

  return {
    profile,
    name: profile.name || 'Saudagar Properties',
    legalName: profile.legalName || 'Saudagar Properties Pvt. Ltd',
    primaryPhone,
    secondaryPhone,
    whatsappNumber,
    primaryEmail,
    address,
    founders,
    foundingYear: profile.foundingYear || 1999,
  };
};
