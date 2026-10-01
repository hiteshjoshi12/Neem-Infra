import React from 'react';

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  className = '',
  subtext = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none transition-colors"
      />
      {subtext && (
        <p className="text-[11px] text-slate-400 mt-1">
          {subtext}
        </p>
      )}
    </div>
  );
}
