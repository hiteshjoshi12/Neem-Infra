"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, Wallet, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import CustomSelect from '../../components/ui/CustomSelect';
import CinematicHeroBackground from '../../components/ui/CinematicHeroBackground';
import { useCms } from '../../context/CmsContext';
import { FEATURED_PROPERTIES_DATA } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';

const unsplashLoader = ({ src, width, quality }) => {
  const baseUrl = src.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality || 75}`;
};

export default function Hero() {
  const { sections, properties } = useCms();
  const heroData = sections?.hero || {};

  // Resolve backend featured properties with fallback
  const rawProperties = properties && properties.length > 0 ? properties : FEATURED_PROPERTIES_DATA;
  const featuredProperties = rawProperties.filter((p) => p.isFeatured !== false);
  const cardList = featuredProperties.length > 0 ? featuredProperties : rawProperties;

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
      else if (location === 'dlf-4' || location === 'dlf-phase-4') locVal = 'dlf-phase-4';
      else if (location === 'dlf-5') locVal = 'dlf-phase-1';
      else if (location === 'golf-course' || location === 'golf-course-ext') locVal = 'golf-course-ext';
      else if (location === 'sushant-lok' || location === 'sushant-lok-1') locVal = 'sushant-lok-1';
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

  return (
    <section
      className="relative z-30 w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-center pt-28 pb-20 lg:pb-32 overflow-visible bg-[#070B16]"
    >
      {/* Production Cinematic Remotion Hero Video Background Layer with Built-in Luxury Controls */}
      <CinematicHeroBackground showControls={true} />

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
              <span className="w-8 h-[1px] bg-[#D09A16]"></span>
              <span className="text-xs md:text-sm tracking-[0.25em] text-[#D09A16] uppercase font-semibold">
                {heroData.badge || "Luxury Builder Floors & Estates"}
              </span>
            </motion.div>

            {/* H1 SEO Headline: Reduced scale, strictly 2 lines */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-[clamp(2.15rem,4.2vw,4.25rem)] font-serif text-[#F7F5EF] leading-[1.15] tracking-tight max-w-[920px] mb-3.5 sm:mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            >
              <span className="block">Gurgaon&apos;s Premier</span>
              <span className="block">
                <span className="italic font-normal text-[#D09A16]">Real Estate</span> Partner.
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
                className="bg-white border border-[#E2DDD5] hover:border-[#D09A16]/40 rounded-2xl p-2 sm:p-2.5 shadow-[0_20px_55px_rgba(0,0,0,0.4)] hover:shadow-[0_24px_65px_rgba(0,0,0,0.48)] flex flex-col lg:flex-row gap-2 lg:gap-0 items-center relative z-40 transition-all duration-300 min-h-[74px]"
              >
                {/* Field 1: Keyword Search */}
                <div className="flex-[1.2] w-full flex items-center gap-2.5 px-3.5 sm:px-4 py-2 lg:border-r border-[#EBE7DF]">
                  <div className="w-7 h-7 rounded-lg bg-[#D09A16]/10 flex items-center justify-center flex-shrink-0">
                    <Search className="text-[#D09A16] w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A95A7] leading-none mb-0.5">
                      Search / Keyword
                    </span>
                    <input
                      type="text"
                      aria-label="Search properties"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={heroData.searchPlaceholder || "Search DLF builder floors, villas..."}
                      className="w-full bg-transparent border-none outline-none text-[#17213D] placeholder-[#94A3B8] font-medium text-xs sm:text-[13px] truncate"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#94A3B8] hover:text-[#17213D] p-1 flex-shrink-0"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Custom Dropdown Filters Container */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#EBE7DF] relative text-[#17213D]">

                  <CustomSelect
                    icon={MapPin}
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    options={heroData.locationOptions || [
                      { value: "golf-course", label: "Golf Course Ext" },
                      { value: "dlf-1", label: "DLF Phase 1" },
                      { value: "dlf-5", label: "DLF Phase 5" },
                      { value: "sushant-lok", label: "Sushant Lok 1" },
                      { value: "dwarka-expy", label: "Dwarka Expressway" }
                    ]}
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
                  className="group/btn w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2 bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
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
                <span className="text-[#D09A16] text-xs font-semibold tracking-widest uppercase">
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
                      aria-label={`Search trending category: ${tag}`}
                      className="px-4 py-1.5 rounded-full border border-white/20 text-[#C9CED9] text-xs font-medium hover:border-[#D09A16] hover:text-[#D09A16] hover:bg-[#202B4A]/60 transition-all duration-300 bg-[#17213D]/70 backdrop-blur-md shadow-sm cursor-pointer"
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
                className="bg-[#202B4A]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 text-white shadow-[0_30px_70px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-[#D09A16]/60 transition-all duration-500"
              >
                {/* Header with live status and counter indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D09A16] shadow-[0_0_10px_#D09A16] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D09A16]">
                      {heroData.spotlight?.badge || "Featured Property"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#9DA6B8] font-mono font-semibold">
                      {String(currentCardIndex + 1).padStart(2, '0')}/{String(cardList.length).padStart(2, '0')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-wider text-[#C9CED9] truncate max-w-[120px]">
                      {currentProperty.location || heroData.spotlight?.tag || "DLF Phase 1"}
                    </span>
                  </div>
                </div>

                {/* Property Image Showcase */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-white/10 bg-[#0E162B]">
                  <Image
                    loader={unsplashLoader}
                    src={currentProperty.img || (currentProperty.images && currentProperty.images[0]) || heroData.spotlight?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                    alt={currentProperty.title || "Featured Gurgaon Property"}
                    width={800}
                    height={500}
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
                    {currentProperty.tag || "Exclusive Listing"}
                  </div>
                </div>

                {/* Title & Specifications */}
                <h2 className="text-lg font-serif text-white mb-1 truncate" title={currentProperty.title}>
                  {currentProperty.title || "Ultra-Luxury Independent Floor"}
                </h2>
                <p className="text-xs text-[#C9CED9] font-light mb-4 line-clamp-1">
                  {currentProperty.specs || currentProperty.desc || "4 BHK • DLF Phase Gurgaon"}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/15">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-[#9DA6B8]">
                      {heroData.spotlight?.startingAtLabel || "Starting At"}
                    </span>
                    <span className="text-base font-semibold text-[#D09A16]">
                      {currentProperty.price || "₹4.50 Cr."}
                    </span>
                  </div>
                  <a
                    href={currentProperty.link || `tel:${heroData.spotlight?.phone || '+919811221207'}`}
                    aria-label={`Enquire about ${currentProperty.title || 'Featured Property'}`}
                    className="px-4 py-2 rounded-full bg-[#D09A16] text-[#0E162B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#D09A16] transition-colors shadow-md cursor-pointer"
                  >
                    {heroData.spotlight?.ctaText || "Enquire"}
                  </a>
                </div>

                {/* 3-Second Cycle Progress Bar Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10">
                  <motion.div
                    key={`bar-${currentCardIndex}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-[#D09A16]"
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