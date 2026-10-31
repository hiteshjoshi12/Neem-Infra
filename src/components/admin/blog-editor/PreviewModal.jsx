"use client";

import React from 'react';
import Image from 'next/image';
import { X, ExternalLink, Calendar, Clock, Sparkles } from 'lucide-react';
import { MarkdownRenderer, extractTableOfContents } from '@/lib/blog/markdownRenderer';
import ArticleImage from '@/components/blog/ArticleImage';
import DirectAnswerBox from '@/components/blog/DirectAnswerBox';
import BlogFaq from '@/components/blog/BlogFaq';

export default function PreviewModal({
  isOpen,
  onClose,
  formData = {},
  taxonomies = {}
}) {
  if (!isOpen) return null;

  const {
    title = 'Untitled Article',
    slug = '',
    content = '',
    featuredImage = '',
    featuredImageAlt = '',
    featuredImageCaption = '',
    featuredImageCredit = '',
    publishedAt = new Date().toISOString(),
    readingTime = 5,
    author = '',
    category = '',
    directAnswer = '',
    keyTakeaways = [],
    faq = []
  } = formData;

  const authorObj = (taxonomies.authors || []).find(a => a._id === author || a.id === author) || {
    name: 'Arun Sharma',
    avatar: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png'
  };

  const categoryObj = (taxonomies.categories || []).find(c => c._id === category || c.id === category) || {
    name: 'Real Estate Analysis'
  };

  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const tableOfContents = extractTableOfContents(content);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-brand-ivory-warm text-brand-navy border border-white/20 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Floating Bar */}
        <div className="bg-brand-navy-deep text-white px-5 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-gold text-brand-navy-deep uppercase tracking-wider">
              Exact Public Renderer Preview
            </span>
            <span className="text-xs text-slate-300 font-mono truncate max-w-xs sm:max-w-md">
              /blog/{slug || 'preview-slug'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Public Blog Canvas */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-10 max-w-4xl mx-auto w-full">
          {/* Header */}
          <header className="mb-10 pb-8 border-b border-brand-navy/10">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold font-semibold text-xs tracking-wider uppercase mb-4">
              {categoryObj.name}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-navy leading-tight tracking-tight mb-5">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-slate font-medium">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-navy text-brand-gold flex items-center justify-center text-[10px] font-bold">
                  {authorObj.name?.[0] || 'A'}
                </span>
                <span>By {authorObj.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-brand-gold" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-brand-gold" />
                <span>{readingTime || 5} min read</span>
              </div>
            </div>

            {/* Featured Image */}
            {featuredImage && (
              <div className="mt-8">
                <ArticleImage
                  src={featuredImage}
                  alt={featuredImageAlt || title}
                  caption={featuredImageCaption}
                  credit={featuredImageCredit}
                  priority={true}
                  className="rounded-2xl overflow-hidden shadow-md"
                />
              </div>
            )}
          </header>

          {/* Direct Answer Box (AEO) */}
          {directAnswer && (
            <div className="mb-8">
              <DirectAnswerBox answer={directAnswer} />
            </div>
          )}

          {/* Key Takeaways */}
          {Array.isArray(keyTakeaways) && keyTakeaways.length > 0 && (
            <div className="p-6 rounded-2xl bg-brand-navy text-white mb-10 shadow-sm border border-brand-gold/30">
              <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
                <Sparkles size={14} />
                <span>Key Investment &amp; Market Takeaways</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-200 list-disc ml-5 marker:text-brand-gold">
                {keyTakeaways.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of Contents Preview */}
          {tableOfContents.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-brand-navy/10 mb-8 shadow-xs">
              <p className="font-serif font-bold text-sm text-brand-navy mb-3">Table of Contents</p>
              <ul className="space-y-1.5 text-xs text-brand-slate">
                {tableOfContents.map(toc => (
                  <li key={toc.id} className={toc.level === 3 ? 'ml-4' : 'font-medium'}>
                    <a href={`#${toc.id}`} className="hover:text-brand-gold hover:underline">
                      {toc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Prose Rendered by Public MarkdownRenderer */}
          <article className="prose-container">
            <MarkdownRenderer content={content} />
          </article>

          {/* FAQ Accordion */}
          {Array.isArray(faq) && faq.length > 0 && (
            <div className="mt-12 pt-8 border-t border-brand-navy/10">
              <BlogFaq faqs={faq} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

