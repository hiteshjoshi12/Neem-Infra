"use client";

import React from 'react';
import { ExternalLink, TrendingUp, Calendar, Info } from 'lucide-react';

/**
 * MarketStat Component
 * Renders verified market metrics with explicit third-party attribution.
 * Strict compliance rule: Renders NOTHING unless all 5 fields (value, label,
 * sourceName, sourceUrl, asOfDate) are fully populated.
 */
export default function MarketStat({
  value,
  label,
  sourceName,
  sourceUrl,
  asOfDate,
  className = '',
}) {
  // Strict compliance check: render nothing unless ALL 5 fields are filled
  if (
    !value ||
    !label ||
    !sourceName ||
    !sourceUrl ||
    !asOfDate ||
    typeof value !== 'string' ||
    typeof label !== 'string' ||
    value.trim() === '' ||
    label.trim() === '' ||
    sourceName.trim() === '' ||
    sourceUrl.trim() === '' ||
    asOfDate.trim() === ''
  ) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border border-brand-gold/30 bg-white/90 p-5 shadow-sm backdrop-blur-xs transition-all hover:border-brand-gold hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-brand-slate">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-brand-gold" />
          <span>{label}</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] font-mono text-brand-slate-light">
          <Calendar size={12} />
          <span>{asOfDate}</span>
        </span>
      </div>

      <div className="mt-3 font-serif text-2xl font-bold text-brand-navy">
        {value}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-brand-navy/10 pt-2.5 text-[11px]">
        <span className="text-brand-slate">Sourced from:</span>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand-gold hover:underline"
        >
          <span>{sourceName}</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
