import React from 'react';
import FAQJsonLd from '@/components/seo/FAQJsonLd';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function BlogFaq({ faqs = [] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="my-12">
      {/* Schema.org FAQPage for Google Voice & Rich Snippets */}
      <FAQJsonLd faqs={faqs} />

      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={18} className="text-[#C6A24A]" />
        <h2 id="faq-heading" className="font-serif font-bold text-2xl sm:text-3xl text-[#17213D] tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white border border-[#17213D]/10 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs hover:border-[#C6A24A]/40"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none font-serif font-semibold text-[#17213D] text-base md:text-lg">
              <span className="pr-4">{faq.question}</span>
              <ChevronDown
                size={18}
                className="text-[#C6A24A] flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm md:text-base text-[#475569] leading-relaxed border-t border-[#17213D]/5">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
