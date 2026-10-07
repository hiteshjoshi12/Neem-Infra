import React from 'react';
import { BookOpen } from 'lucide-react';

/**
 * TermDefinitions Component
 * Explains complex real estate concepts (UDS, Stilt+4 FAR, FEMA, NNN Leases)
 * in semantic definition lists (<dl>, <dt>, <dd>).
 */
export default function TermDefinitions({ definitions = [] }) {
  if (!definitions || definitions.length === 0) return null;

  return (
    <section aria-label="Key Real Estate Terminology" className="my-10">
      <div className="rounded-2xl border border-[#17213D]/10 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-[#D09A16]" />
          <h3 className="font-serif font-bold text-lg text-[#17213D]">
            Key Terminology & Regulatory Definitions
          </h3>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {definitions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#17213D]/5">
              <dt className="font-serif font-bold text-sm text-[#17213D] mb-1">
                {item.term}
              </dt>
              <dd className="text-xs text-[#566078] leading-relaxed">
                {item.definition}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
