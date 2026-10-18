"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  Home,
  Users,
  Phone,
  LayoutList,
  FileText,
  Compass,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import api from '@/services/api';

const logoImg = 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?tr=f-auto,q-80';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('saudagar_admin_sidebar_collapsed');
        if (saved !== null) return saved === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
  const [inquiryCount, setInquiryCount] = useState(0);
  const fetchedInquiriesRef = useRef(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('saudagar_admin_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Fetch quick lead count for badge (guarded to avoid re-querying on every sub-route transition)
  useEffect(() => {
    if (fetchedInquiriesRef.current && pathname !== '/admin/inquiries') {
      return;
    }
    let ignore = false;
    async function loadStats() {
      try {
        const res = await api.getInquiries();
        if (!ignore && res?.success && Array.isArray(res?.data)) {
          setInquiryCount(res.data.length);
          fetchedInquiriesRef.current = true;
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
      group: 'Website Pages (CMS)',
      items: [
        { label: 'All Pages Hub', to: '/admin/pages', icon: Layers, pill: '12 Pages' },
        { label: 'Landing Page', to: '/admin/sections', icon: Home, pill: '12 Sec' },
        { label: 'Micro-Market Corridors', to: '/admin/pages/corridors', icon: Compass, pill: '6 Locs' },
      ]
    },
    {
      group: 'Inventory & Leads',
      items: [
        { label: 'Properties Database', to: '/admin/properties', icon: Building },
        { label: 'Client Inquiries', to: '/admin/inquiries', icon: Inbox, badge: inquiryCount },
      ]
    },
    {
      group: 'Editorial & Media',
      items: [
        { label: 'Blog Articles', to: '/admin/blog', icon: FileText },
        { label: 'Testimonials', to: '/admin/testimonials', icon: Quote },
      ]
    }
  ];

  // Derive active page title & description for the top header
  const getHeaderInfo = () => {
    if (pathname === '/admin/dashboard') {
      return { title: 'Dashboard Overview', desc: 'Platform activity, stats, and shortcuts' };
    }
    if (pathname === '/admin/pages') {
      return { title: 'Website Pages CMS Hub', desc: 'Manage all 12 public website pages and micro-market corridors' };
    }
    if (pathname.startsWith('/admin/pages/corridors')) {
      return { title: 'Micro-Market Corridors CMS', desc: 'Edit DLF Phase 1–4, Sushant Lok, and Udyog Vihar corridor landing pages' };
    }
    if (pathname === '/admin/pages/terms') {
      return { title: 'Terms of Service CMS', desc: 'Edit legal engagement conditions and disclaimers' };
    }
    if (pathname === '/admin/pages/privacy') {
      return { title: 'Privacy Policy CMS', desc: 'Edit HNWI confidentiality and data governance policy' };
    }
    if (pathname.startsWith('/admin/sections')) {
      return { title: 'Landing Page CMS', desc: 'Manage hero banner, sections, stats, and homepage copy' };
    }
    if (pathname === '/admin/pages/residential') {
      return { title: 'Residential Service CMS', desc: 'Edit residential asset classes, metrics, and advisory standards' };
    }
    if (pathname === '/admin/pages/commercial') {
      return { title: 'Commercial Service CMS', desc: 'Edit corporate office hubs, retail assets, and leasing copy' };
    }
    if (pathname === '/admin/pages/industrial') {
      return { title: 'Industrial Service CMS', desc: 'Edit logistics parks, warehousing specs, and land parcel copy' };
    }
    if (pathname === '/admin/pages/team') {
      return { title: 'Our Team Page CMS', desc: 'Edit leadership highlights, experience credentials, and advisory standards' };
    }
    if (pathname === '/admin/pages/properties') {
      return { title: 'Properties Page CMS', desc: 'Edit catalog masthead, search filters, and bottom advisory banner' };
    }
    if (pathname === '/admin/pages/blog') {
      return { title: 'Blog Page CMS', desc: 'Edit research archive masthead, market pulse, and newsletter banner' };
    }
    if (pathname === '/admin/pages/about') {
      return { title: 'About Us Page CMS', desc: 'Edit company mission, video tour, leadership, and consultation banner' };
    }
    if (pathname === '/admin/pages/contact') {
      return { title: 'Contact Page CMS', desc: 'Edit office hours, phone numbers, email, and inquiry form copy' };
    }
    if (pathname.startsWith('/admin/properties')) {
      return { title: 'Properties Database', desc: 'Add, update, or remove luxury property listings' };
    }
    if (pathname.startsWith('/admin/inquiries')) {
      return { title: 'Client Inquiries', desc: 'Review consultation requests and visitor messages' };
    }
    if (pathname.startsWith('/admin/blog')) {
      return { title: 'Blog Articles', desc: 'Create and publish market intelligence research articles' };
    }
    if (pathname.startsWith('/admin/testimonials')) {
      return { title: 'Testimonials', desc: 'Manage verified client reviews and feedback' };
    }
    return { title: 'Admin Console', desc: 'Saudagar Properties back office' };
  };

  const { title: currentTitle, desc: currentDesc } = getHeaderInfo();

  const isItemActive = (to) => {
    if (to === '/admin/pages') {
      return pathname === '/admin/pages';
    }
    return pathname === to || pathname.startsWith(to + '/');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* ===================== SIDEBAR (Desktop) ===================== */}
      <aside
        className={`hidden md:flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-72'
          } bg-[#0E1424] border-r border-white/[0.08] shrink-0 select-none transition-all duration-300 ease-in-out`}
      >
        {/* Brand Header */}
        <div className={`p-4 border-b border-white/[0.08] flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-white border border-[#D09A16]/50 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                sizes="32px"
                width={800}
                height={600}
                src={logoImg}
                alt="Saudagar Properties"
                className="h-6 w-auto object-contain"
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-serif font-bold text-white tracking-wide truncate">Saudagar</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D09A16]/20 text-[#D09A16] border border-[#D09A16]/30 uppercase">
                    CMS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block truncate">Control Console</span>
              </div>
            )}
          </Link>

          {/* Toggle Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${isSidebarCollapsed ? 'mt-1 text-[#D09A16]' : ''
              }`}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                  {group.group}
                </div>
              ) : (
                gIdx > 0 && <div className="my-2 border-t border-white/[0.06] mx-2" />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.to);

                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`relative flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
                      } rounded-xl text-xs font-medium transition-all duration-200 ${active
                        ? 'bg-[#D09A16]/15 text-[#E6C673] font-semibold shadow-sm border border-[#D09A16]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                      }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} min-w-0`}>
                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors ${active ? 'text-[#D09A16]' : 'text-slate-400'
                          }`}
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && item.pill && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300 shrink-0">
                        {item.pill}
                      </span>
                    )}

                    {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${active
                          ? 'bg-[#D09A16] text-[#0E1424]'
                          : 'bg-white/10 text-slate-300'
                        }`}>
                        {item.badge}
                      </span>
                    )}

                    {isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D09A16]" />
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
        <div className="p-3 border-t border-white/[0.08] space-y-2 bg-[#0A0F1D]">
          {!isSidebarCollapsed ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-9 h-9 rounded-xl bg-[#D09A16]/15 border border-[#D09A16]/30 text-[#D09A16] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
                title={`${admin?.name || 'Administrator'} (${admin?.email || 'admin@saudagar.com'})`}
              >
                <Shield size={16} />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Live Site"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          )}
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
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${active
                          ? 'bg-[#D09A16]/15 text-[#E6C673] font-semibold border border-[#D09A16]/30'
                          : 'text-slate-300 hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={active ? 'text-[#D09A16]' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.pill && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300">
                            {item.pill}
                          </span>
                        )}
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D09A16] text-[#0E1424]">
                            {item.badge}
                          </span>
                        )}
                      </div>
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
        <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 border-b border-white/[0.08] bg-[#0E1424]/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar (full menu)" : "Collapse sidebar (more workspace for editing)"}
              aria-label="Toggle Sidebar"
            >
              {isSidebarCollapsed ? (
                <>
                  <PanelLeftOpen size={16} className="text-[#D09A16]" />
                  <span className="text-[11px] font-medium text-slate-300">Expand</span>
                </>
              ) : (
                <>
                  <PanelLeftClose size={16} className="text-slate-400" />
                  <span className="hidden xl:inline text-[11px] font-medium text-slate-400">Collapse</span>
                </>
              )}
            </button>

            <div className="h-6 w-px bg-white/10 mx-1" />

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
