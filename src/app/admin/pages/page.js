"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home,
  Building2,
  Layers,
  LayoutList,
  Users,
  Phone,
  BookOpen,
  Compass,
  FileText,
  ShieldCheck,
  Search,
  ExternalLink,
  Edit3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

const WEBSITE_PAGES = [
  {
    id: 'landing',
    title: 'Landing Page (Homepage)',
    category: 'core',
    route: '/',
    editUrl: '/admin/sections',
    icon: Home,
    badge: 'Flagship Portal',
    sectionsCount: 12,
    description: 'Hero masthead, top consultant showcase, featured corridors, services portfolio, DLF market stats, why choose us, testimonials, office location & newsletter.',
    sections: ['Hero Banner', 'Top Consultant', 'Curated Corridors', 'Services Matrix', 'DLF Callout & Stats', 'Why Choose Us', 'Testimonials', 'Location & Map', 'Newsletter', 'Header & Nav', 'Footer', 'Floating Buttons']
  },
  {
    id: 'about',
    title: 'About Us Page',
    category: 'core',
    route: '/about',
    editUrl: '/admin/pages/about',
    icon: Users,
    badge: 'Company Profile',
    sectionsCount: 7,
    description: 'Company 25+ year leadership narrative, cinematic video tour, core property categories, value proposition pillars, visionary founders, and private advisory CTA.',
    sections: ['Hero & Mission', 'Cinematic Video Tour', 'Property Offerings', '3 Pillars of Proposition', 'Founders & Leadership', 'Why Choose Us', 'Executive Consultation CTA']
  },
  {
    id: 'properties',
    title: 'Properties Catalog Page',
    category: 'core',
    route: '/properties',
    editUrl: '/admin/pages/properties',
    icon: Building2,
    badge: 'Inventory Hub',
    sectionsCount: 4,
    description: 'Header masthead, search & multi-facet filters, empty search state messaging, and bottom off-market advisory banner.',
    sections: ['Catalog Masthead', 'Search & Filtering Bar', 'Empty State UI', 'Bottom Advisory Banner']
  },
  {
    id: 'residential',
    title: 'Residential Services',
    category: 'services',
    route: '/services/residential',
    editUrl: '/admin/pages/residential',
    icon: Building2,
    badge: 'Core Portfolio',
    sectionsCount: 7,
    description: 'Luxury builder floor typologies, DLF Phase 1–5 performance metrics, micro-market intelligence benchmarks, 7-point due diligence roadmap, specification standards, and private consultation CTA.',
    sections: ['Hero Masthead', 'Key Performance Metrics', 'Asset Classes & Typologies', 'Micro-Market Intelligence', '7-Point Due Diligence', 'Specification Standards', 'Consultation Banner']
  },
  {
    id: 'commercial',
    title: 'Commercial Services',
    category: 'services',
    route: '/services/commercial',
    editUrl: '/admin/pages/commercial',
    icon: Layers,
    badge: 'Corporate Assets',
    sectionsCount: 7,
    description: 'Grade-A office suites, high-street retail spaces, commercial yield benchmarks across Cyber City & Golf Course Rd, institutional lease structuring, compliance checklist, and corporate desk CTA.',
    sections: ['Commercial Hero', 'Yield & Occupancy Metrics', 'Office & Retail Typologies', 'Micro-Market Benchmarks', 'Lease Framework', 'Building Compliance Checklist', 'Corporate Advisory Banner']
  },
  {
    id: 'industrial',
    title: 'Industrial & Logistics',
    category: 'services',
    route: '/services/industrial',
    editUrl: '/admin/pages/industrial',
    icon: LayoutList,
    badge: 'Infrastructure',
    sectionsCount: 7,
    description: 'Logistics parks, HSIIDC industrial land parcels, warehousing specs, prime NCR transport corridors, regulatory compliance roadmap, engineering standards, and industrial advisory CTA.',
    sections: ['Industrial Hero', 'Logistics Metrics', 'Industrial Typologies', 'NCR Transport Corridors', 'HSIIDC Compliance Protocol', 'Warehouse Engineering Standards', 'Industrial Advisory Banner']
  },
  {
    id: 'team',
    title: 'Our Leadership & Team',
    category: 'core',
    route: '/team',
    editUrl: '/admin/pages/team',
    icon: Users,
    badge: 'Advisory Board',
    sectionsCount: 5,
    description: 'Founder credentials for Arun Sharma & Suneeta Chawla, senior advisory principals, 4 fiduciary advisory pillars, and private founder session CTA.',
    sections: ['Team Masthead', 'Visionary Founders', 'Senior Principals', '4 Fiduciary Pillars', 'Private Founder Session CTA']
  },
  {
    id: 'contact',
    title: 'Contact Us Page',
    category: 'core',
    route: '/contact',
    editUrl: '/admin/pages/contact',
    icon: Phone,
    badge: 'Client Desks',
    sectionsCount: 3,
    description: 'Corporate headquarters address in DLF Phase 2, direct telephone lines, executive email desks, operating hours, and inquiry form copy.',
    sections: ['Contact Masthead', 'Headquarters & Channels', 'Inquiry Form Copy']
  },
  {
    id: 'blog',
    title: 'Blog & Market Research',
    category: 'core',
    route: '/blog',
    editUrl: '/admin/pages/blog',
    icon: BookOpen,
    badge: 'Intelligence Archive',
    sectionsCount: 6,
    description: 'Market research masthead, DLF market pulse metrics, editorial cover dossier, corridor spotlights, research library archive, and VIP newsletter subscription.',
    sections: ['Research Masthead', 'Market Pulse Indicators', 'Editorial Cover Dossier', 'Corridor Spotlights', 'Research Library Archive', 'Advisory Newsletter']
  },
  {
    id: 'corridors',
    title: 'Micro-Market Corridors (6 Pages)',
    category: 'corridors',
    route: '/property/dlf-phase-1',
    editUrl: '/admin/pages/corridors',
    icon: Compass,
    badge: 'Hyperlocal Landing Pages',
    sectionsCount: 9,
    description: 'Dedicated luxury micro-market landing pages for DLF Phase 1, DLF Phase 2, DLF Phase 3, DLF Phase 4, Sushant Lok, and Udyog Vihar with live benchmarks, asset typologies, commute radar, and turnkey platform advisory.',
    sections: ['Hero & Gallery', 'Live Benchmarks', 'Locality Profile', 'Asset Typologies', 'Urban Balance & Callout', 'Why Live Here (8 Pillars)', 'Commute & Landmarks', 'Turnkey Platform & Authority', 'Corridor FAQs']
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    category: 'legal',
    route: '/terms',
    editUrl: '/admin/pages/terms',
    icon: FileText,
    badge: 'Legal & Fiduciary',
    sectionsCount: 2,
    description: 'Official advisory engagement conditions, portal usage, title due diligence disclaimers, and legal disclosures for Saudagar Properties Pvt Ltd.',
    sections: ['Legal Masthead', 'Advisory Terms & Articles']
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    category: 'legal',
    route: '/privacy-policy',
    editUrl: '/admin/pages/privacy',
    icon: ShieldCheck,
    badge: 'Data Governance',
    sectionsCount: 2,
    description: 'High-Net-Worth Individual confidentiality standards, zero third-party monetization policy, secure communications, and client deletion rights.',
    sections: ['Privacy Masthead', 'Confidentiality Articles & Safeguards']
  }
];

export default function AdminPagesHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Pages', count: WEBSITE_PAGES.length },
    { id: 'core', label: 'Core Website', count: WEBSITE_PAGES.filter(p => p.category === 'core').length },
    { id: 'services', label: 'Service Portfolios', count: WEBSITE_PAGES.filter(p => p.category === 'services').length },
    { id: 'corridors', label: 'Micro-Market Corridors', count: WEBSITE_PAGES.filter(p => p.category === 'corridors').length },
    { id: 'legal', label: 'Legal & Policy', count: WEBSITE_PAGES.filter(p => p.category === 'legal').length }
  ];

  const filteredPages = WEBSITE_PAGES.filter(page => {
    const matchesCategory = activeCategory === 'all' || page.category === activeCategory;
    const matchesSearch = 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.sections.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#111A30] via-[#0E1424] to-[#0A0F1D] p-6 sm:p-8 border border-white/[0.08] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold tracking-wider text-brand-gold uppercase">
              <Sparkles size={12} />
              <span>Full Site CMS Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white">
              Website Pages &amp; CMS Portals
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              Every single page and micro-market corridor on the live website is powered directly by the database. Select any page below to customize its headlines, metrics, typologies, media, and copy in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-2 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-gold text-brand-dark shadow-md shadow-brand-gold/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeCategory === cat.id ? 'bg-brand-dark/20 text-brand-dark' : 'bg-white/10 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages or sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.map((page, idx) => {
          const Icon = page.icon;
          return (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="group p-5 rounded-2xl bg-[#0E1424] border border-white/[0.08] hover:border-brand-gold/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Icon & Route Pill */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon size={19} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {page.route}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live DB</span>
                    </span>
                  </div>
                </div>

                {/* Title & Badge */}
                <div className="mb-2">
                  <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                    {page.badge}
                  </div>
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-brand-gold transition-colors">
                    {page.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {page.description}
                </p>

                {/* Sections Pill Tag List */}
                <div className="pt-3 border-t border-white/[0.06] mb-5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">CMS Section Blocks</span>
                    <span className="font-mono text-brand-gold font-bold">{page.sectionsCount} Sections</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                    {page.sections.slice(0, 4).map((sec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-slate-300"
                      >
                        {sec}
                      </span>
                    ))}
                    {page.sections.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] text-slate-400 font-mono">
                        +{page.sections.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={page.editUrl}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold hover:brightness-110 text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_2px_10px_rgba(208,154,22,0.2)]"
                >
                  <Edit3 size={13} />
                  <span>Edit Content</span>
                </Link>
                <Link
                  href={page.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  title="View Live Page"
                >
                  <Eye size={15} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
