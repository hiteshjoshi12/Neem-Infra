'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { 
  Sparkles, Calendar, Clock, Building2, ChevronRight, 
  HelpCircle, ChevronDown, CheckCircle2, AlignLeft, ShieldCheck 
} from 'lucide-react';
import { MarkdownRenderer, extractTableOfContents } from '@/lib/blog/markdownRenderer';

export default function LiveArticlePreview({
  formData = {},
  author = null,
  category = null,
  isSplitView = false
}) {
  const tableOfContents = useMemo(() => {
    return extractTableOfContents(formData.content || '');
  }, [formData.content]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(formData.publishedAt || new Date()).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Today';
    }
  }, [formData.publishedAt]);

  const authorName = author?.name || 'Saudagar Editorial Desk';
  const authorRole = author?.jobTitle || 'Senior Property Consultant';
  const authorImg = author?.image || null;
  const categoryName = category?.name || 'Market Insights';

  return (
    <div className="w-full bg-[#FAF8F5] text-[#17213D] selection:bg-[#D09A16] selection:text-[#0E162B] rounded-2xl overflow-hidden shadow-2xl border border-black/10">
      
      {/* Top Browser Chrome Bar */}
      <div className="bg-[#0E162B] text-slate-300 px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
            https://www.saudagarproperties.com/blog/{formData.slug || 'preview'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#D09A16] uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#D09A16] animate-pulse" />
          <span>Live Synchronous Website Preview</span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-4 sm:p-8 lg:p-10 max-w-5xl mx-auto">
        
        {/* =========================================================
            1. BREADCRUMBS
        ========================================================== */}
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#8892A6] mb-5 overflow-x-auto">
          <span>Home</span>
          <ChevronRight size={12} className="text-[#D09A16] shrink-0" />
          <span>Blog</span>
          <ChevronRight size={12} className="text-[#D09A16] shrink-0" />
          <span className="text-[#D09A16]">{categoryName}</span>
          <ChevronRight size={12} className="text-[#D09A16] shrink-0" />
          <span className="truncate max-w-[200px] text-[#17213D]">{formData.title || 'Untitled Article'}</span>
        </div>

        {/* =========================================================
            2. CATEGORY PILL
        ========================================================== */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/30">
            <Sparkles size={11} />
            <span>{categoryName}</span>
          </span>
        </div>

        {/* =========================================================
            3. H1 ARTICLE TITLE
        ========================================================== */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] tracking-tight mb-5 leading-[1.15]">
          {formData.title || 'Enter your headline in the editor on the left...'}
        </h1>

        {/* =========================================================
            4. EXCERPT / DEK
        ========================================================== */}
        {formData.excerpt ? (
          <p className="text-base sm:text-lg text-[#475569] font-serif italic leading-relaxed mb-6 border-l-3 border-[#D09A16] pl-4 sm:pl-5">
            {formData.excerpt}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">
            (Add an editorial excerpt in the top settings card to display a highlighted lead paragraph)
          </p>
        )}

        {/* =========================================================
            5. DIRECT ANSWER & KEY TAKEAWAYS (AEO BOX)
        ========================================================== */}
        {(formData.directAnswer || (formData.keyTakeaways && formData.keyTakeaways.length > 0)) && (
          <section className="my-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#D09A16]/40 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D09A16]/20 text-[#D09A16]">
                <Sparkles size={12} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D09A16]">
                Executive Summary & Direct Answer
              </span>
            </div>

            {formData.directAnswer && (
              <p className="text-sm sm:text-base font-serif text-[#17213D] leading-relaxed mb-4 font-medium">
                {formData.directAnswer}
              </p>
            )}

            {formData.keyTakeaways && formData.keyTakeaways.length > 0 && (
              <div className="pt-3 border-t border-[#17213D]/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#566078] block mb-2">
                  Key Takeaways:
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#334155] leading-snug">
                      <CheckCircle2 size={14} className="text-[#D09A16] shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            6. AUTHOR & META BAR
        ========================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#17213D]/10 text-xs text-[#566078] mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D09A16]/40 bg-[#17213D]/5 flex items-center justify-center font-serif font-bold text-[#17213D] relative">
              {authorImg ? (
                <Image
                  src={authorImg}
                  alt={authorName}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                authorName.charAt(0)
              )}
            </div>
            <div>
              <span className="block font-serif font-semibold text-[#17213D]">{authorName}</span>
              <span className="text-[11px] text-[#8892A6]">{authorRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#566078]">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#D09A16]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#D09A16]" />
              <span>{formData.readingTime || 5} min read</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            7. FEATURED IMAGE
        ========================================================== */}
        {formData.featuredImage ? (
          <figure className="my-6 rounded-2xl overflow-hidden border border-black/10 shadow-md bg-white">
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
              <Image
                src={formData.featuredImage}
                alt={formData.featuredImageAlt || formData.title || 'Featured Image'}
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
            {(formData.featuredImageCaption || formData.featuredImageCredit) && (
              <figcaption className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748B]">
                <span>{formData.featuredImageCaption || formData.featuredImageAlt}</span>
                {formData.featuredImageCredit && (
                  <span className="font-semibold text-[#D09A16]">Credit: {formData.featuredImageCredit}</span>
                )}
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="my-6 p-8 rounded-2xl border border-dashed border-[#D09A16]/40 bg-[#D09A16]/5 text-center text-xs text-[#D09A16]">
            Upload a Featured Image in the top settings card to display the main header photograph.
          </div>
        )}

        {/* =========================================================
            8. CONTENT & TABLE OF CONTENTS
        ========================================================== */}
        <div className={`gap-8 items-start ${isSplitView ? 'flex flex-col' : 'lg:grid lg:grid-cols-12'}`}>
          
          {/* Table of Contents Column */}
          {tableOfContents.length > 0 && (
            <aside className={`${isSplitView ? 'w-full mb-4' : 'lg:col-span-4 sticky top-6'} space-y-4`}>
              <nav className="bg-white p-5 rounded-2xl border border-[#17213D]/10 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#17213D]/10">
                  <AlignLeft size={15} className="text-[#D09A16]" />
                  <span className="font-serif font-bold text-xs text-[#17213D] tracking-wide uppercase">
                    Table of Contents ({tableOfContents.length} Sections)
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-[#566078]">
                  {tableOfContents.map((item, idx) => (
                    <li key={idx} className={item.level === 3 ? 'ml-3 text-[11px]' : 'font-medium'}>
                      <span className="text-[#566078] hover:text-[#D09A16] transition-colors block py-0.5 border-l-2 border-transparent pl-2.5">
                        {item.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Sidebar Luxury Advisory Card */}
              <div className="bg-[#0E162B] text-white p-5 rounded-2xl border border-[#D09A16]/30 shadow-md">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D09A16] mb-1.5">
                  <Building2 size={13} />
                  <span>Confidential Advisory</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-white mb-1.5">
                  Prime DLF Corridors
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  Looking for builder floors or commercial investments in DLF Phase 1–5?
                </p>
                <div className="block text-center py-2 px-3 rounded-xl bg-[#D09A16] text-[#0E162B] font-bold text-xs uppercase tracking-wider">
                  Consult Senior Partner
                </div>
              </div>
            </aside>
          )}

          {/* Main Editorial Content Column */}
          <div className={tableOfContents.length > 0 && !isSplitView ? 'lg:col-span-8' : 'w-full'}>
            <section className="prose-container bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-xs">
              {formData.content ? (
                <MarkdownRenderer content={formData.content} />
              ) : (
                <div className="py-12 text-center text-slate-400 italic text-sm">
                  Start typing in the Markdown editor on the left to see your formatted article appear here in real time.
                </div>
              )}
            </section>

            {/* =========================================================
                9. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
            ========================================================== */}
            {formData.faq && formData.faq.length > 0 && (
              <section className="mt-8 pt-6 border-t border-black/10">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle size={17} className="text-[#D09A16]" />
                  <h3 className="font-serif font-bold text-xl text-[#17213D] tracking-tight">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {formData.faq.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-white border border-[#17213D]/10 rounded-xl overflow-hidden transition-all duration-200 shadow-xs"
                    >
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none font-serif font-semibold text-[#17213D] text-sm sm:text-base">
                        <span className="pr-3">{faq.question}</span>
                        <ChevronDown
                          size={16}
                          className="text-[#D09A16] shrink-0 transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#17213D]/5">
                        <p>{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Verification Badge */}
            <div className="mt-8 p-4 rounded-xl bg-white border border-[#D09A16]/20 flex items-center justify-between text-xs text-[#566078]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#D09A16]" />
                <span>Verified by Saudagar Properties Research & Advisory Desk</span>
              </span>
              <span className="font-mono text-[11px] text-[#D09A16]">DLF Phase 2, Gurugram</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
