import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function LocationMap() {
  const { sections } = useCms();
  const locData = sections?.location || {};

  const badge = locData.badge || "Visit Our Office";
  const titleMain = locData.titleMain || "Where to";
  const titleItalic = locData.titleItalic || "Find Us";
  const description = locData.description || "Drop by our headquarters for a private, one-on-one consultation regarding Gurgaon's premier luxury properties.";
  const officeName = locData.officeName || "Saudagar Properties Pvt. Ltd";
  const address = locData.address || "38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002";
  const gmapsUrl = locData.gmapsUrl || "https://www.google.com/maps/place/Saudagar+Properties+Pvt.Ltd/@28.4847851,77.0842655,17z/data=!3m1!4b1!4m6!3m5!1s0x390d193a8eabbb6b:0x3d99d3fce74198d5!8m2!3d28.4847851!4d77.0842655!16s%2Fg%2F11f03pch1x";
  const embedUrl = locData.embedUrl || "https://maps.google.com/maps?q=Saudagar+Properties+Pvt.Ltd,+Akashneem+Marg,+DLF+Phase+2,+Gurugram&t=&z=16&ie=UTF8&iwloc=&output=embed";

  const cardRef = useRef(null);

  // 3D Motion Values for Spring Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const rectCacheRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectCacheRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e) => {
    if (!rectCacheRef.current && cardRef.current) {
      rectCacheRef.current = cardRef.current.getBoundingClientRect();
    }
    const rect = rectCacheRef.current;
    if (!rect) return;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    x.set(mouseXPos / rect.width - 0.5);
    y.set(mouseYPos / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rectCacheRef.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <section className="w-full bg-[#F9F8F4] py-12 md:py-16 overflow-hidden border-t border-[#E5E0D8]">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
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
                {badge}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C302E] leading-tight mb-4">
              {titleMain} <span className="italic text-[#A89069] font-light">{titleItalic}</span>
            </h2>
            
            <p className="text-[#334155] font-normal text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <a 
              href={gmapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#2F3E35] text-white px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#1E2822] transition-colors shadow-lg"
            >
              {locData.openMapsText || "Open in Google Maps"}
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>

        {/* 3D Interactive Map Container */}
        <motion.div 
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
          className="w-full"
        >
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-[0_30px_90px_rgba(44,48,46,0.1)] bg-white"
          >
            
            {/* Embedded Google Maps Pinning Saudagar Properties Pvt. Ltd */}
            <iframe 
              title="Saudagar Properties Location"
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0 filter contrast-[1.05] opacity-90"
              allowFullScreen="" 
              loading="lazy" 
            />

            {/* 3D Floating Address Card */}
            <motion.div 
              style={{ transform: "translateZ(60px)" }}
              className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-sm bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-[#E5E0D8] shadow-2xl z-10"
            >
              <div className="flex items-center gap-2 text-[#A89069] mb-2">
                <MapPin size={18} />
                <span className="text-xs font-bold tracking-widest uppercase">{locData.officeBadge || "Headquarters"}</span>
              </div>
              
              <h3 className="text-2xl font-serif text-[#2C302E] mb-3">{officeName}</h3>
              
              <p className="text-[#334155] font-medium text-sm leading-relaxed mb-6">
                {address}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-[#E5E0D8]">
                <a 
                  href={gmapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2F3E35] hover:text-[#A89069] transition-colors"
                >
                  <Navigation size={14} />
                  {locData.directionsText || "Get Directions"}
                </a>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}