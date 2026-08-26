import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOCATIONS = [
  {
    id: "golf-course-road",
    title: "Golf Course Road",
    subtitle: "The ultimate address for investment and luxury living.",
    img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    // Spans 2 columns and 2 rows on desktop for massive visual impact
    gridClass: "md:col-span-2 md:row-span-2 h-[400px] md:h-full", 
  },
  {
    id: "new-gurgaon",
    title: "New Gurgaon",
    tag: "Sec 80-99",
    subtitle: "A rapidly growing residential hub with modern connectivity.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    gridClass: "md:col-span-1 md:row-span-1 h-[300px] md:h-[300px]",
  },
  {
    id: "sohna-road",
    title: "Sohna Road",
    subtitle: "A vibrant mix of commercial hubs and upscale residences.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    gridClass: "md:col-span-1 md:row-span-1 h-[300px] md:h-[300px]",
  },
  {
    id: "spr",
    title: "SPR",
    tag: "Southern Peripheral",
    subtitle: "An emerging corridor for premium real estate and fast-tracked growth.",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    gridClass: "md:col-span-3 lg:col-span-3 md:row-span-1 h-[300px] md:h-[350px]", // Wide bottom banner
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Locations() {
  return (
    // Bringing back the warm Pearl background to contrast the dark Premium section above it
    <section className="w-full bg-[#F9F8F4] py-32 overflow-hidden border-t border-[#E5E0D8]">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header - Left Aligned Editorial Style */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#A89069]" />
              <span className="text-xs tracking-[0.25em] text-[#A89069] uppercase font-semibold">
                Prime Neighborhoods
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C302E] leading-[1.1] mb-6">
              Live or invest in Gurgaon's most <br className="hidden md:block" />
              <span className="italic text-[#A89069] font-light">sought-after</span> locations.
            </h2>
            
            <p className="text-[#5A605C] font-light text-lg leading-relaxed max-w-2xl">
              We specialize in high-performing and lifestyle-rich locations, meticulously selected for exceptional residential and investment purposes.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block pb-2"
          >
            <Link 
              to="/locations"
              className="flex items-center gap-3 text-[#2C302E] font-medium tracking-widest uppercase text-xs hover:text-[#A89069] transition-colors group"
            >
              Explore Map View
              <div className="w-8 h-8 rounded-full border border-[#E5E0D8] group-hover:border-[#A89069] flex items-center justify-center transition-colors">
                <Map size={14} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-auto">
          {LOCATIONS.map((loc, idx) => (
            <motion.div 
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${loc.gridClass}`}
            >
              {/* Background Image with Slow Zoom on Hover */}
              <img 
                src={loc.img} 
                alt={loc.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              
              {/* Gradient Overlay - Darkens on Hover for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A231E]/90 via-[#1A231E]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content Box */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl md:text-3xl font-serif text-white">
                      {loc.title}
                    </h3>
                    {loc.tag && (
                      <span className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-[0.6rem] font-bold tracking-[0.1em] uppercase text-white border border-white/30">
                        {loc.tag}
                      </span>
                    )}
                  </div>
                  
                  {/* Subtitle reveals smoothly on hover */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                    <p className="text-[#E5E0D8] font-light text-sm leading-relaxed overflow-hidden">
                      {loc.subtitle}
                    </p>
                  </div>
                  
                </div>

                {/* Floating Arrow Icon - Top Right */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center lg:hidden">
          <Link 
            to="/locations"
            className="flex items-center gap-3 bg-white border border-[#E5E0D8] text-[#2C302E] px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs shadow-sm hover:border-[#A89069] hover:text-[#A89069] transition-colors"
          >
            Explore Map View
            <Map size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}