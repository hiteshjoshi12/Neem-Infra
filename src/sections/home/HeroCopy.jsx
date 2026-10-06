"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Building2, Wallet, Volume2, VolumeX, Play, Pause, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
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
export default function HeroCopy() {
  const { sections, properties } = useCms();
  const heroData = sections?.hero || {};

  // Resolve backend featured properties with fallback
  const rawProperties = properties && properties.length > 0 ? properties : FEATURED_PROPERTIES_DATA;
  const featuredProperties = rawProperties.filter((p) => p.isFeatured !== false);
  const cardList = featuredProperties.length > 0 ? featuredProperties : rawProperties;

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

  // Clean luxury villa video URL
  const primaryVideoUrl = heroData.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-with-pool-and-palm-trees-43950-large.mp4";

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

  // Handle trending capsule click to populate search bar and filters
  const handleTagClick = (tag) => {
    if (searchQuery === tag) {
      setSearchQuery("");
      setLocation("");
      setPropertyType("");
      setBudget("");
    } else {
      setSearchQuery(tag);
      if (tag.includes('DLF Phase 1')) {
        setLocation('dlf-1');
        setPropertyType('builder-floor');
      } else if (tag.includes('Sushant Lok')) {
        setLocation('sushant-lok');
        setPropertyType('villa');
      } else if (tag.includes('Golf Course')) {
        setLocation('golf-course');
      } else if (tag.includes('Under 5 Cr')) {
        setBudget('under-5');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const targetSection = document.getElementById('featured') || document.getElementById('properties') || document.querySelector('section:nth-of-type(3)');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
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
    <section className="relative z-30 w-full min-h-screen flex flex-col justify-between overflow-visible bg-[#070B16] text-white">

      {/* ================= FULL-BLEED PRODUCTION CINEMATIC HERO VIDEO CANVAS ================= */}
      <CinematicHeroBackground
        ref={videoRef}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onMuteChange={(muted) => setIsMuted(muted)}
      />

      {/* ================= TOP SPACER FOR FLOATING NAVBAR ================= */}
      <div className="pt-24 sm:pt-28" />

      {/* ================= MAIN EDITORIAL HERO CONTENT (MAX-W 980PX, ELEVATED Z-50) ================= */}
      <div className="w-full max-w-[980px] mx-auto px-6 sm:px-8 relative z-50 flex flex-col items-center text-center mt-auto mb-10 md:my-auto py-2 sm:py-4">
        
        {/* Eyebrow: Subtle Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-3 sm:mb-3.5 flex items-center justify-center gap-3"
        >
          <span className="w-7 h-[1px] bg-[#C6A24A]"></span>
          <span className="text-[11px] sm:text-xs tracking-[0.3em] text-[#C6A24A] uppercase font-semibold flex items-center gap-1.5 drop-shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {heroData.badge || "DLF Phase 1–4 • Sushant Lok • Golf Course Ext."}
          </span>
          <span className="w-7 h-[1px] bg-[#C6A24A]"></span>
        </motion.div>

        {/* Master Headline: Reduced ~20%, Responsive clamp, Strictly 2 Lines */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-2xl md:text-[clamp(1.75rem,3.5vw,3.5rem)] font-serif text-[#F7F5EF] leading-[1.12] tracking-tight max-w-[800px] mb-2 md:mb-3 sm:mb-3.5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
        >
          <span className="block">Gurgaon&apos;s Premier</span>
          <span className="block">
            <span className="italic font-light text-[#C6A24A]">Real Estate</span> Partner.
          </span>
        </motion.h1>

        {/* Supporting Description: Refined 16–18px, Max-w 680px */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-[#CBD5E1] text-xs sm:text-sm md:text-[15px] font-light max-w-[600px] mb-4 md:mb-5 sm:mb-6 leading-[1.58] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          {heroData.description || "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas across DLF Phase 1–4, Sushant Lok & Golf Course Ext."}
        </motion.p>

        {/* ================= LUXURY PROPERTY DISCOVERY SEARCH BAR ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-[1040px] relative z-50"
        >
          {/* Desktop Search Bar (Horizontal Luxury Console, Sleek) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center bg-white/98 backdrop-blur-2xl border border-[#E2DDD5] hover:border-[#C6A24A]/40 rounded-2xl p-1.5 shadow-[0_20px_55px_rgba(7,11,22,0.4)] hover:shadow-[0_24px_65px_rgba(7,11,22,0.48)] transition-all duration-300 relative z-50 min-h-[64px]"
          >
            {/* Field 1: Keyword Search */}
            <div className="flex-[1.2] flex items-center gap-2 px-3 py-1.5 border-r border-[#EBE7DF]">
              <div className="w-6 h-6 rounded-lg bg-[#C6A24A]/10 flex items-center justify-center flex-shrink-0">
                <Search className="text-[#C6A24A] w-3 h-3 flex-shrink-0" aria-hidden="true" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8A95A7] leading-none mb-0.5">
                  Search / Keyword
                </span>
                <input
                  type="text"
                  aria-label="Search properties"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={heroData.searchPlaceholder || "Search DLF builder floors, villas..."}
                  className="w-full bg-transparent border-none outline-none text-[#17213D] placeholder-[#94A3B8] font-medium text-xs truncate"
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

            {/* Field 2: Location */}
            <div className="flex-1 border-r border-[#EBE7DF]">
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
            </div>

            {/* Field 3: Property Type */}
            <div className="flex-1 border-r border-[#EBE7DF]">
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
            </div>

            {/* Field 4: Budget */}
            <div className="flex-1">
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

            {/* Field 5: Explore Action Button with Micro-Interaction */}
            <button
              type="submit"
              aria-label="Search and explore properties"
              className="group/btn ml-2 bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
            >
              <span>{heroData.searchButtonText || "Explore"}</span>
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Mobile Search Card (Minimal Inline Layout) */}
          <form
            onSubmit={handleSearch}
            className="flex lg:hidden items-center bg-white border border-[#E2DDD5] rounded-full p-1.5 shadow-2xl relative z-50 w-full"
          >
            <div className="flex-1 flex items-center gap-2 pl-3">
              <Search className="text-[#C6A24A] w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search DLF floors, villas..."
                className="w-full bg-transparent border-none outline-none text-[#17213D] placeholder-[#94A3B8] font-medium text-xs sm:text-sm"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#94A3B8] px-2"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center justify-center shadow-md ml-1"
            >
              Explore
            </button>
          </form>

          {/* Interactive Trending Capsule Buttons */}
          <div className="mt-3.5 sm:mt-4 hidden md:flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#C6A24A] font-semibold mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Trending:
            </span>
            {['DLF Phase 1 Floors', 'Sushant Lok Villas', 'Golf Course Ext.', 'Under 5 Cr'].map((tag) => {
              const isSelected = searchQuery === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-[11px] sm:text-xs transition-all duration-300 cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#C6A24A] text-[#0E162B] font-bold shadow-[0_0_18px_rgba(198,162,74,0.45)] border border-[#C6A24A]'
                      : 'bg-black/50 text-[#C9CED9] hover:bg-[#C6A24A]/25 hover:text-white border border-white/20'
                  }`}
                  title={`Filter by ${tag}`}
                >
                  <span>{tag}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0E162B]" />}
                </button>
              );
            })}
          </div>
        </motion.div>

      </div>

      {/* ================= AMBIENT BOTTOM DOCK (RELATIVE Z-10 TO PREVENT OVERLAPPING DROPDOWN) ================= */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pb-6 pt-2 h-0">
        
        {/* Discreet Video Controls (Bottom Center) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070B16]/80 backdrop-blur-xl border border-white/20 text-white text-[11px] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#C9CED9] tracking-wide font-light hidden sm:inline">Cinematic Tour</span>
          <div className="h-3 w-[1px] bg-white/20 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="text-[#C6A24A] hover:text-white transition-colors p-1"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="text-[#C6A24A] hover:text-white transition-colors p-1"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>

        {/* Center: Scroll Whisper (Above Video Controls) */}
        <div className="hidden lg:flex absolute bottom-20 left-1/2 -translate-x-1/2 items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#C9CED9]/70 drop-shadow">
          <span>Scroll to explore</span>
          <ChevronDown size={12} className="animate-bounce text-[#C6A24A]" />
        </div>

        {/* Right Dock: Ultra-Minimalist Floating Glass Spotlight Pill (Cycles every 3 seconds) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden md:block absolute bottom-8 right-8 z-50"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="group relative flex items-center gap-3 px-3.5 py-2 rounded-full bg-[#070B16]/85 backdrop-blur-2xl border border-white/20 hover:border-[#C6A24A]/60 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden"
          >
              {/* Mini Thumbnail */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                <Image
                  loader={unsplashLoader}
                  src={currentProperty.img || (currentProperty.images && currentProperty.images[0]) || heroData.spotlight?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                  alt={currentProperty.title || "Featured Property"}
                  fill
                  sizes="36px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Property Details (Compact) */}
              <div className="flex flex-col text-left pr-2 max-w-[240px]">
                <span className="text-xs sm:text-[13px] font-serif text-[#F7F5EF] truncate group-hover:text-[#C6A24A] transition-colors leading-tight">
                  {currentProperty.title || "Ultra-Luxury Independent Floor"}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-[#9DA6B8] truncate">
                    {currentProperty.location || "DLF Phase 1"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#C6A24A]/50" />
                  <span className="text-[10px] font-semibold text-[#C6A24A]">
                    {currentProperty.price || "₹4.50 Cr."}
                  </span>
                </div>
              </div>

              {/* Direct Enquiry Action Arrow */}
              <a
                href={currentProperty.link || `tel:${heroData.spotlight?.phone || '+919811221207'}`}
                aria-label={`Enquire about ${currentProperty.title || 'Featured Property'}`}
                className="w-7 h-7 rounded-full bg-[#C6A24A] hover:bg-[#D4B258] text-[#0E162B] flex items-center justify-center flex-shrink-0 shadow transition-colors ml-1"
                title="Enquire"
              >
                <ArrowUpRight size={14} />
              </a>

              {/* 3-Second Cycle Progress Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
                <motion.div
                  key={`progress-${currentCardIndex}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-[#C6A24A]"
                />
              </div>
          </motion.div>
        </div>

      </div>

    </section>
  );
}
