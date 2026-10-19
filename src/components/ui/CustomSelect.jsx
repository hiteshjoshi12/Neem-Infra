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
        className="flex items-center justify-between gap-2 px-3 sm:px-3 py-1.5 cursor-pointer select-none group rounded-xl hover:bg-brand-ivory transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden text-left min-w-0">
          {Icon && (
            <div className="w-6 h-6 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
              <Icon className="text-brand-gold w-3 h-3 flex-shrink-0" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-brand-slate-light leading-none mb-0.5">
              {label}
            </span>
            <span className={`text-xs truncate font-medium leading-tight ${value ? 'text-brand-navy font-semibold' : 'text-brand-slate-light'}`}>
              {displayValue}
            </span>
          </div>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-brand-slate-light group-hover:text-brand-gold transition-transform duration-300 flex-shrink-0 ml-1 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-[calc(100%+8px)] bg-white border border-brand-cream-border rounded-2xl shadow-[0_20px_50px_rgba(7,11,22,0.35)] py-2 z-50 max-h-64 overflow-y-auto w-56 sm:w-64 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-brand-cream-border [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <li
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-xs transition-colors cursor-pointer border-b border-brand-cream-border/60 mb-1 font-medium ${
                !value ? 'text-brand-gold font-semibold bg-brand-gold/5' : 'text-brand-slate-light hover:bg-brand-ivory'
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
                    ? 'bg-brand-gold/10 text-brand-navy font-semibold' 
                    : 'text-brand-slate font-normal hover:bg-brand-ivory hover:text-brand-navy'
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
