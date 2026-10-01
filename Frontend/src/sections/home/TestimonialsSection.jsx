import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ShieldCheck, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: "01",
    name: "Deepak Arora",
    role: "Investor",
    location: "Dubai, UAE",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c3.jpg",
    quote:
      "Selecting a best real estate consultant in Gurugram, especially one who is trustworthy, experienced, and honest, is the basic pillar of investment. From their before sales to after sales service, I can definitely say that customer satisfaction is in the company's DNA. Extremely happy to approach them for my investment decisions and will look up to the same in future too.",
    tag: "NRI Investment Advisory"
  },
  {
    id: "02",
    name: "Kedarnath Gupta",
    role: "Investor",
    location: "Dubai, UAE",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c2.jpg",
    quote:
      "Choosing the right home is a very important aspect of any individual's life. With their decade-long experience in the Gurgaon real estate market, Saudagar Properties Pvt. Ltd. played a key role in ensuring that I was making the right decision while choosing my dream home by providing the right push when needed, and cautioning me when necessary. I owe the team a huge part of my dream.",
    tag: "High-Value Transaction"
  },
  {
    id: "03",
    name: "Saravjit Dasaan",
    role: "Investor & End User",
    location: "India",
    rating: 5,
    avatar: "https://saudagarproperties.com/wp-content/uploads/2021/01/c1.jpg",
    quote:
      "The team seamlessly took over everything, from research, visit, paperwork to maintenance. Amidst a plethora of options, Saudagar Properties shortlisted the best residential properties in Gurgaon according to my needs and comfort. It has been a delight working with the highly-qualified and seasoned team. I would recommend their services to all my friends and acquaintances.",
    tag: "End-to-End Concierge"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

import { useCms } from '../../context/CmsContext';

export default function TestimonialsSection() {
  const { testimonials, sections } = useCms();
  const list = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;
  const testData = sections?.testimonials || {};

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (list.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % list.length);
  };

  const handlePrev = () => {
    if (list.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const currentItem = list[activeIndex] || list[0] || {};

  return (
    <section className="relative w-full py-12 md:py-20 bg-[#FAF8F5] text-[#1D263B] overflow-hidden border-t border-[#EFECE6]">
      {/* Background Architectural Ambient Grid & Subtle Glow */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#1D263B_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">

        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C5A880]/40 shadow-sm text-[11px] font-bold tracking-[0.25em] text-[#A27B48] uppercase mb-4">
            <Sparkles size={12} className="text-[#C5A880]" />
            <span>{testData.badge || "Client Perspectives"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1D263B] leading-[1.15] mb-4">
            {testData.titleMain || "Words of"} <span className="italic font-light text-[#C5A880]">{testData.titleItalic || "Distinction"}</span>
          </h2>

          <div className="flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-[#C5A880]/60" />
            <span className="text-xs tracking-[0.25em] text-[#C5A880] uppercase font-semibold">{testData.subBadge || "Testimonial"}</span>
            <span className="w-12 h-[1px] bg-[#C5A880]/60" />
          </div>
        </motion.div>

        {/* ===================== DESKTOP 3D GRID (md and up) ===================== */}
        {/* ===================== DESKTOP 3D GRID (md and up) ===================== */}
        <div className="hidden md:grid md:grid-cols-3 gap-7 lg:gap-8 perspective-[1200px] items-stretch">
          {list.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -10,
                rotateX: 3,
                rotateY: index === 0 ? 3 : index === 2 ? -3 : 0,
                transition: { duration: 0.3 }
              }}
              className="group relative rounded-3xl bg-white border border-[#E8E2D8] p-8 lg:p-9 flex flex-col justify-between shadow-[0_15px_40px_-15px_rgba(29,38,59,0.07)] hover:shadow-[0_30px_60px_-12px_rgba(197,168,128,0.22)] hover:border-[#C5A880] transition-all duration-500 transform-gpu"
            >
              {/* Subtle 3D Glass Gold Bevel Accent */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner Architectural Bracket Accents on Hover */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C5A880] rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C5A880] rounded-br-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

              <div>
                {/* Top Badge & Rating Row */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#C5A880" className="text-[#C5A880]" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[10px] font-semibold text-[#8B7355] uppercase tracking-wider">
                    <ShieldCheck size={12} className="text-[#C5A880]" />
                    <span>{item.tag || 'Verified'}</span>
                  </span>
                </div>

                {/* Floating 3D Quote Watermark */}
                <div className="relative mb-5">
                  <Quote
                    size={42}
                    className="text-[#C5A880]/20 absolute -top-4 -left-2 pointer-events-none group-hover:text-[#C5A880]/35 transition-colors duration-500"
                  />
                  <p className="relative z-10 text-[#1E293B] text-sm lg:text-[14.5px] font-normal leading-relaxed tracking-normal pt-2">
                    "{item.quote}"
                  </p>
                </div>
              </div>

              {/* Author Info Footer */}
              <div className="pt-6 mt-6 border-t border-[#F0ECE1] flex items-center gap-4 sm:gap-5">
                {/* Elevated Luxury Client Portrait */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-20 h-20 lg:w-22 lg:h-22 rounded-2xl p-[2.5px] bg-gradient-to-tr from-[#C5A880] via-[#FAF8F5] to-[#B39366] shadow-[0_10px_25px_-5px_rgba(197,168,128,0.35)] group-hover:shadow-[0_14px_32px_-4px_rgba(197,168,128,0.45)] group-hover:scale-105 transition-all duration-300">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-full h-full rounded-[14px] object-cover object-top"
                    />
                  </div>
                  {/* Verified Shield Badge on Portrait */}
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1D263B] border-2 border-white text-[#C5A880] flex items-center justify-center shadow-md"
                    title="Verified Saudagar Properties Client"
                  >
                    <ShieldCheck size={12} className="stroke-[2.5]" />
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="text-lg lg:text-xl font-serif font-bold text-[#1D263B] truncate group-hover:text-[#A27B48] transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#8B7355] font-semibold tracking-wide uppercase mt-1">
                    {item.role}, {item.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===================== MOBILE-FIRST INTERACTIVE 3D CAROUSEL (< md) ===================== */}
        <div className="md:hidden">
          <div className="relative overflow-hidden perspective-[1000px] pb-4">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl bg-white border border-[#E8E2D8] p-7 shadow-[0_20px_45px_-12px_rgba(29,38,59,0.12)] flex flex-col justify-between"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-6 right-6 h-[2.5px] bg-[#C5A880]" />

              <div>
                <div className="flex items-center justify-between gap-3 mb-5 pt-1">
                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {[...Array(currentItem.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#C5A880" className="text-[#C5A880]" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[10px] font-semibold text-[#8B7355] uppercase tracking-wider">
                    <ShieldCheck size={12} className="text-[#C5A880]" />
                    <span>{currentItem.tag || 'Verified'}</span>
                  </span>
                </div>

                <div className="relative mb-5">
                  <Quote size={36} className="text-[#C5A880]/20 absolute -top-3 -left-1" />
                  <p className="relative z-10 text-[#1E293B] text-sm font-normal leading-relaxed pt-2">
                    "{currentItem.quote}"
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F0ECE1] flex items-center gap-4">
                {/* Elevated Mobile Client Portrait */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-[2.5px] bg-gradient-to-tr from-[#C5A880] via-[#FAF8F5] to-[#B39366] shadow-[0_8px_20px_rgba(197,168,128,0.3)]">
                    <img
                      src={currentItem.avatar}
                      alt={currentItem.name}
                      className="w-full h-full rounded-[14px] object-cover object-top"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1D263B] border-2 border-white text-[#C5A880] flex items-center justify-center shadow-sm"
                    title="Verified Saudagar Properties Client"
                  >
                    <ShieldCheck size={11} className="stroke-[2.5]" />
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="text-base sm:text-lg font-serif font-bold text-[#1D263B] truncate">
                    {currentItem.name}
                  </h4>
                  <p className="text-xs text-[#8B7355] font-semibold tracking-wide uppercase mt-0.5">
                    {currentItem.role}, {currentItem.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Carousel Controls & Progress Dots */}
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="flex items-center gap-2">
              {list.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-7 bg-[#C5A880]' : 'w-2 bg-[#D1D5DB]'
                    }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-[#E8E4DA] bg-white flex items-center justify-center text-[#1D263B] active:scale-95 shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-[#E8E4DA] bg-white flex items-center justify-center text-[#1D263B] active:scale-95 shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
