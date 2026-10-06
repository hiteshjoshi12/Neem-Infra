import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MapPin, Clock, ArrowRight } from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PropertyLocationCta from '@/components/blog/PropertyLocationCta';
import { getBlogPosts, getLocationBySlug, getLocations } from '@/services/blogService';
import { buildPageMetadata } from '@/lib/seo/metadataHelper';

export const revalidate = 60;

export async function generateStaticParams() {
  const locations = await getLocations();
  return (locations || []).map((loc) => ({
    location: loc.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { location } = await params;
  const loc = await getLocationBySlug(location);
  const locationName = loc?.name || location.replace(/-/g, ' ');

  return buildPageMetadata({
    title: `${locationName} Real Estate Insights & Guides`,
    description: loc?.description || `Explore luxury real estate insights, builder floor pricing, and market trends in ${locationName} Gurugram.`,
    path: `/blog/location/${location}`,
    canonical: `/blog/location/${location}`,
    keywords: [locationName, `${locationName} Builder Floors`, 'Gurugram Property Market', 'Saudagar Properties'],
  });
}

export default async function BlogLocationPage({ params }) {
  const { location } = await params;
  const [loc, posts, allLocations] = await Promise.all([
    getLocationBySlug(location),
    getBlogPosts({ location }),
    getLocations(),
  ]);

  const locationName = loc?.name || location.replace(/-/g, ' ');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: locationName, url: `/blog/location/${location}` },
  ];

  return (
    <PublicLayout asMain={false}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#C6A24A] selection:text-[#0E162B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Location Header */}
          <header className="mb-12 pb-8 border-b border-[#17213D]/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#C6A24A]/10 text-[#C6A24A] border border-[#C6A24A]/30 mb-4">
              <MapPin size={12} />
              <span>Prime Gurugram Corridor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] mb-4">
              {locationName}
            </h1>
            <p className="text-base sm:text-lg text-[#566078] max-w-2xl leading-relaxed">
              {loc?.description || `Corridor analysis, builder floor guides, and market dynamics in ${locationName}.`}
            </p>
          </header>

          {/* All Corridors Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none text-xs">
            <span className="font-bold uppercase tracking-wider text-[#8892A6] mr-1 flex-shrink-0">
              Other Corridors:
            </span>
            {allLocations.map((l) => (
              <Link
                key={l._id || l.slug}
                href={`/blog/location/${l.slug}`}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-colors flex-shrink-0 ${
                  l.slug === location
                    ? 'bg-[#17213D] text-[#F7F5EF] shadow-xs'
                    : 'bg-white border border-[#17213D]/10 hover:border-[#C6A24A] text-[#17213D]'
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Articles Grid */}
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                      <span>Read Analysis</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#17213D]/10 p-8 mb-16">
              <h3 className="font-serif font-bold text-xl text-[#17213D] mb-2">No Articles Listed Yet</h3>
              <p className="text-sm text-[#566078] mb-6">
                Our advisors are preparing dedicated research reports for this corridor.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#17213D] text-[#F7F5EF] text-xs font-bold uppercase tracking-wider"
              >
                Return to Blog Home
              </Link>
            </div>
          )}

          {/* Contextual Location CTA */}
          <PropertyLocationCta locationName={locationName} />
        </div>
      </main>
    </PublicLayout>
  );
}
