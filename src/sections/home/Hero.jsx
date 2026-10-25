"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Building2, Wallet, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import CustomSelect from '../../components/ui/CustomSelect';
import CinematicHeroBackground from '../../components/ui/CinematicHeroBackground';
import { useCms } from '../../context/CmsContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const { sections, properties } = useCms();
  const heroData = sections?.hero || {};

  // Resolve backend featured properties
  const rawProperties = useMemo(() => (Array.isArray(properties) ? properties : []), [properties]);
  const cardList = useMemo(() => {
    const filtered = rawProperties.filter((p) => p.isFeatured !== false);
    return filtered.length > 0 ? filtered : rawProperties;
  }, [rawProperties]);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-rotation every 3 seconds for the spotlight card
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardList || cardList.length <= 1) return;
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cardList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cardList, isHovered]);

  const currentProperty = cardList[currentCardIndex] || cardList[0] || {};

  const propertyDetailUrl = currentProperty?.slug
    ? `/properties/${currentProperty.slug}`
    : (currentProperty?._id || currentProperty?.id
        ? `/properties/${currentProperty._id || currentProperty.id}`
        : (currentProperty?.link || '/properties'));

  const rawSpotlightImage = currentProperty?.img || (currentProperty?.images && currentProperty.images[0]) || heroData.spotlight?.image;

  const currentSpotlightImage = useMemo(() => {
    if (!rawSpotlightImage) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    if (typeof rawSpotlightImage === "string") {
      if (rawSpotlightImage.includes("ik.imagekit.io")) {
        const separator = rawSpotlightImage.includes("?") ? "&" : "?";
        return `${rawSpotlightImage}${separator}tr=w-800,h-500,c-maintain_ratio,f-auto`;
      }
      if (rawSpotlightImage.includes("images.unsplash.com")) {
        return rawSpotlightImage.replace(/w=\d+/, "w=800").replace(/q=\d+/, "q=80");
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

  const spotlightCardRef = useRef(null);

  const handleCardMouseMove = (e) => {
    const card = spotlightCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const router = useRouter();

  const handleCardMouseLeave = () => {
    const card = spotlightCardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const params = new URLSearchParams();

    if (searchQuery && searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    if (location && location !== 'all') {
      let locVal = location;
      if (location === 'dlf-1' || location === 'dlf-phase-1') locVal = 'dlf-phase-1';
      else if (location === 'dlf-2' || location === 'dlf-phase-2') locVal = 'dlf-phase-2';
      else if (location === 'dlf-3' || location === 'dlf-phase-3') locVal = 'dlf-phase-3';
      else if (location === 'dlf-4' || location === 'dlf-phase-4') locVal = 'dlf-phase-4';
      else if (location === 'dlf-5' || location === 'dlf-phase-5') locVal = 'dlf-phase-5';
      else if (location === 'golf-course' || location === 'golf-course-ext') locVal = 'golf-course-ext';
      else if (location === 'sushant-lok' || location === 'sushant-lok-1') locVal = 'sushant-lok-1';
      else locVal = location;
      params.set('location', locVal);
    }

    if (propertyType && propertyType !== 'all') {
      let catVal = propertyType;
      if (propertyType === 'builder-floor' || propertyType === 'residential') catVal = 'residential';
      params.set('category', catVal);
    }

    if (budget && budget !== 'all') {
      let budVal = budget;
      if (budget === '5-to-10') budVal = '5-10';
      else if (budget === 'above-10') budVal = 'above-15';
      params.set('price', budVal);
    }

    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : '/properties');
  };

  const handleTagClick = (tag) => {
    let locVal = '';
    let catVal = '';
    let budVal = '';

    if (tag.includes('DLF Phase 1')) {
      locVal = 'dlf-phase-1';
      catVal = 'residential';
    } else if (tag.includes('Sushant Lok')) {
      locVal = 'sushant-lok-1';
      catVal = 'villa';
    } else if (tag.includes('Golf Course')) {
      locVal = 'golf-course-ext';
    } else if (tag.includes('Under 5 Cr')) {
      budVal = 'under-5';
    }

    const params = new URLSearchParams();
    if (tag) params.set('search', tag);
    if (locVal) params.set('location', locVal);
    if (catVal) params.set('category', catVal);
    if (budVal) params.set('price', budVal);

    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : '/properties');
  };

  return (
    <section
      className="relative z-30 w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-center pt-28 pb-20 lg:pb-32 overflow-visible bg-brand-obsidian"
    >
      {/* Production Cinematic Remotion Hero Video Background Layer with Built-in Luxury Controls */}
      <CinematicHeroBackground showControls={true} posterAlt={heroData.videoPosterAlt || heroData.bgImageAlt || "Saudagar Luxury Properties Architecture"} />

      <div className="container mx-auto px-6 md:px-12 relative z-20 h-full flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          <div className="max-w-3xl w-full">

            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 flex items-center gap-4"
            >
              <span className="w-8 h-[1px] bg-brand-gold"></span>
              <span className="text-xs md:text-sm tracking-[0.25em] text-brand-gold uppercase font-semibold">
                {heroData.badge || "Luxury Builder Floors & Estates"}
              </span>
            </motion.div>

            {/* H1 SEO Headline: Reduced scale, strictly 2 lines */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-[clamp(2.15rem,4.2vw,4.25rem)] font-serif text-brand-ivory leading-[1.15] tracking-tight max-w-[920px] mb-3.5 sm:mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            >
              <span className="block">Gurgaon&apos;s Premier</span>
              <span className="block">
                <span className="italic font-normal text-brand-gold">Real Estate</span> Partner.
              </span>
            </motion.h1>

            {/* Subtext: High readability text */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-slate-100 text-sm sm:text-base md:text-[17px] font-normal max-w-[650px] mb-6 sm:mb-7 leading-[1.62] drop-shadow-sm"
            >
              {heroData.description || "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas across DLF Phase 1–4, Sushant Lok & Golf Course Ext."}
            </motion.p>

            {/* High-Visibility White Search Bar Console */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="w-full max-w-[1040px] relative z-40"
            >
              <form
                onSubmit={handleSearch}
                className="bg-white border border-brand-cream-border hover:border-brand-gold/40 rounded-2xl p-2 sm:p-2.5 shadow-[0_20px_55px_rgba(0,0,0,0.4)] hover:shadow-[0_24px_65px_rgba(0,0,0,0.48)] flex flex-col lg:flex-row gap-2 lg:gap-0 items-center relative z-40 transition-all duration-300 min-h-[74px]"
              >
                {/* Field 1: Keyword Search */}
                <div className="flex-[1.2] w-full flex items-center gap-2.5 px-3.5 sm:px-4 py-2 lg:border-r border-brand-cream-border">
                  <div className="w-7 h-7 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Search className="text-brand-gold w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-slate-light leading-none mb-0.5">
                      Search / Keyword
                    </span>
                    <input
                      type="text"
                      aria-label="Search properties"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={heroData.searchPlaceholder || "Search DLF builder floors, villas..."}
                      className="w-full bg-transparent border-none outline-none text-brand-navy placeholder-brand-text-dim font-medium text-xs sm:text-[13px] truncate"
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

                {/* Custom Dropdown Filters Container */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-brand-cream-border relative text-brand-navy">

                  <CustomSelect
                    icon={MapPin}
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    options={dynamicLocationOptions}
                  />

                  <CustomSelect
                    icon={Building2}
                    label="Property Type"
                    value={propertyType}
                    onChange={setPropertyType}
                    options={heroData.propertyTypeOptions || [
                      { value: "builder-floor", label: "Luxury Builder Floor" },
                      { value: "villa", label: "Bespoke Villa" },
                      { value: "penthouse", label: "Penthouse" },
                      { value: "apartment", label: "High-Rise Apartment" }
                    ]}
                  />

                  <CustomSelect
                    icon={Wallet}
                    label="Budget"
                    value={budget}
                    onChange={setBudget}
                    options={heroData.budgetOptions || [
                      { value: "under-5", label: "Under 5 Cr" },
                      { value: "5-to-10", label: "5 Cr - 10 Cr" },
                      { value: "above-10", label: "10 Cr+" }
                    ]}
                  />

                </div>

                {/* Action Button: Gold background + Explore arrow micro-interaction */}
                <button
                  type="submit"
                  aria-label="Search and explore properties"
                  className="group/btn w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2 bg-brand-gold hover:bg-brand-gold text-brand-navy-deep px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
                >
                  <span>{heroData.searchButtonText || "Explore"}</span>
                  <ArrowUpRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
              </form>

              {/* Trending Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10"
              >
                <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase">
                  {heroData.trendingLabel || "Trending"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(heroData.trendingTags && heroData.trendingTags.length > 0
                    ? heroData.trendingTags
                    : ['DLF Phase 1 Floors', 'Sushant Lok Villas', 'Golf Course Ext.', 'Under 5 Cr']
                  ).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      aria-label={`Search trending category: ${tag}`}
                      className="px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-medium hover:border-brand-gold hover:text-brand-navy hover:bg-white transition-all duration-300 bg-white/15 backdrop-blur-md shadow-sm cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side: 3D Floating Featured Property Card - Cycles Every 3 Seconds from Backend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            ref={spotlightCardRef}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              handleCardMouseLeave();
            }}
            className="hidden lg:flex flex-col gap-4 max-w-sm w-full z-20 cursor-pointer transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProperty.id || currentProperty._id || currentCardIndex}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-white/95 backdrop-blur-2xl border border-brand-cream-border rounded-3xl p-6 text-brand-navy shadow-[0_25px_60px_rgba(0,0,0,0.35)] relative overflow-hidden group hover:border-brand-gold/60 transition-all duration-500"
              >
                {/* Header with live status and counter indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold shadow-[0_0_10px_var(--color-brand-gold)] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold-deep">
                      {heroData.spotlight?.badge || "Featured Property"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-slate-light font-mono font-semibold">
                      {String(currentCardIndex + 1).padStart(2, '0')}/{String(cardList.length).padStart(2, '0')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-brand-ivory border border-brand-cream-border text-[10px] uppercase tracking-wider text-brand-navy font-medium truncate max-w-[120px]">
                      {currentProperty.location || heroData.spotlight?.tag || "DLF Phase 1"}
                    </span>
                  </div>
                </div>

                {/* Property Image Showcase */}
                <Link href={propertyDetailUrl} className="block relative h-44 rounded-2xl overflow-hidden mb-4 border border-brand-cream-border bg-brand-cream group/img">
                  <Image
                    src={currentSpotlightImage}
                    alt={currentProperty.imgAlt || (currentProperty.imagesAlt && currentProperty.imagesAlt[0]) || currentProperty.title || "Featured Gurgaon Property"}
                    width={800}
                    height={500}
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-brand-navy text-[10px] font-bold border border-brand-cream-border shadow-xs">
                    {currentProperty.tag || "Exclusive Listing"}
                  </div>
                </Link>

                {/* Title & Specifications */}
                <Link href={propertyDetailUrl} className="block group/title">
                  <h2 className="text-lg font-serif font-bold text-brand-navy mb-1 truncate group-hover/title:text-brand-gold transition-colors" title={currentProperty.title}>
                    {currentProperty.title || "Ultra-Luxury Independent Floor"}
                  </h2>
                </Link>
                <p className="text-xs text-brand-slate font-light mb-4 line-clamp-1">
                  {currentProperty.specs || currentProperty.desc || "4 BHK • DLF Phase Gurgaon"}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-cream-border">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-brand-slate-light">
                      {heroData.spotlight?.startingAtLabel || "Starting At"}
                    </span>
                    <span className="text-base font-bold text-brand-gold-deep">
                      {currentProperty.price || "₹4.50 Cr."}
                    </span>
                  </div>
                  <Link
                    href={propertyDetailUrl}
                    aria-label={`View details for ${currentProperty.title || 'Featured Property'}`}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light hover:brightness-105 text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>{heroData.spotlight?.ctaText || "View Property"}</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                {/* 3-Second Cycle Progress Bar Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-cream-border">
                  <motion.div
                    key={`bar-${currentCardIndex}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-brand-gold"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}