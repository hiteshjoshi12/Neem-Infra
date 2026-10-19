import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Direct Answer & Executive Summary Component
 * Provides immediate, high-clarity answers at the top of the article for
 * readers, featured snippets, and conversational answer engines.
 */
export default function DirectAnswerBox({ directAnswer, keyTakeaways = [] }) {
  if (!directAnswer && (!keyTakeaways || keyTakeaways.length === 0)) return null;

  return (
    <section 
      aria-label="Executive Summary & Direct Answer" 
      className="my-8 rounded-3xl bg-brand-ivory-warm border-2 border-brand-gold/40 p-6 sm:p-8 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
          <Sparkles size={13} />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
          Executive Summary & Direct Answer
        </span>
      </div>

      {directAnswer && (
        <p className="text-base sm:text-lg font-serif text-brand-navy leading-relaxed mb-6 font-medium">
          {directAnswer}
        </p>
      )}

      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="pt-4 border-t border-brand-navy/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block mb-3">
            Key Takeaways:
          </span>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-slate leading-snug">
                <CheckCircle2 size={15} className="text-brand-gold shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
