import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';

/**
 * PillarClusterNav Component
 * Connects Pillar articles to supporting Child articles,
 * and Child articles back to their parent Pillar guide with descriptive anchor text.
 */
export default function PillarClusterNav({ 
  isPillar = false, 
  topicCluster = null, 
  parentPillar = null, 
  childArticles = [] 
}) {
  // Scenario 1: Child Article linking back to Parent Pillar
  if (!isPillar && parentPillar) {
    return (
      <aside 
        aria-label="Parent Pillar Guide Reference" 
        className="my-8 rounded-2xl bg-[#0E162B] text-[#F7F5EF] p-5 sm:p-6 border border-[#D09A16]/40 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-[#D09A16]">
          <BookOpen size={14} />
          <span>Part of Master Topic Cluster</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#F7F5EF] mb-1">
              {parentPillar.title || 'Comprehensive Guide to Gurugram Real Estate'}
            </h4>
            <p className="text-xs text-[#C9CED9] leading-relaxed">
              This article is a specialized deep-dive within our authoritative pillar cluster. Explore the master guide for comprehensive valuation benchmarks and statutory frameworks.
            </p>
          </div>
          <Link
            href={`/blog/${parentPillar.slug}`}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            <span>Read Master Pillar</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </aside>
    );
  }

  // Scenario 2: Pillar Article displaying Supporting Topic Cluster Articles
  if (isPillar && childArticles && childArticles.length > 0) {
    return (
      <section 
        aria-label="Topic Cluster Supporting Guides" 
        className="my-12 rounded-3xl bg-[#FAF8F5] border-2 border-[#17213D]/10 p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#17213D]/10">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17213D] text-[#D09A16]">
              <Layers size={13} />
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#17213D]">
              Topic Cluster: Supporting In-Depth Guides
            </h3>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-[#D09A16] bg-[#D09A16]/10 px-3 py-1 rounded-full">
            Topical Pillar Hub
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#566078] mb-6 leading-relaxed">
          As an authoritative pillar guide on Gurugram real estate, explore our specialized cluster articles addressing specific corridors, financial models, and due diligence workflows:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {childArticles.map((child, idx) => (
            <Link
              key={idx}
              href={`/blog/${child.slug}`}
              className="group p-5 bg-white rounded-2xl border border-[#17213D]/10 hover:border-[#D09A16]/60 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#D09A16] mb-2">
                  <span>Cluster Guide {idx + 1}</span>
                  <Sparkles size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17213D] group-hover:text-[#D09A16] transition-colors leading-snug mb-2">
                  {child.title}
                </h4>
                {child.excerpt && (
                  <p className="text-xs text-[#566078] line-clamp-2 leading-relaxed mb-4">
                    {child.excerpt}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#17213D]/5 text-[11px] text-[#8892A6]">
                <span>{child.readingTime || 5} min read</span>
                <span className="font-bold text-[#17213D] group-hover:text-[#D09A16] transition-colors flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
