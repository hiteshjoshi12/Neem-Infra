"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Search,
  Layers,
  ArrowRight,
  Phone,
  X,
  Compass,
  ShieldCheck,
  Building2,
  RefreshCw,
  Check,
  ChevronDown,
  LayoutGrid,
  ListFilter,
  MessageCircle,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CORRIDOR_CLASSIFICATIONS = [
  { id: 'all', label: 'All Prime Corridors', match: '' },
  { id: 'dlf-phase-1', label: 'DLF Phase 1', match: 'DLF Phase 1', desc: 'Freehold plots, private kothis & tree canopy avenues' },
  { id: 'dlf-phase-2', label: 'DLF Phase 2', match: 'DLF Phase 2', desc: 'Central Cybercity proximity, independent builder floors' },
  { id: 'dlf-phase-4', label: 'DLF Phase 4', match: 'DLF Phase 4', desc: 'Galleria Market adjacency & corner terrace floors' },
  { id: 'golf-course-ext', label: 'Golf Course Road & Ext.', match: 'Golf Course', desc: 'Sky penthouses, golf corridors & high-rise duplexes' },
  { id: 'sushant-lok-1', label: 'Sushant Lok 1', match: 'Sushant Lok', desc: 'Quiet gated residential kothis & private pool villas' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Asset Types' },
  { id: 'residential', label: 'Luxury Builder Floors' },
  { id: 'villa', label: 'Private Villas & Kothis' },
  { id: 'penthouse', label: 'Sky Penthouses' },
  { id: 'commercial', label: 'Commercial Hubs' },
  { id: 'industrial', label: 'Industrial Assets' },
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
  { id: '3 BHK', label: '3 BHK Floors' },
  { id: '4 BHK', label: '4 BHK Floors' },
  { id: '5 BHK', label: '5+ BHK / Kothis' },
];

const SORT_OPTIONS = [
  { id: 'curated', label: 'Curated Signature' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest Arrivals' },
];

export default function PropertiesCatalogClient({ initialProperties = [] }) {
  const searchParams = useSearchParams();

  // State initialized from URL query params or defaults
  const [properties, setProperties] = useState(initialProperties);
  const [loading, setLoading] = useState(false);
  const [activeCorridor, setActiveCorridor] = useState(searchParams?.get('location') || 'all');
  const [activeCategory, setActiveCategory] = useState(searchParams?.get('category') || 'all');
  const [activePrice, setActivePrice] = useState(searchParams?.get('price') || 'all');
  const [activeBhk, setActiveBhk] = useState(searchParams?.get('bhk') || 'all');
  const [activeSort, setActiveSort] = useState(searchParams?.get('sort') || 'curated');
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [viewMode, setViewMode] = useState('dossier'); // 'dossier' | 'grid' | 'chapters'

  // Custom Dropdown Menus Open State
  const [openDropdown, setOpenDropdown] = useState(null); // 'price' | 'bhk' | 'sort' | null
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch properties from backend API based on active filters
  const fetchFilteredProperties = useCallback(async (paramsOverride = {}) => {
    setLoading(true);
    const queryObj = {};
    try {
      const activeCorridorItem = CORRIDOR_CLASSIFICATIONS.find(c => c.id === (paramsOverride.corridor ?? activeCorridor));
      const activePriceItem = PRICE_RANGES.find(p => p.id === (paramsOverride.price ?? activePrice));

      const cat = paramsOverride.category ?? activeCategory;
      if (cat && cat !== 'all') queryObj.category = cat;

      const loc = activeCorridorItem?.match;
      if (loc) queryObj.location = loc;

      const q = paramsOverride.search ?? searchTerm;
      if (q && q.trim()) queryObj.search = q.trim();

      const bhkVal = paramsOverride.bhk ?? activeBhk;
      if (bhkVal && bhkVal !== 'all') queryObj.bhk = bhkVal;

      if (activePriceItem?.min) queryObj.minPrice = activePriceItem.min;
      if (activePriceItem?.max) queryObj.maxPrice = activePriceItem.max;

      const sortVal = paramsOverride.sort ?? activeSort;
      if (sortVal && sortVal !== 'curated') queryObj.sort = sortVal;

      const res = await api.getProperties(queryObj);
      if (res?.success && Array.isArray(res?.data)) {
        setProperties(res.data);
      }
    } catch (err) {
      console.warn('Error fetching filtered properties:', err);
      // In-memory fallback over initialProperties
      let fallback = initialProperties;
      if (queryObj.location) {
        fallback = fallback.filter(p => p.location?.toLowerCase().includes(queryObj.location.toLowerCase()));
      }
      if (queryObj.category) {
        fallback = fallback.filter(p => p.category?.toLowerCase() === queryObj.category.toLowerCase());
      }
      if (queryObj.search) {
        const qLower = queryObj.search.toLowerCase();
        fallback = fallback.filter(p =>
          p.title?.toLowerCase().includes(qLower) ||
          p.location?.toLowerCase().includes(qLower) ||
          p.specs?.toLowerCase().includes(qLower) ||
          p.desc?.toLowerCase().includes(qLower)
        );
      }
      setProperties(fallback);
    } finally {
      setLoading(false);
    }
  }, [activeCorridor, activeCategory, activePrice, activeBhk, activeSort, searchTerm, initialProperties]);

  // Synchronize state and trigger query when searchParams changes (e.g. navigation from hero search bar)
  const searchParamsString = searchParams?.toString();
  const prevParamsRef = useRef(searchParamsString);

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
      setSearchTerm(pSearch);

      fetchFilteredProperties({
        corridor: pLoc,
        category: pCat,
        price: pPrice,
        bhk: pBhk,
        sort: pSort,
        search: pSearch,
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

  // Handler for corridor classification buttons
  const handleCorridorSelect = (corridorId) => {
    setActiveCorridor(corridorId);
    updateUrlParams({ location: corridorId });
    fetchFilteredProperties({ corridor: corridorId });
  };

  // Handler for category filter
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    updateUrlParams({ category: categoryId });
    fetchFilteredProperties({ category: categoryId });
  };

  // Handler for price filter
  const handlePriceSelect = (priceId) => {
    setActivePrice(priceId);
    setOpenDropdown(null);
    updateUrlParams({ price: priceId });
    fetchFilteredProperties({ price: priceId });
  };

  // Handler for BHK filter
  const handleBhkSelect = (bhkId) => {
    setActiveBhk(bhkId);
    setOpenDropdown(null);
    updateUrlParams({ bhk: bhkId });
    fetchFilteredProperties({ bhk: bhkId });
  };

  // Handler for sorting
  const handleSortChange = (sortId) => {
    setActiveSort(sortId);
    setOpenDropdown(null);
    updateUrlParams({ sort: sortId });
    fetchFilteredProperties({ sort: sortId });
  };

  // Handler for search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ search: searchTerm });
    fetchFilteredProperties({ search: searchTerm });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveCorridor('all');
    setActiveCategory('all');
    setActivePrice('all');
    setActiveBhk('all');
    setActiveSort('curated');
    setSearchTerm('');
    setOpenDropdown(null);
    updateUrlParams({
      location: 'all',
      category: 'all',
      price: 'all',
      bhk: 'all',
      sort: 'curated',
      search: ''
    });
    fetchFilteredProperties({
      corridor: 'all',
      category: 'all',
      price: 'all',
      bhk: 'all',
      sort: 'curated',
      search: ''
    });
  };

  const hasActiveFilters = 
    activeCorridor !== 'all' ||
    activeCategory !== 'all' ||
    activePrice !== 'all' ||
    activeBhk !== 'all' ||
    activeSort !== 'curated' ||
    searchTerm.trim() !== '';

  // Corridor counts calculated from current dataset
  const corridorCounts = useMemo(() => {
    const map = { all: initialProperties.length };
    CORRIDOR_CLASSIFICATIONS.forEach(c => {
      if (c.id === 'all') return;
      map[c.id] = initialProperties.filter(p => 
        p.location && p.location.toLowerCase().includes(c.match.toLowerCase())
      ).length;
    });
    return map;
  }, [initialProperties]);

  // Grouped properties by corridor
  const groupedProperties = useMemo(() => {
    if (viewMode !== 'chapters') return null;
    const groups = {};
    properties.forEach(p => {
      let matchedGroup = 'Other Prime Corridors';
      for (const c of CORRIDOR_CLASSIFICATIONS) {
        if (c.match && p.location?.toLowerCase().includes(c.match.toLowerCase())) {
          matchedGroup = c.label;
          break;
        }
      }
      if (!groups[matchedGroup]) groups[matchedGroup] = [];
      groups[matchedGroup].push(p);
    });
    return groups;
  }, [properties, viewMode]);

  const activePriceLabel = PRICE_RANGES.find(p => p.id === activePrice)?.label || 'All Budgets';
  const activeBhkLabel = BHK_CONFIGS.find(b => b.id === activeBhk)?.label || 'All Configs';
  const activeSortLabel = SORT_OPTIONS.find(s => s.id === activeSort)?.label || 'Curated Signature';

  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] text-[#17213D] pb-24 selection:bg-[#D09A16] selection:text-[#0E162B]">
      
      {/* =========================================================================
          SECTION 1: DARK — ARCHITECTURAL EDITORIAL MASTHEAD (OPENING SCREEN)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0A0E17] text-white pt-32 sm:pt-36 pb-16 md:pb-20 border-b border-white/10">
        {/* Background Architectural Vignette & Parallax Depth */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80"
            alt="DLF Luxury Estate Architecture"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0A0E17]/85 to-[#0A0E17]" />
        </div>

        {/* Ambient Golden Glow Beams */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(208, 154, 22, 0.16) 0%, rgba(208, 154, 22, 0) 70%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Illuminated Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#D09A16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
              <span>Curated Portfolio</span>
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[#D09A16] text-xs font-bold uppercase tracking-[0.22em] shadow-[0_0_20px_rgba(208,154,22,0.15)]">
                <Compass size={13} className="text-[#D09A16]" />
                <span>Exclusive Real Estate Dossier • DLF Gurugram</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
                Curated Luxury Residences &amp; <span className="italic font-serif text-[#D09A16]">Estates</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl">
                Explore verified freehold builder floors, private kothis, and sky duplexes across DLF Phase 1–5, Golf Course Road, and Sushant Lok. Every asset is certified with 100% clean title and bespoke architectural specifications.
              </p>
            </div>

            {/* Quick Live Stats Pill */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#D09A16]/20 border border-[#D09A16]/40 text-[#D09A16] flex items-center justify-center font-bold">
                <Building2 size={24} />
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">
                  {properties.length}
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Verified Estates Available
                </span>
              </div>
            </div>
          </div>

          {/* 4 DARK GLASS LIVE MARKET PULSE METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 pb-8 border-y border-white/10 mb-8">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                DLF Phase 1–5 Freehold
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-white block">
                100% Clear Titles
              </span>
              <span className="text-[10px] text-[#D09A16] font-mono">Registry &amp; Encumbrance Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Golf Course Sky Estates
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-[#D09A16] block">
                ₹5.5 Cr – ₹25+ Cr
              </span>
              <span className="text-[10px] text-slate-300 font-mono">Penthouses &amp; Builder Floors</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Direct Developer Mandates
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-white block">
                Zero Discrepancy
              </span>
              <span className="text-[10px] text-[#D09A16] font-mono">Direct Price Scrutiny</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Advisory Authority
              </span>
              <span className="text-lg sm:text-xl font-serif font-bold text-white block">
                25+ <span className="text-xs text-[#D09A16]">Years</span>
              </span>
              <span className="text-[10px] text-slate-300 font-mono">Over 1,000 HNIs Advised</span>
            </div>
          </div>

          {/* MICRO-MARKET CORRIDOR QUICK SELECTOR RIBBON */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D09A16] flex items-center gap-1.5">
                <Compass size={13} />
                <span>Micro-Market Corridor Filter:</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Click any corridor to view localized availability
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 luxury-scrollbar">
              {CORRIDOR_CLASSIFICATIONS.map(corridor => {
                const count = corridorCounts[corridor.id] || 0;
                const isSelected = activeCorridor === corridor.id;

                return (
                  <button
                    key={corridor.id}
                    onClick={() => handleCorridorSelect(corridor.id)}
                    className={`group px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#D09A16] text-[#0A0E17] font-bold shadow-[0_0_18px_rgba(208,154,22,0.35)] ring-1 ring-[#D09A16]'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <MapPin size={12} className={isSelected ? 'text-[#0A0E17]' : 'text-slate-400 group-hover:text-[#D09A16]'} />
                    <span>{corridor.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-[#0A0E17] text-[#D09A16]' : 'bg-white/10 text-slate-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: LIGHT — ULTRA-PREMIUM ARCHITECTURAL FILTER COMMAND DOCK
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20" ref={dropdownRef}>
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#17213D]/10 shadow-[0_20px_50px_rgba(23,33,61,0.06)] space-y-5">
          
          {/* ROW 1: SEARCH BAR & ASSET CATEGORY PILLS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search residences, plot size, keywords (e.g. 500 Sq. Yds, Private Lift)..."
                className="w-full bg-[#F7F5EF] border border-[#17213D]/10 rounded-2xl pl-11 pr-24 py-3 text-xs font-medium text-[#17213D] placeholder-slate-400 outline-none focus:border-[#D09A16] focus:ring-1 focus:ring-[#D09A16] transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    fetchFilteredProperties({ search: '' });
                  }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#17213D] p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-[#17213D] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#D09A16] hover:text-[#0A0E17] transition-all cursor-pointer"
              >
                Find
              </button>
            </form>

            {/* Asset Category Segmented Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 luxury-scrollbar">
              {CATEGORIES.map(cat => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#17213D] text-white shadow-xs'
                        : 'bg-[#F7F5EF] text-[#566078] hover:text-[#17213D] hover:bg-[#EFEBE1]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="categoryFilterPill"
                        className="absolute inset-0 bg-[#17213D] rounded-xl -z-10"
                      />
                    )}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ROW 2: CUSTOM LUXURY FILTER SELECTORS & VIEW SWITCHER */}
          <div className="pt-4 border-t border-[#17213D]/10 flex flex-wrap items-center justify-between gap-4">
            
            {/* Popover Filter Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* 1. Custom Budget Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                    activePrice !== 'all'
                      ? 'bg-[#17213D] text-white border-[#17213D]'
                      : 'bg-[#F7F5EF] text-[#17213D] border-[#17213D]/10 hover:border-[#D09A16]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">Budget:</span>
                  <span>{activePriceLabel}</span>
                  <ChevronDown size={14} className={`transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'price' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#17213D]/10 p-2 z-50 space-y-1"
                    >
                      {PRICE_RANGES.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handlePriceSelect(p.id)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            activePrice === p.id
                              ? 'bg-[#17213D] text-[#D09A16] font-bold'
                              : 'text-[#17213D] hover:bg-[#F7F5EF]'
                          }`}
                        >
                          <span>{p.label}</span>
                          {activePrice === p.id && <Check size={14} className="text-[#D09A16]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Custom Configuration Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'bhk' ? null : 'bhk')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                    activeBhk !== 'all'
                      ? 'bg-[#17213D] text-white border-[#17213D]'
                      : 'bg-[#F7F5EF] text-[#17213D] border-[#17213D]/10 hover:border-[#D09A16]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">Config:</span>
                  <span>{activeBhkLabel}</span>
                  <ChevronDown size={14} className={`transition-transform ${openDropdown === 'bhk' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'bhk' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#17213D]/10 p-2 z-50 space-y-1"
                    >
                      {BHK_CONFIGS.map(b => (
                        <button
                          key={b.id}
                          onClick={() => handleBhkSelect(b.id)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            activeBhk === b.id
                              ? 'bg-[#17213D] text-[#D09A16] font-bold'
                              : 'text-[#17213D] hover:bg-[#F7F5EF]'
                          }`}
                        >
                          <span>{b.label}</span>
                          {activeBhk === b.id && <Check size={14} className="text-[#D09A16]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Custom Sort Order Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                    activeSort !== 'curated'
                      ? 'bg-[#17213D] text-white border-[#17213D]'
                      : 'bg-[#F7F5EF] text-[#17213D] border-[#17213D]/10 hover:border-[#D09A16]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">Sort:</span>
                  <span>{activeSortLabel}</span>
                  <ChevronDown size={14} className={`transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'sort' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#17213D]/10 p-2 z-50 space-y-1"
                    >
                      {SORT_OPTIONS.map(s => (
                        <button
                          key={s.id}
                          onClick={() => handleSortChange(s.id)}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            activeSort === s.id
                              ? 'bg-[#17213D] text-[#D09A16] font-bold'
                              : 'text-[#17213D] hover:bg-[#F7F5EF]'
                          }`}
                        >
                          <span>{s.label}</span>
                          {activeSort === s.id && <Check size={14} className="text-[#D09A16]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Layout View Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-[#F7F5EF] p-1 rounded-2xl border border-[#17213D]/10">
              <button
                type="button"
                onClick={() => setViewMode('dossier')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'dossier'
                    ? 'bg-[#17213D] text-white shadow-xs'
                    : 'text-[#566078] hover:text-[#17213D]'
                }`}
                title="Expansive Architectural Dossier View"
              >
                <ListFilter size={13} className={viewMode === 'dossier' ? 'text-[#D09A16]' : ''} />
                <span className="hidden sm:inline">Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#17213D] text-white shadow-xs'
                    : 'text-[#566078] hover:text-[#17213D]'
                }`}
                title="3D Spatial Gallery Grid View"
              >
                <LayoutGrid size={13} className={viewMode === 'grid' ? 'text-[#D09A16]' : ''} />
                <span className="hidden sm:inline">Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('chapters')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'chapters'
                    ? 'bg-[#17213D] text-white shadow-xs'
                    : 'text-[#566078] hover:text-[#17213D]'
                }`}
                title="Group by Corridor Chapters"
              >
                <Layers size={13} className={viewMode === 'chapters' ? 'text-[#D09A16]' : ''} />
                <span className="hidden sm:inline">Chapters</span>
              </button>
            </div>

          </div>

          {/* ROW 3: ACTIVE FILTERS SUMMARY & FAST RESET */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-[#17213D]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D09A16]">
                  Active Filters:
                </span>

                {activeCorridor !== 'all' && (
                  <span className="px-3 py-1 rounded-full bg-[#17213D] text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span>Corridor: {CORRIDOR_CLASSIFICATIONS.find(c => c.id === activeCorridor)?.label}</span>
                    <button onClick={() => handleCorridorSelect('all')} className="hover:text-[#D09A16] cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}

                {activeCategory !== 'all' && (
                  <span className="px-3 py-1 rounded-full bg-[#17213D] text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span>Asset: {CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
                    <button onClick={() => handleCategorySelect('all')} className="hover:text-[#D09A16] cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}

                {activePrice !== 'all' && (
                  <span className="px-3 py-1 rounded-full bg-[#17213D] text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span>Budget: {activePriceLabel}</span>
                    <button onClick={() => handlePriceSelect('all')} className="hover:text-[#D09A16] cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}

                {activeBhk !== 'all' && (
                  <span className="px-3 py-1 rounded-full bg-[#17213D] text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span>Config: {activeBhkLabel}</span>
                    <button onClick={() => handleBhkSelect('all')} className="hover:text-[#D09A16] cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}

                {searchTerm.trim() !== '' && (
                  <span className="px-3 py-1 rounded-full bg-[#17213D] text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span>Keyword: &ldquo;{searchTerm}&rdquo;</span>
                    <button onClick={() => { setSearchTerm(''); fetchFilteredProperties({ search: '' }); }} className="hover:text-[#D09A16] cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#D09A16] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: LIGHT — PROPERTY LISTINGS SHOWCASE
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Results Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#17213D]/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-1">
              Live Verified Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D]">
              {CORRIDOR_CLASSIFICATIONS.find(c => c.id === activeCorridor)?.label || 'All Residences'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#566078] font-semibold">
              Showing <strong className="text-[#17213D]">{properties.length}</strong> Verified Estates
            </span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <RefreshCw size={32} className="animate-spin text-[#D09A16] mx-auto" />
            <p className="text-lg font-serif font-bold text-[#17213D]">Loading Curated Residences...</p>
            <p className="text-xs text-[#566078]">Filtering real-time ownership titles and micro-market classifications</p>
          </div>
        ) : properties.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-20 px-6 rounded-3xl bg-white border border-[#17213D]/10 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mx-auto">
              <Building2 size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#17213D]">
              No Verified Residences Match Your Criteria
            </h3>
            <p className="text-sm text-[#566078] leading-relaxed max-w-md mx-auto">
              We couldn&apos;t find active inventory matching your selected corridor, budget, or configuration. You may reset filters or request an off-market search through our private advisory desk.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-xl bg-[#17213D] text-[#F7F5EF] text-xs font-bold uppercase tracking-wider hover:bg-[#D09A16] hover:text-[#0A0E17] transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
              <a
                href="https://wa.me/919718511207"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#D09A16] text-[#0A0E17] text-xs font-bold uppercase tracking-wider hover:bg-[#E5AC2B] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageCircle size={14} />
                <span>Request Off-Market Mandate</span>
              </a>
            </div>
          </div>
        ) : viewMode === 'chapters' && groupedProperties ? (
          /* =========================================================================
              VIEW MODE: CHAPTERS (GROUPED BY CORRIDOR)
          ========================================================================= */
          <div className="space-y-16">
            {Object.entries(groupedProperties).map(([groupTitle, groupItems]) => (
              <div key={groupTitle} className="space-y-8">
                
                {/* Corridor Chapter Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b-2 border-[#17213D]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-1">
                      Micro-Market Chapter
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D]">
                      {groupTitle}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#566078]">
                    {groupItems.length} {groupItems.length === 1 ? 'Residence' : 'Residences'} Available
                  </span>
                </div>

                {/* Chapter List */}
                <div className="space-y-8">
                  {groupItems.map(property => (
                    <ArchitecturalEstateRow key={property._id} property={property} />
                  ))}
                </div>

              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          /* =========================================================================
              VIEW MODE: 3D SPATIAL GALLERY GRID (3-COLUMNS)
          ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <ArchitecturalEstateCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          /* =========================================================================
              VIEW MODE: ARCHITECTURAL DOSSIER (EXPANSIVE WIDE ROWS)
          ========================================================================= */
          <div className="space-y-8">
            {properties.map(property => (
              <ArchitecturalEstateRow key={property._id} property={property} />
            ))}
          </div>
        )}

      </section>

      {/* =========================================================================
          SECTION 4: DARK — PRIVATE OFF-MARKET CONSULTATION DESK
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-3xl bg-[#0A0E17] text-white p-8 sm:p-12 md:p-16 border border-white/10 overflow-hidden shadow-2xl">
          {/* Ambient Gold Halo */}
          <div 
            aria-hidden="true"
            className="absolute top-0 right-0 w-[500px] h-[350px] bg-[#D09A16]/12 rounded-full blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#D09A16]/40 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D09A16]">
                <ShieldCheck size={14} className="text-[#D09A16]" />
                <span>Confidential Off-Market Desk • Gurugram</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                Seeking Unlisted DLF Phase 1–5 <span className="italic font-serif text-[#D09A16]">Estates?</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Many of Gurugram’s most exclusive builder floors, private corner kothis, and penthouse duplexes are held in private off-market discretion. Connect directly with Arun Sharma and our senior advisory partners for confidential mandates, pre-acquisition scrutiny, and bespoke site visits.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#D09A16]" />
                  <span>100% Verified Titles</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#D09A16]" />
                  <span>Strict Client Non-Disclosure</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#D09A16]" />
                  <span>Direct Ownership Pricing</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
              <a
                href="https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20am%20interested%20in%20confidential%20off-market%20DLF%20properties.%20Please%20connect%20with%20a%20senior%20advisor."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0A0E17] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Advisory Desk</span>
              </a>

              <a
                href="tel:+919811221207"
                className="px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <PhoneCall size={15} className="text-[#D09A16]" />
                <span>Direct Line (+91 98112 21207)</span>
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
 * ARCHITECTURAL ESTATE ROW COMPONENT (EXPANSIVE DOSSIER VIEW)
 * Presents real estate with expansive architectural framing, specs matrix,
 * micro-market location context, and price hero.
 * =========================================================================
 */
function ArchitecturalEstateRow({ property }) {
  const specsTokens = (property.specs || '')
    .split('•')
    .map(s => s.trim())
    .filter(Boolean);

  const detailUrl = property.slug ? `/properties/${property.slug}` : (property.link || `/properties/${property._id}`);

  const whatsappInquiryUrl = `https://wa.me/919718511207?text=${encodeURIComponent(
    `Hello Saudagar Properties, I am interested in inquiring about the verified residence: "${property.title}" (${property.location}, Ask: ${property.price}). Please share the detailed brochure, architectural floor plans, and schedule a private site inspection.`
  )}`;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group bg-white rounded-3xl border border-[#17213D]/10 hover:border-[#D09A16]/60 transition-all duration-300 overflow-hidden shadow-[0_10px_30px_rgba(23,33,61,0.04)] hover:shadow-[0_20px_50px_rgba(208,154,22,0.14)] flex flex-col lg:flex-row"
    >
      
      {/* Visual Pillar (Left: 16:10 Cinematic Frame with Badges) */}
      <div className="lg:w-[46%] xl:w-[44%] relative bg-[#0E162B] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden shrink-0">
        <Image
          src={property.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
          alt={property.title}
          fill
          sizes="(max-width: 1024px) 100vw, 44vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Subtle Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.tag && (
            <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E17]/90 backdrop-blur-md text-[#D09A16] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#D09A16]/40 shadow-sm">
              {property.tag}
            </span>
          )}
          <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#17213D] text-[10px] font-bold uppercase tracking-wider shadow-xs">
            {property.category || 'Luxury Floor'}
          </span>
        </div>

        {/* Bottom Location Pill Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            <MapPin size={12} className="text-[#D09A16]" />
            <span className="font-medium truncate max-w-[200px]">{property.location}</span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase text-slate-200 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <ShieldCheck size={12} className="text-[#D09A16]" />
            <span>Title Verified</span>
          </span>
        </div>
      </div>

      {/* Architectural Narrative Pillar (Right: Large Typography & Specs Grid) */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
        
        <div className="space-y-4">
          
          {/* Micro-Market & Verified Status Header Strip */}
          <div className="flex items-center justify-between gap-2 border-b border-[#17213D]/10 pb-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D09A16] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#D09A16]" />
              <span>Independent Title • Freehold Estate</span>
            </span>
            <span className="text-[11px] font-mono text-[#8A95A7]">
              Ref #{property._id?.slice(-6) || 'ESTATE'}
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug">
            <Link href={detailUrl}>
              {property.title}
            </Link>
          </h3>

          {/* Narrative Excerpt */}
          <p className="text-xs sm:text-sm text-[#566078] leading-relaxed font-sans line-clamp-2">
            {property.desc || 'Architect-designed luxury floor in prime Gurugram with private elevator, Italian marble flooring, and exclusive stilt parking.'}
          </p>

          {/* Specification Matrix (Pill Modules) */}
          <div className="flex flex-wrap gap-2 pt-1">
            {specsTokens.map((spec, sIdx) => (
              <span
                key={sIdx}
                className="px-3 py-1.5 rounded-xl bg-[#F7F5EF] border border-[#17213D]/10 text-xs font-semibold text-[#17213D] flex items-center gap-1.5"
              >
                <Check size={12} className="text-[#D09A16]" />
                <span>{spec}</span>
              </span>
            ))}
          </div>

        </div>

        {/* Pricing & Call to Action Bottom Strip */}
        <div className="pt-6 border-t border-[#17213D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Price Callout */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A95A7] block mb-0.5">
              Valuation Benchmark
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors">
                {property.price}
              </span>
              <span className="text-[11px] text-[#566078] font-medium">
                All-Inclusive Ask
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#F7F5EF] hover:bg-[#D09A16] hover:text-[#0A0E17] border border-[#17213D]/15 text-[#17213D] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Direct WhatsApp Consultation"
            >
              <MessageCircle size={14} className="text-[#D09A16]" />
              <span className="hidden sm:inline">WhatsApp Tour</span>
            </a>

            <a
              href="tel:+919811221207"
              className="p-2.5 rounded-xl bg-[#F7F5EF] hover:bg-[#EFEBE1] border border-[#17213D]/15 text-[#17213D] transition-colors cursor-pointer"
              title="Call Corridor Manager"
            >
              <Phone size={14} className="text-[#D09A16]" />
            </a>

            <Link
              href={detailUrl}
              className="px-5 py-2.5 rounded-xl bg-[#17213D] hover:bg-[#D09A16] text-[#F7F5EF] hover:text-[#0A0E17] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Explore</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </motion.article>
  );
}

/**
 * =========================================================================
 * ARCHITECTURAL ESTATE CARD COMPONENT (3D SPATIAL GALLERY GRID VIEW)
 * Modern 3D luxury card with hover elevation, status badges, specs & actions.
 * =========================================================================
 */
function ArchitecturalEstateCard({ property }) {
  const specsTokens = (property.specs || '')
    .split('•')
    .map(s => s.trim())
    .filter(Boolean);

  const detailUrl = property.slug ? `/properties/${property.slug}` : (property.link || `/properties/${property._id}`);

  const whatsappInquiryUrl = `https://wa.me/919718511207?text=${encodeURIComponent(
    `Hello Saudagar Properties, I am interested in inquiring about the verified residence: "${property.title}" (${property.location}, Ask: ${property.price}). Please share the detailed brochure, architectural floor plans, and schedule a private site inspection.`
  )}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-3xl border border-[#17213D]/10 hover:border-[#D09A16]/60 p-5 shadow-[0_10px_30px_rgba(23,33,61,0.04)] hover:shadow-[0_20px_50px_rgba(208,154,22,0.15)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image Frame */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 mb-5 border border-[#17213D]/5">
          <Image
            src={property.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {property.tag && (
              <span className="px-2.5 py-1 rounded-full bg-[#0A0E17]/85 backdrop-blur-md text-[#D09A16] text-[9px] font-bold uppercase tracking-wider border border-white/15">
                {property.tag}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#17213D] text-[9px] font-bold uppercase tracking-wider">
              {property.category || 'Floor'}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-[#D09A16]" />
              <span className="truncate max-w-[180px] font-medium">{property.location}</span>
            </div>
            <span className="font-mono text-[10px] text-[#D09A16]">VERIFIED</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug mb-2 line-clamp-2">
          <Link href={detailUrl}>{property.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed mb-4 font-sans">
          {property.desc}
        </p>

        {/* Specs Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {specsTokens.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] border border-[#17213D]/10 text-[11px] font-semibold text-[#17213D]"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Card Bottom Strip */}
      <div className="pt-4 border-t border-[#17213D]/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A95A7] block mb-0.5">
            Benchmark Ask
          </span>
          <span className="text-xl font-serif font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors">
            {property.price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-[#F7F5EF] hover:bg-[#D09A16] hover:text-[#0A0E17] text-[#17213D] transition-colors cursor-pointer"
            title="WhatsApp Inquiry"
          >
            <MessageCircle size={14} className="text-[#D09A16]" />
          </a>

          <Link
            href={detailUrl}
            className="px-4 py-2.5 rounded-xl bg-[#17213D] hover:bg-[#D09A16] text-[#F7F5EF] hover:text-[#0A0E17] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Dossier</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
