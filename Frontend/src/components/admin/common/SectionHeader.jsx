import React from 'react';

export default function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="border-b border-white/10 pb-3 mb-6">
      <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
        {Icon && <Icon size={18} className="text-[#C5A880]" />}
        <span>{title}</span>
      </h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
