import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Building2, MapPin, ArrowUpRight, Sparkles, Check } from 'lucide-react';
import Tilt3DCard from '../../components/ui/Tilt3DCard';

export default function AboutOfferings() {
  const offerings = [
    {
      id: 'kothis-flats',
      icon: Home,
      tag: 'Residential Distinction',
      title: 'Kothis / Flats',
      description: 'Want to stay in a lavish independent house or a premium apartment where you can get all the facilities and comforts? Let us find this for you in your desirable location.',
      features: [
        'Luxury Independent Builder Floors',
        'Grand Kothis & Mansions in DLF Phase 1–5',
        'Sky Penthouses on Golf Course Road',
        'Vastu-compliant architectural layouts'
      ],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Explore Residential',
      ctaLink: '/ready-to-move'
    },
    {
      id: 'office-spaces',
      icon: Building2,
      tag: 'Commercial Elite',
      title: 'Office Spaces',
      description: 'Switch to modern office spaces with us which are spacious and extremely classy. We’ll help you to find the right space for you depending on the requirements and budget.',
      features: [
        'Grade-A Corporate Floor Plates',
        'Cyber City & Cyber Hub Proximity',
        'Flexible Leasing & Purchase Terms',
        'Strategic High-Footfall Commercial Hubs'
      ],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Inquire Office Spaces',
      ctaLink: '/contact'
    },
    {
      id: 'plots-land',
      icon: MapPin,
      tag: 'Capital Growth & ROI',
      title: 'Plots & Strategic Land',
      description: 'Looking for an optimum investment opportunity? Well, what could be better than investing your money on land and earn higher ROIs for all the coming years ahead with the property values increasing every year.',
      features: [
        'Freehold Residential Plots in DLF',
        'Commercial SCO (Shop-cum-Office) Plots',
        'Exponential Annual Capital Appreciation',
        'Thorough Due Diligence & Clean Titles'
      ],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      ctaText: 'Discover Land Deals',
      ctaLink: '/ready-to-move'
    }
  ];

  return (
    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#A27B48] text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <Sparkles size={13} className="text-[#C5A880]" />
            <span>Stay Tuned & Receive Updates</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1D263B] leading-tight mb-4">
            Our Core Property <span className="italic font-light text-[#C5A880]">Categories</span>
          </h2>

          <p className="text-sm sm:text-base text-[#334155] font-normal leading-relaxed">
            Whether you seek an illustrious residential address, high-end commercial headquarters, or strategic investment land, we curate the finest options in DLF Gurugram.
          </p>
        </motion.div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {offerings.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="h-full"
              >
                <Tilt3DCard
                  maxTilt={6}
                  className="group relative flex flex-col justify-between rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#C5A880] overflow-hidden transition-all duration-500 shadow-[0_12px_35px_-10px_rgba(29,38,59,0.06)] hover:shadow-[0_25px_50px_-12px_rgba(197,168,128,0.25)] h-full"
                >
                  <div>
                    {/* Top Image Banner */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-black/20 to-transparent" />

                      {/* Tag Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-[#A27B48] text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
                          {item.tag}
                        </span>
                      </div>

                      {/* Category Icon */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-[#1D263B] group-hover:bg-[#C5A880] group-hover:text-[#0C101A] flex items-center justify-center transition-all duration-300 shadow-md">
                        <Icon size={22} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-7">
                      <h3 className="text-2xl font-serif font-bold text-[#1D263B] mb-3 group-hover:text-[#A27B48] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#334155] font-normal leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Key Highlights Checklist */}
                      <div className="space-y-2.5 pt-4 border-t border-[#E8E2D8]/80 mb-6">
                        {item.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#1D263B]">
                            <Check size={14} className="text-[#C5A880] shrink-0 mt-0.5" />
                            <span className="font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom CTA Button */}
                  <div className="p-7 pt-0">
                    <Link
                      to={item.ctaLink}
                      className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#1D263B] text-[#1D263B] hover:text-white border border-[#E8E2D8] hover:border-[#1D263B] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm group/btn"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowUpRight size={14} className="text-[#C5A880] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </Tilt3DCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
