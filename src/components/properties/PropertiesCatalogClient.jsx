"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  ArrowRight,
  Phone,
  X,
  Building2,
  RefreshCw,
  ChevronDown,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';

const BASE_CORRIDORS = [
  { id: 'all', label: 'All Corridors', match: '' },
  { id: 'dlf-phase-1', label: 'DLF Phase 1', match: 'DLF Phase 1' },
  { id: 'dlf-phase-2', label: 'DLF Phase 2', match: 'DLF Phase 2' },
  { id: 'dlf-phase-3', label: 'DLF Phase 3', match: 'DLF Phase 3' },
  { id: 'dlf-phase-4', label: 'DLF Phase 4', match: 'DLF Phase 4' },
  { id: 'dlf-phase-5', label: 'DLF Phase 5', match: 'DLF Phase 5' },
  { id: 'golf-course-ext', label: 'Golf Course Road', match: 'Golf Course' },
  { id: 'sushant-lok-1', label: 'Sushant Lok 1', match: 'Sushant Lok' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Property Types' },
  { id: 'residential', label: 'Builder Floors' },
  { id: 'villa', label: 'Villas & Kothis' },
  { id: 'penthouse', label: 'Penthouses' },
  { id: 'commercial', label: 'Commercial' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Budgets', min: '', max: '' },
  { id: 'under-5', label: 'Under ₹5 Cr', min: '', max: '5' },
  { id: '5-10', label: '₹5 Cr – ₹10 Cr', min: '5', max: '10' },
  { id: '10-15', label: '₹10 Cr – ₹15 Cr', min: '10', max: '15' },
  { id: 'above-15', label: 'Above ₹15 Cr', min: '15', max: '' },
];

const BHK_CONFIGS = [
  { id: 'all', label: 'All Configurations' },
  { id: '3 BHK', label: '3 BHK' },
  { id: '4 BHK', label: '4 BHK' },
  { id: '5 BHK', label: '5+ BHK' },
];

const SORT_OPTIONS = [
  { id: 'curated', label: 'Featured First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest Listed' },
];

function parsePriceToNumber(priceStr) {
  if (!priceStr) return 0;
  const str = String(priceStr).replace(/[₹,\s]/g, '').toLowerCase();
  const crMatch = str.match(/([\d.]+)\s*cr/);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;
  const lakhMatch = str.match(/([\d.]+)\s*(?:lakh|lac)/);
  if (lakhMatch) return parseFloat(lakhMatch[1]) * 100000;
  const rawNum = parseFloat(str);
  return isNaN(rawNum) ? 0 : rawNum;
}

export default function PropertiesCatalogClient({ initialProperties = [], allProperties: initialAllProperties = [] }) {
  const searchParams = useSearchParams();
  const { sections, properties: cmsProperties } = useCms();
  const cms = sections?.page_properties || DEFAULT_SECTIONS?.page_properties || {};

  // State initialized from URL query params or defaults
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(false);
  const [activeCorridor, setActiveCorridor] = useState(searchParams?.get('location') || 'all');
  const [activeCategory, setActiveCategory] = useState(searchParams?.get('category') || 'all');
  const [activePrice, setActivePrice] = useState(searchParams?.get('price') || 'all');
  const [activeBhk, setActiveBhk] = useState(searchParams?.get('bhk') || 'all');
  const [activeSort, setActiveSort] = useState(searchParams?.get('sort') || 'curated');

  // Comprehensive pool of properties to discover locations and counts
  const allAvailableProperties = useMemo(() => {
    if (Array.isArray(cmsProperties) && cmsProperties.length > 0) {
      return cmsProperties;
    }
    if (Array.isArray(initialAllProperties) && initialAllProperties.length > 0) {
      return initialAllProperties;
    }
    if (Array.isArray(initialProperties) && initialProperties.length > 0) {
      return initialProperties;
    }
    return properties || [];
  }, [cmsProperties, initialAllProperties, initialProperties, properties]);

  // Dynamically compute corridors: standard prime DLF corridors + any custom locations in properties
  const dynamicCorridors = useMemo(() => {
    const list = [...BASE_CORRIDORS];
    const knownMatches = list.map(c => c.match.toLowerCase()).filter(Boolean);

    allAvailableProperties.forEach(p => {
      if (!p.location) return;
      const rawLoc = p.location.split(',')[0].trim();
      if (!rawLoc) return;

      const alreadyMatched = knownMatches.some(m => rawLoc.toLowerCase().includes(m) || m.includes(rawLoc.toLowerCase()));
      if (!alreadyMatched) {
        const slug = rawLoc.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (!list.some(c => c.id === slug)) {
          list.push({
            id: slug,
            label: rawLoc,
            match: rawLoc,
          });
        }
      }
    });

    return list;
  }, [allAvailableProperties]);

  // Synchronize state and trigger query when searchParams changes
  const searchParamsString = searchParams?.toString() || '';
  const prevParamsRef = useRef(searchParamsString);

  // Fetch properties from backend API based on active filters
  const fetchFilteredProperties = useCallback(async (paramsOverride = {}) => {
    setLoading(true);
    const queryObj = {};
    const corrVal = paramsOverride.corridor ?? activeCorridor;
    const catVal = paramsOverride.category ?? activeCategory;
    const priceVal = paramsOverride.price ?? activePrice;
    const bhkVal = paramsOverride.bhk ?? activeBhk;
    const sortVal = paramsOverride.sort ?? activeSort;

    const activeCorridorItem = dynamicCorridors.find(c => c.id === corrVal);
    const activePriceItem = PRICE_RANGES.find(p => p.id === priceVal);

    if (catVal && catVal !== 'all') queryObj.category = catVal;
    if (activeCorridorItem?.match) {
      queryObj.location = activeCorridorItem.match;
    } else if (corrVal && corrVal !== 'all') {
      queryObj.location = corrVal.replace(/-/g, ' ');
    }
    if (bhkVal && bhkVal !== 'all') queryObj.bhk = bhkVal;
    if (activePriceItem?.min) queryObj.minPrice = activePriceItem.min;
    if (activePriceItem?.max) queryObj.maxPrice = activePriceItem.max;
    if (sortVal && sortVal !== 'curated') queryObj.sort = sortVal;

    try {
      const res = await api.getProperties(queryObj);
      if (res?.success && Array.isArray(res?.data)) {
        setProperties(res.data);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.warn('Filtering with in-memory dataset:', err?.message);
      let fallback = [...allAvailableProperties];

      if (queryObj.location) {
        fallback = fallback.filter(p => p.location?.toLowerCase().includes(queryObj.location.toLowerCase()));
      }
      if (queryObj.category) {
        fallback = fallback.filter(p => p.category?.toLowerCase() === queryObj.category.toLowerCase());
      }
      if (bhkVal && bhkVal !== 'all') {
        fallback = fallback.filter(p => p.specs?.toLowerCase().includes(bhkVal.toLowerCase()));
      }
      if (activePriceItem?.min || activePriceItem?.max) {
        const minNum = activePriceItem.min ? parseFloat(activePriceItem.min) * 10000000 : 0;
        const maxNum = activePriceItem.max ? parseFloat(activePriceItem.max) * 10000000 : Infinity;
        fallback = fallback.filter(p => {
          const val = parsePriceToNumber(p.price);
          return val >= minNum && val <= maxNum;
        });
      }
      if (sortVal === 'price_asc') {
        fallback.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
      } else if (sortVal === 'price_desc') {
        fallback.sort((a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price));
      } else if (sortVal === 'newest') {
        fallback.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
      setProperties(fallback);
    } finally {
      setLoading(false);
    }
  }, [activeCorridor, activeCategory, activePrice, activeBhk, activeSort, initialProperties]);

  useEffect(() => {
    if (prevParamsRef.current !== searchParamsString) {
      prevParamsRef.current = searchParamsString;

      const pLoc = searchParams?.get('location') || 'all';
      const pCat = searchParams?.get('category') || 'all';
      const pPrice = searchParams?.get('price') || 'all';
      const pBhk = searchParams?.get('bhk') || 'all';
      const pSort = searchParams?.get('sort') || 'curated';
      const pSearch = searchParams?.get('search') || '';

      setActiveCorridor(pLoc);
      setActiveCategory(pCat);
      setActivePrice(pPrice);
      setActiveBhk(pBhk);
      setActiveSort(pSort);

      fetchFilteredProperties({
        corridor: pLoc,
        category: pCat,
        price: pPrice,
        bhk: pBhk,
        sort: pSort,
      });
    }
  }, [searchParamsString, searchParams, fetchFilteredProperties]);

  // Sync state to URL search params
  const updateUrlParams = useCallback((newParams) => {
    const current = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === 'all' || v === 'curated' || v === '') {
        current.delete(k);
      } else {
        current.set(k, v);
      }
    });
    const qs = current.toString();
    const newPath = qs ? `/properties?${qs}` : '/properties';
    window.history.replaceState(null, '', newPath);
  }, [searchParams]);

  const handleCorridorSelect = (corridorId) => {
    setActiveCorridor(corridorId);
    updateUrlParams({ location: corridorId });
    fetchFilteredProperties({ corridor: corridorId });
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    updateUrlParams({ category: categoryId });
    fetchFilteredProperties({ category: categoryId });
  };

  const handlePriceSelect = (priceId) => {
    setActivePrice(priceId);
    updateUrlParams({ price: priceId });
    fetchFilteredProperties({ price: priceId });
  };

  const handleBhkSelect = (bhkId) => {
    setActiveBhk(bhkId);
    updateUrlParams({ bhk: bhkId });
    fetchFilteredProperties({ bhk: bhkId });
  };

  const handleSortChange = (sortId) => {
    setActiveSort(sortId);
    updateUrlParams({ sort: sortId });
    fetchFilteredProperties({ sort: sortId });
  };

  const handleResetFilters = () => {
    setActiveCorridor('all');
    setActiveCategory('all');
    setActivePrice('all');
    setActiveBhk('all');
    setActiveSort('curated');
    updateUrlParams({
      location: 'all',
      category: 'all',
      price: 'all',
      bhk: 'all',
      sort: 'curated'
    });
    fetchFilteredProperties({
      corridor: 'all',
      category: 'all',
      price: 'all',
      bhk: 'all',
      sort: 'curated'
    });
  };

  const hasActiveFilters = 
    activeCorridor !== 'all' ||
    activeCategory !== 'all' ||
    activePrice !== 'all' ||
    activeBhk !== 'all' ||
    activeSort !== 'curated';

  // Corridor counts calculated from current available dataset
  const corridorCounts = useMemo(() => {
    const map = { all: allAvailableProperties.length };
    dynamicCorridors.forEach(c => {
      if (c.id === 'all') return;
      map[c.id] = allAvailableProperties.filter(p => 
        p.location && p.location.toLowerCase().includes(c.match.toLowerCase())
      ).length;
    });
    return map;
  }, [allAvailableProperties, dynamicCorridors]);

  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy pb-20 selection:bg-brand-gold selection:text-brand-navy-deep">
      
      {/* =========================================================================
          SECTION 1: DARK — STREAMLINED, FOCUSED MASTHEAD
          Compact header with clear title, subtitle, and breadcrumbs.
      ========================================================================= */}
      <section className="relative overflow-hidden bg-brand-obsidian text-white pt-28 pb-10 sm:pt-32 sm:pb-12 border-b border-white/10">
        {/* Architectural Background Vignette - Clearly Visible */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
          <Image
            src={cms.masthead?.bgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"}
            alt="DLF Real Estate Architecture"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.85] contrast-[1.05]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-obsidian/80 via-brand-obsidian/45 to-brand-obsidian/95" />
        </div>

        {/* Golden Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.14) 0%, rgba(208, 154, 22, 0) 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-brand-gold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
              <span>Properties</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-[0.2em] mb-2.5">
                <Sparkles size={12} className="text-brand-gold" />
                <span>{cms.masthead?.badge || "Verified Portfolio • DLF Gurugram"}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                {cms.masthead?.titleMain || "Luxury Properties & "} <span className="italic font-serif text-brand-gold">{cms.masthead?.titleItalic || "Builder Floors"}</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl mt-2 leading-relaxed">
                {cms.masthead?.description || "Explore verified ready-to-move luxury builder floors, kothis, and penthouses across DLF Phase 1–5, Sushant Lok, and Golf Course Road with 100% clean title certification."}
              </p>
            </div>

            {/* Direct Available Count Badge */}
            <div className="inline-flex items-center gap-3 bg-white/[0.06] backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
              <div className="w-8 h-8 rounded-lg bg-brand-gold/20 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold">
                <Building2 size={16} />
              </div>
              <div>
                <span className="text-base font-serif font-bold text-white leading-none block">
                  {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  {cms.masthead?.statsLabel || "Active Listings"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LUXURY ARCHITECTURAL PROPERTY FILTER TOOLBAR
          Sleek, intuitive, responsive with active filter pills & instant clear
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-cream-border shadow-[0_12px_40px_rgba(23,33,61,0.06)] space-y-5">
          
          {/* Top Corridor Segmented Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-[0.2em] shrink-0">
              <SlidersHorizontal size={14} className="text-brand-gold" />
              <span>{cms.filters?.corridorLabel || "Corridor Filter"}</span>
            </div>

            {/* Corridor Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 luxury-scrollbar w-full lg:w-auto">
              {dynamicCorridors.map(corridor => {
                const count = corridorCounts[corridor.id] || 0;
                const isSelected = activeCorridor === corridor.id;
                const displayLabel = corridor.id === 'all' 
                  ? (cms.filters?.allLocationsLabel || corridor.label) 
                  : corridor.label;

                return (
                  <button
                    key={corridor.id}
                    onClick={() => handleCorridorSelect(corridor.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-brand-obsidian text-white shadow-md'
                        : 'bg-brand-ivory text-brand-slate hover:text-brand-navy hover:bg-brand-cream border border-brand-cream-border/60'
                    }`}
                  >
                    <MapPin size={12} className={isSelected ? 'text-brand-gold' : 'text-slate-400'} />
                    <span>{displayLabel}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-brand-gold font-bold' : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls Row: Custom Styled Selectors & Sort */}
          <div className="pt-4 border-t border-brand-cream-border flex flex-wrap items-center justify-between gap-3 text-xs">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
              
              {/* Asset Type Selector */}
              <div className="relative">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-slate-light mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={activeCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className={`w-full appearance-none bg-brand-ivory border text-brand-navy font-semibold rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-brand-gold cursor-pointer transition-colors ${
                      activeCategory !== 'all' ? 'border-brand-gold bg-brand-gold/5 text-brand-gold' : 'border-brand-cream-border'
                    }`}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Budget Range Selector */}
              <div className="relative">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-slate-light mb-1">
                  Price Bracket
                </label>
                <div className="relative">
                  <select
                    value={activePrice}
                    onChange={(e) => handlePriceSelect(e.target.value)}
                    className={`w-full appearance-none bg-brand-ivory border text-brand-navy font-semibold rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-brand-gold cursor-pointer transition-colors ${
                      activePrice !== 'all' ? 'border-brand-gold bg-brand-gold/5 text-brand-gold' : 'border-brand-cream-border'
                    }`}
                  >
                    {PRICE_RANGES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* BHK Configuration */}
              <div className="relative">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-slate-light mb-1">
                  Configuration
                </label>
                <div className="relative">
                  <select
                    value={activeBhk}
                    onChange={(e) => handleBhkSelect(e.target.value)}
                    className={`w-full appearance-none bg-brand-ivory border text-brand-navy font-semibold rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-brand-gold cursor-pointer transition-colors ${
                      activeBhk !== 'all' ? 'border-brand-gold bg-brand-gold/5 text-brand-gold' : 'border-brand-cream-border'
                    }`}
                  >
                    {BHK_CONFIGS.map(b => (
                      <option key={b.id} value={b.id}>{b.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Sort Order */}
              <div className="relative">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-slate-light mb-1">
                  Sort Order
                </label>
                <div className="relative">
                  <select
                    value={activeSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full appearance-none bg-brand-ivory border border-brand-cream-border text-brand-navy font-semibold rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-brand-gold cursor-pointer transition-colors"
                  >
                    {SORT_OPTIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Reset All Action */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-obsidian text-brand-gold hover:bg-brand-gold hover:text-brand-obsidian text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ml-auto mt-2 lg:mt-0 shadow-sm"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            )}

          </div>

          {/* Active Filter Chips Strip */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-brand-cream-border flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate-light mr-1">
                Active Filters:
              </span>

              {activeCorridor !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-obsidian text-white text-[11px] font-medium">
                  <span>{dynamicCorridors.find(c => c.id === activeCorridor)?.label || activeCorridor}</span>
                  <button onClick={() => handleCorridorSelect('all')} className="hover:text-brand-gold cursor-pointer">
                    <X size={11} />
                  </button>
                </span>
              )}

              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-obsidian text-white text-[11px] font-medium">
                  <span>{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
                  <button onClick={() => handleCategorySelect('all')} className="hover:text-brand-gold cursor-pointer">
                    <X size={11} />
                  </button>
                </span>
              )}

              {activePrice !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-obsidian text-white text-[11px] font-medium">
                  <span>{PRICE_RANGES.find(p => p.id === activePrice)?.label}</span>
                  <button onClick={() => handlePriceSelect('all')} className="hover:text-brand-gold cursor-pointer">
                    <X size={11} />
                  </button>
                </span>
              )}

              {activeBhk !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-obsidian text-white text-[11px] font-medium">
                  <span>{activeBhk}</span>
                  <button onClick={() => handleBhkSelect('all')} className="hover:text-brand-gold cursor-pointer">
                    <X size={11} />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-[11px] text-brand-gold hover:underline font-bold ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LIGHT — THE MAIN LISTINGS SHOWCASE (THE MAIN OBJECTIVE!)
          Immediate visual cards in a clean 3-column responsive grid.
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Results Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-navy/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-navy">
              {dynamicCorridors.find(c => c.id === activeCorridor)?.label || 'All Properties'}
            </h2>
            <span className="text-xs text-brand-slate font-medium">
              Showing {properties.length} verified listings
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
            <CheckCircle2 size={13} className="text-brand-gold" />
            <span className="hidden sm:inline">{cms.filters?.verifiedBadgeText || "100% Freehold Title Verification"}</span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw size={28} className="animate-spin text-brand-gold mx-auto" />
            <p className="text-base font-serif font-bold text-brand-navy">Updating Property Listings...</p>
            <p className="text-xs text-brand-slate">Matching real-time pricing benchmarks and micro-market classifications</p>
          </div>
        ) : properties.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-16 px-6 rounded-3xl bg-white border border-brand-navy/10 text-center space-y-4 max-w-xl mx-auto shadow-sm my-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto">
              <Building2 size={26} />
            </div>
            <h3 className="text-xl font-serif font-bold text-brand-navy">
              {cms.emptyState?.title || "No Properties Found Matching Your Criteria"}
            </h3>
            <p className="text-xs text-brand-slate leading-relaxed max-w-sm mx-auto">
              {cms.emptyState?.description || "Try adjusting your corridor, budget, or configuration filters. You can also contact our advisory desk directly for confidential off-market inventory."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-navy text-brand-ivory text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-obsidian transition-all cursor-pointer"
              >
                {cms.emptyState?.resetBtnText || "Reset All Filters"}
              </button>
              <a
                href={`https://wa.me/${cms.advisory?.whatsappNumber || '919718511207'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-obsidian text-xs font-bold uppercase tracking-wider hover:bg-brand-gold-light transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <WhatsAppIcon size={14} />
                <span>{cms.emptyState?.whatsappBtnText || "WhatsApp Advisory Desk"}</span>
              </a>
            </div>
          </div>
        ) : (
          /* =========================================================================
              CLEAN 3-COLUMN PROPERTY GRID (VISUAL, DIRECT & INTUITIVE)
          ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.map((property, idx) => (
              <PropertyListingCard 
                key={property._id || property.id || idx} 
                property={property} 
                index={idx}
              />
            ))}
          </div>
        )}

      </section>

      {/* =========================================================================
          SECTION 4: DARK — COMPACT CONFIDENTIAL OFF-MARKET ADVISORY CARD
          Short, elegant consultation banner at the bottom of the page.
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-3xl bg-brand-obsidian text-white p-6 sm:p-10 border border-white/10 overflow-hidden shadow-xl">
          {/* Subtle Golden Glow */}
          <div 
            aria-hidden="true"
            className="absolute top-0 right-0 w-[400px] h-[250px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-brand-gold/30 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <Sparkles size={11} className="text-brand-gold" />
                <span>{cms.advisory?.badge || "Private Off-Market Advisory"}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {cms.advisory?.titleMain || "Looking for Unlisted DLF Phase 1–5 "} <span className="italic font-serif text-brand-gold">{cms.advisory?.titleItalic || "Estates?"}</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {cms.advisory?.description || "Many of Gurugram’s most exclusive builder floors and corner kothis are held off-market for family privacy. Connect directly with Arun Sharma and our senior partners for confidential site visits."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${cms.advisory?.whatsappNumber || '919718511207'}?text=Hello%20Saudagar%20Properties%2C%20I%20am%20interested%20in%20confidential%20off-market%20DLF%20properties.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-obsidian font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <WhatsAppIcon size={15} />
                <span>{cms.advisory?.whatsappBtnText || "WhatsApp Advisory"}</span>
              </a>

              <a
                href={`tel:${cms.advisory?.phoneRaw || '+919811221207'}`}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneCall size={14} className="text-brand-gold" />
                <span>{cms.advisory?.phoneText || "+91 98112 21207"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/**
 * =========================================================================
 * PROPERTY LISTING CARD COMPONENT
 * Clean, visual, image-forward property card designed for easy scanning.
 * =========================================================================
 */
function PropertyListingCard({ property, index = 0 }) {
  const specsTokens = (property.specs || '')
    .split('•')
    .map(s => s.trim())
    .filter(Boolean);

  const detailUrl = property.slug 
    ? `/properties/${property.slug}` 
    : (property._id || property.id ? `/properties/${property._id || property.id}` : (property.link || '/properties'));

  const whatsappInquiryUrl = `https://wa.me/919718511207?text=${encodeURIComponent(
    `Hello Saudagar Properties, I am inquiring about "${property.title}" (${property.location}, Ask: ${property.price}). Please share the floor plan and schedule a site inspection.`
  )}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl border border-brand-navy/10 hover:border-brand-gold/60 p-4 sm:p-5 shadow-[0_10px_30px_rgba(23,33,61,0.04)] hover:shadow-[0_20px_50px_rgba(208,154,22,0.14)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Card Image */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-brand-navy/5">
          <Image
            src={property.img}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
            {property.tag ? (
              <span className="px-2.5 py-1 rounded-full bg-brand-obsidian/85 backdrop-blur-md text-brand-gold text-[9px] font-bold uppercase tracking-wider border border-white/15">
                {property.tag}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-brand-obsidian/85 backdrop-blur-md text-brand-gold text-[9px] font-bold uppercase tracking-wider border border-white/15">
                Ready to Move
              </span>
            )}
            {property.category && (
              <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-brand-navy text-[9px] font-bold uppercase tracking-wider">
                {property.category}
              </span>
            )}
          </div>

          {/* Location on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
            <div className="flex items-center gap-1 truncate mr-2">
              <MapPin size={12} className="text-brand-gold shrink-0" />
              <span className="truncate font-medium">{property.location}</span>
            </div>
            <span className="font-mono text-[9px] font-bold text-brand-gold px-1.5 py-0.5 rounded bg-black/50 border border-brand-gold/30 shrink-0">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Price Hero Callout */}
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Benchmark Ask
          </span>
          <span className="text-2xl font-serif font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
            {property.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-base sm:text-lg text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-2 line-clamp-1">
          <Link href={detailUrl}>{property.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed mb-3.5 font-sans">
          {property.desc}
        </p>

        {/* Specs Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specsTokens.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-brand-ivory border border-brand-navy/10 text-[10px] font-semibold text-brand-navy"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Strip */}
      <div className="pt-3 border-t border-brand-navy/10 flex items-center justify-between gap-2">
        <Link
          href={detailUrl}
          className="flex-1 py-2.5 px-3 rounded-xl bg-brand-navy hover:bg-brand-gold text-brand-ivory hover:text-brand-obsidian text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </Link>

        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-brand-ivory hover:bg-[#25D366] hover:text-white border border-brand-navy/10 text-brand-navy transition-all cursor-pointer"
          title="Direct WhatsApp Consultation"
        >
          <WhatsAppIcon size={16} />
        </a>

        <a
          href="tel:+919811221207"
          className="p-2.5 rounded-xl bg-brand-ivory hover:bg-brand-cream border border-brand-navy/10 text-brand-navy transition-colors cursor-pointer"
          title="Call Direct"
        >
          <Phone size={15} className="text-brand-gold" />
        </a>
      </div>
    </motion.article>
  );
}
