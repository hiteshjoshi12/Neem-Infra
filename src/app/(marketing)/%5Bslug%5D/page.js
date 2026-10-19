import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Compass,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Phone,
  HelpCircle,
  Sparkles,
  Share2,
} from 'lucide-react';

import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { getDynamicPageRecord, getDynamicPageSeo, getDynamicBreadcrumbs } from '@/lib/seo/dynamicSeo';
import { normalizePath } from '@/lib/seo/metadataHelper';
import { MarkdownRenderer } from '@/lib/blog/markdownRenderer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/${slug}`;
  const page = await getDynamicPageRecord(path);

  if (!page || page.status !== 'published') {
    return {
      title: 'Page Not Found | Saudagar Properties',
      robots: { index: false, follow: false },
    };
  }

  return await getDynamicPageSeo(path, {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    canonical: page.canonicalUrl || path,
    image: page.featuredImage || page.ogImage,
    imageAlt: page.featuredImageAlt || page.title,
    keywords: page.focusKeywords,
  });
}

export default async function CustomDynamicPage({ params }) {
  const { slug } = await params;
  const path = `/${slug}`;
  const page = await getDynamicPageRecord(path);

  // If page doesn't exist or isn't published, trigger 404
  if (!page || page.status !== 'published') {
    notFound();
  }

  const breadcrumbs = (page.breadcrumbs && page.breadcrumbs.length > 0)
    ? page.breadcrumbs
    : [
        { name: 'Home', url: '/' },
        { name: page.title, url: path },
      ];

  // FAQ Schema generation
  const faqSchema =
    Array.isArray(page.faq) && page.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy selection:bg-brand-gold selection:text-brand-navy-deep">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Custom Schema JSON-LD if provided */}
      {page.customSchemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.customSchemaJson }}
        />
      )}

      {/* Auto-injected FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Masthead & Hero */}
      <section className="bg-brand-navy-deep text-brand-ivory pt-32 pb-16 sm:pt-36 sm:pb-20 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(var(--color-brand-gold)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-gold)_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 w-96 h-96 rounded-full bg-brand-gold/10 blur-[120px]"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs Nav */}
          <nav className="flex items-center gap-2 text-xs text-brand-text-on-dark-muted mb-6 flex-wrap" aria-label="Breadcrumb">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="opacity-40">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-brand-gold font-medium">{b.name}</span>
                ) : (
                  <Link href={b.url} className="hover:text-white transition-colors">
                    {b.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={13} />
            <span>Saudagar Exclusive Editorial & Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-brand-ivory tracking-tight mb-6 leading-tight">
            {page.h1 || page.title}
          </h1>

          {page.h2 && (
            <p className="text-lg sm:text-xl text-brand-text-on-dark-muted font-sans font-light max-w-3xl leading-relaxed">
              {page.h2}
            </p>
          )}

          {page.featuredImage && (
            <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative aspect-video max-h-[500px]">
              <Image
                src={page.featuredImage}
                alt={page.featuredImageAlt || page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Main Body Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {page.content ? (
          <article className="prose prose-lg max-w-none text-brand-navy/90 leading-relaxed font-sans mb-16">
            <MarkdownRenderer content={page.content} />
          </article>
        ) : (
          <p className="text-brand-text-muted italic mb-12">
            Detailed content for this page is currently being compiled by our luxury advisory desk.
          </p>
        )}

        {/* Structured Sections if configured */}
        {Array.isArray(page.sections) && page.sections.length > 0 && (
          <div className="space-y-12 my-16">
            {page.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-brand-gold/20 shadow-sm"
              >
                {sec.subtitle && (
                  <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-2">
                    {sec.subtitle}
                  </span>
                )}
                {sec.title && (
                  <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">
                    {sec.title}
                  </h3>
                )}
                {sec.content && (
                  <div className="text-brand-text-muted leading-relaxed mb-6 font-sans">
                    <MarkdownRenderer content={sec.content} />
                  </div>
                )}
                {sec.image && (
                  <div className="my-6 rounded-2xl overflow-hidden border border-gray-100 relative aspect-video">
                    <Image
                      src={sec.image}
                      alt={sec.imageAlt || sec.title || 'Page Section Image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {sec.buttonText && sec.buttonLink && (
                  <Link
                    href={sec.buttonLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-gold hover:text-brand-navy transition-all"
                  >
                    <span>{sec.buttonText}</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dynamic FAQ Accordion */}
        {Array.isArray(page.faq) && page.faq.length > 0 && (
          <section className="my-16 p-8 sm:p-10 rounded-3xl bg-brand-navy/5 border border-brand-gold/20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-navy text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle size={14} className="text-brand-gold" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy mb-8">
              Frequently Inquired by Investors & Buyers
            </h2>

            <div className="space-y-4">
              {page.faq.map((item, idx) => (
                <details
                  key={idx}
                  className="group bg-white p-6 rounded-2xl border border-gray-200/80 open:border-brand-gold/50 open:shadow-sm transition-all"
                >
                  <summary className="font-serif font-semibold text-lg text-brand-navy cursor-pointer list-none flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-brand-gold text-xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-brand-text-muted leading-relaxed font-sans">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Internal Links Matrix */}
        {Array.isArray(page.internalLinks) && page.internalLinks.length > 0 && (
          <section className="my-12 p-6 rounded-2xl bg-white border border-gray-200">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-4">
              Related Corridors, Portfolios & Analyses
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {page.internalLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url}
                  target={link.target || '_self'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-brand-navy hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <Compass size={12} className="text-brand-gold" />
                  <span>{link.text}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Private Consultation CTA Banner */}
        <section className="my-16 p-8 sm:p-12 rounded-3xl bg-brand-navy-deep text-brand-ivory border border-brand-gold/30 text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-brand-gold/10 blur-[100px]"
          />
          <span className="text-xs font-bold tracking-widest uppercase text-brand-gold block mb-3">
            Fiduciary Real Estate Consultation
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
            Looking to Acquire or Invest in DLF Gurugram?
          </h3>
          <p className="text-sm text-brand-text-on-dark-muted max-w-xl mx-auto mb-8 font-sans leading-relaxed">
            Connect directly with Arun Sharma and our senior partners for off-market inventory, private title audits, and institutional advisory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
            >
              <Phone size={14} />
              <span>Schedule Private Advisory Session</span>
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-all border border-white/15"
            >
              <Building2 size={14} />
              <span>Explore Verified Inventory</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
