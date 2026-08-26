import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CORRIDOR_DATA = [
  {
    id: "01",
    tag: "ULTRA LUXURY",
    title: "Luxury Projects Under ₹25 Cr",
    desc: "Expansive bespoke estates and penthouse living in Gurgaon's most elite pin codes.",
    link: "/properties?category=under-25cr",
    img: "https://neeminfra.com/wp-content/uploads/2026/07/8mefqs8_1776783054_747237784_optOrig-1170x785.webp"
  },
  {
    id: "02",
    tag: "PREMIUM HIGH-RISE",
    title: "Luxury Apartments Under ₹10 Cr",
    desc: "Sophisticated residences offering panoramic city views and world class clubhouses.",
    link: "/properties?category=under-10cr",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "03",
    tag: "HIGH VALUE",
    title: "Best Projects Under ₹5 Crore",
    desc: "Curated living spaces balancing luxury lifestyle amenities with exceptional ROI potential.",
    link: "/properties?category=under-5cr",
    img: "https://neeminfra.com/wp-content/uploads/2026/07/zbpnxoe_1737625589_563701883_optOrig-1170x785.webp"
  },
  {
    id: "04",
    tag: "PRIME LOCATION",
    title: "Golf Course Road New Launches",
    desc: "The pinnacle of corporate and residential prestige, surrounded by elite social infrastructure.",
    link: "/properties?location=golf-course-road",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "05",
    tag: "GROWTH CORRIDOR",
    title: "Sohna Road New Launches",
    desc: "Fast developing luxury hubs offering seamless connectivity via the elevated corridor.",
    link: "/properties?location=sohna-road",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function CuratedCorridors() {
  const [currentIndex, setCurrentIndex] = useState(2);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CORRIDOR_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CORRIDOR_DATA.length) % CORRIDOR_DATA.length);
  };

  return (
    <section className="relative w-full bg-[#F9F8F4] py-32 overflow-hidden border-t border-[#E5E0D8]">
      
      {/* Updated Header Section */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Left Side: Titles and Text */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#A89069]" />
            <span className="text-xs tracking-[0.25em] text-[#A89069] uppercase font-semibold">
              Portfolio Index
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C302E] leading-tight mb-6">
            Curated Luxury <span className="italic text-[#A89069] font-light">Corridors</span>
          </h2>
          
          {/* Added the descriptive text here */}
          <p className="text-[#5A605C] font-light text-lg leading-relaxed">
            Explore Gurgaon’s most premier residential landmarks and investment opportunities, categorized by prime location and investment scale.
          </p>
        </div>

        {/* Right Side: Custom Navigation Arrows */}
        <div className="flex gap-4 lg:pb-2">
          <button 
            onClick={handlePrev}
            className="w-14 h-14 rounded-full border border-[#E5E0D8] bg-white flex items-center justify-center text-[#2C302E] hover:border-[#A89069] hover:text-[#A89069] transition-all duration-300"
          >
            <ChevronLeft strokeWidth={1.5} />
          </button>
          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full border border-[#E5E0D8] bg-white flex items-center justify-center text-[#2C302E] hover:border-[#A89069] hover:text-[#A89069] transition-all duration-300"
          >
            <ChevronRight strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* 3D Stage Area */}
      <div className="relative w-full h-[600px] flex items-center justify-center perspective-[1200px]">
        <AnimatePresence mode="popLayout">
          {CORRIDOR_DATA.map((item, index) => {
            let offset = index - currentIndex;
            if (offset < -2) offset += CORRIDOR_DATA.length;
            if (offset > 2) offset -= CORRIDOR_DATA.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: `${offset * 60}%`,
                  z: isCenter ? 0 : -Math.abs(offset) * 150,
                  rotateY: offset * -15,
                  scale: isCenter ? 1 : 0.85,
                  opacity: isCenter ? 1 : 0.4,
                  filter: isCenter ? "blur(0px)" : "blur(4px)",
                  zIndex: 10 - Math.abs(offset),
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`absolute w-[85%] md:w-[60%] max-w-[600px] h-[500px] rounded-2xl overflow-hidden shadow-2xl ${
                  isCenter ? 'cursor-default' : 'cursor-pointer'
                }`}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                }}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <motion.div 
                  className="absolute inset-x-0 bottom-0 p-8 md:p-10"
                  animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: isCenter ? 0.2 : 0 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-xs tracking-widest text-white/50">
                      {item.id}
                    </span>
                    <span className="px-3 py-1 rounded bg-[#A89069] text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white">
                      {item.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                    {item.desc}
                  </p>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-3 bg-white text-[#2C302E] px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-[#A89069] hover:text-white transition-all duration-300 group"
                  >
                    Explore Collection
                    <ArrowUpRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Master Directory CTA */}
      <div className="container mx-auto px-6 md:px-12 mt-12 flex justify-center">
        <Link 
          to="/new-launches"
          className="group relative px-8 py-4 bg-[#2F3E35] text-white overflow-hidden rounded-full flex items-center gap-4 hover:shadow-xl transition-all duration-300"
        >
          <span className="relative z-10 text-sm font-semibold tracking-widest uppercase">
            View Complete Master Directory
          </span>
          <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#2F3E35] transition-colors">
            <ArrowUpRight size={16} />
          </div>
          <div className="absolute inset-0 w-0 bg-[#1E2822] transition-all duration-500 ease-out group-hover:w-full z-0" />
        </Link>
      </div>
    </section>
  );
}