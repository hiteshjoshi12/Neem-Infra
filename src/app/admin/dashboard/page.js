"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Building,
  Quote,
  Inbox,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  ExternalLink,
  ChevronRight,
  Home,
  Users,
  Phone,
  Compass,
  FileText,
  Plus,
  Edit3,
  Sliders
} from 'lucide-react';
import api from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    propertiesCount: 0,
    testimonialsCount: 0,
    inquiriesCount: 0,
    sectionsCount: 12,
    blogsCount: 0,
    pagesCount: 12
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cmsTab, setCmsTab] = useState('core');

  useEffect(() => {
    let ignore = false;
    const fetchDashboardData = async () => {
      try {
        const [propsRes, testsRes, inqRes, blogRes] = await Promise.allSettled([
          api.getProperties({ all: true }),
          api.getTestimonials({ all: true }),
          api.getInquiries(),
          api.getBlogs()
        ]);

        const pCount = propsRes.status === 'fulfilled' && propsRes.value?.count ? propsRes.value.count : 4;
        const tCount = testsRes.status === 'fulfilled' && testsRes.value?.count ? testsRes.value.count : 3;
        const inqs = inqRes.status === 'fulfilled' && inqRes.value?.data ? inqRes.value.data : [];
        const bCount = blogRes.status === 'fulfilled' && blogRes.value?.count ? blogRes.value.count : 6;

        if (!ignore) {
          setStats({
            propertiesCount: pCount,
            testimonialsCount: tCount,
            inquiriesCount: inqs.length,
            sectionsCount: 28,
            blogsCount: bCount,
            pagesCount: 12
          });
          setRecentInquiries(inqs.slice(0, 6));
        }
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { ignore = true; };
  }, []);

  const cardItems = [
    {
      title: 'Managed Properties',
      value: stats.propertiesCount,
      subtext: 'Luxury builder floors & plots',
      icon: Building,
      link: '/admin/properties',
      color: '#D09A16',
      badge: 'Active Listings'
    },
    {
      title: 'Client Inquiries',
      value: stats.inquiriesCount,
      subtext: 'Direct lead submissions',
      icon: Inbox,
      link: '/admin/inquiries',
      color: '#60A5FA',
      badge: 'Real-time Desk'
    },
    {
      title: 'Editorial Articles',
      value: stats.blogsCount,
      subtext: 'Market research & local guides',
      icon: BookOpen,
      link: '/admin/blog',
      color: '#34D399',
      badge: 'SEO Intelligence'
    },
    {
      title: 'Website Pages CMS',
      value: `${stats.pagesCount} Pages`,
      subtext: 'All pages & corridors live in DB',
      icon: Layers,
      link: '/admin/pages',
      color: '#F59E0B',
      badge: 'Unified CMS'
    }
  ];

  const pageGroups = {
    core: [
      { name: 'Landing Page (Homepage)', route: '/', editUrl: '/admin/sections', count: '12 Sections', icon: Home },
      { name: 'About Us Page', route: '/about', editUrl: '/admin/pages/about', count: '7 Sections', icon: Users },
      { name: 'Properties Catalog', route: '/properties', editUrl: '/admin/pages/properties', count: '4 Sections', icon: Building },
      { name: 'Our Team Page', route: '/team', editUrl: '/admin/pages/team', count: '5 Sections', icon: Users },
      { name: 'Contact Us Page', route: '/contact', editUrl: '/admin/pages/contact', count: '3 Sections', icon: Phone },
      { name: 'Blog Archive & Research', route: '/blog', editUrl: '/admin/pages/blog', count: '6 Sections', icon: BookOpen }
    ],
    services: [
      { name: 'Residential Services', route: '/services/residential', editUrl: '/admin/pages/residential', count: '6 Sections', icon: Building },
      { name: 'Commercial Services', route: '/services/commercial', editUrl: '/admin/pages/commercial', count: '6 Sections', icon: Layers },
      { name: 'Industrial Services', route: '/services/industrial', editUrl: '/admin/pages/industrial', count: '6 Sections', icon: ShieldCheck }
    ],
    corridors: [
      { name: 'DLF Phase 1 Corridor', route: '/property/dlf-phase-1', editUrl: '/admin/pages/corridors?corridor=dlf-phase-1', count: '10 Sections', icon: Compass },
      { name: 'DLF Phase 2 Corridor', route: '/property/dlf-phase-2', editUrl: '/admin/pages/corridors?corridor=dlf-phase-2', count: '10 Sections', icon: Compass },
      { name: 'DLF Phase 3 Corridor', route: '/property/dlf-phase-3', editUrl: '/admin/pages/corridors?corridor=dlf-phase-3', count: '10 Sections', icon: Compass },
      { name: 'DLF Phase 4 Corridor', route: '/property/dlf-phase-4', editUrl: '/admin/pages/corridors?corridor=dlf-phase-4', count: '10 Sections', icon: Compass },
      { name: 'Sushant Lok Corridor', route: '/property/shushant-lok', editUrl: '/admin/pages/corridors?corridor=shushant-lok', count: '10 Sections', icon: Compass },
      { name: 'Udyog Vihar Corridor', route: '/property/udyog-vihar', editUrl: '/admin/pages/corridors?corridor=udyog-vihar', count: '10 Sections', icon: Compass }
    ],
    legal: [
      { name: 'Terms of Service', route: '/terms', editUrl: '/admin/pages/terms', count: '2 Sections', icon: FileText },
      { name: 'Privacy Policy', route: '/privacy-policy', editUrl: '/admin/pages/privacy', count: '2 Sections', icon: ShieldCheck }
    ]
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#111A30] via-[#0E1424] to-[#0A0F1D] p-6 sm:p-8 border border-white/[0.08] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold tracking-wider text-brand-gold uppercase">
              <Sparkles size={12} />
              <span>Saudagar Properties Control Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white">
              Executive Management Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Full control over all 12 public pages, 6 micro-market corridors, luxury property inventory, and client inquiries — with real-time updates directly to MongoDB.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/pages"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold hover:brightness-110 text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(208,154,22,0.2)]"
            >
              <span>Pages CMS Hub</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Live Portal</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.link}
              className="group p-5 rounded-2xl bg-[#0E1424] border border-white/[0.08] hover:border-brand-gold/50 transition-all duration-200 shadow-sm hover:-translate-y-0.5 block"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon size={20} />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-400 font-mono">
                  {item.badge}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-0.5">
                {loading ? '...' : item.value}
              </div>
              <h3 className="text-xs font-bold text-slate-200 mb-0.5 group-hover:text-brand-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {item.subtext}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Command Strip */}
      <div className="p-4 rounded-2xl bg-[#0E1424] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders size={13} className="text-brand-gold" />
          <span>Quick Actions</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/properties/new"
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} className="text-brand-gold" />
            <span>Add Property</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} className="text-brand-gold" />
            <span>Create Article</span>
          </Link>
          <Link
            href="/admin/sections"
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 size={13} className="text-brand-gold" />
            <span>Edit Homepage</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Inbox size={13} className="text-brand-gold" />
            <span>Review Leads ({stats.inquiriesCount})</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Section: Pages Matrix & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Website Pages Quick Jump Matrix */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0E1424] border border-white/[0.08] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-white">Website Pages CMS Matrix</h3>
              <p className="text-xs text-slate-400">Directly jump into any page or corridor editor</p>
            </div>
            <Link href="/admin/pages" className="text-xs text-brand-gold hover:underline font-semibold flex items-center gap-1">
              <span>View Master Hub (12)</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Sub-category selector */}
          <div className="flex items-center gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/5">
            {[
              { id: 'core', label: 'Core Pages (6)' },
              { id: 'services', label: 'Services (3)' },
              { id: 'corridors', label: 'Corridors (6)' },
              { id: 'legal', label: 'Legal (2)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCmsTab(tab.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  cmsTab === tab.id
                    ? 'bg-brand-gold text-brand-dark font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Page List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {pageGroups[cmsTab].map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-brand-gold/40 transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/5 text-brand-gold flex items-center justify-center">
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-semibold text-white group-hover:text-brand-gold transition-colors truncate">
                        {p.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                    <span className="text-slate-400 font-mono">{p.count}</span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={p.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="View Live"
                      >
                        <ExternalLink size={12} />
                      </Link>
                      <Link
                        href={p.editUrl}
                        className="px-2 py-0.5 rounded-md bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-semibold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <Edit3 size={10} />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Client Inquiries Inbox */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0E1424] border border-white/[0.08] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-white">Client Inquiries Inbox</h3>
              <p className="text-xs text-slate-400">Latest website submissions &amp; requests</p>
            </div>
            <Link href="/admin/inquiries" className="text-xs text-brand-gold hover:underline font-semibold flex items-center gap-1">
              <span>All Leads ({stats.inquiriesCount})</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading recent inquiries...
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-white">No inquiries yet</p>
              <p>Test the inquiry form on any property or contact page.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">{inq.name || inq.email}</p>
                      <span className="px-1.5 py-0.2 rounded bg-brand-gold/15 text-brand-gold text-[9px] font-bold uppercase tracking-wider">
                        {inq.type?.replace(/_/g, ' ') || 'Lead'}
                      </span>
                    </div>
                    {inq.phone && (
                      <p className="text-[11px] text-slate-400 font-mono">{inq.phone}</p>
                    )}
                    {inq.message && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                        &quot;{inq.message}&quot;
                      </p>
                    )}
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
                      <Clock size={10} />
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    href="/admin/inquiries"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 transition-colors"
                    title="View Lead Details"
                  >
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
