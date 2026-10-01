import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ icon: Icon, label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  return (
    <div className="relative flex-1 w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-4 py-3 lg:py-2 cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className="text-[#C5A880] w-4 h-4 flex-shrink-0" />
          <span className={`text-sm truncate ${value ? 'text-[#1D263B] font-medium' : 'text-[#334155] font-normal'}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-[#C5A880] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] bg-white border border-[#E5E0D8] rounded-xl shadow-[0_20px_50px_rgba(20,25,35,0.15)] py-2 z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#E5E0D8] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="px-4 py-2.5 text-xs text-[#64748B] hover:bg-[#F9F8F4] transition-colors cursor-pointer"
            >
              All {label}s
            </li>

            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  value === opt.value 
                    ? 'bg-[#C5A880]/10 text-[#1D263B] font-semibold' 
                    : 'text-[#334155] font-normal hover:bg-[#F9F8F4] hover:text-[#1D263B]'
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
