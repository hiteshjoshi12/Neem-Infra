import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

/**
 * EditorialSources Component
 * Displays verifiable statutory, municipal, and institutional citations.
 * Fosters credibility for human readers and answer engines alike.
 */
export default function EditorialSources({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section 
      aria-label="Editorial References & Sources" 
      className="my-10 rounded-2xl border border-brand-navy/10 bg-brand-ivory-warm p-6 sm:p-7"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={16} className="text-brand-gold" />
        <h4 className="font-serif font-bold text-sm sm:text-base text-brand-navy">
          Editorial References & Statutory Sources
        </h4>
      </div>
      <p className="text-xs text-brand-slate mb-4 leading-relaxed">
        Saudagar Properties verifies legal frameworks, municipal bylaws, and registry norms directly with statutory bodies in Gurugram, Haryana:
      </p>

      <ul className="space-y-2 text-xs text-brand-slate">
        {sources.map((src, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="font-semibold text-brand-navy shrink-0">[{idx + 1}]</span>
            <div className="flex-1">
              <cite className="not-italic font-medium text-brand-navy">{src.name}</cite>
              {src.organization && (
                <span className="text-brand-slate"> — {src.organization}</span>
              )}
              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-gold hover:underline ml-2"
                >
                  <span>Verify Portal</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
