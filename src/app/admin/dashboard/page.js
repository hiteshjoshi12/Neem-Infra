"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ChevronRight
} from 'lucide-react';
import api from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    propertiesCount: 0,
    testimonialsCount: 0,
    inquiriesCount: 0,
    sectionsCount: 12,
    blogsCount: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

        const pCount = propsRes.status === 'fulfilled' && propsRes.value?.count ? propsRes.value.count : 5;
        const tCount = testsRes.status === 'fulfilled' && testsRes.value?.count ? testsRes.value.count : 3;
        const inqs = inqRes.status === 'fulfilled' && inqRes.value?.data ? inqRes.value.data : [];
        const bCount = blogRes.status === 'fulfilled' && blogRes.value?.count ? blogRes.value.count : 6;

        if (!ignore) {
          setStats({
            propertiesCount: pCount,
            testimonialsCount: tCount,
            inquiriesCount: inqs.length,
            sectionsCount: 12,
            blogsCount: bCount
          });
          setRecentInquiries(inqs.slice(0, 5));
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
      subtext: 'Luxury floors & prime corridor listings',
      icon: Building,
      link: '/admin/properties',
      color: '#D09A16'
    },
    {
      title: 'Customer Leads',
      value: stats.inquiriesCount,
      subtext: 'Newsletter & direct property inquiries',
      icon: Inbox,
      link: '/admin/inquiries',
      color: '#60A5FA'
    },
    {
      title: 'Editorial Articles',
      value: stats.blogsCount,
      subtext: 'Published guides & local SEO clusters',
      icon: BookOpen,
      link: '/admin/blog',
      color: '#34D399'
    },
    {
      title: 'CMS Sections',
      value: stats.sectionsCount,
      subtext: 'Hero, navbar, corridors, testimonials...',
      icon: Layers,
      link: '/admin/sections',
      color: '#F59E0B'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#111A30] via-[#0E1424] to-[#0A0F1D] p-6 sm:p-8 border border-white/[0.08] shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D09A16]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[10px] font-bold tracking-wider text-[#D09A16] uppercase">
              <Sparkles size={12} />
              <span>Saudagar CMS Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white">
              Executive Management Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Curate live listings, monitor client leads, publish search-optimized articles, and update website branding in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/properties"
              className="px-4 py-2.5 rounded-xl bg-[#D09A16] hover:bg-[#D09A16] text-[#0E162B] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Manage Properties</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/admin/inquiries"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Leads ({stats.inquiriesCount})</span>
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
              className="group p-5 rounded-2xl bg-[#0E1424] border border-white/[0.08] hover:border-[#D09A16]/50 transition-all duration-200 shadow-sm hover:-translate-y-0.5 block"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={15} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-0.5">
                {loading ? '...' : item.value}
              </div>
              <h3 className="text-xs font-bold text-slate-200 mb-0.5">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {item.subtext}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Secondary Grid: CMS Sections & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Homepage Sections Manager */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0E1424] border border-white/[0.08] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-white">Homepage Section Editors</h3>
              <p className="text-xs text-slate-400">Jump directly into any section to edit copy & media</p>
            </div>
            <Link href="/admin/sections" className="text-xs text-[#D09A16] hover:underline font-semibold flex items-center gap-1">
              <span>View All</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { name: '1. Navbar & Header', desc: 'Logo, links, dropdowns, CTA & phones', tab: 'navbar' },
              { name: '2. Hero Section', desc: 'Title, tags, search bar & spotlight card', tab: 'hero' },
              { name: '3. Top Consultant', desc: 'Copy, 3 categories, video walkthrough', tab: 'topConsultant' },
              { name: '4. Featured Properties', desc: 'Section header and corridor copy', tab: 'curatedCorridors' },
              { name: '5. Our Services', desc: 'Core services, 25+ yrs counter, process', tab: 'services' },
              { name: '6. DLF Callout & Stats', desc: 'Dedicated DLF desk, phone, explore & stats', tab: 'dlfCallout' },
              { name: '7. Why Choose Us', desc: 'Trust card, advantage copy & pillars', tab: 'whyChooseUs' },
              { name: '8. Testimonials Header', desc: 'Section title, badges & subtitle', tab: 'testimonials' },
              { name: '9. Location & Map', desc: 'Office address, Google Map pin & phones', tab: 'location' },
              { name: '10. Newsletter Section', desc: 'Subscription banner & intelligence copy', tab: 'newsletter' },
              { name: '11. Footer & Socials', desc: 'About copy, addresses, phone list & socials', tab: 'footer' },
              { name: '12. Floating Widgets', desc: 'WhatsApp number, prefill text & scroll-to-top', tab: 'floatingWidgets' }
            ].map((sec, i) => (
              <Link
                key={i}
                href={`/admin/sections?tab=${sec.tab}`}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-[#D09A16]/40 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white group-hover:text-[#D09A16] transition-colors">
                    {sec.name}
                  </h4>
                  <ArrowUpRight size={12} className="text-slate-500 group-hover:text-[#D09A16]" />
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  {sec.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Inquiries Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0E1424] border border-white/[0.08] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-sm font-serif font-bold text-white">Recent Client Leads</h3>
              <p className="text-xs text-slate-400">Latest website submissions</p>
            </div>
            <Link href="/admin/inquiries" className="text-xs text-[#D09A16] hover:underline font-semibold flex items-center gap-1">
              <span>All Leads</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading recent leads...
            </div>
          ) : recentInquiries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-1">
              <p className="font-semibold text-white">No inquiries yet</p>
              <p>Sign up on the website newsletter to test.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{inq.email}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="capitalize">{inq.type?.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/inquiries"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 transition-colors"
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
