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
import JsonLd from '@/components/seo/JsonLd';
import { buildProfilePageSchema } from '@/lib/seo/schemaBuilders';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getBlogPosts, getAuthorBySlug, getAuthors } from '@/services/blogService';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const authors = await getAuthors();
  return (authors || []).map((author) => ({
    author: author.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { author } = await params;
  const [authorDoc, posts] = await Promise.all([
    getAuthorBySlug(author),
    getBlogPosts({ author }),
  ]);
  const authorName = authorDoc?.name || author.replace(/-/g, ' ');

  // Per Google Search Console quality remediation:
  // Index ONLY if the author profile has a verified photo, substantive bio (>=50 chars), and published articles.
  // Founder photos are pending from owner input, so default to noindex,follow.
  const hasPhoto = Boolean(authorDoc?.image && authorDoc.image.trim().length > 0);
  const hasBio = Boolean(authorDoc?.bio && authorDoc.bio.trim().length >= 50);
  const hasArticles = Array.isArray(posts) && posts.length > 0;
  const shouldIndex = hasPhoto && hasBio && hasArticles;

  return buildPageMetadata({
    title: `${authorName} — Editorial & Advisory`,
    description: authorDoc?.bio || `Read luxury real estate articles, market insights, and investment guides by ${authorName} at Saudagar Properties.`,
    path: `/blog/author/${author}`,
    canonical: `/blog/author/${author}`,
    image: authorDoc?.image,
    imageAlt: authorName,
    noindex: !shouldIndex,
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

  const hasPhoto = Boolean(authorDoc?.image && authorDoc.image.trim().length > 0);
  const hasBio = Boolean(authorDoc?.bio && authorDoc.bio.trim().length >= 50);
  const hasArticles = Array.isArray(posts) && posts.length > 0;
  const shouldEmitPersonSchema = hasPhoto && hasBio && hasArticles;

  const profileSchema = (authorDoc && shouldEmitPersonSchema) ? buildProfilePageSchema(authorDoc, breadcrumbs) : null;

  return (
    <PublicLayout asMain={false}>
      {profileSchema && <JsonLd data={profileSchema} />}

      <main className="w-full bg-brand-ivory-warm pt-28 md:pt-36 pb-20 selection:bg-brand-gold selection:text-brand-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Author Profile Card Header */}
          <header className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-navy/10 shadow-[0_20px_50px_-15px_rgba(23,33,61,0.06)] mb-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-brand-gold bg-brand-navy/5 flex-shrink-0 shadow-md">
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
                  <div className="w-full h-full flex items-center justify-center font-serif text-3xl font-bold text-brand-navy">
                    {authorName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold border border-brand-gold/30 mb-3">
                  <Award size={13} />
                  <span>Senior Editorial Contributor</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-2">
                  {authorName}
                </h1>

                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-slate mb-4">
                  {authorDoc?.jobTitle || 'Senior Luxury Property Consultant'}
                </p>

                <p className="text-sm sm:text-base text-brand-slate leading-relaxed max-w-3xl mb-6 font-sans">
                  {authorDoc?.bio || 'Advising high-net-worth investors and families on prime real estate assets across DLF Gurugram.'}
                </p>

                {authorDoc?.expertise && authorDoc.expertise.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                      Specialties:
                    </span>
                    {authorDoc.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-brand-ivory-warm border border-brand-navy/10 text-brand-navy"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-brand-navy/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-brand-slate">
                    {authorDoc?.socialProfiles?.linkedin && (
                      <a
                        href={authorDoc.socialProfiles.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-gold transition-colors"
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
                        className="hover:text-brand-gold transition-colors"
                        aria-label={`${authorName} on Twitter`}
                      >
                        <TwitterIcon />
                      </a>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy">
                    <BookOpen size={14} className="text-brand-gold" />
                    <span>{posts.length} Published Articles</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Published Articles Section */}
          <section aria-labelledby="author-articles-heading">
            <h2 id="author-articles-heading" className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy mb-8 pb-4 border-b border-brand-navy/10">
              Articles by {authorName}
            </h2>

            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post._id || post.slug}
                    className="bg-white rounded-2xl overflow-hidden border border-brand-navy/10 group hover:border-brand-gold/50 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {post.featuredImage && (
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-obsidian border-b border-brand-navy/10">
                          {/* Ambient Blurred Backdrop */}
                          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                            <Image
                              src={post.featuredImage}
                              alt=""
                              fill
                              sizes="100px"
                              className="object-cover blur-xl scale-125 brightness-75"
                              aria-hidden="true"
                            />
                          </div>
                          {/* Full Uncut Foreground Image */}
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-500 relative z-10"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.category && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block mb-2">
                            {post.category.name}
                          </span>
                        )}
                        <h3 className="font-serif font-bold text-xl text-brand-navy group-hover:text-brand-gold transition-colors leading-snug line-clamp-2 mb-3">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-sm text-brand-slate line-clamp-2 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-brand-navy/5 flex items-center justify-between text-xs text-brand-muted">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-brand-gold" />
                        <span>{post.readingTime || 5} min read</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-brand-navy group-hover:text-brand-gold transition-colors"
                      >
                        <span>Read</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-brand-navy/10 p-8">
                <h3 className="font-serif font-bold text-xl text-brand-navy mb-2">No Articles Currently Published</h3>
                <p className="text-sm text-brand-slate mb-6">
                  Check back soon for new real estate analysis from {authorName}.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-navy text-brand-ivory text-xs font-bold uppercase tracking-wider"
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
