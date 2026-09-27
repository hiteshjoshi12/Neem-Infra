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

function CustomSelect({ icon: Icon, label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  return (
    <div className="relative flex-1 w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-4 py-3 lg:py-2 cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className="text-[#A89069] w-4 h-4 flex-shrink-0" />
          <span className={`text-sm font-light truncate ${value ? 'text-[#2C302E] font-normal' : 'text-[#5A605C]'}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-[#A89069] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] bg-white border border-[#E5E0D8] rounded-xl shadow-[0_20px_50px_rgba(44,48,46,0.12)] py-2 z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#E5E0D8] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="px-4 py-2.5 text-xs text-[#9CA3AF] hover:bg-[#F9F8F4] transition-colors cursor-pointer"
            >
              All {label}s
            </li>

            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  value === opt.value 
                    ? 'bg-[#2F3E35]/5 text-[#2F3E35] font-medium' 
                    : 'text-[#5A605C] hover:bg-[#F9F8F4] hover:text-[#2C302E]'
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-[#A89069]" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-visible bg-[#1A231E]">
      
      {/* Background Architectural Image */}
      <div className="absolute inset-0 -z-20 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2500&q=80" 
          alt="Luxury Modern Architecture" 
          className="w-full h-full object-cover filter brightness-[0.7]"
        />
      </div>

      {/* Cinematic Dark Gradient Overlays for optimal text contrast */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1A231E]/95 via-[#1A231E]/75 to-transparent"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1A231E] via-transparent to-transparent"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-20 h-full flex flex-col justify-center">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#A89069]"></span>
            <span className="text-xs md:text-sm tracking-[0.25em] text-[#A89069] uppercase font-medium">
              Curated Living Spaces
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif text-white leading-[1.1] mb-6">
            Gurgaon's Premier <br />
            <span className="italic text-[#A89069] font-light">Real Estate</span> Partner.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#D1D5DB] text-lg font-light max-w-xl mb-12 leading-relaxed">
            Discover an exclusive portfolio of high-rise apartments, bespoke builder floors, and luxury penthouses in the city's most coveted locations.
          </motion.p>

          <motion.div variants={fadeUp} className="w-full max-w-5xl relative">
            {/* Search Bar Container */}
            <form 
              onSubmit={handleSearch}
              className="bg-white border border-[#E5E0D8] rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row gap-3 lg:gap-0 items-center relative z-30"
            >
              {/* Text Search Input */}
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 lg:py-2 lg:border-r border-[#E5E0D8]">
                <Search className="text-[#A89069] w-5 h-5 flex-shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties, locations..." 
                  className="w-full bg-transparent border-none outline-none text-[#2C302E] placeholder-[#9CA3AF] font-light text-sm"
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
                    { value: "dlf-5", label: "DLF Phase 5" },
                    { value: "dwarka-expy", label: "Dwarka Expressway" },
                    { value: "sohna-road", label: "Sohna Road" },
                    { value: "new-gurgaon", label: "New Gurgaon" }
                  ]}
                />

                <CustomSelect 
                  icon={Building2}
                  label="Property Type"
                  value={propertyType}
                  onChange={setPropertyType}
                  options={[
                    { value: "villa", label: "Luxury Villa" },
                    { value: "penthouse", label: "Penthouse" },
                    { value: "apartment", label: "High-Rise Apartment" },
                    { value: "builder-floor", label: "Builder Floor" }
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
                className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-2 bg-[#2F3E35] text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#1E2822] transition-colors flex items-center justify-center shadow-md cursor-pointer"
              >
                Explore

                
              </button>
            </form>

            {/* Trending Pills */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
              <span className="text-[#A89069] text-xs font-semibold tracking-widest uppercase">Trending</span>
              <div className="flex flex-wrap gap-2">
                {['Golf Course Ext.', 'Godrej Upcoming', 'Under 5 Cr', 'Under 10 Cr'].map((tag) => (
                  <button 
                    key={tag}
                    type="button"
                    className="px-4 py-1.5 rounded-full border border-white/20 text-gray-200 text-xs font-medium hover:border-[#A89069] hover:text-white hover:bg-white/10 transition-all duration-300 bg-black/30 backdrop-blur-md shadow-sm cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}