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
  { id: 'navbar', label: '1. Navbar & Header', icon: Globe },
  { id: 'hero', label: '2. Hero Section', icon: Sparkles },
  { id: 'topConsultant', label: '3. Top Consultant', icon: Award },
  { id: 'curatedCorridors', label: '4. Featured Properties', icon: Building2 },
  { id: 'services', label: '5. Our Services', icon: Layers },
  { id: 'dlfCallout', label: '6. DLF Callout & Stats', icon: TrendingUp },
  { id: 'whyChooseUs', label: '7. Why Choose Us', icon: ShieldCheck },
  { id: 'testimonials', label: '8. Testimonials Header', icon: MessageSquare },
  { id: 'location', label: '9. Location & Map', icon: MapPin },
  { id: 'newsletter', label: '10. Newsletter', icon: Mail },
  { id: 'footer', label: '11. Footer & Socials', icon: Share2 },
  { id: 'floatingWidgets', label: '12. Floating Widgets', icon: Phone }
];

export default function AdminSectionsCMS() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams ? searchParams.get('tab') || 'navbar' : 'navbar';

  const { sections, refetch } = useCms();
  const [formData, setFormData] = useState({});
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [prevTabKey, setPrevTabKey] = useState(activeTab);
  const [prevSections, setPrevSections] = useState(sections);

  if (prevTabKey !== activeTab || prevSections !== sections) {
    setPrevTabKey(activeTab);
    setPrevSections(sections);
    const currentData = sections[activeTab] || {};
    setFormData(currentData);
    setJsonText(JSON.stringify(currentData, null, 2));
    setJsonError('');
    setStatusMsg({ type: '', text: '' });
  }

  const handleTabChange = (tabId) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('tab', tabId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleJsonToggle = () => {
    if (!jsonMode) {
      setJsonText(JSON.stringify(formData, null, 2));
      setJsonError('');
      setJsonMode(true);
    } else {
      try {
        const parsed = JSON.parse(jsonText);
        setFormData(parsed);
        setJsonError('');
        setJsonMode(false);
      } catch (err) {
        setJsonError('Invalid JSON format: ' + err.message);
      }
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    let dataToSave = formData;
    if (jsonMode) {
      try {
        dataToSave = JSON.parse(jsonText);
        setFormData(dataToSave);
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Cannot save: Invalid JSON format.' });
        setSaving(false);
        return;
      }
    }

    try {
      const res = await api.updateSection(activeTab, dataToSave, `${activeTab.toUpperCase()} Section`);
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Section '${activeTab}' successfully updated and published live!` });
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#D09A16] uppercase mb-2">
            <Layers size={12} />
            <span>Complete Website CMS Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            100% Dynamic Content Manager
          </h1>
          <p className="text-xs text-slate-400">
            Edit text, links, banners, media & arrays for all 12 public sections with real-time sync
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleJsonToggle}
            className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              jsonMode
                ? 'bg-[#D09A16]/20 border-[#D09A16] text-[#D09A16]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            {jsonMode ? <Sliders size={14} /> : <Code size={14} />}
            <span>{jsonMode ? 'Switch to Form View' : 'Raw JSON Mode'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D09A16] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(208, 154, 22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
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
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
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
      <form onSubmit={handleSave} className="rounded-3xl bg-[#121724] border border-white/10 p-6 sm:p-10 shadow-xl space-y-8">
        {/* JSON MODE EDITOR */}
        {jsonMode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <Code size={16} className="text-[#D09A16]" />
                <span>Raw JSON Editor for &apos;{activeTab}&apos;</span>
              </h3>
              <span className="text-[11px] text-slate-400">Direct schema access for complete CRUD customization</span>
            </div>

            {jsonError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                {jsonError}
              </div>
            )}

            <textarea
              rows={22}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full font-mono text-xs bg-slate-950/80 border border-white/10 focus:border-[#D09A16] rounded-2xl p-4 text-emerald-400 outline-none leading-relaxed"
            />
          </div>
        ) : (
          renderActiveEditor()
        )}

        {/* Bottom Save Button Bar */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Changes publish immediately across the public website via MongoDB Atlas and CmsContext.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D09A16] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_6px_20px_rgba(208, 154, 22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


