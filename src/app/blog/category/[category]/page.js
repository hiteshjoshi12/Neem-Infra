import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Sparkles, Clock, ArrowRight } from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getBlogPosts, getCategoryBySlug, getCategories } from '@/services/blogService';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return (categories || []).map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  const name = cat?.name || category.replace(/-/g, ' ');

  return buildPageMetadata({
    title: `${name} Articles & Analysis`,
    description: cat?.description || `Authoritative real estate insights, builder floor guides, and market dynamics categorized under ${name}.`,
    path: `/blog/category/${category}`,
    canonical: `/blog/category/${category}`,
    keywords: [name, 'Gurugram Real Estate', 'Saudagar Properties Blog', `${name} DLF`],
  });
}

export default async function BlogCategoryPage({ params }) {
  const { category } = await params;
  const [cat, posts, allCategories] = await Promise.all([
    getCategoryBySlug(category),
    getBlogPosts({ category }),
    getCategories(),
  ]);

  const categoryName = cat?.name || category.replace(/-/g, ' ');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: categoryName, url: `/blog/category/${category}` },
  ];

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#D09A16] selection:text-[#0E162B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Category Header */}
          <header className="mb-12 pb-8 border-b border-[#17213D]/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/30 mb-4">
              <Sparkles size={12} />
              <span>Topic Category</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] mb-4">
              {categoryName}
            </h1>
            <p className="text-base sm:text-lg text-[#566078] max-w-2xl leading-relaxed">
              {cat?.description || `Authoritative insights, analyses, and guides classified under ${categoryName}.`}
            </p>
          </header>

          {/* Quick Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none text-xs">
            <Link
              href="/blog"
              className="px-3.5 py-1.5 rounded-full border border-[#17213D]/10 hover:border-[#D09A16] bg-white text-[#17213D] font-medium transition-colors"
            >
              All Articles
            </Link>
            {allCategories.map((c) => (
              <Link
                key={c._id || c.slug}
                href={`/blog/category/${c.slug}`}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
                  c.slug === category
                    ? 'bg-[#17213D] text-[#F7F5EF] shadow-xs'
                    : 'border border-[#17213D]/10 hover:border-[#D09A16] bg-white text-[#17213D]'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Articles Grid */}
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post._id || post.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-[#17213D]/10 group hover:border-[#D09A16]/50 transition-all shadow-xs flex flex-col justify-between"
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
                      <h2 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug line-clamp-2 mb-3">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-sm text-[#566078] line-clamp-2 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-[#17213D]/5 flex items-center justify-between text-xs text-[#8892A6]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#D09A16]" />
                      <span>{post.readingTime || 5} min read</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors"
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
              <h3 className="font-serif font-bold text-xl text-[#17213D] mb-2">No Articles Found</h3>
              <p className="text-sm text-[#566078] mb-6">
                We are actively curating insights for this topic. Explore all available articles below.
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
