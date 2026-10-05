"use client";

import { useState, useRef } from 'react';
import { Search, MapPin, Building2, Wallet } from 'lucide-react';
import Image from 'next/image';
import CustomSelect from '../../components/ui/CustomSelect';
import { useCms } from '../../context/CmsContext';

const unsplashLoader = ({ src, width, quality }) => {
  const baseUrl = src.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality || 75}`;
};

export default function Hero() {
  const { sections } = useCms();
  const heroData = sections?.hero || {};

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCardMouseLeave = () => {
    const card = spotlightCardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <section
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-center pt-28 pb-12 overflow-hidden bg-slate-950"
    >
      {/* Premium Builder Floor Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          loader={unsplashLoader}
          src={heroData.bgImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"}
          alt="Gurgaon Luxury Builder Floor"
          fill
          priority
          fetchPriority="high"
          quality={80}
          sizes="100vw"
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
        />
      </div>

      {/* Balanced Vignette Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-20 h-full flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          <div className="max-w-3xl w-full">

            {/* Top Badge */}
            <div className="mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#D09A16]"></span>
              <span className="text-xs md:text-sm tracking-[0.25em] text-[#D09A16] uppercase font-semibold">
                {heroData.badge || "Luxury Builder Floors & Estates"}
              </span>
            </div>

            {/* H1 SEO Headline — Immediate render without paint-blocking layout transforms */}
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-sm">
              {heroData.headlinePrefix || "Gurgaon's Premier"} <br />
              <span className="italic text-[#D09A16] font-light">
                {heroData.headlineHighlight || "Real Estate"}
              </span> {heroData.headlineSuffix || "Partner."}
            </h1>

            {/* Subtext */}
            <p className="text-[#E2E8F0] text-lg font-light max-w-xl mb-12 leading-relaxed drop-shadow-sm">
              {heroData.description || "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas in DLF Phase 1–4, Sushant Lok & Golf Course Ext."}
            </p>

            {/* Search Bar Container */}
            <div className="w-full max-w-5xl relative">
              <form
                onSubmit={handleSearch}
                className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-[0_25px_60px_rgba(0,0,0,0.35)] flex flex-col lg:flex-row gap-3 lg:gap-0 items-center relative z-30"
              >
                {/* Text Search Input */}
                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 lg:py-2 lg:border-r border-[#E5E0D8]">
                  <Search className="text-[#D09A16] w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    aria-label="Search properties"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={heroData.searchPlaceholder || "Search builder floors, DLF villas..."}
                    className="w-full bg-transparent border-none outline-none text-[#1D263B] placeholder-[#9CA3AF] font-light text-sm"
                  />
                </div>

                {/* Custom Dropdown Filters Container */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E0D8] relative">

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

                {/* Action Button */}
                <button
                  type="submit"
                  aria-label="Search and explore properties"
                  className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2 bg-[#1D263B] hover:bg-[#D09A16] text-white hover:text-[#1D263B] px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {heroData.searchButtonText || "Explore"}
                </button>
              </form>

              {/* Trending Pills */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
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
                      className="px-4 py-1.5 rounded-full border border-white/25 text-white text-xs font-medium hover:border-[#D09A16] hover:bg-white/20 transition-all duration-300 bg-black/40 backdrop-blur-md shadow-sm cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: 3D Floating Spotlight Property Card */}
          <div
            ref={spotlightCardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="hidden lg:flex flex-col gap-4 max-w-sm w-full z-20 cursor-pointer transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-white shadow-[0_30px_70px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#D09A16]/60 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D09A16] shadow-[0_0_10px_#D09A16]" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D09A16]">
                    {heroData.spotlight?.badge || "Spotlight Property"}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-wider text-gray-200">
                  {heroData.spotlight?.tag || "DLF Phase 1"}
                </span>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-white/10">
                <Image
                  loader={unsplashLoader}
                  src={heroData.spotlight?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                  alt="Gurgaon Builder Floor Interior"
                  width={800}
                  height={500}
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                  {heroData.spotlight?.tag || "Independent Terrace Floor"}
                </div>
              </div>

              {/* Semantic H2 for heading hierarchy correctness */}
              <h2 className="text-lg font-serif text-white mb-1">
                {heroData.spotlight?.title || "Ultra-Luxury Independent Floor"}
              </h2>
              <p className="text-xs text-gray-300 font-light mb-4">
                {heroData.spotlight?.specs || "4 BHK • 500 Sq. Yds • Private Stilt Parking & Elevator"}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/15">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400">
                    {heroData.spotlight?.startingAtLabel || "Starting At"}
                  </span>
                  <span className="text-base font-semibold text-[#D09A16]">
                    {heroData.spotlight?.price || "₹6.75 Cr Onwards"}
                  </span>
                </div>
                <a
                  href={`tel:${heroData.spotlight?.phone || '+919811221207'}`}
                  aria-label={`Enquire about ${heroData.spotlight?.title || 'Spotlight Property'}`}
                  className="px-4 py-2 rounded-full bg-white text-[#1D263B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#D09A16] hover:text-white transition-colors shadow-md"
                >
                  {heroData.spotlight?.ctaText || "Enquire"}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}