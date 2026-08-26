import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, BedDouble, Maximize, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PREMIUM_PROPERTIES = [
  {
    id: 1,
    title: "M3M BRABUS Residences",
    developer: "M3M India",
    location: "Sector 58, Golf Course Ext",
    price: "₹20 Cr+*",
    bhk: "4, 5 BHK",
    size: "5,000 - 7,000 Sq Ft",
    tag: "New Launch",
    img: "https://images.unsplash.com/photo-1613490908571-9ce224a1dc13?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "M3M Elie Saab",
    developer: "M3M India",
    location: "Sector 111, Dwarka Expressway",
    price: "₹15 Cr+*",
    bhk: "4 BHK",
    size: "4,205 - 4,055 Sq Ft",
    tag: "New Launch",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Trump Tower",
    developer: "Tribeca Developers & SmartWorld",
    location: "Sector 65, GCER",
    price: "₹10 Cr+*",
    bhk: "3, 4 BHK",
    size: "3,500 - 5,000 Sq Ft",
    tag: "Under Construction",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "DLF The Camellias",
    developer: "DLF Limited",
    location: "DLF Phase 5, Golf Course Road",
    price: "₹35 Cr+*",
    bhk: "4, 5, 6 BHK",
    size: "7,361 - 11,000 Sq Ft",
    tag: "Ready To Move",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function PremiumProperties() {
  const scrollRef = useRef(null);

  return (
    // Switching to the Deep Neem Green background for a cinematic, dark luxury feel
    <section className="relative w-full bg-[#2F3E35] py-32 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-[#A89069]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 mb-16">
        
        {/* Header - Split Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#A89069]" />
              <span className="text-xs tracking-[0.25em] text-[#A89069] uppercase font-semibold">
                Premium Portfolio
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-4">
              Explore Our Range of <br />
              <span className="italic text-[#A89069] font-light">Premium Properties</span>
            </h2>
            
            <p className="text-[#B5BCB7] font-light text-sm md:text-base leading-relaxed">
              Explore ultra-luxury villas, expansive apartments, bespoke builder floors, and select penthouses across Gurgaon's most prestigious pin codes.
            </p>
          </motion.div>

          {/* Desktop "Explore All" Button */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link 
              to="/premium-properties"
              className="group flex items-center gap-4 bg-transparent border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white hover:text-[#2F3E35] transition-all duration-300"
            >
              <span className="text-xs font-bold tracking-widest uppercase">
                Explore Portfolio
              </span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Scrolling Gallery */}
      {/* Using standard CSS scroll snap for buttery smooth native performance */}
      <div className="pl-6 md:pl-12 pb-12">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 md:gap-8 snap-x snap-mandatory scroll-smooth pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {PREMIUM_PROPERTIES.map((property, idx) => (
            <motion.div 
              key={property.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative flex-none w-[85vw] md:w-[400px] lg:w-[480px] aspect-[4/5] snap-center rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Background Image with Parallax-style hover zoom */}
              <img 
                src={property.img} 
                alt={property.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
              />
              
              {/* Dual Gradient Overlay - Darker at bottom for text, subtle overall */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A231E]/95 via-[#1A231E]/40 to-transparent" />
              
              {/* Top Badge */}
              <div className="absolute top-6 right-6">
                <span className="bg-[#A89069]/90 backdrop-blur-md text-white text-[0.65rem] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full shadow-lg">
                  {property.tag}
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end transform transition-transform duration-500">
                
                <p className="text-[#A89069] text-xs tracking-widest uppercase font-semibold mb-2">
                  {property.developer}
                </p>
                
                <h3 className="text-3xl font-serif text-white leading-tight mb-2 group-hover:text-[#E5E0D8] transition-colors">
                  {property.title}
                </h3>
                
                <div className="flex items-center gap-2 text-[#B5BCB7] mb-6">
                  <MapPin size={14} className="text-[#A89069]" />
                  <span className="text-sm font-light">{property.location}</span>
                </div>

                <div className="w-full h-[1px] bg-white/10 mb-6 group-hover:bg-[#A89069]/50 transition-colors" />

                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-3 text-[#B5BCB7]">
                    <div className="flex items-center gap-3">
                      <BedDouble size={16} strokeWidth={1.5} className="text-[#A89069]" />
                      <span className="text-sm font-light">{property.bhk}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Maximize size={16} strokeWidth={1.5} className="text-[#A89069]" />
                      <span className="text-sm font-light">{property.size}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="block text-[0.65rem] text-[#B5BCB7] uppercase tracking-widest mb-1">Starting From</span>
                    <span className="text-2xl font-serif text-white">{property.price}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}

          {/* Invisible spacer at the end to allow the last card to scroll fully to the center */}
          <div className="flex-none w-[10vw] md:w-[5vw]" />
        </div>
      </div>

      {/* Mobile "Explore All" Button */}
      <div className="md:hidden px-6 flex justify-center mt-4">
        <Link 
          to="/premium-properties"
          className="w-full flex items-center justify-center gap-4 bg-transparent border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white hover:text-[#2F3E35] transition-all duration-300"
        >
          <span className="text-xs font-bold tracking-widest uppercase">
            Explore Portfolio
          </span>
          <ArrowRight size={16} />
        </Link>
      </div>

    </section>
  );
}