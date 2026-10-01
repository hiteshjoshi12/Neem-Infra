import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, Wallet, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

import CustomSelect from '../../components/ui/CustomSelect';
import { useCms } from '../../context/CmsContext';

export default function Hero() {
  const { sections } = useCms();
  const heroData = sections?.hero || {};

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center pt-28 pb-12 overflow-visible bg-slate-950">
      
      {/* Premium Builder Floor Background Image (z-0 to sit directly above section background) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80" 
          alt="Gurgaon Luxury Builder Floor" 
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] transition-transform duration-[10s] ease-out hover:scale-105"
        />
      </div>

      {/* Balanced Vignette Gradients (z-10) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-20 h-full flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl w-full"
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#C5A880]"></span>
              <span className="text-xs md:text-sm tracking-[0.25em] text-[#C5A880] uppercase font-semibold">
                {heroData.badge || "Luxury Builder Floors & Estates"}
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-sm">
              {heroData.headlinePrefix || "Gurgaon's Premier"} <br />
              <span className="italic text-[#C5A880] font-light">
                {heroData.headlineHighlight || "Real Estate"}
              </span> {heroData.headlineSuffix || "Partner."}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-[#E2E8F0] text-lg font-light max-w-xl mb-12 leading-relaxed drop-shadow-sm">
              {heroData.description || "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas in DLF Phase 1–4, Sushant Lok & Golf Course Ext."}
            </motion.p>

            <motion.div variants={fadeUp} className="w-full max-w-5xl relative">
              {/* Search Bar Container */}
              <form 
                onSubmit={handleSearch}
                className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-[0_25px_60px_rgba(0,0,0,0.35)] flex flex-col lg:flex-row gap-3 lg:gap-0 items-center relative z-30"
              >
                {/* Text Search Input */}
                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 lg:py-2 lg:border-r border-[#E5E0D8]">
                  <Search className="text-[#C5A880] w-5 h-5 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search builder floors, DLF villas..." 
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
                    options={[
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
                    options={[
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
                    options={[
                      { value: "under-5", label: "Under 5 Cr" },
                      { value: "5-to-10", label: "5 Cr - 10 Cr" },
                      { value: "above-10", label: "10 Cr+" }
                    ]}
                  />

                </div>

                {/* Action Button */}
                <button 
                  type="submit"
                  className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2 bg-[#1D263B] text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#111827] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Explore
                </button>
              </form>

              {/* Trending Pills */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                <span className="text-[#C5A880] text-xs font-semibold tracking-widest uppercase">Trending</span>
                <div className="flex flex-wrap gap-2">
                  {['DLF Phase 1 Floors', 'Sushant Lok Villas', 'Golf Course Ext.', 'Under 5 Cr'].map((tag) => (
                    <button 
                      key={tag}
                      type="button"
                      className="px-4 py-1.5 rounded-full border border-white/25 text-white text-xs font-medium hover:border-[#C5A880] hover:bg-white/20 transition-all duration-300 bg-black/40 backdrop-blur-md shadow-sm cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: 3D Floating Builder Floor Highlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:flex flex-col gap-4 max-w-sm w-full z-20"
          >
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-white shadow-[0_30px_70px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-[#C5A880]/60 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A880]">
                    {heroData.spotlight?.badge || "Spotlight Property"}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-wider text-gray-200">
                  {heroData.spotlight?.tag || "DLF Phase 1"}
                </span>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-white/10">
                <img 
                  src={heroData.spotlight?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"} 
                  alt="Gurgaon Builder Floor Interior" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                  {heroData.spotlight?.tag || "Independent Terrace Floor"}
                </div>
              </div>

              <h4 className="text-lg font-serif text-white mb-1">
                {heroData.spotlight?.title || "Ultra-Luxury Independent Floor"}
              </h4>
              <p className="text-xs text-gray-300 font-light mb-4">
                {heroData.spotlight?.specs || "4 BHK • 500 Sq. Yds • Private Stilt Parking & Elevator"}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/15">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-gray-400">Starting At</span>
                  <span className="text-base font-semibold text-[#C5A880]">
                    {heroData.spotlight?.price || "₹6.75 Cr Onwards"}
                  </span>
                </div>
                <a
                  href={`tel:${heroData.spotlight?.phone || '+919811221207'}`}
                  className="px-4 py-2 rounded-full bg-white text-[#1D263B] text-[11px] font-bold uppercase tracking-wider hover:bg-[#C5A880] hover:text-white transition-colors shadow-md"
                >
                  Enquire
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}