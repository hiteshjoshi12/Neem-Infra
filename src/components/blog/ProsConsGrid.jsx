import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * ProsConsGrid Component
 * Semantic comparative evaluation for real estate assets
 */
export default function ProsConsGrid({ data }) {
  if (!data || (!data.pros?.length && !data.cons?.length)) return null;

  return (
    <section aria-label="Comparative Advantages & Considerations" className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        {data.pros && data.pros.length > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h4 className="font-serif font-bold text-base text-emerald-950 mb-4 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-emerald-800 text-xs">
                <Check size={12} strokeWidth={3} />
              </span>
              <span>{data.prosTitle || 'Key Advantages'}</span>
            </h4>
            <ul className="space-y-2.5">
              {data.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-900 leading-snug">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons */}
        {data.cons && data.cons.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <h4 className="font-serif font-bold text-base text-amber-950 mb-4 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-800 text-xs">
                <X size={12} strokeWidth={3} />
              </span>
              <span>{data.consTitle || 'Important Considerations'}</span>
            </h4>
            <ul className="space-y-2.5">
              {data.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-amber-900 leading-snug">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
