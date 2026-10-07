"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Building,
  Quote,
  Inbox,
  LogOut,
  ExternalLink,
  X,
  Shield,
  Menu,
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import api from '@/services/api';

const logoImg = '/logo.png';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inquiryCount, setInquiryCount] = useState(0);

  // Fetch quick lead count for badge
  useEffect(() => {
    let ignore = false;
    async function loadStats() {
      try {
        const res = await api.getInquiries();
        if (!ignore && res?.success && Array.isArray(res?.data)) {
          setInquiryCount(res.data.length);
        }
      } catch {
        // Silently ignore if not loaded yet
      }
    }
    loadStats();
    return () => { ignore = true; };
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      group: 'Real Estate & Inquiries',
      items: [
        { label: 'Properties', to: '/admin/properties', icon: Building },
        { label: 'Leads & Inquiries', to: '/admin/inquiries', icon: Inbox, badge: inquiryCount },
      ]
    },
    {
      group: 'Content Management',
      items: [
        { label: 'Sections CMS', to: '/admin/sections', icon: Layers },
        { label: 'Blog & Articles', to: '/admin/blog', icon: BookOpen },
        { label: 'Testimonials', to: '/admin/testimonials', icon: Quote },
      ]
    },
    {
      group: 'Growth & Analytics',
      items: [
        { label: 'SEO & Performance', to: '/admin/seo', icon: Search },
      ]
    }
  ];

  // Derive active page title & description for the top header
  const getHeaderInfo = () => {
    if (pathname === '/admin/dashboard') {
      return { title: 'Executive Overview', desc: 'Real-time platform activity and management shortcuts' };
    }
    if (pathname.startsWith('/admin/properties')) {
      return { title: 'Properties Management', desc: 'Curate luxury residences, builder floors, and corridor listings' };
    }
    if (pathname.startsWith('/admin/inquiries')) {
      return { title: 'Leads & Inquiries', desc: 'Review incoming customer submissions, consultation requests, and subscribers' };
    }
    if (pathname.startsWith('/admin/sections')) {
      return { title: 'Sections CMS', desc: 'Customise homepage sections, branding, navigation, and corridors' };
    }
    if (pathname.startsWith('/admin/blog')) {
      return { title: 'Blog & Articles', desc: 'Editorial content management, topical clusters, and publishing pipeline' };
    }
    if (pathname.startsWith('/admin/seo')) {
      return { title: 'SEO & Search Console', desc: 'Search performance telemetry, indexing health, and automated audits' };
    }
    if (pathname.startsWith('/admin/testimonials')) {
      return { title: 'Client Testimonials', desc: 'Verified client experiences and investor perspectives' };
    }
    return { title: 'Admin Console', desc: 'Saudagar Properties control management center' };
  };

  const { title: currentTitle, desc: currentDesc } = getHeaderInfo();

  const isItemActive = (to) => {
    if (to === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* ===================== SIDEBAR (Desktop) ===================== */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0E1424] border-r border-white/[0.08] shrink-0 select-none">

        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-white border border-[#D09A16]/50 shadow-md group-hover:scale-105 transition-transform">
              <Image 
                sizes="32px"
                width={800} 
                height={600} 
                src={logoImg} 
                alt="Saudagar Properties" 
                className="h-6 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-serif font-bold text-white tracking-wide">Saudagar</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D09A16]/20 text-[#D09A16] border border-[#D09A16]/30 uppercase">
                  CMS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Control Console</span>
            </div>
          </Link>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 p-3.5 space-y-5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {group.group}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.to);

                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[#D09A16]/15 text-[#E6C673] font-semibold shadow-sm border border-[#D09A16]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon 
                        size={17} 
                        className={`shrink-0 transition-colors ${
                          active ? 'text-[#D09A16]' : 'text-slate-400'
                        }`} 
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        active
                          ? 'bg-[#D09A16] text-[#0E1424]'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#D09A16]" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Action Footer */}
        <div className="p-3.5 border-t border-white/[0.08] space-y-2.5 bg-[#0A0F1D]">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] flex items-center justify-center font-bold text-xs shrink-0">
                <Shield size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{admin?.email || 'admin@saudagar.com'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* ===================== MOBILE HEADER ===================== */}
      <div className="md:hidden bg-[#0E1424] border-b border-white/[0.08] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-white">
            <Image width={100} height={40} src={logoImg} alt="Saudagar" className="h-5 w-auto" />
          </div>
          <div>
            <span className="text-sm font-serif font-bold text-white">Saudagar CMS</span>
          </div>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-200"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-[#090D16]/98 backdrop-blur-2xl z-40 p-4 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-[#D09A16]/15 text-[#E6C673] font-semibold border border-[#D09A16]/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={active ? 'text-[#D09A16]' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D09A16] text-[#0E1424]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="text-xs text-slate-400 px-2">
              Logged in as <span className="text-white font-semibold">{admin?.name || 'Administrator'}</span>
            </div>
            <div className="flex gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-center text-xs font-medium text-white"
              >
                Live Website
              </a>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-center text-xs font-medium text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090D16]">
        {/* Top Header / Breadcrumb Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-white/[0.08] bg-[#0E1424]/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Saudagar Admin</span>
                <ChevronRight size={12} className="text-slate-500" />
                <span className="text-[#D09A16] font-semibold">{currentTitle}</span>
              </div>
              <h2 className="text-base font-serif font-bold text-white leading-tight">
                {currentTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Online Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Online</span>
            </div>

            {/* Quick Visit Live Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 hover:text-white transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink size={12} className="text-[#D09A16]" />
            </a>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-5 sm:p-7 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
