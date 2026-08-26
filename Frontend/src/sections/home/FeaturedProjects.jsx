import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Scaling, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    id: 1,
    title: "Ganga Anantam",
    developer: "Ganga Realty",
    location: "Sector 85, New Gurugram",
    price: "₹4.19 Cr*",
    bhk: "3, 4 BHK",
    size: "On Request",
    status: "Under Construction",
    img: "https://images.unsplash.com/photo-1613490908571-9ce224a1dc13?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Adani Tatva Estates",
    developer: "Adani Realty",
    location: "Sector 99A, New Gurugram",
    price: "On Request*",
    bhk: "4, 5 BHK",
    size: "3,000 - 6,000 Sq Ft",
    status: "Under Construction",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Ashiana Aarcham",
    developer: "Ashiana Housing",
    location: "Sector 80, SPR",
    price: "₹2.99 Cr*",
    bhk: "3, 4, 5 BHK",
    size: "1,967 - 2,288 Sq Ft",
    status: "New Launch",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Conscient Parq",
    developer: "Conscient Infrastructure",
    location: "Sector 80, SPR",
    price: "₹3.19 Cr*",
    bhk: "3, 4 BHK",
    size: "1,963 - 1,964 Sq Ft",
    status: "Under Construction",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Max Estate 360",
    developer: "Max Estates",
    location: "Sector 36A, Dwarka Expy",
    price: "₹5.48 Cr*",
    bhk: "3, 4 BHK",
    size: "2,500 - 3,800 Sq Ft",
    status: "Under Construction",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Satya Levante Residences",
    developer: "Satya Group",
    location: "Sector 104, Dwarka Expy",
    price: "₹3.10 Cr*",
    bhk: "2, 3, 4 BHK",
    size: "1,300 - 2,800 Sq Ft",
    status: "Under Construction",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function FeaturedProjects() {
  return (
    // Contrasting pure white background against the pearl background of previous sections
    <section className="w-full bg-white py-32 overflow-hidden border-t border-[#E5E0D8]">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Section Header - Editorial Centered */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-[#A89069]" />
              <span className="text-xs tracking-[0.25em] text-[#A89069] uppercase font-semibold">
                Featured Properties
              </span>
              <span className="w-12 h-[1px] bg-[#A89069]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C302E] leading-tight mb-6">
              New Launch Projects <br className="hidden md:block" />
              <span className="italic text-[#A89069] font-light">in Gurgaon</span>
            </h2>
            
            <p className="text-[#5A605C] font-light text-sm md:text-base leading-relaxed max-w-2xl">
              Explore our latest curated properties—high-rise apartments, bespoke builder floors, villas, and select penthouses available for discerning buyers.
            </p>
          </motion.div>
        </div>

        {/* Spacious, Borderless Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {PROJECTS.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Container with Hover Scale & Floating Badge */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-6">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Elegant Status Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                  <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#2C302E]">
                    {project.status}
                  </span>
                </div>

                {/* View Details Hover Button */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-lg">
                  <ArrowUpRight size={18} className="text-[#2F3E35]" />
                </div>
              </div>

              {/* Minimalist Data Presentation */}
              <div className="flex flex-col flex-grow px-2">
                
                {/* Title & Developer */}
                <div className="mb-4">
                  <h3 className="text-2xl font-serif text-[#2C302E] mb-1 group-hover:text-[#A89069] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs tracking-widest text-[#5A605C] uppercase font-medium">
                    By {project.developer}
                  </p>
                </div>

                {/* Location & Price */}
                <div className="flex items-end justify-between mb-5">
                  <div className="flex items-center gap-1.5 text-[#5A605C]">
                    <MapPin size={14} className="text-[#A89069]" />
                    <span className="text-sm font-light">{project.location}</span>
                  </div>
                  <span className="text-xl font-serif text-[#2F3E35]">
                    {project.price}
                  </span>
                </div>

                {/* Refined Divider */}
                <div className="w-full h-[1px] bg-[#E5E0D8] mb-4 group-hover:bg-[#A89069]/30 transition-colors" />

                {/* Bottom Amenities Row */}
                <div className="flex items-center gap-6 text-[#5A605C]">
                  <div className="flex items-center gap-2">
                    <BedDouble size={16} strokeWidth={1.5} className="text-[#A89069]" />
                    <span className="text-sm font-light">{project.bhk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scaling size={16} strokeWidth={1.5} className="text-[#A89069]" />
                    <span className="text-sm font-light">{project.size}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <Link 
            to="/properties"
            className="group flex items-center gap-4 bg-transparent border border-[#2C302E] text-[#2C302E] px-8 py-4 rounded-full hover:bg-[#2C302E] hover:text-white transition-all duration-300"
          >
            <span className="text-sm font-bold tracking-widest uppercase">
              View All Projects
            </span>
            <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}