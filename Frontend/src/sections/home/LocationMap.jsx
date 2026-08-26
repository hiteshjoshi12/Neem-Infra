import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function LocationMap() {
  const cardRef = useRef(null);

  // 3D Motion Values for Spring Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="w-full bg-[#F9F8F4] py-32 overflow-hidden border-t border-[#E5E0D8]">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Section Header */}
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
                Visit Our Office
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C302E] leading-tight mb-4">
              Where to <span className="italic text-[#A89069] font-light">Find Us</span>
            </h2>
            
            <p className="text-[#5A605C] font-light text-base md:text-lg leading-relaxed">
              Drop by our headquarters for a private, one-on-one consultation regarding Gurgaon's premier luxury properties.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <a 
              href="https://maps.google.com/?q=Club+Patio+Sector+41+Gurugram" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#2F3E35] text-white px-8 py-4 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#1E2822] transition-colors shadow-lg"
            >
              Open in Google Maps
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>

        {/* 3D Interactive Map Container */}
        <motion.div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
          className="w-full"
        >
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-[0_30px_90px_rgba(44,48,46,0.1)] bg-white"
          >
            
            {/* 
              Embedded Google Map iframe with a custom CSS filter 
              (grayscale/contrast adjustments to match the luxury pearl aesthetic)
            */}
            <iframe 
              title="Club Patio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.7720917296065!2d77.0463!3d28.4506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1867c29bc979%3A0x5241477732607e1!2sClub%20Patio%2C%20South%20City%20I%2C%20Sector%2041%2C%20Gurugram%2C%20Haryana%20122003!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full border-0 filter contrast-[1.05] opacity-90"
              allowFullScreen="" 
              loading="lazy" 
            />

            {/* 3D Floating Address Card (Elevated on the Z-axis for depth) */}
            <motion.div 
              style={{ transform: "translateZ(60px)" }}
              className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-sm bg-white/95 backdrop-blur-md p-8 rounded-2xl border border-[#E5E0D8] shadow-2xl z-10"
            >
              <div className="flex items-center gap-2 text-[#A89069] mb-2">
                <MapPin size={18} />
                <span className="text-xs font-bold tracking-widest uppercase">Headquarters</span>
              </div>
              
              <h3 className="text-2xl font-serif text-[#2C302E] mb-3">Club Patio</h3>
              
              <p className="text-[#5A605C] font-light text-sm leading-relaxed mb-6">
                NH 8, near Huda City Metro Station, Block E, South City I, Sector 41, Gurugram, Haryana 122003, India
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-[#E5E0D8]">
                <a 
                  href="https://maps.google.com/?q=Club+Patio+Sector+41+Gurugram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#2F3E35] hover:text-[#A89069] transition-colors"
                >
                  <Navigation size={14} />
                  Get Directions
                </a>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}