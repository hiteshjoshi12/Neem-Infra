import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, Factory, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES_DATA = [
  {
    id: "01",
    category: "RESIDENTIAL REAL ESTATE",
    title: "Residential",
    icon: Building2,
    badge: "Plots • Builder Floors • Kothis • Apartments",
    description: "From residential plots and builder floors in DLF to apartments in Sushant Lok and premium kothis in Gurgaon, we specialize in properties that fit your lifestyle and your family’s future. Whether you're looking to buy or sell, we recommend options that combine comfort, location, and long-term value.",
    highlights: ["DLF Phase 1–5 Floors", "Sushant Lok & Golf Course", "Verified Legal Titles", "Luxury Kothis"],
    bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    link: "/services/residential"
  },
  {
    id: "02",
    category: "COMMERCIAL REAL ESTATE",
    title: "Commercial",
    icon: Briefcase,
    badge: "Office Spaces • Retail • Corporate Hubs",
    description: "Great ideas need the right environment to thrive. Our team helps you find and lease office spaces in Gurgaon, including top locations like Udyog Vihar and Golf Course Road. With a deep understanding of commercial real estate in Gurugram, we streamline your search and provide tailored options that suit your business needs.",
    highlights: ["Udyog Vihar Offices", "Golf Course Road Hubs", "Corporate Lease", "High-Yield Assets"],
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    link: "/services/commercial"
  },
  {
    id: "03",
    category: "INDUSTRIAL REAL ESTATE",
    title: "Industrial",
    icon: Factory,
    badge: "Warehouses • Industrial Plots • Factories",
    description: "Whether you’re expanding or relocating, we offer smart, reliable options for industrial plots, warehouses, and factory leasing opportunities in Udyog Vihar and surrounding hubs. Our mission is to find industrial properties that support growth, productivity, and scalability for your business.",
    highlights: ["Industrial Warehouses", "Factory Land Leasing", "Scalable Outlets", "Prime Connectivity"],
    bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    link: "/services/industrial"
  }
];

export default function ServicesCardsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-10 mb-16 md:mb-20">
      {SERVICES_DATA.map((service, index) => {
        const IconComponent = service.icon;
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col h-full rounded-3xl bg-white border border-[#E8E2D8] shadow-[0_12px_35px_-10px_rgba(29,38,59,0.06)] hover:shadow-[0_25px_50px_-10px_rgba(197,168,128,0.28)] transition-all duration-500 overflow-hidden transform-gpu hover:-translate-y-2"
          >
            {/* Top Image Preview with Dark Vignette */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden">
              <img
                src={service.bgImage}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D263B] via-[#1D263B]/35 to-transparent" />
              
              {/* Category Badge & Number Indicator */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3.5 py-1 rounded-full bg-[#1D263B]/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  {service.category}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-md border border-white/30 text-[#C5A880] flex items-center justify-center text-xs font-bold font-serif shadow-sm">
                  {service.id}
                </span>
              </div>

              {/* Title & Icon overlaid at the bottom of the image */}
              <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#C5A880] text-[#1D263B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <IconComponent size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-[#E2D4BF] font-medium">
                    {service.badge}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow bg-white">
              <p className="text-[#334155] text-xs sm:text-sm font-normal leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Bulleted Micro-Highlights */}
              <div className="pt-4 border-t border-[#F1F5F9] space-y-2 mb-6">
                {service.highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#1D263B] font-medium">
                    <CheckCircle2 size={14} className="text-[#C5A880] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Inquire Action Button */}
              <Link
                to="/contact"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#FAF8F5] hover:bg-[#1D263B] text-[#1D263B] hover:text-white border border-[#E8E2D8] hover:border-[#1D263B] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 group/btn shadow-sm"
              >
                <span>Inquire Service</span>
                <ArrowRight size={14} className="text-[#C5A880] group-hover/btn:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            {/* Bottom Champagne Gold Hover Glow Line */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
}
