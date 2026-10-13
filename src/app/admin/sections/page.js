"use client";

import React, { useState, useEffect } from 'react';
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
  { id: 'dlfCallout', label: 'Market Stats', icon: TrendingUp },
  { id: 'whyChooseUs', label: 'Why Choose Us', icon: ShieldCheck },
  { id: 'testimonials', label: 'Testimonials Header', icon: MessageSquare },
  { id: 'location', label: 'Office & Map', icon: MapPin },
  { id: 'newsletter', label: 'Newsletter Banner', icon: Mail },
  { id: 'navbar', label: 'Header & Navigation', icon: Globe },
  { id: 'footer', label: 'Footer & Links', icon: Share2 },
  { id: 'floatingWidgets', label: 'Floating Buttons', icon: Phone }
];

export default function AdminSectionsCMS() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams ? searchParams.get('tab') || 'hero' : 'hero';

  const { sections, refetch } = useCms();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [prevTabKey, setPrevTabKey] = useState(activeTab);
  const [prevSections, setPrevSections] = useState(sections);

  if (prevTabKey !== activeTab || prevSections !== sections) {
    setPrevTabKey(activeTab);
    setPrevSections(sections);
    const currentData = sections[activeTab] || {};
    setFormData(currentData);
    setStatusMsg({ type: '', text: '' });
  }

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
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Changes saved and published successfully!` });
        await refetch();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Failed to update section' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Error saving to backend' });
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
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Landing Page CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update headings, descriptions, media, and banners for your homepage sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
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


