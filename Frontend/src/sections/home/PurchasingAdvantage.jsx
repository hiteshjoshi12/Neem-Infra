import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    id: "01",
    title: "Verified Property Listings",
    desc: "No random listings. We only show properties that pass strict legal checks, builder credibility, and location value.",
    icon: ShieldCheck,
  },
  {
    id: "02",
    title: "Expert Consultation",
    desc: "From setting your budget to final negotiation, we guide you at every step so you never overpay or make the wrong decision.",
    icon: Compass,
  },
  {
    id: "03",
    title: "End-to-End Support",
    desc: "From site visits to home loans and registration. For NRI buyers, we manage everything remotely so you don't have to travel.",
    icon: Globe,
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

export default function PurchasingAdvantage() {
  return (
    <section className="relative w-full bg-[#2F3E35] py-24 md:py-32 overflow-hidden border-t border-[#4A574F]">
      
      {/* Subtle Ambient Glow for depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A89069]/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/20 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* Left Side: Sticky Header & CTA */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#A89069]" />
              <span className="text-xs tracking-[0.25em] text-[#A89069] uppercase font-semibold">
                The Neem Infra Advantage
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
              Interested in <br />
              <span className="italic text-[#A89069] font-light">Purchasing</span> Your Home?
            </motion.h2>
            
            <motion.p variants={fadeUp} className="text-[#B5BCB7] font-light text-base md:text-lg leading-relaxed mb-10 max-w-md">
              We show you verified properties, help you secure early deals, and guide you through pricing, negotiation, and paperwork—so you avoid costly mistakes.
            </motion.p>
        

            <motion.div variants={fadeUp}>
              <Link 
                to="/contact"
                className="group inline-flex items-center gap-4 bg-transparent border border-white/30 text-white px-8 py-4 rounded-full hover:bg-white hover:border-white hover:text-[#2F3E35] transition-all duration-300"
              >
                <span className="text-xs font-bold tracking-widest uppercase">
                  Let's Start Together
                </span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Interactive Feature Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={feature.id}
                variants={fadeUp}
                className="group relative bg-[#27332C]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 md:p-10 hover:bg-[#27332C] hover:border-[#A89069]/40 transition-all duration-500 ease-out transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden cursor-pointer"
              >
                {/* Number Watermark */}
                <div className="absolute -top-6 -right-4 text-9xl font-serif font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500 pointer-events-none select-none">
                  {feature.id}
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
                  {/* Icon Container */}
                  <div className="flex-none w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#A89069]/20 group-hover:border-[#A89069]/50 transition-colors duration-500">
                    <feature.icon className="text-[#B5BCB7] group-hover:text-[#A89069] transition-colors duration-500" strokeWidth={1.5} size={24} />
                  </div>
                  
                  {/* Text Content */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-3 group-hover:text-[#E5E0D8] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#B5BCB7] font-light text-sm md:text-base leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}