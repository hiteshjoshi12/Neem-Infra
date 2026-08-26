import React from 'react';
import { motion } from 'framer-motion';

// Replace the src paths with the actual logo files you have in your public/assets folder
const DEVELOPERS = [
  { name: "Godrej Properties", img: "/logos/godrej.png" },
  { name: "DLF", img: "/logos/dlf.png" },
  { name: "Adani Realty", img: "/logos/adani.png" },
  { name: "Sobha Realty", img: "/logos/sobha.png" },
  { name: "Tata Housing", img: "/logos/tata.png" },
  { name: "Elan", img: "/logos/elan.png" },
  { name: "Smart World", img: "/logos/smartworld.png" },
  { name: "Signature Global", img: "/logos/signature.png" },
];

// We double the array so the infinite scroll loops seamlessly without a gap
const MARQUEE_ITEMS = [...DEVELOPERS, ...DEVELOPERS];

export default function Developers() {
  return (
    // Clean white background to make the logos pop and contrast the previous sections
    <section className="relative w-full bg-white py-32 overflow-hidden border-t border-[#E5E0D8]">
      
      {/* Editorial Header */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-[#A89069]" />
          <span className="text-xs tracking-[0.25em] text-[#A89069] uppercase font-semibold">
            Industry Leaders
          </span>
          <span className="w-8 h-[1px] bg-[#A89069]" />
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C302E]">
          Our Prestige <span className="italic text-[#A89069] font-light">Partners</span>
        </h2>
      </div>

      {/* 3D Perspective Stage */}
      <div className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center perspective-[1000px] overflow-hidden">
        
        {/* Soft edge gradients to fade the logos in and out smoothly */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        {/* 
          The 3D Track
          We tilt the entire container on the X and Y axis to make it look like 
          an angled architectural wall stretching away from the user.
        */}
        <div 
          className="w-full h-full flex items-center"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(10deg) rotateY(-5deg) rotateZ(1deg)", 
          }}
        >
          {/* Framer Motion Infinite Scroll Container */}
          <motion.div 
            className="flex gap-6 md:gap-10 w-max"
            animate={{
              x: ["0%", "-50%"] // Moves exactly half its doubled width, then instantly resets
            }}
            transition={{
              duration: 35, // Adjust this to speed up or slow down the marquee
              ease: "linear",
              repeat: Infinity
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {MARQUEE_ITEMS.map((dev, idx) => (
              <div 
                key={idx}
                className="group relative flex-none w-[200px] h-[120px] md:w-[280px] md:h-[160px] perspective-[500px]"
              >
                {/* 
                  3D Glass Tile Interaction
                  Hovering pulls the tile forward on the Z-axis, removes the grayscale filter,
                  and adds a luxury shadow. 
                */}
                <div className="w-full h-full bg-[#F9F8F4]/50 border border-[#E5E0D8] rounded-2xl flex items-center justify-center p-6 md:p-8 backdrop-blur-sm transition-all duration-500 ease-out transform group-hover:translate-z-[40px] group-hover:-translate-y-2 group-hover:bg-white group-hover:shadow-[0_25px_60px_rgba(44,48,46,0.08)] group-hover:border-[#A89069]/30 cursor-pointer">
                  
                  {/* Fallback text if image breaks, otherwise shows the logo */}
                  {dev.img ? (
                    <img 
                      src={dev.img} 
                      alt={dev.name} 
                      className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  ) : (
                    <span className="font-serif text-[#2C302E] text-xl text-center">
                      {dev.name}
                    </span>
                  )}
                  
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}