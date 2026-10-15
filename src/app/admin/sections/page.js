"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Building2,
  MapPin,
  Mail,
  ShieldCheck,
  RefreshCw,
  Award,
  MessageSquare,
  Share2,
  Phone,
  Globe,
  Code,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import api from '@/services/api';

// Section Editors
import NavbarEditor from '@/components/admin/sections/NavbarEditor';
import HeroEditor from '@/components/admin/sections/HeroEditor';
import TopConsultantEditor from '@/components/admin/sections/TopConsultantEditor';
import CuratedCorridorsEditor from '@/components/admin/sections/CuratedCorridorsEditor';
import ServicesEditor from '@/components/admin/sections/ServicesEditor';
import DlfCalloutEditor from '@/components/admin/sections/DlfCalloutEditor';
import WhyChooseUsEditor from '@/components/admin/sections/WhyChooseUsEditor';
import TestimonialsEditor from '@/components/admin/sections/TestimonialsEditor';
import LocationEditor from '@/components/admin/sections/LocationEditor';
import NewsletterEditor from '@/components/admin/sections/NewsletterEditor';
import FooterEditor from '@/components/admin/sections/FooterEditor';
import FloatingWidgetsEditor from '@/components/admin/sections/FloatingWidgetsEditor';

const TABS = [
  { id: 'hero', label: 'Hero Banner', icon: Sparkles },
  { id: 'topConsultant', label: 'Consultant Showcase', icon: Award },
  { id: 'curatedCorridors', label: 'Featured Corridors', icon: Building2 },
  { id: 'services', label: 'Our Services', icon: Layers },
  { id: 'dlfCallout', label: 'DLF Callout & Stats', icon: TrendingUp },
  { id: 'whyChooseUs', label: 'Why Choose Us', icon: ShieldCheck },
  { id: 'testimonials', label: 'Testimonials Header', icon: MessageSquare },
  { id: 'location', label: 'Office & Map', icon: MapPin },
  { id: 'newsletter', label: 'Newsletter Banner', icon: Mail },
  { id: 'navbar', label: 'Header & Navigation', icon: Globe },
  { id: 'footer', label: 'Footer & Links', icon: Share2 },
  { id: 'floatingWidgets', label: 'Floating Buttons', icon: Phone }
];

import { DEFAULT_SECTIONS } from '@/constants/defaultSections';

export default function AdminSectionsCMS() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams ? searchParams.get('tab') || 'hero' : 'hero';

  const { sections, refetch, updateLocalSection } = useCms();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [formData, setFormData] = useState(() => sections[activeTab] || DEFAULT_SECTIONS[activeTab] || {});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Sync state when active tab changes (official React pattern for adjusting state from props/URL)
  if (currentTab !== activeTab) {
    setCurrentTab(activeTab);
    setFormData(sections[activeTab] || DEFAULT_SECTIONS[activeTab] || {});
    setStatusMsg({ type: '', text: '' });
  }

  // Fetch fresh section data from database asynchronously
  useEffect(() => {
    let isMounted = true;

    api.getSection(activeTab)
      .then((res) => {
        if (isMounted && res?.success && res.data) {
          setFormData(res.data);
        }
      })
      .catch((err) => {
        console.warn(`[Admin] Fresh fetch for section '${activeTab}':`, err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', tabId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await api.updateSection(activeTab, formData, `${activeTab.toUpperCase()} Section`);
      if (res && res.success) {
        setStatusMsg({
          type: 'success',
          text: `Section "${activeTab}" saved and published live to database successfully!`
        });

        // Update local form and context immediately
        const savedData = res.data || formData;
        setFormData(savedData);
        if (updateLocalSection) {
          updateLocalSection(activeTab, savedData);
        }

        // Force background refetch to synchronize cache
        await refetch(true);
      } else {
        setStatusMsg({ type: 'error', text: res?.message || 'Failed to update section' });
      }
    } catch (err) {
      console.error('[Admin Save Error]', err);
      const isAuthError =
        err.message?.toLowerCase().includes('authorized') ||
        err.message?.toLowerCase().includes('token') ||
        err.message?.toLowerCase().includes('401');

      setStatusMsg({
        type: 'error',
        isAuth: isAuthError,
        text: isAuthError
          ? 'Your admin login session has expired or is unauthorized. Please log in again to save changes.'
          : (err.message || 'Error saving to database')
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'navbar':
        return <NavbarEditor formData={formData} updateField={updateField} />;
      case 'hero':
        return <HeroEditor formData={formData} updateField={updateField} />;
      case 'topConsultant':
        return <TopConsultantEditor formData={formData} updateField={updateField} />;
      case 'curatedCorridors':
        return <CuratedCorridorsEditor formData={formData} updateField={updateField} />;
      case 'services':
        return <ServicesEditor formData={formData} updateField={updateField} onNavigateTab={handleTabChange} />;
      case 'dlfCallout':
        return <DlfCalloutEditor formData={formData} updateField={updateField} />;
      case 'whyChooseUs':
        return <WhyChooseUsEditor formData={formData} updateField={updateField} />;
      case 'testimonials':
        return <TestimonialsEditor formData={formData} updateField={updateField} />;
      case 'location':
        return <LocationEditor formData={formData} updateField={updateField} />;
      case 'newsletter':
        return <NewsletterEditor formData={formData} updateField={updateField} />;
      case 'footer':
        return <FooterEditor formData={formData} updateField={updateField} />;
      case 'floatingWidgets':
        return <FloatingWidgetsEditor formData={formData} updateField={updateField} />;
      default:
        return (
          <div className="text-center py-12 text-slate-400">
            Select a valid section tab to edit.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
            >
              <span>← All Pages Hub</span>
            </Link>
            <span className="px-2 py-0.5 rounded-full bg-[#D09A16]/10 text-[#D09A16] border border-[#D09A16]/30 text-[10px] font-bold uppercase tracking-wider">
              12 Sections
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Landing Page CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update headings, descriptions, media, and banners for your homepage sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Site</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D09A16] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(208,154,22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#D09A16] text-[#0C101A] shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Alert Notification */}
      {statusMsg.text && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
          {statusMsg.isAuth && (
            <Link
              href="/admin/login"
              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-bold text-[11px] uppercase tracking-wider transition-colors shrink-0"
            >
              Log In Again
            </Link>
          )}
        </motion.div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSave} className="rounded-2xl bg-[#0E1424] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
        {renderActiveEditor()}

        {/* Bottom Save Button Bar */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Changes will be reflected immediately on the live website.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D09A16] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(208,154,22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


