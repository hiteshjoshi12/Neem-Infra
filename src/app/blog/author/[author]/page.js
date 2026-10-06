import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Award, Clock, ArrowRight, BookOpen } from 'lucide-react';

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getBlogPosts, getAuthorBySlug, getAuthors } from '@/services/blogService';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

export async function generateStaticParams() {
  const authors = await getAuthors();
  return (authors || []).map((author) => ({
    author: author.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { author } = await params;
  const authorDoc = await getAuthorBySlug(author);
  const authorName = authorDoc?.name || author.replace(/-/g, ' ');

  return buildPageMetadata({
    title: `${authorName} — Editorial & Advisory`,
    description: authorDoc?.bio || `Read luxury real estate articles, market insights, and investment guides by ${authorName} at Saudagar Properties.`,
    path: `/blog/author/${author}`,
    canonical: `/blog/author/${author}`,
    image: authorDoc?.image,
    imageAlt: authorName,
    keywords: [authorName, 'Saudagar Properties Author', 'DLF Real Estate Consultant'],
  });
}

export default async function BlogAuthorPage({ params }) {
  const { author } = await params;
  const [authorDoc, posts] = await Promise.all([
    getAuthorBySlug(author),
    getBlogPosts({ author }),
  ]);

  const authorName = authorDoc?.name || author.replace(/-/g, ' ');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: authorName, url: `/blog/author/${author}` },
  ];

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#C6A24A] selection:text-[#0E162B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Author Profile Card Header */}
          <header className="bg-white rounded-3xl p-8 sm:p-12 border border-[#17213D]/10 shadow-[0_20px_50px_-15px_rgba(23,33,61,0.06)] mb-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#C6A24A] bg-[#17213D]/5 flex-shrink-0 shadow-md">
                {authorDoc?.image ? (
                  <Image
                    src={authorDoc.image}
                    alt={authorName}
                    fill
                    sizes="144px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-3xl font-bold text-[#17213D]">
                    {authorName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#C6A24A]/10 text-[#C6A24A] border border-[#C6A24A]/30 mb-3">
                  <Award size={13} />
                  <span>Senior Editorial Contributor</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] mb-2">
                  {authorName}
                </h1>

                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#566078] mb-4">
                  {authorDoc?.jobTitle || 'Senior Luxury Property Consultant'}
                </p>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-3xl mb-6 font-sans">
                  {authorDoc?.bio || 'Advising high-net-worth investors and families on prime real estate assets across DLF Gurugram.'}
                </p>

                {authorDoc?.expertise && authorDoc.expertise.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8892A6]">
                      Specialties:
                    </span>
                    {authorDoc.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-[#FAF8F5] border border-[#17213D]/10 text-[#17213D]"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-[#17213D]/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-[#566078]">
                    {authorDoc?.socialProfiles?.linkedin && (
                      <a
                        href={authorDoc.socialProfiles.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#C6A24A] transition-colors"
                        aria-label={`${authorName} on LinkedIn`}
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                    {authorDoc?.socialProfiles?.twitter && (
                      <a
                        href={authorDoc.socialProfiles.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#C6A24A] transition-colors"
                        aria-label={`${authorName} on Twitter`}
                      >
                        <TwitterIcon />
                      </a>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17213D]">
                    <BookOpen size={14} className="text-[#C6A24A]" />
                    <span>{posts.length} Published Articles</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Published Articles Section */}
          <section aria-labelledby="author-articles-heading">
            <h2 id="author-articles-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] mb-8 pb-4 border-b border-[#17213D]/10">
              Articles by {authorName}
            </h2>

            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post._id || post.slug}
                    className="bg-white rounded-2xl overflow-hidden border border-[#17213D]/10 group hover:border-[#C6A24A]/50 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {post.featuredImage && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A24A] block mb-2">
                            {post.category.name}
                          </span>
                        )}
                        <h3 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#C6A24A] transition-colors leading-snug line-clamp-2 mb-3">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-sm text-[#566078] line-clamp-2 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-[#17213D]/5 flex items-center justify-between text-xs text-[#8892A6]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#C6A24A]" />
                        <span>{post.readingTime || 5} min read</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-[#17213D] group-hover:text-[#C6A24A] transition-colors"
                      >
                        <span>Read</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#17213D]/10 p-8">
                <h3 className="font-serif font-bold text-xl text-[#17213D] mb-2">No Articles Currently Published</h3>
                <p className="text-sm text-[#566078] mb-6">
                  Check back soon for new real estate analysis from {authorName}.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#17213D] text-[#F7F5EF] text-xs font-bold uppercase tracking-wider"
                >
                  Return to Blog Home
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}
