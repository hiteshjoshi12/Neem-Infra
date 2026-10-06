import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Hash, Clock, ArrowRight } from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getBlogPosts, getTagBySlug, getTags } from '@/services/blogService';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getTags();
  return (tags || []).map((tag) => ({
    tag: tag.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const tagDoc = await getTagBySlug(tag);
  const tagName = tagDoc?.name || tag.replace(/-/g, ' ');

  return buildPageMetadata({
    title: `#${tagName} Articles & Guides`,
    description: `Expert real estate insights, corridor reports, and buyer guides tagged under #${tagName} at Saudagar Properties.`,
    path: `/blog/tag/${tag}`,
    canonical: `/blog/tag/${tag}`,
    keywords: [tagName, 'DLF Gurugram', 'Saudagar Properties Blog', `#${tagName}`],
  });
}

export default async function BlogTagPage({ params }) {
  const { tag } = await params;
  const [tagDoc, posts, allTags] = await Promise.all([
    getTagBySlug(tag),
    getBlogPosts({ tag }),
    getTags(),
  ]);

  const tagName = tagDoc?.name || tag.replace(/-/g, ' ');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: `#${tagName}`, url: `/blog/tag/${tag}` },
  ];

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#C6A24A] selection:text-[#0E162B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Tag Header */}
          <header className="mb-12 pb-8 border-b border-[#17213D]/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#C6A24A]/10 text-[#C6A24A] border border-[#C6A24A]/30 mb-4">
              <Hash size={12} />
              <span>Tag Focus</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] mb-4">
              #{tagName}
            </h1>
            <p className="text-base sm:text-lg text-[#566078] max-w-2xl leading-relaxed">
              Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'} curated around #{tagName} in Gurugram luxury real estate.
            </p>
          </header>

          {/* Related Tags Pill Cloud */}
          <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none text-xs">
            <span className="font-bold uppercase tracking-wider text-[#8892A6] mr-1 flex-shrink-0">
              Popular Tags:
            </span>
            {allTags.map((t) => (
              <Link
                key={t._id || t.slug}
                href={`/blog/tag/${t.slug}`}
                className={`px-3 py-1 rounded-full font-medium transition-colors flex-shrink-0 ${
                  t.slug === tag
                    ? 'bg-[#17213D] text-[#F7F5EF]'
                    : 'bg-white border border-[#17213D]/10 hover:border-[#C6A24A] text-[#17213D]'
                }`}
              >
                #{t.name}
              </Link>
            ))}
          </div>

          {/* Articles Grid */}
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
                      <h2 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#C6A24A] transition-colors leading-snug line-clamp-2 mb-3">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
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
              <h3 className="font-serif font-bold text-xl text-[#17213D] mb-2">No Articles Tagged</h3>
              <p className="text-sm text-[#566078] mb-6">
                Explore our full blog journal for the latest market insights and builder floor guides.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#17213D] text-[#F7F5EF] text-xs font-bold uppercase tracking-wider"
              >
                Return to Blog Home
              </Link>
            </div>
          )}
        </div>
      </main>
    </PublicLayout>
  );
}
