import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Building,
  Quote,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Sections CMS', to: '/admin/sections', icon: Layers },
    { label: 'Properties', to: '/admin/properties', icon: Building },
    { label: 'Testimonials', to: '/admin/testimonials', icon: Quote },
    { label: 'Leads & Inquiries', to: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-[#0C101A] text-slate-100 flex flex-col md:flex-row">
      {/* ===================== SIDEBAR (Desktop) ===================== */}
      <aside className="hidden md:flex flex-col w-72 bg-[#121724] border-r border-white/10 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/95 border border-[#D09A16]/40 shadow-sm">
              <img src={logoImg} alt="Saudagar Properties" className="h-7 w-auto object-contain" />
            </div>
            <div>
              <span className="block text-sm font-serif font-bold text-white tracking-wide">Saudagar</span>
              <span className="block text-[10px] text-[#D09A16] font-semibold uppercase tracking-widest">CMS Control</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D09A16] to-[#B39366] text-[#0C101A] shadow-[0_4px_15px_rgba(197,168,128,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom Strip */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#0F141F]">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#D09A16]/20 border border-[#D09A16]/40 text-[#D09A16] flex items-center justify-center font-bold text-xs shrink-0">
                <Shield size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</p>
                <p className="text-[10px] text-[#D09A16] truncate">{admin?.email || 'admin@saudagar.com'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* ===================== MOBILE HEADER ===================== */}
      <div className="md:hidden bg-[#121724] border-b border-white/10 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/95">
            <img src={logoImg} alt="Saudagar" className="h-6 w-auto" />
          </div>
          <span className="text-sm font-serif font-bold text-white">Saudagar CMS</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#0C101A]/98 backdrop-blur-2xl z-40 p-5 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#D09A16] text-[#0C101A]'
                        : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 flex gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-semibold text-white"
            >
              View Live Website
            </a>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-xs font-semibold text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0C101A]">
        {/* Top Announcement Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#121724]/60 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles size={14} className="text-[#D09A16]" />
            <span>Saudagar Properties Content Management Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#CBD5E1] hover:text-white transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink size={12} className="text-[#D09A16]" />
            </a>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
