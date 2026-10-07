import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  ArrowRight, 
  Compass, 
  Building2, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2, 
  Briefcase, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

import PublicLayout from '@/layouts/PublicLayout';
import LocationJsonLd from '@/components/seo/LocationJsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PropertyLocationCta from '@/components/blog/PropertyLocationCta';
import BlogFaq from '@/components/blog/BlogFaq';
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

  const title = loc?.seoTitle || `${locationName} Real Estate Insights & Property Advisory | Saudagar Properties`;
  const description = loc?.seoDescription || loc?.description || `Authoritative real estate insights, builder floor pricing, and market dynamics in ${locationName} Gurugram.`;

  return buildPageMetadata({
    title,
    description,
    path: `/blog/location/${location}`,
    canonical: `/blog/location/${location}`,
    keywords: [
      locationName,
      `${locationName} Real Estate`,
      `${locationName} Builder Floors`,
      `${locationName} Property Price`,
      'Gurugram Luxury Real Estate',
      'Saudagar Properties'
    ],
  });
}

export default async function BlogLocationPage({ params }) {
  const { location } = await params;
  const [loc, posts, allLocations] = await Promise.all([
    getLocationBySlug(location),
    getBlogPosts({ location }),
    getLocations(),
  ]);

  if (!loc) {
    notFound();
  }

  const locationName = loc.name;

  // 5-tier Breadcrumb hierarchy: Home → Blog → Locations → Gurugram → [Location Name]
  const isGurugramHub = location === 'gurugram';
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Locations', url: '/blog/location' },
    ...(isGurugramHub 
      ? [{ name: 'Gurugram', url: '/blog/location/gurugram' }]
      : [
          { name: 'Gurugram', url: '/blog/location/gurugram' },
          { name: locationName, url: `/blog/location/${location}` }
        ]
    )
  ];

  // If there are fewer than 3 direct posts, fetch additional related market insights
  let displayPosts = posts || [];
  if (displayPosts.length < 3) {
    const additionalPosts = await getBlogPosts({ limit: 4, excludeSlug: displayPosts[0]?.slug });
    const existingSlugs = new Set(displayPosts.map(p => p.slug));
    const supplemental = (additionalPosts || []).filter(p => !existingSlugs.has(p.slug));
    displayPosts = [...displayPosts, ...supplemental].slice(0, 3);
  }

  // Filter nearby corridors to exclude current location
  const nearbyCorridors = (loc.nearbyLocations && loc.nearbyLocations.length > 0)
    ? loc.nearbyLocations
    : allLocations
        .filter(l => l.slug !== location && l.slug !== 'gurugram')
        .slice(0, 3)
        .map(l => ({
          slug: l.slug,
          name: l.name,
          distance: 'Neighboring Sector',
          highlights: l.description?.slice(0, 85) + '...'
        }));

  return (
    <PublicLayout asMain={false}>
      {/* Schema.org Connected Graph: WebSite, RealEstateAgent, Place, WebPage, BreadcrumbList & FAQPage */}
      <LocationJsonLd 
        location={loc} 
        breadcrumbs={breadcrumbs} 
        faqs={loc.faqs || []} 
      />

      <main className="w-full bg-[#FAF8F5] pt-28 md:pt-36 pb-20 selection:bg-[#D09A16] selection:text-[#0E162B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* =====================================================
              LOCATION HERO & GEOGRAPHIC OVERVIEW
          ====================================================== */}
          <header className="mb-14 pb-10 border-b border-[#17213D]/10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/30">
                <MapPin size={12} />
                <span>Prime Gurugram Corridor</span>
              </div>

              {loc.coordinates?.latitude && loc.coordinates?.longitude && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#566078] bg-white border border-[#17213D]/10">
                  <Navigation size={11} className="text-[#D09A16]" />
                  <span>{loc.coordinates.latitude.toFixed(4)}° N, {loc.coordinates.longitude.toFixed(4)}° E</span>
                </div>
              )}

              <span className="text-xs text-[#8892A6] font-medium ml-1">
                {loc.city}, {loc.state}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#17213D] mb-5 tracking-tight leading-tight">
              {locationName} Real Estate Insights & Property Advisory
            </h1>

            <p className="text-base sm:text-lg text-[#566078] max-w-4xl leading-relaxed font-light">
              {loc.description}
            </p>
          </header>

          {/* =====================================================
              PROPERTY MARKET CONTEXT
          ====================================================== */}
          {loc.marketOverview && (
            <section aria-labelledby="market-context-heading" className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-1">
                    Market Intelligence
                  </span>
                  <h2 id="market-context-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D]">
                    {locationName} Property Market Context
                  </h2>
                </div>
              </div>

              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {loc.marketOverview.avgPriceRange && (
                  <div className="p-5 bg-white rounded-2xl border border-[#17213D]/10 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8892A6] block mb-1">
                      Price Benchmark
                    </span>
                    <p className="font-serif font-bold text-lg text-[#17213D] leading-snug">
                      {loc.marketOverview.avgPriceRange}
                    </p>
                  </div>
                )}

                {loc.marketOverview.typicalPlotSizes && loc.marketOverview.typicalPlotSizes.length > 0 && (
                  <div className="p-5 bg-white rounded-2xl border border-[#17213D]/10 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8892A6] block mb-1">
                      Typical Plot Sizes
                    </span>
                    <p className="font-serif font-bold text-lg text-[#17213D] leading-snug">
                      {loc.marketOverview.typicalPlotSizes.join(', ')}
                    </p>
                  </div>
                )}

                {loc.marketOverview.inventoryType && (
                  <div className="p-5 bg-white rounded-2xl border border-[#17213D]/10 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8892A6] block mb-1">
                      Primary Asset Class
                    </span>
                    <p className="font-serif font-bold text-lg text-[#17213D] leading-snug">
                      {loc.marketOverview.inventoryType}
                    </p>
                  </div>
                )}

                {loc.marketOverview.zoningNorms && (
                  <div className="p-5 bg-white rounded-2xl border border-[#17213D]/10 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8892A6] block mb-1">
                      Zoning & Approvals
                    </span>
                    <p className="font-serif font-bold text-lg text-[#17213D] leading-snug">
                      {loc.marketOverview.zoningNorms}
                    </p>
                  </div>
                )}
              </div>

              {/* Key Catalysts & Connectivity Two-Column Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#17213D]/10 shadow-xs">
                {loc.marketOverview.keyStrengths && loc.marketOverview.keyStrengths.length > 0 && (
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#17213D] mb-4 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#D09A16]" />
                      <span>Corridor Strengths & Capital Drivers</span>
                    </h3>
                    <ul className="space-y-3">
                      {loc.marketOverview.keyStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#566078] leading-relaxed">
                          <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {loc.marketOverview.connectivity && loc.marketOverview.connectivity.length > 0 && (
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#17213D] mb-4 flex items-center gap-2">
                      <Navigation size={18} className="text-[#D09A16]" />
                      <span>Transit & Transit Connectivity</span>
                    </h3>
                    <ul className="space-y-3">
                      {loc.marketOverview.connectivity.map((conn, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#566078] leading-relaxed">
                          <CheckCircle2 size={15} className="text-[#D09A16] shrink-0 mt-0.5" />
                          <span>{conn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              RELEVANT PROPERTY TYPES
          ====================================================== */}
          {loc.propertyTypes && loc.propertyTypes.length > 0 && (
            <section aria-labelledby="property-types-heading" className="mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-1">
                Asset Allocation
              </span>
              <h2 id="property-types-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] mb-6">
                Relevant Property Types in {locationName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loc.propertyTypes.map((pt, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16]/50 transition-colors shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mb-3">
                        <Building2 size={18} />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#17213D] mb-2">
                        {pt}
                      </h3>
                      <p className="text-xs text-[#566078] leading-relaxed">
                        Curated verified inventory in {locationName} with complete 30-year title diligence and statutory approvals.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#17213D]/5">
                      <Link 
                        href="/services/residential"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D09A16] hover:text-[#0E162B] transition-colors uppercase tracking-wider"
                      >
                        <span>Explore Advisory</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              RELEVANT ARTICLES & EDITORIAL GUIDES
          ====================================================== */}
          <section aria-labelledby="articles-heading" className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-1">
                  Corridor Research
                </span>
                <h2 id="articles-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D]">
                  Relevant Articles & Market Insights
                </h2>
              </div>
              <Link 
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#17213D] hover:text-[#D09A16] transition-colors uppercase tracking-wider"
              >
                <span>All Research Articles</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {displayPosts && displayPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPosts.map((post) => (
                  <article
                    key={post._id || post.slug}
                    className="bg-white rounded-2xl overflow-hidden border border-[#17213D]/10 group hover:border-[#D09A16]/50 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {post.featuredImage && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <Image
                            src={post.featuredImage}
                            alt={post.featuredImageAlt || post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="font-serif font-bold text-xl text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug line-clamp-2 mb-3">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
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
                        <span>Read Analysis</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#17213D]/10 p-8">
                <h3 className="font-serif font-bold text-xl text-[#17213D] mb-2">Dedicated Corridor Research Underway</h3>
                <p className="text-sm text-[#566078] mb-6">
                  Our research desk is preparing an exclusive micro-market report for {locationName}.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#17213D] text-[#F7F5EF] text-xs font-bold uppercase tracking-wider"
                >
                  Browse Latest Market Insights
                </Link>
              </div>
            )}
          </section>

          {/* =====================================================
              NEARBY CORRIDORS & CONNECTED AREAS
          ====================================================== */}
          <section aria-labelledby="nearby-heading" className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D09A16] block mb-1">
              Micro-Market Topology
            </span>
            <h2 id="nearby-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#17213D] mb-6">
              Connected Corridors & Nearby Areas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyCorridors.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/blog/location/${item.slug}`}
                  className="p-6 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16] transition-all duration-300 shadow-xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8892A6] mb-3">
                      <span className="inline-flex items-center gap-1 text-[#D09A16] font-semibold">
                        <Compass size={13} />
                        <span>{item.distance || 'Adjacent Sector'}</span>
                      </span>
                      <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#17213D] group-hover:text-[#D09A16] transition-colors mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#566078] leading-relaxed">
                      {item.highlights || `Explore luxury real estate insights, builder floor pricing, and market trends in ${item.name}.`}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#17213D]/5 text-[11px] font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors flex items-center justify-between">
                    <span>View Corridor Guide</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* =====================================================
              LOCAL REAL ESTATE FAQS
          ====================================================== */}
          {loc.faqs && loc.faqs.length > 0 && (
            <BlogFaq faqs={loc.faqs} renderSchema={false} />
          )}

          {/* =====================================================
              RELATED SERVICES CROSS-LINKING
          ====================================================== */}
          <section aria-labelledby="services-heading" className="mb-16 bg-[#17213D] text-[#F7F5EF] rounded-3xl p-8 sm:p-10 border border-[#D09A16]/20">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D09A16] block mb-2">
                Specialized Advisory
              </span>
              <h2 id="services-heading" className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                Related Advisory Services for {locationName}
              </h2>
              <p className="text-xs sm:text-sm text-[#C9CED9] leading-relaxed font-light">
                Saudagar Properties offers comprehensive end-to-end representation for buyers, investors, and family offices in this corridor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/services/residential" 
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D09A16]/60 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mb-3">
                  <Building2 size={16} />
                </div>
                <h3 className="font-serif font-bold text-base text-white group-hover:text-[#D09A16] transition-colors mb-1.5">
                  Residential Builder Floors
                </h3>
                <p className="text-xs text-[#9DA6B8] leading-relaxed">
                  Clear-title freehold 3, 4 & 5 BHK luxury floors on 300 to 1,000 sq. yd. plots with stilt parking and private lifts.
                </p>
              </Link>

              <Link 
                href="/services/commercial" 
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D09A16]/60 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mb-3">
                  <Briefcase size={16} />
                </div>
                <h3 className="font-serif font-bold text-base text-white group-hover:text-[#D09A16] transition-colors mb-1.5">
                  Pre-Leased Commercial
                </h3>
                <p className="text-xs text-[#9DA6B8] leading-relaxed">
                  Institutional Grade-A corporate assets with Fortune 500 MNC leases delivering 7% to 9% immediate annual yields.
                </p>
              </Link>

              <Link 
                href="/properties" 
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D09A16]/60 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#D09A16]/10 text-[#D09A16] flex items-center justify-center mb-3">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-serif font-bold text-base text-white group-hover:text-[#D09A16] transition-colors mb-1.5">
                  Curated Inventory
                </h3>
                <p className="text-xs text-[#9DA6B8] leading-relaxed">
                  Browse vetted ready-to-move builder floors, penthouses, and freehold residential plots available for immediate possession.
                </p>
              </Link>
            </div>
          </section>

          {/* =====================================================
              CONFIDENTIAL INQUIRY & SITE VISIT CTA
          ====================================================== */}
          <PropertyLocationCta locationName={locationName} />

        </div>
      </main>
    </PublicLayout>
  );
}
