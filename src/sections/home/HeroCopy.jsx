"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Building2, Wallet, Volume2, VolumeX, Play, Pause, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';
import CustomSelect from '../../components/ui/CustomSelect';
import CinematicHeroBackground from '../../components/ui/CinematicHeroBackground';
import { useCms } from '../../context/CmsContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Editorial Luxury Real Estate Hero (HeroCopy)
 * 
 * Sizing & Placement System:
 * - Headline: Reduced 20%, responsive clamp(2.2rem, 4.2vw, 4.25rem), strictly 2 lines on desktop
 * - Content Width: Constrained to 980px max-width editorial canvas
 * - Hierarchy: Compact vertical rhythm with 24-28px gap to search bar
 * - Search Bar: Sophisticated property discovery console (74-78px height, two-tier field labels, subtle hairlines, micro-interaction on Explore button)
 * - Mobile: Clean stacked search card with compact footprint
 */
export default function HeroCopy({ initialProperties = [], initialHeroData = null }) {
  const router = useRouter();
  const { sections, properties } = useCms();
  const heroData = sections?.hero || initialHeroData || {};

  // Resolve backend featured properties with SSR support
  const cardList = useMemo(() => {
    const raw = (properties && properties.length > 0)
      ? properties
      : (initialProperties && initialProperties.length > 0)
        ? initialProperties
        : [];
    const featured = raw.filter((p) => p.isFeatured !== false);
    return featured.length > 0 ? featured : raw;
  }, [properties, initialProperties]);

  // Search filter states
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-rotation every 3 seconds for the minimal spotlight ticker
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Video State
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Clean luxury villa video URL via ImageKit CDN
  const primaryVideoUrl = heroData.videoUrl || "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/saudagar-hero.mp4";

  // Auto-rotate spotlight property every 3 seconds
  useEffect(() => {
    if (!cardList || cardList.length <= 1) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cardList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cardList, isHovered]);

  const currentProperty = cardList[currentCardIndex] || cardList[0] || {};

  // Destination URL for clicking on the spotlight property
  const propertyDetailUrl = currentProperty?.slug
    ? `/properties/${currentProperty.slug}`
    : (currentProperty?._id || currentProperty?.id
        ? `/properties/${currentProperty._id || currentProperty.id}`
        : (currentProperty?.link || '/properties'));

  const rawSpotlightImage = currentProperty?.img || (currentProperty?.images && currentProperty.images[0]) || heroData.spotlight?.image;

  const currentSpotlightImage = useMemo(() => {
    if (!rawSpotlightImage) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&h=120&q=75";
    if (typeof rawSpotlightImage === "string") {
      if (rawSpotlightImage.includes("ik.imagekit.io")) {
        const separator = rawSpotlightImage.includes("?") ? "&" : "?";
        return `${rawSpotlightImage}${separator}tr=w-96,h-96,c-maintain_ratio,f-auto`;
      }
      if (rawSpotlightImage.includes("images.unsplash.com")) {
        return rawSpotlightImage.replace(/w=\d+/, "w=120").replace(/q=\d+/, "q=75");
      }
    }
    return rawSpotlightImage;
  }, [rawSpotlightImage]);

  // Dynamically compute location options for the search console
  const dynamicLocationOptions = useMemo(() => {
    if (heroData.locationOptions && Array.isArray(heroData.locationOptions) && heroData.locationOptions.length > 0) {
      return heroData.locationOptions;
    }
    const base = [
      { value: "dlf-phase-1", label: "DLF Phase 1" },
      { value: "dlf-phase-2", label: "DLF Phase 2" },
      { value: "dlf-phase-3", label: "DLF Phase 3" },
      { value: "dlf-phase-4", label: "DLF Phase 4" },
      { value: "dlf-phase-5", label: "DLF Phase 5" },
      { value: "golf-course-ext", label: "Golf Course Ext" },
      { value: "sushant-lok-1", label: "Sushant Lok 1" }
    ];
    (rawProperties || []).forEach(p => {
      if (!p.location) return;
      const rawLoc = p.location.split(',')[0].trim();
      const val = rawLoc.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!base.some(b => b.value === val || b.label.toLowerCase() === rawLoc.toLowerCase())) {
        base.push({ value: val, label: rawLoc });
      }
    });
    return base;
  }, [heroData.locationOptions, rawProperties]);

  // Helper to build URL with query params
  const buildPropertiesSearchUrl = (searchParamsObj = {}) => {
    const params = new URLSearchParams();

    const q = searchParamsObj.searchQuery !== undefined ? searchParamsObj.searchQuery : searchQuery;
    if (q && q.trim()) {
      params.set('search', q.trim());
    }

    const loc = searchParamsObj.location !== undefined ? searchParamsObj.location : location;
    if (loc && loc !== 'all' && loc !== '') {
      let locVal = loc;
      if (loc === 'dlf-1' || loc === 'dlf-phase-1') locVal = 'dlf-phase-1';
      else if (loc === 'dlf-2' || loc === 'dlf-phase-2') locVal = 'dlf-phase-2';
      else if (loc === 'dlf-3' || loc === 'dlf-phase-3') locVal = 'dlf-phase-3';
      else if (loc === 'dlf-4' || loc === 'dlf-phase-4') locVal = 'dlf-phase-4';
      else if (loc === 'dlf-5' || loc === 'dlf-phase-5') locVal = 'dlf-phase-5';
      else if (loc === 'golf-course' || loc === 'golf-course-ext') locVal = 'golf-course-ext';
      else if (loc === 'sushant-lok' || loc === 'sushant-lok-1') locVal = 'sushant-lok-1';
      else locVal = loc;
      params.set('location', locVal);
    }

    const cat = searchParamsObj.propertyType !== undefined ? searchParamsObj.propertyType : propertyType;
    if (cat && cat !== 'all' && cat !== '') {
      let catVal = cat;
      if (cat === 'builder-floor' || cat === 'residential') catVal = 'residential';
      params.set('category', catVal);
    }

    const bud = searchParamsObj.budget !== undefined ? searchParamsObj.budget : budget;
    if (bud && bud !== 'all' && bud !== '') {
      let budVal = bud;
      if (bud === '5-to-10') budVal = '5-10';
      else if (bud === 'above-10') budVal = 'above-15';
      params.set('price', budVal);
    }

    const qs = params.toString();
    return qs ? `/properties?${qs}` : '/properties';
  };

  // Handle trending capsule click: set state and immediately navigate to properties
  const handleTagClick = (tag) => {
    let newLoc = "";
    let newType = "";
    let newBudget = "";

    if (tag.includes('DLF Phase 1')) {
      newLoc = 'dlf-phase-1';
      newType = 'residential';
    } else if (tag.includes('Sushant Lok')) {
      newLoc = 'sushant-lok-1';
      newType = 'villa';
    } else if (tag.includes('Golf Course')) {
      newLoc = 'golf-course-ext';
    } else if (tag.includes('Under 5 Cr')) {
      newBudget = 'under-5';
    }

    setSearchQuery(tag);
    if (newLoc) setLocation(newLoc);
    if (newType) setPropertyType(newType);
    if (newBudget) setBudget(newBudget);

    const targetUrl = buildPropertiesSearchUrl({
      searchQuery: tag,
      location: newLoc,
      propertyType: newType,
      budget: newBudget
    });
    router.push(targetUrl);
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetUrl = buildPropertiesSearchUrl();
    router.push(targetUrl);
  };

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
    }
    setIsMuted(nextMuted);
  };

  return (
    <section className="relative z-30 w-full min-h-screen flex flex-col justify-between overflow-visible bg-brand-obsidian text-white">

      {/* ================= FULL-BLEED PRODUCTION CINEMATIC HERO VIDEO CANVAS ================= */}
      <CinematicHeroBackground
        ref={videoRef}
        isPlaying={isPlaying}
        isMuted={isMuted}
        videoUrl={primaryVideoUrl}
        videoMobileUrl={heroData.videoMobileUrl || "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/saudagar-hero-mobile.mp4"}
        customPoster={heroData.bgImage || "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/poster.jpg?tr=f-auto,q-80"}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onMuteChange={(muted) => setIsMuted(muted)}
      />

      {/* ================= TOP SPACER FOR FLOATING NAVBAR ================= */}
      <div className="pt-20 sm:pt-24" />

      {/* ================= MAIN EDITORIAL HERO CONTENT (COMPACT LUXURY SCALE, ELEVATED Z-50) ================= */}
      <div className="w-full max-w-[840px] mx-auto px-5 sm:px-6 relative z-50 flex flex-col items-center text-center mt-auto mb-8 md:my-auto py-1 sm:py-2">
        
        {/* Eyebrow: Subtle Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-2 sm:mb-2.5 flex items-center justify-center gap-2.5 transform-gpu"
        >
          <span className="w-6 h-[1px] bg-brand-gold"></span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.28em] text-brand-gold uppercase font-semibold flex items-center gap-1.5 drop-shadow-sm">
            <Sparkles className="w-3 h-3" />
            {heroData.badge || "DLF Phase 1–4 • Sushant Lok • Golf Course Ext."}
          </span>
          <span className="w-6 h-[1px] bg-brand-gold"></span>
        </motion.div>

        {/* Master Headline: Reduced ~20% scale so video is clearly visible */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          aria-label={`${heroData.headlinePrefix || "Gurgaon's Premier"} ${heroData.headlineHighlight || "Real Estate"} ${heroData.headlineSuffix !== undefined && heroData.headlineSuffix !== null && heroData.headlineSuffix !== "" ? heroData.headlineSuffix : "Partner."}`.trim()}
          className="text-2xl sm:text-3xl md:text-[clamp(1.75rem,2.85vw,2.95rem)] font-serif text-brand-ivory leading-[1.15] tracking-tight max-w-[760px] mb-2 sm:mb-2.5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] transform-gpu"
        >
          <span className="block">{heroData.headlinePrefix || "Gurgaon's Premier"}</span>
          <span className="block">
            <span className="italic font-normal text-brand-gold">{heroData.headlineHighlight || "Real Estate"}</span>{" "}
            {heroData.headlineSuffix !== undefined && heroData.headlineSuffix !== null && heroData.headlineSuffix !== ""
              ? heroData.headlineSuffix
              : "Partner."}
          </span>
        </motion.h1>

        {/* Supporting Description: Compact, refined readability */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-slate-100 text-xs sm:text-sm font-normal max-w-[540px] mb-3.5 sm:mb-4 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transform-gpu"
        >
          {heroData.description || "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas across DLF Phase 1–4, Sushant Lok & Golf Course Ext."}
        </motion.p>

        {/* ================= LUXURY PROPERTY DISCOVERY SEARCH BAR ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-[920px] relative z-50 transform-gpu"
        >
          {/* Desktop Search Bar (Horizontal Luxury Console, Slim & Refined) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center bg-white/98 backdrop-blur-2xl border border-brand-cream-border hover:border-brand-gold/40 rounded-2xl p-1 shadow-[0_16px_45px_rgba(7,11,22,0.35)] hover:shadow-[0_20px_55px_rgba(7,11,22,0.45)] transition-all duration-300 relative z-50 min-h-[52px]"
          >
            {/* Field 1: Keyword Search */}
            <div className="flex-[1.2] flex items-center gap-2 px-3 py-1 border-r border-brand-cream-border">
              <div className="w-5 h-5 rounded-md bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                <Search className="text-brand-gold w-3 h-3 flex-shrink-0" aria-hidden="true" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-brand-slate-light leading-none mb-0.5">
                  Search / Keyword
                </span>
                <input
                  type="text"
                  aria-label="Search properties"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={heroData.searchPlaceholder || "Search DLF builder floors, villas..."}
                  className="w-full bg-transparent border-none outline-none text-brand-navy placeholder-brand-text-dim font-medium text-xs truncate"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-brand-text-dim hover:text-brand-navy p-1 flex-shrink-0"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Field 2: Location */}
            <div className="flex-1 border-r border-brand-cream-border">
              <CustomSelect
                icon={MapPin}
                label="Location"
                value={location}
                onChange={setLocation}
                options={dynamicLocationOptions}
              />
            </div>

            {/* Field 3: Property Type */}
            <div className="flex-1 border-r border-brand-cream-border">
              <CustomSelect
                icon={Building2}
                label="Property Type"
                value={propertyType}
                onChange={setPropertyType}
                options={heroData.propertyTypeOptions || [
                  { value: "residential", label: "Luxury Builder Floor" },
                  { value: "villa", label: "Bespoke Villa" },
                  { value: "penthouse", label: "Penthouse" },
                  { value: "commercial", label: "Commercial Hub" }
                ]}
              />
            </div>

            {/* Field 4: Budget */}
            <div className="flex-1">
              <CustomSelect
                icon={Wallet}
                label="Budget"
                value={budget}
                onChange={setBudget}
                options={heroData.budgetOptions || [
                  { value: "under-5", label: "Under ₹5 Cr" },
                  { value: "5-10", label: "₹5 Cr – ₹10 Cr" },
                  { value: "10-15", label: "₹10 Cr – ₹15 Cr" },
                  { value: "above-15", label: "Above ₹15 Cr" }
                ]}
              />
            </div>

            {/* Field 5: Explore Action Button with Micro-Interaction */}
            <button
              type="submit"
              aria-label="Search and explore properties"
              className="group/btn ml-2 bg-brand-gold hover:bg-brand-gold text-brand-navy-deep px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
            >
              <span>{heroData.searchButtonText || "Explore"}</span>
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Mobile Search Card (Minimal Inline Layout) */}
          <form
            onSubmit={handleSearch}
            className="flex lg:hidden items-center bg-white border border-brand-cream-border rounded-full p-1.5 shadow-2xl relative z-50 w-full"
          >
            <div className="flex-1 flex items-center gap-2 pl-3">
              <Search className="text-brand-gold w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search DLF floors, villas..."
                className="w-full bg-transparent border-none outline-none text-brand-navy placeholder-brand-text-dim font-medium text-xs sm:text-sm"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-brand-text-dim px-2"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-gold hover:bg-brand-gold text-brand-navy-deep px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center justify-center shadow-md ml-1"
            >
              {heroData.searchButtonText || "Explore"}
            </button>
          </form>

          {/* Interactive Trending Capsule Buttons - Compact Luxury Style */}
          <div className="mt-2.5 sm:mt-3 hidden md:flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[9px] uppercase tracking-widest text-brand-gold font-semibold mr-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {heroData.trendingLabel || "Trending:"}
            </span>
            {(Array.isArray(heroData.trendingTags) && heroData.trendingTags.length > 0
              ? heroData.trendingTags
              : ['DLF Phase 1 Floors', 'Sushant Lok Villas', 'Golf Course Ext.', 'Under 5 Cr']
            ).map((tag) => {
              const isSelected = searchQuery === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] transition-all duration-300 cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                    isSelected
                      ? 'bg-brand-gold text-brand-navy-deep font-bold shadow-[0_0_15px_rgba(208,154,22,0.4)] border border-brand-gold'
                      : 'bg-black/40 text-brand-text-on-dark-muted hover:bg-brand-gold/20 hover:text-white border border-white/15'
                  }`}
                  title={`Filter by ${tag}`}
                >
                  <span>{tag}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-navy-deep" />}
                </button>
              );
            })}
          </div>
        </motion.div>

      </div>

      {/* ================= AMBIENT BOTTOM DOCK (RELATIVE Z-10 TO PREVENT OVERLAPPING DROPDOWN) ================= */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pb-6 pt-2 h-0">
        
        {/* Discreet Video Controls (Bottom Center) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-obsidian/80 backdrop-blur-xl border border-white/20 text-white text-[11px] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-brand-text-on-dark-muted tracking-wide font-light hidden sm:inline">Cinematic Tour</span>
          <div className="h-3 w-[1px] bg-white/20 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="text-brand-gold hover:text-white transition-colors p-1"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="text-brand-gold hover:text-white transition-colors p-1"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>

        {/* Center: Scroll Whisper (Above Video Controls) */}
        <div className="hidden lg:flex absolute bottom-20 left-1/2 -translate-x-1/2 items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-brand-text-on-dark-muted/70 drop-shadow">
          <span>Scroll to explore</span>
          <ChevronDown size={12} className="animate-bounce text-brand-gold" />
        </div>

        {/* Right Dock: Ultra-Minimalist Floating Glass Spotlight Pill (Cycles every 3 seconds) */}
        {currentProperty?.title && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="hidden md:block absolute bottom-8 right-8 z-50"
          >
            <Link
              href={propertyDetailUrl}
              className="block no-underline focus:outline-none focus:ring-2 focus:ring-brand-gold/60 rounded-full"
              aria-label={`View ${currentProperty.title || 'Featured Property'}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                className="group relative flex items-center gap-3 px-3.5 py-2 rounded-full bg-brand-obsidian/85 backdrop-blur-2xl border border-white/20 hover:border-brand-gold/60 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden"
              >
                {/* Mini Thumbnail */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/20 bg-brand-navy">
                  <Image
                    src={currentSpotlightImage}
                    alt={currentProperty.title || "Featured Property"}
                    fill
                    sizes="36px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Property Details (Compact) */}
                <div className="flex flex-col text-left pr-2 max-w-[240px]">
                  <span className="text-xs sm:text-[13px] font-serif text-brand-ivory truncate group-hover:text-brand-gold transition-colors leading-tight">
                    {currentProperty.title || "Ultra-Luxury Independent Floor"}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-brand-text-dim truncate">
                      {currentProperty.location || "DLF Phase 1"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-brand-gold/50" />
                    <span className="text-[10px] font-semibold text-brand-gold">
                      {currentProperty.price || "₹4.50 Cr."}
                    </span>
                  </div>
                </div>

                {/* Direct Action Arrow Indicator */}
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-brand-gold group-hover:bg-brand-gold-light group-hover:scale-105 text-brand-navy-deep flex items-center justify-center flex-shrink-0 shadow transition-all ml-1"
                  title="View Property"
                >
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>

                {/* 3-Second Cycle Progress Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 pointer-events-none">
                  <motion.div
                    key={`progress-${currentCardIndex}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-brand-gold"
                  />
                </div>
              </motion.div>
            </Link>
          </div>
        )}

      </div>

    </section>
  );
}
