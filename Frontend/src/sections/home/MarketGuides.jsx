import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const GUIDES = [
  {
    id: "dwarka-expressway",
    category: "Area Guide",
    title: "Dwarka Expressway: The New Epicenter of Luxury Real Estate",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    featured: true, // Will take up a larger primary slot
  },
  {
    id: "spr-corridor",
    category: "Market Insights",
    title: "Southern Peripheral Road (SPR): Investment Potential & Growth",
    readTime: "3 min read",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "golf-course-road",
    category: "Area Guide",
    title: "Golf Course Road: Why Established Luxury Remains Unmatched",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sohna-road",
    category: "Buyer Advisory",
    title: "Sohna Road vs Golf Course Extension: Making the Right Choice",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1613490908571-9ce224a1dc13?auto=format&fit=crop&w=800&q=80",
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function MarketGuides() {
  const featuredGuide = GUIDES[0];
  const secondaryGuides = GUIDES.slice(1);

  return (
    <section className="w-full bg-[#F9F8F4] py-32 overflow-hidden border-t border-[#E5E0D8]">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
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
                Expert Knowledge
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C302E] leading-tight mb-4">
              Guide for <span className="italic text-[#A89069] font-light">Buyers & Sellers</span>
            </h2>
            
            <p className="text-[#5A605C] font-light text-base md:text-lg leading-relaxed">
              Get clear insights on Gurgaon's property market—latest listings, price trends, and expert advice for smart real estate decisions.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block pb-2"
          >
            <Link 
              to="/blogs"
              className="flex items-center gap-3 text-[#2C302E] font-medium tracking-widest uppercase text-xs hover:text-[#A89069] transition-colors group"
            >
              View All Articles
              <div className="w-8 h-8 rounded-full border border-[#E5E0D8] group-hover:border-[#A89069] flex items-center justify-center transition-colors">
                <BookOpen size={14} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Editorial Magazine Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Featured Large Article */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col group cursor-pointer"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl mb-6">
              <img 
                src={featuredGuide.img} 
                alt={featuredGuide.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#2C302E]">
                  {featuredGuide.category}
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-xs text-[#5A605C] font-light mb-3">
                <span>{featuredGuide.readTime}</span>
                <span>•</span>
                <span className="text-[#A89069] font-medium tracking-wider uppercase">Featured Insight</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif text-[#2C302E] leading-snug mb-4 group-hover:text-[#A89069] transition-colors">
                {featuredGuide.title}
              </h3>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#2C302E] group-hover:text-[#A89069] transition-colors mt-auto pt-4">
                <span>Read Full Guide</span>
                <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Stacked Secondary Articles */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {secondaryGuides.map((guide, idx) => (
              <motion.div 
                key={guide.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group flex items-center gap-6 bg-white p-6 rounded-2xl border border-[#E5E0D8] hover:border-[#A89069]/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="flex-none w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden">
                  <img 
                    src={guide.img} 
                    alt={guide.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center flex-grow">
                  <div className="flex items-center gap-3 text-[0.65rem] text-[#5A605C] font-light mb-2">
                    <span className="text-[#A89069] font-medium uppercase tracking-wider">{guide.category}</span>
                    <span>•</span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h4 className="text-lg md:text-xl font-serif text-[#2C302E] leading-snug group-hover:text-[#A89069] transition-colors line-clamp-2">
                    {guide.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Mobile View All Button */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link 
            to="/blogs"
            className="flex items-center gap-3 bg-white border border-[#E5E0D8] text-[#2C302E] px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs shadow-sm"
          >
            View All Articles
            <BookOpen size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}