import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * DirectAnswerBox
 * Answer Engine Optimization (AEO) component.
 * Provides a 40-60 word authoritative answer lead designed to trigger Google Featured Snippets
 * and provide clean extraction snippets for AI search engines (Perplexity, ChatGPT, Claude).
 */
export default function DirectAnswerBox({
  title = "At a Glance",
  badge = "Advisory Overview",
  answer,
  highlights = [],
  className = "",
}) {
  if (!answer) return null;

  return (
    <div
      className={`relative my-8 p-6 md:p-8 rounded-2xl bg-white/95 border border-brand-gold/30 shadow-lg shadow-brand-gold/5 backdrop-blur-sm ${className}`}
      aria-label="Direct answer overview"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={12} />
          {badge}
        </span>
        {title && (
          <h3 className="text-sm font-semibold text-brand-navy tracking-wide">
            {title}
          </h3>
        )}
      </div>

      <p className="text-base md:text-lg text-brand-navy font-sans leading-relaxed">
        {answer}
      </p>

      {Array.isArray(highlights) && highlights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-brand-navy/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-brand-navy/80 font-medium">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-brand-gold shrink-0" />
              <span>{typeof item === 'string' ? item : item.label || item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
