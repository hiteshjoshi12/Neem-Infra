import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ChevronRight, Share2, ArrowLeft, Sparkles, Building2 } from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import ArticleJsonLd from '@/components/seo/ArticleJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import TableOfContents from '@/components/blog/TableOfContents';
import AuthorCard from '@/components/blog/AuthorCard';
import PropertyLocationCta from '@/components/blog/PropertyLocationCta';
import ContextualInternalLinks from '@/components/blog/ContextualInternalLinks';
import BlogFaq from '@/components/blog/BlogFaq';

import { getBlogPostBySlug, getRelatedPosts, getBlogPosts } from '@/services/blogService';
import { extractTableOfContents, MarkdownRenderer } from '@/lib/blog/markdownRenderer';
import { buildArticleMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return (posts || []).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const metadata = buildArticleMetadata(post);
  // Ensure self-canonical URL reference
  metadata.alternates = { canonical: post?.canonicalUrl || `/blog/${slug}` };
  return metadata;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);
  const tableOfContents = extractTableOfContents(post.content);

  const formattedPublishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const formattedUpdatedDate =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? new Date(post.updatedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    ...(post.category
      ? [{ name: post.category.name, url: `/blog/category/${post.category.slug}` }]
      : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  const primaryLocation = post.location?.[0]?.name || 'DLF Gurugram';

  return (
    <PublicLayout asMain={false}>
      {/* Schema.org Structured Data */}
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd post={post} />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#C6A24A] selection:text-[#0E162B]">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* =========================================================
              ARTICLE HEADER
          ========================================================== */}
          <header className="max-w-4xl mx-auto mb-12 sm:mb-16">
            {/* Semantic Accessible Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Category Pill */}
            {post.category && (
              <div className="mb-4">
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-[#C6A24A]/10 text-[#C6A24A] border border-[#C6A24A]/25 hover:bg-[#C6A24A] hover:text-[#0E162B] transition-all"
                >
                  <Sparkles size={11} />
                  <span>{post.category.name}</span>
                </Link>
              </div>
            )}

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl/tight font-serif font-bold text-[#17213D] tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Short summary / dek */}
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-[#475569] font-serif italic leading-relaxed mb-8 border-l-2 border-[#C6A24A] pl-4 sm:pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Line */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-[#17213D]/10 text-xs sm:text-sm text-[#566078]">
              <div className="flex items-center gap-3">
                {post.author && (
                  <Link
                    href={`/blog/author/${post.author.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#C6A24A]/40 bg-[#17213D]/5">
                      {post.author.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center font-serif font-bold text-[#17213D]">
                          {post.author.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="block font-serif font-semibold text-[#17213D] group-hover:text-[#C6A24A] transition-colors">
                        {post.author.name}
                      </span>
                      <span className="text-[11px] text-[#8892A6]">
                        {post.author.jobTitle || 'Property Consultant'}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#566078]">
                {formattedPublishedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#C6A24A]" />
                    <time dateTime={post.publishedAt}>{formattedPublishedDate}</time>
                  </div>
                )}
                {formattedUpdatedDate && (
                  <span className="hidden sm:inline text-[#8892A6]">
                    (Updated {formattedUpdatedDate})
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#C6A24A]" />
                  <span>{post.readingTime || 5} min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <figure className="mt-8 mb-4">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-md border border-[#17213D]/10 bg-slate-100">
                  <Image
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    priority
                    sizes="(max-width: 1200px) 100vw, 1000px"
                    className="object-cover"
                  />
                </div>
                {post.featuredImageAlt && (
                  <figcaption className="text-center text-xs text-[#8892A6] mt-3 italic">
                    {post.featuredImageAlt}
                  </figcaption>
                )}
              </figure>
            )}
          </header>

          {/* =========================================================
              MAIN ARTICLE BODY & SIDEBAR
          ========================================================== */}
          <div className="lg:grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
            {/* Sticky Sidebar on Desktop */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
              {tableOfContents.length > 0 && (
                <TableOfContents items={tableOfContents} />
              )}

              {/* Quick Advisory CTA Widget */}
              <div className="bg-[#17213D] text-[#F7F5EF] p-6 rounded-2xl border border-[#C6A24A]/30 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C6A24A] mb-2">
                  <Building2 size={14} />
                  <span>Confidential Advisory</span>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#F7F5EF] mb-2">
                  Prime DLF Corridors
                </h4>
                <p className="text-xs text-[#C9CED9] leading-relaxed mb-4">
                  Looking for builder floors or commercial investments in {primaryLocation}?
                </p>
                <Link
                  href="/contact"
                  className="block text-center py-2.5 px-4 rounded-xl bg-[#C6A24A] hover:bg-[#D8BD73] text-[#0E162B] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                >
                  Consult Senior Partner
                </Link>
              </div>
            </aside>

            {/* Main Editorial Content Column */}
            <div className="lg:col-span-8">
              {/* Mobile Collapsible TOC */}
              {tableOfContents.length > 0 && (
                <div className="lg:hidden">
                  <TableOfContents items={tableOfContents} />
                </div>
              )}

              {/* Crawlable Semantic Article Body */}
              <section aria-label="Article Body" className="prose-container">
                <MarkdownRenderer content={post.content} />
              </section>

              {/* Reusable Contextual Internal Links with Descriptive Anchors */}
              <ContextualInternalLinks
                categorySlug={post.categorySlug || post.category?.slug}
                locationSlug={post.locationSlugs?.[0] || post.location?.[0]?.slug}
                currentSlug={post.slug}
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 my-8 pt-6 border-t border-[#17213D]/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#566078]">
                    Topics:
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag._id || tag.slug}
                      href={`/blog/tag/${tag.slug}`}
                      className="text-xs px-3 py-1 rounded-full bg-white border border-[#17213D]/10 text-[#17213D] hover:border-[#C6A24A] hover:text-[#C6A24A] transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Relevant Property / Location CTA */}
              <PropertyLocationCta locationName={primaryLocation} />

              {/* FAQs where applicable */}
              {post.faq && post.faq.length > 0 && (
                <BlogFaq faqs={post.faq} />
              )}

              {/* Author Block */}
              {post.author && (
                <section aria-label="About the Author">
                  <AuthorCard author={post.author} />
                </section>
              )}

              {/* Related Articles */}
              {relatedPosts && relatedPosts.length > 0 && (
                <section aria-labelledby="related-heading" className="my-16">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#17213D]/10">
                    <h2 id="related-heading" className="font-serif font-bold text-2xl sm:text-3xl text-[#17213D]">
                      Related Editorial Insights
                    </h2>
                    <Link
                      href="/blog"
                      className="text-xs font-bold text-[#C6A24A] hover:underline uppercase tracking-wider"
                    >
                      View All Insights →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((rel) => (
                      <div
                        key={rel._id || rel.slug}
                        className="bg-white rounded-2xl overflow-hidden border border-[#17213D]/10 group hover:border-[#C6A24A]/50 transition-all shadow-xs flex flex-col"
                      >
                        {rel.featuredImage && (
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                            <Image
                              src={rel.featuredImage}
                              alt={rel.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 350px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            {rel.category && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A24A] block mb-2">
                                {rel.category.name}
                              </span>
                            )}
                            <h3 className="font-serif font-bold text-base text-[#17213D] group-hover:text-[#C6A24A] transition-colors line-clamp-2 mb-2">
                              <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                            </h3>
                            <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed">
                              {rel.excerpt}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#17213D]/5 flex items-center justify-between text-[11px] text-[#8892A6]">
                            <span>{rel.readingTime || 5} min read</span>
                            <Link
                              href={`/blog/${rel.slug}`}
                              className="font-bold text-[#17213D] group-hover:text-[#C6A24A] transition-colors"
                            >
                              Read →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* =========================================================
              FINAL ARTICLE FOOTER & CTA
          ========================================================== */}
          <footer className="mt-16 pt-12 border-t border-[#17213D]/10">
            <div className="relative overflow-hidden bg-[#0E162B] text-[#F7F5EF] rounded-3xl p-8 sm:p-12 text-center border border-[#C6A24A]/40 shadow-xl max-w-4xl mx-auto">
              <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#F7F5EF] mb-4">
                Schedule a Private Real Estate Consultation
              </h2>
              <p className="text-sm sm:text-base text-[#C9CED9] max-w-xl mx-auto leading-relaxed mb-8">
                Whether acquiring a luxury builder floor in DLF Phase 1–5 or allocating capital to Grade-A commercial pre-leased assets, connect directly with Saudagar Properties.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-full bg-[#C6A24A] hover:bg-[#D8BD73] text-[#0E162B] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Book Private Advisory
                </Link>
                <Link
                  href="/blog"
                  className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  Browse More Articles
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </PublicLayout>
  );
}
