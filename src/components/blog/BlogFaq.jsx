import React from 'react';
import FAQJsonLd from '@/components/seo/FAQJsonLd';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function BlogFaq({ faqs = [], renderSchema = true }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="my-12">
      {/* Schema.org FAQPage for Google Rich Snippets (skipped if included in article graph) */}
      {renderSchema && <FAQJsonLd faqs={faqs} />}

      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={18} className="text-brand-gold" />
        <h2 id="faq-heading" className="font-serif font-bold text-2xl sm:text-3xl text-brand-navy tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white border border-brand-navy/10 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs hover:border-brand-gold/40"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none font-serif font-semibold text-brand-navy text-base md:text-lg">
              <span className="pr-4">{faq.question}</span>
              <ChevronDown
                size={18}
                className="text-brand-gold flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm md:text-base text-brand-slate leading-relaxed border-t border-brand-navy/5">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
