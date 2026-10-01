import React from 'react';

export default function FormInput({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  required = false
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        required={required}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[0.05] border border-white/10 focus:border-[#C5A880] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
      />
    </div>
  );
}
