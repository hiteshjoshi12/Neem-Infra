import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X} from 'lucide-react';

const CORE_SERVICES = [
  "Luxury Residential Advisory",
  "Commercial Real Estate",
  "Strategic Investment Opportunities",
  "End-to-End Transaction Support"
];

export default function MobileDrawer({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Blurred Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Drawer Panel */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
        className="relative w-full max-w-md h-full bg-[#111111] text-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
           <h2 className="text-xl font-serif tracking-widest uppercase">Saudagar Properties</h2>
           <button 
             onClick={onClose} 
             className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
           >
             <X size={20} className="text-gray-300" />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <h2 className="text-3xl font-serif mb-6 text-white">About Saudagar Properties Realty</h2>
          <p className="text-sm text-gray-400 leading-loose mb-10 font-light">
            Founded with the vision of offering strategic, transparent, and relationship-driven property advisory services. With deep market understanding and years of experience in Gurgaon’s dynamic real estate landscape, we help clients navigate property decisions with clarity and confidence.
          </p>

          <h3 className="text-xl font-serif mb-6 border-b border-white/10 pb-2">Our Core Services</h3>
          <ul className="space-y-5 text-sm text-gray-300 font-light mb-10">
            {CORE_SERVICES.map((service, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-1 h-1 bg-white rounded-full"></span>
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Area */}
        <div className="p-8 bg-black/50 border-t border-white/10">
          <button className="w-full py-4 mb-6 bg-white text-black text-sm uppercase tracking-widest font-medium hover:bg-gray-200 transition-colors">
            Get A Free Consultation
          </button>
          
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm font-light">Follow us</span>
            <div className="flex gap-4">
              {/* <a href="#" className="hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}