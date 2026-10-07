"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ icon: Icon, label, options, value, onChange, placeholder }) {
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

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : (placeholder || `All ${label}s`);

  return (
    <div className={`relative flex-1 w-full ${isOpen ? 'z-50' : 'z-20'}`} ref={dropdownRef}>
      {/* Trigger Button with Two-Tier Editorial Luxury Hierarchy */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 sm:px-3 py-1.5 cursor-pointer select-none group rounded-xl hover:bg-[#F9F8F4] transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden text-left min-w-0">
          {Icon && (
            <div className="w-6 h-6 rounded-lg bg-[#D09A16]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D09A16]/20 transition-colors">
              <Icon className="text-[#D09A16] w-3 h-3 flex-shrink-0" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8A95A7] leading-none mb-0.5">
              {label}
            </span>
            <span className={`text-xs truncate font-medium leading-tight ${value ? 'text-[#17213D] font-semibold' : 'text-[#64748B]'}`}>
              {displayValue}
            </span>
          </div>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-[#8A95A7] group-hover:text-[#D09A16] transition-transform duration-300 flex-shrink-0 ml-1 ${isOpen ? 'rotate-180 text-[#D09A16]' : ''}`} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-[calc(100%+8px)] bg-white border border-[#E2DDD5] rounded-2xl shadow-[0_20px_50px_rgba(7,11,22,0.35)] py-2 z-50 max-h-64 overflow-y-auto w-56 sm:w-64 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#E5E0D8] [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-xs transition-colors cursor-pointer border-b border-[#F1EFE9] mb-1 font-medium ${
                !value ? 'text-[#D09A16] font-semibold bg-[#D09A16]/5' : 'text-[#64748B] hover:bg-[#F9F8F4]'
              }`}
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
                className={`px-4 py-2 text-xs sm:text-[13px] transition-colors cursor-pointer flex items-center justify-between ${
                  value === opt.value 
                    ? 'bg-[#D09A16]/10 text-[#17213D] font-semibold' 
                    : 'text-[#475569] font-normal hover:bg-[#F9F8F4] hover:text-[#17213D]'
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16]" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
