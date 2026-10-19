"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  BookOpen,
  Users,
  Phone,
  Sparkles,
  Layers,
  ArrowRight,
  Search,
  Mail,
  MapPin,
  Clock,
  Film,
  FileText,
  LayoutList,
  Compass,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';
import { CORRIDOR_PAGES_DATA } from '@/constants/corridorPagesData';
import api from '@/services/api';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

const CORRIDOR_LIST = [
  { slug: 'dlf-phase-1', name: 'DLF Phase 1', path: '/property/dlf-phase-1' },
  { slug: 'dlf-phase-2', name: 'DLF Phase 2', path: '/property/dlf-phase-2' },
  { slug: 'dlf-phase-3', name: 'DLF Phase 3', path: '/property/dlf-phase-3' },
  { slug: 'dlf-phase-4', name: 'DLF Phase 4', path: '/property/dlf-phase-4' },
  { slug: 'shushant-lok', name: 'Sushant Lok', path: '/property/shushant-lok' },
  { slug: 'udyog-vihar', name: 'Udyog Vihar', path: '/property/udyog-vihar' }
];

const PAGE_CONFIGS = {
  properties: {
    pageKey: 'page_properties',
    liveUrl: '/properties',
    title: 'Properties Catalog Page CMS',
    desc: 'Customize the header masthead, search filters, empty states, and advisory contact banner.',
    icon: Building2,
    sections: [
      { id: 'masthead', label: 'Masthead & Hero' },
      { id: 'filters', label: 'Search & Filters' },
      { id: 'emptyState', label: 'Empty Search State' },
      { id: 'advisory', label: 'Bottom Advisory Banner' }
    ]
  },
  residential: {
    pageKey: 'page_residential',
    liveUrl: '/services/residential',
    title: 'Residential Services Page CMS',
    desc: 'Manage luxury builder floor typologies, DLF Phase 1–5 metrics, micro-markets, 7-point due diligence roadmap, specification standards, and private consultation CTA.',
    icon: Building2,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'metrics', label: 'Key Performance Metrics' },
      { id: 'assetClasses', label: 'Asset Classes & Pricing' },
      { id: 'microMarkets', label: 'Micro-Markets' },
      { id: 'dueDiligenceSteps', label: '7-Point Due Diligence' },
      { id: 'specificationStandards', label: 'Specification Standards' },
      { id: 'cta', label: 'Consultation Banner' }
    ]
  },
  commercial: {
    pageKey: 'page_commercial',
    liveUrl: '/services/commercial',
    title: 'Commercial Services Page CMS',
    desc: 'Manage Cyber City & Udyog Vihar corporate suites, high-street retail, pre-leased yields, lease structuring framework, compliance standards, and leasing desk copy.',
    icon: Layers,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'metrics', label: 'Commercial Yield Metrics' },
      { id: 'assetClasses', label: 'Office & Retail Classes' },
      { id: 'yieldBenchmarks', label: 'Yield Benchmarks' },
      { id: 'leaseFramework', label: 'Lease Framework' },
      { id: 'complianceStandards', label: 'Compliance Standards' },
      { id: 'cta', label: 'Corporate Advisory Banner' }
    ]
  },
  industrial: {
    pageKey: 'page_industrial',
    liveUrl: '/services/industrial',
    title: 'Industrial Services Page CMS',
    desc: 'Manage logistics parks, HSIIDC plots, warehousing specs, transport corridors, compliance steps, engineering standards, and BTS manufacturing land copy.',
    icon: LayoutList,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'metrics', label: 'Logistics Metrics' },
      { id: 'assetClasses', label: 'Industrial & Land Classes' },
      { id: 'corridors', label: 'Industrial Corridors' },
      { id: 'complianceSteps', label: 'HSIIDC Compliance' },
      { id: 'engineeringStandards', label: 'Engineering Standards' },
      { id: 'cta', label: 'Industrial Advisory Banner' }
    ]
  },
  team: {
    pageKey: 'page_team',
    liveUrl: '/team',
    title: 'Our Team Page CMS',
    desc: 'Manage founder credentials for Arun Sharma & Suneeta Chawla, senior principals, 4 fiduciary pillars, and private session CTA.',
    icon: Users,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'founders', label: 'Founders & Directors' },
      { id: 'teamMembers', label: 'Senior Principals' },
      { id: 'advisoryPillars', label: '4 Fiduciary Pillars' },
      { id: 'cta', label: 'Private Session CTA' }
    ]
  },
  about: {
    pageKey: 'page_about',
    liveUrl: '/about',
    title: 'About Us Page CMS',
    desc: 'Customize company leadership narrative, legacy video tour, property categories, value proposition, why choose us distinction, and private advisory CTA.',
    icon: Users,
    sections: [
      { id: 'hero', label: 'Hero & Metric Strip' },
      { id: 'videoShowcase', label: 'Video Showcase' },
      { id: 'offerings', label: 'Property Categories' },
      { id: 'proposition', label: 'Value Proposition' },
      { id: 'leadership', label: 'Founders & Team' },
      { id: 'whyChooseUs', label: '7 Pillars & Comparison' },
      { id: 'consultationCta', label: 'Consultation Banner' }
    ]
  },
  contact: {
    pageKey: 'page_contact',
    liveUrl: '/contact',
    title: 'Contact Page CMS',
    desc: 'Customize headquarters address, direct telephone lines, email desks, office timings, and inquiry form text.',
    icon: Phone,
    sections: [
      { id: 'hero', label: 'Hero Masthead' },
      { id: 'contactInfo', label: 'Headquarters & Channels' },
      { id: 'form', label: 'Inquiry Form Copy' }
    ]
  },
  blog: {
    pageKey: 'page_blog',
    liveUrl: '/blog',
    title: 'Blog & Research Page CMS',
    desc: 'Customize market intelligence headlines, market pulse metrics, corridor spotlights, research library, and newsletter text.',
    icon: BookOpen,
    sections: [
      { id: 'masthead', label: 'Hero Masthead' },
      { id: 'marketPulse', label: 'Market Pulse Bar' },
      { id: 'spotlight', label: 'Editorial Spotlight' },
      { id: 'corridors', label: 'Corridor Spotlights' },
      { id: 'researchLibrary', label: 'Research Library Archive' },
      { id: 'newsletter', label: 'Advisory Newsletter' }
    ]
  },
  corridors: {
    pageKey: 'corridor_dlf-phase-1',
    isCorridor: true,
    liveUrl: '/property/dlf-phase-1',
    title: 'Micro-Market Corridor CMS',
    desc: 'Customize live metrics, overview narrative, connectivity, nearest landmarks, and FAQs for DLF Phase 1–4, Sushant Lok & Udyog Vihar.',
    icon: Compass,
    sections: [
      { id: 'hero', label: 'Hero & Gallery' },
      { id: 'metrics', label: 'Live Benchmarks' },
      { id: 'overview', label: 'Locality Profile' },
      { id: 'typologies', label: 'Asset Typologies' },
      { id: 'locationSection', label: 'Urban Balance & Callout' },
      { id: 'whyLiveHere', label: 'Why Live Here (8 Pillars)' },
      { id: 'nearestPlaces', label: 'Commute & Landmarks' },
      { id: 'howWeHelp', label: 'How We Help (Turnkey)' },
      { id: 'whyChooseSaudagar', label: 'Why Choose Saudagar' },
      { id: 'inventorySection', label: 'Verified Inventory' },
      { id: 'inquiryForm', label: 'Inquiry Desk Copy' },
      { id: 'mapShowcase', label: 'Strategic & Static Maps' },
      { id: 'faqs', label: 'Corridor FAQs' }
    ]
  },
  terms: {
    pageKey: 'page_terms',
    liveUrl: '/terms',
    title: 'Terms of Service CMS',
    desc: 'Customize legal disclosures, title verification disclaimers, and advisory representation conditions.',
    icon: FileText,
    sections: [
      { id: 'hero', label: 'Hero Masthead' },
      { id: 'sections', label: 'Terms Clauses & Articles' }
    ]
  },
  privacy: {
    pageKey: 'page_privacy',
    liveUrl: '/privacy-policy',
    title: 'Privacy Policy CMS',
    desc: 'Customize HNWI confidentiality standards, zero third-party monetization policy, and client data governance.',
    icon: ShieldCheck,
    sections: [
      { id: 'hero', label: 'Hero Masthead' },
      { id: 'sections', label: 'Privacy Articles & Safeguards' }
    ]
  }
};

// Reusable Form Inputs
function FormField({ label, description, value, onChange, placeholder = '' }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-200">
        {label}
      </label>
      {description && (
        <p className="text-[11px] text-slate-400">{description}</p>
      )}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors"
      />
    </div>
  );
}

function TextAreaField({ label, description, value, onChange, rows = 3, placeholder = '' }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-200">
        {label}
      </label>
      {description && (
        <p className="text-[11px] text-slate-400">{description}</p>
      )}
      <textarea
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors leading-relaxed"
      />
    </div>
  );
}

function ListField({ label, description, items = [], onChange, placeholder = 'One item per line', rows = 3 }) {
  const text = Array.isArray(items) ? items.join('\n') : (items || '');
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-200">
        {label} <span className="text-[10px] text-slate-400 font-normal">(One bullet per line)</span>
      </label>
      {description && (
        <p className="text-[11px] text-slate-400">{description}</p>
      )}
      <textarea
        rows={rows}
        value={text}
        onChange={(e) => {
          const lines = e.target.value.split('\n');
          onChange(lines);
        }}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-gold text-white text-xs outline-none transition-colors leading-relaxed font-mono"
      />
    </div>
  );
}

export default function AdminPageCMS() {
  const routerParams = useParams();
  const searchParams = useSearchParams();
  const pageParam = routerParams?.page || 'properties';
  const config = PAGE_CONFIGS[pageParam] || PAGE_CONFIGS.properties;

  const [selectedCorridor, setSelectedCorridor] = useState(() => {
    const querySlug = searchParams?.get('corridor');
    return querySlug || 'dlf-phase-1';
  });

  const activePageKey = config.isCorridor 
    ? `corridor_${selectedCorridor}` 
    : config.pageKey;

  const { sections, refetch, updateLocalSection } = useCms();
  const [activeSectionTab, setActiveSectionTab] = useState(config.sections[0]?.id || '');
  
  const getInitialData = () => {
    if (config.isCorridor) {
      return sections[activePageKey] || CORRIDOR_PAGES_DATA[selectedCorridor] || {};
    }
    return sections[activePageKey] || DEFAULT_SECTIONS[activePageKey] || {};
  };

  const [currentKey, setCurrentKey] = useState(activePageKey);
  const [formData, setFormData] = useState(getInitialData);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Sync state during render when activePageKey changes (official React pattern)
  if (currentKey !== activePageKey) {
    setCurrentKey(activePageKey);
    const freshDefault = config.isCorridor 
      ? (CORRIDOR_PAGES_DATA[selectedCorridor] || {}) 
      : (DEFAULT_SECTIONS[activePageKey] || {});
    const existing = sections[activePageKey] || {};
    setFormData({ ...freshDefault, ...existing });
    setActiveSectionTab(config.sections[0]?.id || '');
    setStatusMsg({ type: '', text: '' });
  }

  // Fetch fresh from MongoDB asynchronously
  useEffect(() => {
    let isMounted = true;
    api.getPage(activePageKey)
      .then((res) => {
        if (isMounted && res?.success && res.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => {
        console.warn(`[Admin] Fresh fetch for '${activePageKey}':`, err.message);
      });

    return () => { isMounted = false; };
  }, [activePageKey]);

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const pageTitle = config.isCorridor 
        ? `Corridor: ${selectedCorridor.toUpperCase()}` 
        : config.title;

      const res = await api.updatePage(activePageKey, formData, pageTitle);
      if (res && res.success) {
        setStatusMsg({ type: 'success', text: `Page content saved & updated in MongoDB live successfully!` });
        const savedData = res.data || formData;
        setFormData(savedData);
        if (updateLocalSection) {
          updateLocalSection(activePageKey, savedData);
        }
        await refetch(true);
      } else {
        setStatusMsg({ type: 'error', text: res?.message || 'Failed to save changes' });
      }
    } catch (err) {
      console.error('[Admin Page Save Error]', err);
      const isAuthError =
        err.message?.toLowerCase().includes('authorized') ||
        err.message?.toLowerCase().includes('token') ||
        err.message?.toLowerCase().includes('401');

      setStatusMsg({
        type: 'error',
        isAuth: isAuthError,
        text: isAuthError
          ? 'Your admin login session has expired or is unauthorized. Please log in again.'
          : (err.message || 'Network error saving changes')
      });
    } finally {
      setSaving(false);
    }
  };

  const PageIcon = config.icon;
  const currentLiveUrl = config.isCorridor 
    ? `/property/${selectedCorridor}` 
    : config.liveUrl;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
            >
              <span>← All Pages Hub</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-wider">
              <PageIcon size={12} />
              <span>{config.isCorridor ? 'Corridor CMS' : 'Page CMS'}</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {config.isCorridor 
              ? `${CORRIDOR_LIST.find(c => c.slug === selectedCorridor)?.name || 'Corridor'} CMS` 
              : config.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {config.desc}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={currentLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>View Live</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold hover:brightness-110 text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(208,154,22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Corridor Selector Strip (When on corridors page) */}
      {config.isCorridor && (
        <div className="p-4 rounded-2xl bg-[#0E1424] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Micro-Market Corridor to Edit:
            </span>
            <span className="text-[11px] font-mono text-brand-gold">
              Database Key: corridor_{selectedCorridor}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CORRIDOR_LIST.map((corridor) => (
              <button
                key={corridor.slug}
                onClick={() => setSelectedCorridor(corridor.slug)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                  selectedCorridor === corridor.slug
                    ? 'bg-brand-gold text-brand-dark font-bold shadow-md shadow-brand-gold/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {corridor.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {config.sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSectionTab(sec.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSectionTab === sec.id
                ? 'bg-brand-gold text-brand-dark shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Status Alert Notification */}
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

      {/* Form Editor Body */}
      <form onSubmit={handleSave} className="rounded-2xl bg-[#0E1424] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">

        {/* ======================= PROPERTIES CATALOG ======================= */}
        {pageParam === 'properties' && (
          <>
            {activeSectionTab === 'masthead' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Catalog Masthead &amp; Hero</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.masthead?.badge} onChange={(val) => updateField('masthead.badge', val)} placeholder="e.g. Verified Portfolio • DLF Gurugram" />
                  <FormField label="Stats Counter Label" value={formData?.masthead?.statsLabel} onChange={(val) => updateField('masthead.statsLabel', val)} placeholder="e.g. Active Listings" />
                  <FormField label="Heading Prefix" value={formData?.masthead?.titleMain} onChange={(val) => updateField('masthead.titleMain', val)} placeholder="e.g. Luxury Properties & " />
                  <FormField label="Heading Highlight (Italic)" value={formData?.masthead?.titleItalic} onChange={(val) => updateField('masthead.titleItalic', val)} placeholder="e.g. Builder Floors" />
                </div>
                <TextAreaField label="Description Subtext" value={formData?.masthead?.description} onChange={(val) => updateField('masthead.description', val)} rows={3} placeholder="Explore verified ready-to-move luxury builder floors..." />
                <ImageUploadInput
                  label="Masthead Architectural Background Image"
                  value={formData?.masthead?.bgImage}
                  onChange={(val) => updateField('masthead.bgImage', val)}
                  folder="/saudagar-properties/properties"
                />
              </div>
            )}

            {activeSectionTab === 'filters' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Search Toolbar &amp; Corridor Bar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Corridor Filter Section Label" value={formData?.filters?.corridorLabel} onChange={(val) => updateField('filters.corridorLabel', val)} placeholder="e.g. Corridor Filter" />
                  <FormField label="Search Bar Placeholder" value={formData?.filters?.searchPlaceholder} onChange={(val) => updateField('filters.searchPlaceholder', val)} placeholder="e.g. Search by title, location, or plot size..." />
                  <FormField label="Freehold Verification Badge Label" value={formData?.filters?.verifiedBadgeText} onChange={(val) => updateField('filters.verifiedBadgeText', val)} placeholder="e.g. 100% Freehold Title Verification" />
                  <FormField label="All Locations Tab Label" value={formData?.filters?.allLocationsLabel} onChange={(val) => updateField('filters.allLocationsLabel', val)} placeholder="e.g. All Corridors" />
                </div>
              </div>
            )}

            {activeSectionTab === 'emptyState' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Empty Search State Display</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Empty State Heading" value={formData?.emptyState?.title} onChange={(val) => updateField('emptyState.title', val)} placeholder="e.g. No Properties Found Matching Your Criteria" />
                  <FormField label="Reset Filters Button Text" value={formData?.emptyState?.resetBtnText} onChange={(val) => updateField('emptyState.resetBtnText', val)} placeholder="e.g. Reset All Filters" />
                  <FormField label="WhatsApp Button Text" value={formData?.emptyState?.whatsappBtnText} onChange={(val) => updateField('emptyState.whatsappBtnText', val)} placeholder="e.g. WhatsApp Advisory Desk" />
                </div>
                <TextAreaField label="Guidance Description" value={formData?.emptyState?.description} onChange={(val) => updateField('emptyState.description', val)} rows={3} placeholder="Try adjusting your corridor, budget, or configuration filters..." />
              </div>
            )}

            {activeSectionTab === 'advisory' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Bottom Advisory Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.advisory?.badge} onChange={(val) => updateField('advisory.badge', val)} placeholder="e.g. Private Off-Market Advisory" />
                  <FormField label="WhatsApp Contact Number (Digits only)" value={formData?.advisory?.whatsappNumber} onChange={(val) => updateField('advisory.whatsappNumber', val)} placeholder="e.g. 919718511207" />
                  <FormField label="Heading Prefix" value={formData?.advisory?.titleMain} onChange={(val) => updateField('advisory.titleMain', val)} placeholder="e.g. Looking for Unlisted DLF Phase 1–5 " />
                  <FormField label="Heading Highlight (Italic)" value={formData?.advisory?.titleItalic} onChange={(val) => updateField('advisory.titleItalic', val)} placeholder="e.g. Estates?" />
                  <FormField label="WhatsApp CTA Button Text" value={formData?.advisory?.whatsappBtnText} onChange={(val) => updateField('advisory.whatsappBtnText', val)} placeholder="e.g. WhatsApp Advisory" />
                  <FormField label="Direct Hotline Display Text" value={formData?.advisory?.phoneText} onChange={(val) => updateField('advisory.phoneText', val)} placeholder="e.g. +91 98112 21207" />
                  <FormField label="Phone Dial String (tel: URI)" value={formData?.advisory?.phoneRaw} onChange={(val) => updateField('advisory.phoneRaw', val)} placeholder="e.g. +919811221207" />
                </div>
                <TextAreaField label="Advisory Description" value={formData?.advisory?.description} onChange={(val) => updateField('advisory.description', val)} rows={3} placeholder="Many of Gurugram's most exclusive builder floors..." />
              </div>
            )}
          </>
        )}

        {/* ======================= RESIDENTIAL SERVICES ======================= */}
        {pageParam === 'residential' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Hero Banner &amp; Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Direct Hotline Phone" value={formData?.hero?.ctaPhone} onChange={(val) => updateField('hero.ctaPhone', val)} />
                  <FormField label="Heading Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Heading Italic Highlight" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle / Description" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} />
                <ImageUploadInput
                  label="Hero Background Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/services"
                />

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Hero Right Showcase Card</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Card Category Tag" value={formData?.hero?.heroCard?.tag} onChange={(val) => updateField('hero.heroCard.tag', val)} placeholder="e.g. Advisory Authority" />
                    <FormField label="Card Verified Badge" value={formData?.hero?.heroCard?.badge} onChange={(val) => updateField('hero.heroCard.badge', val)} placeholder="e.g. DLF Authorized Desk" />
                    <FormField label="Feature #1 Title" value={formData?.hero?.heroCard?.feature1Title} onChange={(val) => updateField('hero.heroCard.feature1Title', val)} placeholder="e.g. 100% Clear & Verified Titles" />
                    <FormField label="Feature #1 Description" value={formData?.hero?.heroCard?.feature1Desc} onChange={(val) => updateField('hero.heroCard.feature1Desc', val)} placeholder="e.g. Every builder floor..." />
                    <FormField label="Feature #2 Title" value={formData?.hero?.heroCard?.feature2Title} onChange={(val) => updateField('hero.heroCard.feature2Title', val)} placeholder="e.g. Off-Market Builder Floors" />
                    <FormField label="Feature #2 Description" value={formData?.hero?.heroCard?.feature2Desc} onChange={(val) => updateField('hero.heroCard.feature2Desc', val)} placeholder="e.g. Direct access..." />
                    <FormField label="Feature #3 Title" value={formData?.hero?.heroCard?.feature3Title} onChange={(val) => updateField('hero.heroCard.feature3Title', val)} placeholder="e.g. 25+ Years DLF Leadership" />
                    <FormField label="Feature #3 Description" value={formData?.hero?.heroCard?.feature3Desc} onChange={(val) => updateField('hero.heroCard.feature3Desc', val)} placeholder="e.g. Trusted advisors..." />
                    <FormField label="Card Stat Label" value={formData?.hero?.heroCard?.statLabel} onChange={(val) => updateField('hero.heroCard.statLabel', val)} placeholder="e.g. Average Turnaround" />
                    <FormField label="Card Stat Value" value={formData?.hero?.heroCard?.statValue} onChange={(val) => updateField('hero.heroCard.statValue', val)} placeholder="e.g. Seamless 14-Day Closure" />
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'metrics' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">4 Key Performance Metrics</h3>
                {(formData?.metrics || []).map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label={`Metric #${idx + 1} Label`} value={m.label} onChange={(val) => updateField(`metrics.${idx}.label`, val)} />
                    <FormField label="Metric Value (e.g. 100%, 25+)" value={m.value} onChange={(val) => updateField(`metrics.${idx}.value`, val)} />
                    <FormField label="Description Subtext" value={m.desc} onChange={(val) => updateField(`metrics.${idx}.desc`, val)} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'assetClasses' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Residential Asset Classes &amp; Typologies</h3>
                {(formData?.assetClasses || []).map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Asset Class #{idx + 1}: {item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Class Title" value={item.title} onChange={(val) => updateField(`assetClasses.${idx}.title`, val)} />
                      <FormField label="Locations" value={item.locations} onChange={(val) => updateField(`assetClasses.${idx}.locations`, val)} />
                      <FormField label="Specifications Summary" value={item.specs} onChange={(val) => updateField(`assetClasses.${idx}.specs`, val)} />
                      <FormField label="Price Bracket" value={item.price || item.pricing} onChange={(val) => { updateField(`assetClasses.${idx}.price`, val); updateField(`assetClasses.${idx}.pricing`, val); }} />
                    </div>
                    
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block mb-2">Technical &amp; Typology Metrics</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(item.metrics || [{ label: '', val: '' }, { label: '', val: '' }, { label: '', val: '' }, { label: '', val: '' }]).slice(0, 4).map((m, mIdx) => (
                          <div key={mIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                            <FormField label={`Metric #${mIdx + 1} Label`} value={m.label} onChange={(val) => updateField(`assetClasses.${idx}.metrics.${mIdx}.label`, val)} placeholder="e.g. Built-Up Area" />
                            <FormField label="Value" value={m.val || m.value} onChange={(val) => { updateField(`assetClasses.${idx}.metrics.${mIdx}.val`, val); updateField(`assetClasses.${idx}.metrics.${mIdx}.value`, val); }} placeholder="e.g. 2,800 - 4,500 Sq. Ft." />
                          </div>
                        ))}
                      </div>
                    </div>

                    <ListField
                      label="Key Features &amp; Specifications"
                      items={item.features}
                      onChange={(val) => updateField(`assetClasses.${idx}.features`, val)}
                      placeholder="Private OTIS/Kone elevator with access control&#10;Separate staff quarters with private washroom"
                    />

                    <ImageUploadInput
                      label={`Asset Class #${idx + 1} Image`}
                      value={item.image}
                      onChange={(val) => updateField(`assetClasses.${idx}.image`, val)}
                      folder="/saudagar-properties/services"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'microMarkets' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Prime Micro-Market Intelligence Benchmarks</h3>
                {(formData?.microMarkets || []).map((market, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Micro-Market #{idx + 1}: {market.phase}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Corridor / Phase Name" value={market.phase} onChange={(val) => updateField(`microMarkets.${idx}.phase`, val)} />
                      <FormField label="Character Tag" value={market.character} onChange={(val) => updateField(`microMarkets.${idx}.character`, val)} />
                      <FormField label="Livability Score" value={market.livabilityScore} onChange={(val) => updateField(`microMarkets.${idx}.livabilityScore`, val)} />
                      <FormField label="Price Range / Valuation" value={market.priceRange} onChange={(val) => updateField(`microMarkets.${idx}.priceRange`, val)} />
                      <FormField label="Rental Yield" value={market.rentalYield} onChange={(val) => updateField(`microMarkets.${idx}.rentalYield`, val)} />
                    </div>
                    <ListField
                      label="Micro-Market Key Highlights"
                      items={market.highlights}
                      onChange={(val) => updateField(`microMarkets.${idx}.highlights`, val)}
                      placeholder="Immediate connectivity to Golf Course Road &amp; MG Road&#10;Dense tree canopy, tranquil residential atmosphere"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'dueDiligenceSteps' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">7-Point Due Diligence &amp; Conveyance Roadmap</h3>
                {(formData?.dueDiligenceSteps || []).map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Step Number" value={step.step} onChange={(val) => updateField(`dueDiligenceSteps.${idx}.step`, val)} />
                      <div className="sm:col-span-2">
                        <FormField label="Step Title" value={step.title} onChange={(val) => updateField(`dueDiligenceSteps.${idx}.title`, val)} />
                      </div>
                    </div>
                    <TextAreaField label="Verification Protocol Description" value={step.desc} onChange={(val) => updateField(`dueDiligenceSteps.${idx}.desc`, val)} rows={2} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'specificationStandards' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Luxury Architectural &amp; Specification Standards</h3>
                {(formData?.specificationStandards || []).map((std, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <FormField label={`Standard Category #${idx + 1}`} value={std.category} onChange={(val) => updateField(`specificationStandards.${idx}.category`, val)} />
                    <ListField
                      label="Category Specifications &amp; Standards"
                      items={std.items}
                      onChange={(val) => updateField(`specificationStandards.${idx}.items`, val)}
                      placeholder="Seismic Zone IV earthquake-resistant RCC frame construction&#10;Double-glazed Unit (DGU) acoustic windows by Schüco / Fenesta"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'cta' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Bottom Consultation CTA Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.cta?.badge} onChange={(val) => updateField('cta.badge', val)} />
                  <FormField label="Direct Hotline Phone" value={formData?.cta?.phone} onChange={(val) => updateField('cta.phone', val)} />
                  <FormField label="Title Main" value={formData?.cta?.titleMain} onChange={(val) => updateField('cta.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.cta?.titleItalic} onChange={(val) => updateField('cta.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.cta?.subtitle} onChange={(val) => updateField('cta.subtitle', val)} />
                <FormField label="WhatsApp Direct URL" value={formData?.cta?.whatsappUrl} onChange={(val) => updateField('cta.whatsappUrl', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= COMMERCIAL SERVICES ======================= */}
        {pageParam === 'commercial' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Commercial Hero Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Direct Phone" value={formData?.hero?.ctaPhone} onChange={(val) => updateField('hero.ctaPhone', val)} />
                  <FormField label="Title Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} />
                <ImageUploadInput
                  label="Commercial Hero Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/services"
                />

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Hero Right Showcase Card</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Card Category Tag" value={formData?.hero?.heroCard?.tag} onChange={(val) => updateField('hero.heroCard.tag', val)} placeholder="e.g. Enterprise Advisory" />
                    <FormField label="Card Verified Badge" value={formData?.hero?.heroCard?.badge} onChange={(val) => updateField('hero.heroCard.badge', val)} placeholder="e.g. Corporate Tenant Desk" />
                    <FormField label="Feature #1 Title" value={formData?.hero?.heroCard?.feature1Title} onChange={(val) => updateField('hero.heroCard.feature1Title', val)} placeholder="e.g. Pre-Leased High ROI Deals" />
                    <FormField label="Feature #1 Description" value={formData?.hero?.heroCard?.feature1Desc} onChange={(val) => updateField('hero.heroCard.feature1Desc', val)} placeholder="e.g. Vetted commercial..." />
                    <FormField label="Feature #2 Title" value={formData?.hero?.heroCard?.feature2Title} onChange={(val) => updateField('hero.heroCard.feature2Title', val)} placeholder="e.g. Direct Developer Mandates" />
                    <FormField label="Feature #2 Description" value={formData?.hero?.heroCard?.feature2Desc} onChange={(val) => updateField('hero.heroCard.feature2Desc', val)} placeholder="e.g. Preferred institutional..." />
                    <FormField label="Feature #3 Title" value={formData?.hero?.heroCard?.feature3Title} onChange={(val) => updateField('hero.heroCard.feature3Title', val)} placeholder="e.g. End-to-End Lease Structuring" />
                    <FormField label="Feature #3 Description" value={formData?.hero?.heroCard?.feature3Desc} onChange={(val) => updateField('hero.heroCard.feature3Desc', val)} placeholder="e.g. Complete legal lease..." />
                    <FormField label="Card Stat Label" value={formData?.hero?.heroCard?.statLabel} onChange={(val) => updateField('hero.heroCard.statLabel', val)} placeholder="e.g. Commercial Portfolio Transacted" />
                    <FormField label="Card Stat Value" value={formData?.hero?.heroCard?.statValue} onChange={(val) => updateField('hero.heroCard.statValue', val)} placeholder="e.g. 1,000,000+ Sq. Ft." />
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'metrics' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Commercial Yield &amp; Performance Metrics</h3>
                {(formData?.metrics || []).map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label={`Metric #${idx + 1} Label`} value={m.label} onChange={(val) => updateField(`metrics.${idx}.label`, val)} />
                    <FormField label="Value" value={m.value} onChange={(val) => updateField(`metrics.${idx}.value`, val)} />
                    <FormField label="Description" value={m.desc} onChange={(val) => updateField(`metrics.${idx}.desc`, val)} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'assetClasses' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Office &amp; Retail Asset Classes</h3>
                {(formData?.assetClasses || []).map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Asset Class #{idx + 1}: {item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Title" value={item.title} onChange={(val) => updateField(`assetClasses.${idx}.title`, val)} />
                      <FormField label="Locations" value={item.locations} onChange={(val) => updateField(`assetClasses.${idx}.locations`, val)} />
                      <FormField label="Specs" value={item.specs} onChange={(val) => updateField(`assetClasses.${idx}.specs`, val)} />
                      <FormField label="Price / Rental Yield" value={item.price || item.pricing} onChange={(val) => { updateField(`assetClasses.${idx}.price`, val); updateField(`assetClasses.${idx}.pricing`, val); }} />
                    </div>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block mb-2">Technical &amp; Asset Metrics</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(item.metrics || [{ label: '', val: '' }, { label: '', val: '' }, { label: '', val: '' }, { label: '', val: '' }]).slice(0, 4).map((m, mIdx) => (
                          <div key={mIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                            <FormField label={`Metric #${mIdx + 1} Label`} value={m.label} onChange={(val) => updateField(`assetClasses.${idx}.metrics.${mIdx}.label`, val)} placeholder="e.g. Floor Plates" />
                            <FormField label="Value" value={m.val || m.value} onChange={(val) => { updateField(`assetClasses.${idx}.metrics.${mIdx}.val`, val); updateField(`assetClasses.${idx}.metrics.${mIdx}.value`, val); }} placeholder="e.g. 15,000 - 35,000 Sq. Ft." />
                          </div>
                        ))}
                      </div>
                    </div>

                    <ListField
                      label="Key Commercial Features &amp; Specifications"
                      items={item.features}
                      onChange={(val) => updateField(`assetClasses.${idx}.features`, val)}
                      placeholder="LEED Gold / Platinum Certified sustainable design&#10;High-speed destination-controlled elevators"
                    />

                    <ImageUploadInput
                      label={`Asset Class #${idx + 1} Image`}
                      value={item.image}
                      onChange={(val) => updateField(`assetClasses.${idx}.image`, val)}
                      folder="/saudagar-properties/services"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'yieldBenchmarks' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Commercial Micro-Market Yield Benchmarks</h3>
                {(formData?.yieldBenchmarks || []).map((market, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Commercial Hub #{idx + 1}: {market.hub}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Commercial Hub Name" value={market.hub} onChange={(val) => updateField(`yieldBenchmarks.${idx}.hub`, val)} />
                      <FormField label="Category / Asset Class" value={market.category} onChange={(val) => updateField(`yieldBenchmarks.${idx}.category`, val)} />
                      <FormField label="Yield Range (%)" value={market.netYield || market.yieldRange} onChange={(val) => { updateField(`yieldBenchmarks.${idx}.netYield`, val); updateField(`yieldBenchmarks.${idx}.yieldRange`, val); }} />
                      <FormField label="Lease Rate / Valuation" value={market.leaseRate || market.capitalValuation} onChange={(val) => { updateField(`yieldBenchmarks.${idx}.leaseRate`, val); updateField(`yieldBenchmarks.${idx}.capitalValuation`, val); }} />
                      <FormField label="Average Occupancy Rate" value={market.occupancy || market.occupancyRate} onChange={(val) => { updateField(`yieldBenchmarks.${idx}.occupancy`, val); updateField(`yieldBenchmarks.${idx}.occupancyRate`, val); }} />
                    </div>
                    <ListField
                      label="Hub Yield Highlights"
                      items={market.highlights}
                      onChange={(val) => updateField(`yieldBenchmarks.${idx}.highlights`, val)}
                      placeholder="India's premier corporate destination housing 500+ MNCs&#10;Direct Rapid Metro and NH-48 connectivity"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'leaseFramework' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Institutional Lease Structuring Framework</h3>
                {(formData?.leaseFramework || []).map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Framework Stage #" value={step.step} onChange={(val) => updateField(`leaseFramework.${idx}.step`, val)} />
                      <div className="sm:col-span-2">
                        <FormField label="Stage Title" value={step.title} onChange={(val) => updateField(`leaseFramework.${idx}.title`, val)} />
                      </div>
                    </div>
                    <TextAreaField label="Lease Structuring Protocol" value={step.desc} onChange={(val) => updateField(`leaseFramework.${idx}.desc`, val)} rows={2} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'complianceStandards' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Institutional Building Compliance Checklist</h3>
                {(formData?.complianceStandards || []).map((std, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Standard / Benchmark Title" value={std.title} onChange={(val) => updateField(`complianceStandards.${idx}.title`, val)} />
                      <FormField label="Compliance Metrics / Certification" value={std.metrics} onChange={(val) => updateField(`complianceStandards.${idx}.metrics`, val)} />
                    </div>
                    <TextAreaField label="Audit &amp; Engineering Description" value={std.desc} onChange={(val) => updateField(`complianceStandards.${idx}.desc`, val)} rows={2} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'cta' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Corporate Advisory Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.cta?.badge} onChange={(val) => updateField('cta.badge', val)} />
                  <FormField label="Direct Hotline Phone" value={formData?.cta?.phone} onChange={(val) => updateField('cta.phone', val)} />
                  <FormField label="Title Main" value={formData?.cta?.titleMain} onChange={(val) => updateField('cta.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.cta?.titleItalic} onChange={(val) => updateField('cta.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.cta?.subtitle} onChange={(val) => updateField('cta.subtitle', val)} />
                <FormField label="WhatsApp Direct URL" value={formData?.cta?.whatsappUrl} onChange={(val) => updateField('cta.whatsappUrl', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= INDUSTRIAL SERVICES ======================= */}
        {pageParam === 'industrial' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Industrial Hero Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Direct Phone" value={formData?.hero?.ctaPhone} onChange={(val) => updateField('hero.ctaPhone', val)} />
                  <FormField label="Title Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} />
                <ImageUploadInput
                  label="Industrial Hero Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/services"
                />

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Hero Right Showcase Card</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Card Category Tag" value={formData?.hero?.heroCard?.tag} onChange={(val) => updateField('hero.heroCard.tag', val)} placeholder="e.g. Industrial Desk" />
                    <FormField label="Card Verified Badge" value={formData?.hero?.heroCard?.badge} onChange={(val) => updateField('hero.heroCard.badge', val)} placeholder="e.g. HSIIDC & Legal Diligence" />
                    <FormField label="Feature #1 Title" value={formData?.hero?.heroCard?.feature1Title} onChange={(val) => updateField('hero.heroCard.feature1Title', val)} placeholder="e.g. Turnkey Logistics Facilities" />
                    <FormField label="Feature #1 Description" value={formData?.hero?.heroCard?.feature1Desc} onChange={(val) => updateField('hero.heroCard.feature1Desc', val)} placeholder="e.g. Immediate occupancy..." />
                    <FormField label="Feature #2 Title" value={formData?.hero?.heroCard?.feature2Title} onChange={(val) => updateField('hero.heroCard.feature2Title', val)} placeholder="e.g. Zoning & Compliance Audits" />
                    <FormField label="Feature #2 Description" value={formData?.hero?.heroCard?.feature2Desc} onChange={(val) => updateField('hero.heroCard.feature2Desc', val)} placeholder="e.g. Pollution board NOC..." />
                    <FormField label="Feature #3 Title" value={formData?.hero?.heroCard?.feature3Title} onChange={(val) => updateField('hero.heroCard.feature3Title', val)} placeholder="e.g. Arterial Freight Proximity" />
                    <FormField label="Feature #3 Description" value={formData?.hero?.heroCard?.feature3Desc} onChange={(val) => updateField('hero.heroCard.feature3Desc', val)} placeholder="e.g. Plots located with..." />
                    <FormField label="Card Stat Label" value={formData?.hero?.heroCard?.statLabel} onChange={(val) => updateField('hero.heroCard.statLabel', val)} placeholder="e.g. Industrial Land Transacted" />
                    <FormField label="Card Stat Value" value={formData?.hero?.heroCard?.statValue} onChange={(val) => updateField('hero.heroCard.statValue', val)} placeholder="e.g. 100+ Acres in NCR" />
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'metrics' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Logistics &amp; Warehousing Metrics</h3>
                {(formData?.metrics || []).map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label={`Metric #${idx + 1} Label`} value={m.label} onChange={(val) => updateField(`metrics.${idx}.label`, val)} />
                    <FormField label="Value" value={m.value} onChange={(val) => updateField(`metrics.${idx}.value`, val)} />
                    <FormField label="Description" value={m.desc} onChange={(val) => updateField(`metrics.${idx}.desc`, val)} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'assetClasses' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Industrial &amp; Logistics Asset Classes</h3>
                {(formData?.assetClasses || []).map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Asset Class #{idx + 1}: {item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Title" value={item.title} onChange={(val) => updateField(`assetClasses.${idx}.title`, val)} />
                      <FormField label="Locations" value={item.locations} onChange={(val) => updateField(`assetClasses.${idx}.locations`, val)} />
                      <FormField label="Specs" value={item.specs} onChange={(val) => updateField(`assetClasses.${idx}.specs`, val)} />
                      <FormField label="Pricing / Lease Rate" value={item.price || item.pricing} onChange={(val) => { updateField(`assetClasses.${idx}.price`, val); updateField(`assetClasses.${idx}.pricing`, val); }} />
                    </div>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block mb-2">Technical &amp; Engineering Metrics</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(item.metrics || [{ label: '', val: '' }, { label: '', val: '' }, { label: '', val: '' }, { label: '', val: '' }]).slice(0, 4).map((m, mIdx) => (
                          <div key={mIdx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                            <FormField label={`Metric #${mIdx + 1} Label`} value={m.label} onChange={(val) => updateField(`assetClasses.${idx}.metrics.${mIdx}.label`, val)} placeholder="e.g. Clear Height" />
                            <FormField label="Value" value={m.val || m.value} onChange={(val) => { updateField(`assetClasses.${idx}.metrics.${mIdx}.val`, val); updateField(`assetClasses.${idx}.metrics.${mIdx}.value`, val); }} placeholder="e.g. 10.5m to 12.5m" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <ListField
                      label="Key Warehouse &amp; Industrial Features"
                      items={item.features}
                      onChange={(val) => updateField(`assetClasses.${idx}.features`, val)}
                      placeholder="FM2 laser-screeded flooring with heavy racking capacity&#10;Automated hydraulic dock levelers"
                    />

                    <ImageUploadInput
                      label={`Asset Class #${idx + 1} Image`}
                      value={item.image}
                      onChange={(val) => updateField(`assetClasses.${idx}.image`, val)}
                      folder="/saudagar-properties/services"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'corridors' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Prime NCR Logistics &amp; Industrial Corridors</h3>
                {(formData?.corridors || []).map((corridor, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Corridor #{idx + 1}: {corridor.corridor || corridor.hub}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Corridor / Hub Name" value={corridor.corridor || corridor.hub} onChange={(val) => { updateField(`corridors.${idx}.corridor`, val); updateField(`corridors.${idx}.hub`, val); }} />
                      <FormField label="Zoning / Category" value={corridor.zoning || corridor.category} onChange={(val) => { updateField(`corridors.${idx}.zoning`, val); updateField(`corridors.${idx}.category`, val); }} />
                      <FormField label="Lease Pricing Range" value={corridor.pricing} onChange={(val) => updateField(`corridors.${idx}.pricing`, val)} />
                      <FormField label="Freight / Connectivity" value={corridor.connectivity || corridor.freightAccess} onChange={(val) => { updateField(`corridors.${idx}.connectivity`, val); updateField(`corridors.${idx}.freightAccess`, val); }} />
                      <FormField label="Power Infrastructure" value={corridor.powerAvailability} onChange={(val) => updateField(`corridors.${idx}.powerAvailability`, val)} placeholder="e.g. Dual 66kV / 33kV Dedicated Substations" />
                      <div>
                        <FormField label="Ideal Industry / Occupiers" value={corridor.idealFor} onChange={(val) => updateField(`corridors.${idx}.idealFor`, val)} />
                      </div>
                    </div>
                    <ListField
                      label="Corridor Key Highlights"
                      items={corridor.highlights}
                      onChange={(val) => updateField(`corridors.${idx}.highlights`, val)}
                      placeholder="Adjacent to DLF Cybercity with zero transit delay&#10;Immediate availability of skilled technical workforce"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'complianceSteps' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">HSIIDC &amp; Industrial Compliance Protocol</h3>
                {(formData?.complianceSteps || []).map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Protocol Step #" value={step.step} onChange={(val) => updateField(`complianceSteps.${idx}.step`, val)} />
                      <div className="sm:col-span-2">
                        <FormField label="Compliance Step Title" value={step.title} onChange={(val) => updateField(`complianceSteps.${idx}.title`, val)} />
                      </div>
                    </div>
                    <TextAreaField label="Regulatory Clearance Details" value={step.desc} onChange={(val) => updateField(`complianceSteps.${idx}.desc`, val)} rows={2} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'engineeringStandards' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Grade-A Warehouse Engineering Standards</h3>
                {(formData?.engineeringStandards || []).map((std, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Engineering Standard Title" value={std.title} onChange={(val) => updateField(`engineeringStandards.${idx}.title`, val)} />
                      <FormField label="Technical Benchmark / Metrics" value={std.metrics} onChange={(val) => updateField(`engineeringStandards.${idx}.metrics`, val)} />
                    </div>
                    <TextAreaField label="Engineering Specification Details" value={std.desc} onChange={(val) => updateField(`engineeringStandards.${idx}.desc`, val)} rows={2} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'cta' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Industrial Consultation Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.cta?.badge} onChange={(val) => updateField('cta.badge', val)} />
                  <FormField label="Phone" value={formData?.cta?.phone} onChange={(val) => updateField('cta.phone', val)} />
                  <FormField label="Title Prefix" value={formData?.cta?.titleMain} onChange={(val) => updateField('cta.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.cta?.titleItalic} onChange={(val) => updateField('cta.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.cta?.subtitle} onChange={(val) => updateField('cta.subtitle', val)} />
                <FormField label="WhatsApp URL" value={formData?.cta?.whatsappUrl} onChange={(val) => updateField('cta.whatsappUrl', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= OUR TEAM ======================= */}
        {pageParam === 'team' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Team Hero Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Title Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} />
                <ImageUploadInput
                  label="Hero Background Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/team"
                />

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">4 Key Trust Metrics (Hero Strip)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(formData?.hero?.stats || [
                      { value: "25+", label: "Years of Trust", highlight: false },
                      { value: "₹100 Cr+", label: "Saved for Clients", highlight: true },
                      { value: "1,000+", label: "Families Advised", highlight: false },
                      { value: "100%", label: "Title-Cleared", highlight: true }
                    ]).map((stat, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                        <FormField label={`Metric #${sIdx + 1} Value`} value={stat.value} onChange={(val) => updateField(`hero.stats.${sIdx}.value`, val)} placeholder="e.g. 25+" />
                        <FormField label="Label" value={stat.label} onChange={(val) => updateField(`hero.stats.${sIdx}.label`, val)} placeholder="e.g. Years of Trust" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'founders' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Founders &amp; Leadership Principals</h3>
                {(formData?.founders || []).map((f, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Leadership #{idx + 1}: {f.name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Full Name" value={f.name} onChange={(val) => updateField(`founders.${idx}.name`, val)} />
                      <FormField label="Role / Title" value={f.role} onChange={(val) => updateField(`founders.${idx}.role`, val)} />
                      <FormField label="Experience Badge" value={f.badge} onChange={(val) => updateField(`founders.${idx}.badge`, val)} />
                      <FormField label="Direct Hotline Phone" value={f.phone} onChange={(val) => updateField(`founders.${idx}.phone`, val)} />
                      <FormField label="WhatsApp Link" value={f.whatsappUrl} onChange={(val) => updateField(`founders.${idx}.whatsappUrl`, val)} placeholder="https://wa.me/919718511207" />
                    </div>
                    <TextAreaField label="Executive Biography" value={f.bio} onChange={(val) => updateField(`founders.${idx}.bio`, val)} rows={3} />
                    <FormField label="Personal Quote / Philosophy" value={f.quote} onChange={(val) => updateField(`founders.${idx}.quote`, val)} />
                    <ListField
                      label="Founder Portfolio Highlights"
                      items={f.highlights}
                      onChange={(val) => updateField(`founders.${idx}.highlights`, val)}
                      placeholder="Over two decades of premier real estate leadership&#10;Personal involvement in every client consultation"
                    />
                    <ImageUploadInput
                      label={`${f.name} Portrait Photo`}
                      value={f.image}
                      onChange={(val) => updateField(`founders.${idx}.image`, val)}
                      folder="/saudagar-properties/team"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'teamMembers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Senior Principals &amp; Transaction Specialists (Carousel)</h3>
                    <p className="text-[11px] text-slate-400">Add or manage corridor advisors. 3 appear on the front view with carousel sliding for additional members.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData?.teamMembers || [];
                      const newAdvisor = {
                        name: 'New Senior Advisor',
                        designation: 'Luxury Corridor Specialist',
                        focus: 'DLF Phase 1–5 & Golf Course Rd',
                        bio: 'Specializing in high-value builder floors, plot acquisitions, and private off-market mandates across prime DLF micro-markets.',
                        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
                      };
                      updateField('teamMembers', [...current, newAdvisor]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Senior Advisor</span>
                  </button>
                </div>
                {(formData?.teamMembers || []).map((member, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 relative group">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Advisor #{idx + 1}: {member.name}</h4>
                      {(formData?.teamMembers || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = (formData?.teamMembers || []).filter((_, i) => i !== idx);
                            updateField('teamMembers', next);
                          }}
                          className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Advisor"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="Full Name" value={member.name} onChange={(val) => updateField(`teamMembers.${idx}.name`, val)} />
                      <FormField label="Role / Designation" value={member.designation} onChange={(val) => updateField(`teamMembers.${idx}.designation`, val)} />
                      <FormField label="Focus Corridor" value={member.focus} onChange={(val) => updateField(`teamMembers.${idx}.focus`, val)} />
                    </div>
                    <TextAreaField label="Advisor Profile / Bio" value={member.bio} onChange={(val) => updateField(`teamMembers.${idx}.bio`, val)} rows={2} />
                    <ImageUploadInput
                      label={`${member.name} Portrait Photo`}
                      value={member.image}
                      onChange={(val) => updateField(`teamMembers.${idx}.image`, val)}
                      folder="/saudagar-properties/team"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'advisoryPillars' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">4 Core Fiduciary Advisory Pillars</h3>
                {(formData?.advisoryPillars || []).map((pillar, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Fiduciary Pillar #{idx + 1}: {pillar.title}</h4>
                    <FormField label="Pillar Title" value={pillar.title} onChange={(val) => updateField(`advisoryPillars.${idx}.title`, val)} />
                    <TextAreaField label="Fiduciary Commitment Description" value={pillar.desc} onChange={(val) => updateField(`advisoryPillars.${idx}.desc`, val)} rows={2} />
                  </div>
                ))}
              </div>
            )}

            {activeSectionTab === 'cta' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Private Founder Session CTA</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.cta?.badge} onChange={(val) => updateField('cta.badge', val)} />
                  <FormField label="Direct Hotline Phone" value={formData?.cta?.phone} onChange={(val) => updateField('cta.phone', val)} />
                  <FormField label="Title Main" value={formData?.cta?.titleMain} onChange={(val) => updateField('cta.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.cta?.titleItalic} onChange={(val) => updateField('cta.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.cta?.subtitle} onChange={(val) => updateField('cta.subtitle', val)} />
                <FormField label="WhatsApp URL" value={formData?.cta?.whatsappUrl} onChange={(val) => updateField('cta.whatsappUrl', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= PROPERTIES PAGE ======================= */}
        {pageParam === 'properties' && (
          <>
            {activeSectionTab === 'masthead' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Masthead &amp; Hero Content</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.masthead?.badge} onChange={(val) => updateField('masthead.badge', val)} />
                  <FormField label="Heading Main" value={formData?.masthead?.titleMain} onChange={(val) => updateField('masthead.titleMain', val)} />
                  <FormField label="Heading Italic / Highlight" value={formData?.masthead?.titleItalic} onChange={(val) => updateField('masthead.titleItalic', val)} />
                  <FormField label="Live Registry Badge Text" value={formData?.masthead?.liveBadge} onChange={(val) => updateField('masthead.liveBadge', val)} />
                </div>
                <TextAreaField label="Hero Subtitle / Description" value={formData?.masthead?.description} onChange={(val) => updateField('masthead.description', val)} />
                <ImageUploadInput
                  label="Properties Hero Background Image"
                  value={formData?.masthead?.bgImage}
                  onChange={(val) => updateField('masthead.bgImage', val)}
                  folder="/saudagar-properties/cms"
                />
              </div>
            )}

            {activeSectionTab === 'filters' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Filter Bar Customization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Search Bar Placeholder" value={formData?.filters?.searchPlaceholder} onChange={(val) => updateField('filters.searchPlaceholder', val)} />
                  <FormField label="Reset Filters Button Label" value={formData?.filters?.resetButtonText} onChange={(val) => updateField('filters.resetButtonText', val)} />
                </div>
              </div>
            )}

            {activeSectionTab === 'emptyState' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Empty Search Results State</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Empty Title" value={formData?.emptyState?.title} onChange={(val) => updateField('emptyState.title', val)} />
                  <FormField label="Reset Button Text" value={formData?.emptyState?.buttonText} onChange={(val) => updateField('emptyState.buttonText', val)} />
                </div>
                <TextAreaField label="Empty Description" value={formData?.emptyState?.description} onChange={(val) => updateField('emptyState.description', val)} />
              </div>
            )}

            {activeSectionTab === 'advisory' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Bottom Off-Market Advisory Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.advisory?.badge} onChange={(val) => updateField('advisory.badge', val)} />
                  <FormField label="Telephone Number" value={formData?.advisory?.phone} onChange={(val) => updateField('advisory.phone', val)} />
                  <FormField label="WhatsApp Number (digits only)" value={formData?.advisory?.whatsappNumber} onChange={(val) => updateField('advisory.whatsappNumber', val)} />
                  <FormField label="Headline Main" value={formData?.advisory?.titleMain} onChange={(val) => updateField('advisory.titleMain', val)} />
                </div>
                <TextAreaField label="Description" value={formData?.advisory?.description} onChange={(val) => updateField('advisory.description', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= ABOUT PAGE ======================= */}
        {pageParam === 'about' && (
          <>
            {/* 1. HERO & METRIC STRIP */}
            {activeSectionTab === 'hero' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Hero Masthead &amp; Key Highlights</h3>
                  <p className="text-xs text-slate-400">Manage the hero headline, subtitle, action buttons, and bottom 4 metric strip stats</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} placeholder="About Saudagar Properties • 25+ Years Legacy" />
                  <FormField label="Title Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} placeholder="25+ Years of Leadership in " />
                  <FormField label="Title Highlight (Gold Italic)" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} placeholder="DLF Gurugram" />
                </div>

                <TextAreaField label="Hero Subtitle / Description" value={formData?.hero?.description} onChange={(val) => updateField('hero.description', val)} rows={3} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Headquarters Micro-Badge" value={formData?.hero?.addressBadge} onChange={(val) => updateField('hero.addressBadge', val)} placeholder="Headquartered at 38, Akashneem Marg, DLF Phase 2, Gurugram" />
                  <FormField label="Video Button Label" value={formData?.hero?.watchFilmText} onChange={(val) => updateField('hero.watchFilmText', val)} placeholder="Watch Corporate Film" />
                  <FormField label="Proposition Button Label" value={formData?.hero?.propositionBtnText} onChange={(val) => updateField('hero.propositionBtnText', val)} placeholder="Our Proposition" />
                </div>

                <ImageUploadInput
                  label="Hero Background Parallax Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/cms"
                />

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Bottom 4 Metric Strip Counters</h4>
                    <p className="text-xs text-slate-400">Counters displayed in the floating glass strip at the bottom of the hero</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData?.hero?.stats || [
                      { value: 25, suffix: "+", label: "Years Experience", subtext: "DLF Phase 1–5 Pioneers" },
                      { prefix: "₹", value: 500, suffix: "Cr+", label: "Transaction Volume", subtext: "Delivered Seamlessly" },
                      { value: 100, suffix: "%", label: "Direct & Transparent", subtext: "Zero Middlemen Fees" },
                      { value: 5000, suffix: "+", formatComma: true, label: "HNI Families & Corporates", subtext: "Enduring Relationships" }
                    ]).map((stat, sIdx) => (
                      <div key={sIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Counter #{sIdx + 1}</span>
                        <div className="grid grid-cols-3 gap-2">
                          <FormField label="Prefix" value={stat.prefix || ''} onChange={(val) => updateField(`hero.stats.${sIdx}.prefix`, val)} placeholder="₹" />
                          <FormField label="Value" value={stat.value} onChange={(val) => updateField(`hero.stats.${sIdx}.value`, Number(val) || val)} placeholder="25" />
                          <FormField label="Suffix" value={stat.suffix || ''} onChange={(val) => updateField(`hero.stats.${sIdx}.suffix`, val)} placeholder="+" />
                        </div>
                        <FormField label="Metric Label" value={stat.label} onChange={(val) => updateField(`hero.stats.${sIdx}.label`, val)} />
                        <FormField label="Subtext / Details" value={stat.subtext} onChange={(val) => updateField(`hero.stats.${sIdx}.subtext`, val)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. VIDEO SHOWCASE */}
            {activeSectionTab === 'videoShowcase' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Video Showcase &amp; Legacy</h3>
                  <p className="text-xs text-slate-400">Configure the corporate cinema film player and legacy narrative</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.videoShowcase?.badge} onChange={(val) => updateField('videoShowcase.badge', val)} placeholder="Cinematic Film & Legacy" />
                  <FormField label="Title Main" value={formData?.videoShowcase?.titleMain} onChange={(val) => updateField('videoShowcase.titleMain', val)} placeholder="Inside Saudagar Properties: " />
                  <FormField label="Title Highlight" value={formData?.videoShowcase?.titleItalic} onChange={(val) => updateField('videoShowcase.titleItalic', val)} placeholder="Two Decades of Excellence" />
                </div>
                <ImageUploadInput
                  label="Video Showcase MP4 Film"
                  value={formData?.videoShowcase?.videoUrl}
                  onChange={(val) => updateField('videoShowcase.videoUrl', val)}
                  folder="/saudagar-properties/videos"
                  acceptVideo={true}
                  mediaType="video"
                  description="Upload full cinematic corporate film MP4 or paste video stream link"
                />
                <TextAreaField label="Subtitle" value={formData?.videoShowcase?.subtitle} onChange={(val) => updateField('videoShowcase.subtitle', val)} rows={3} />
              </div>
            )}

            {/* 3. PROPERTY CATEGORIES / OFFERINGS */}
            {activeSectionTab === 'offerings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Core Property Categories (3 Cards)</h3>
                  <p className="text-xs text-slate-400">Edit Kothis/Flats, Office Spaces, and Plots &amp; Strategic Land</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.offerings?.badge} onChange={(val) => updateField('offerings.badge', val)} placeholder="Prime Real Estate Portfolio" />
                  <FormField label="Title Main" value={formData?.offerings?.titleMain} onChange={(val) => updateField('offerings.titleMain', val)} placeholder="Our Core Property " />
                  <FormField label="Title Highlight" value={formData?.offerings?.titleItalic} onChange={(val) => updateField('offerings.titleItalic', val)} placeholder="Categories" />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.offerings?.subtitle} onChange={(val) => updateField('offerings.subtitle', val)} rows={2} />

                <div className="space-y-6 pt-2">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">3 Property Category Cards</h4>
                  {(formData?.offerings?.items || []).map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Card #{idx + 1}: {item.title}</h5>
                        <span className="text-[10px] text-slate-400">{item.tag}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Tag" value={item.tag} onChange={(val) => updateField(`offerings.items.${idx}.tag`, val)} />
                        <FormField label="Title" value={item.title} onChange={(val) => updateField(`offerings.items.${idx}.title`, val)} />
                        <FormField label="Button Label" value={item.ctaText} onChange={(val) => updateField(`offerings.items.${idx}.ctaText`, val)} />
                        <FormField label="Button Link" value={item.ctaLink} onChange={(val) => updateField(`offerings.items.${idx}.ctaLink`, val)} />
                      </div>
                      <TextAreaField label="Description" value={item.description} onChange={(val) => updateField(`offerings.items.${idx}.description`, val)} rows={2} />

                      {/* 4 Feature Checklist Items */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="block text-xs font-medium text-slate-300">4 Key Feature Checklist Items</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[0, 1, 2, 3].map((fIdx) => (
                            <FormField
                              key={fIdx}
                              label={`Feature #${fIdx + 1}`}
                              value={item?.features?.[fIdx] || ''}
                              onChange={(val) => updateField(`offerings.items.${idx}.features.${fIdx}`, val)}
                              placeholder={`Feature bullet ${fIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <ImageUploadInput
                        label={`Card #${idx + 1} Image`}
                        value={item.image}
                        onChange={(val) => updateField(`offerings.items.${idx}.image`, val)}
                        folder="/saudagar-properties/services"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. VALUE PROPOSITION */}
            {activeSectionTab === 'proposition' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Three Pillars of Value Proposition</h3>
                  <p className="text-xs text-slate-400">Edit the Residential, Commercial, and Industrial interactive accordion showcase</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.proposition?.badge} onChange={(val) => updateField('proposition.badge', val)} placeholder="Our Proposition" />
                  <FormField label="Title Main" value={formData?.proposition?.titleMain} onChange={(val) => updateField('proposition.titleMain', val)} placeholder="Where Our " />
                  <FormField label="Title Highlight" value={formData?.proposition?.titleItalic} onChange={(val) => updateField('proposition.titleItalic', val)} placeholder="Expertise Lies" />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.proposition?.subtitle} onChange={(val) => updateField('proposition.subtitle', val)} rows={2} />

                <div className="space-y-6 pt-2">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">3 Pillars (Residential, Commercial, Industrial)</h4>
                  {(formData?.proposition?.pillars || []).map((pillar, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Pillar #{pillar.number || idx + 1}: {pillar.title}</h5>
                        <span className="text-[10px] text-slate-400">{pillar.tag}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Number" value={pillar.number} onChange={(val) => updateField(`proposition.pillars.${idx}.number`, val)} />
                        <FormField label="Tag" value={pillar.tag} onChange={(val) => updateField(`proposition.pillars.${idx}.tag`, val)} />
                        <FormField label="Pillar Title" value={pillar.title} onChange={(val) => updateField(`proposition.pillars.${idx}.title`, val)} />
                        <FormField label="Headline" value={pillar.headline} onChange={(val) => updateField(`proposition.pillars.${idx}.headline`, val)} />
                      </div>
                      <TextAreaField label="Advisory Philosophy / Quote" value={pillar.quote} onChange={(val) => updateField(`proposition.pillars.${idx}.quote`, val)} rows={2} />

                      {/* 4 Key Points / Pills */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="block text-xs font-medium text-slate-300">4 Key Focus Points (Pills)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          {[0, 1, 2, 3].map((kIdx) => (
                            <FormField
                              key={kIdx}
                              label={`Point #${kIdx + 1}`}
                              value={pillar?.keyPoints?.[kIdx] || ''}
                              onChange={(val) => updateField(`proposition.pillars.${idx}.keyPoints.${kIdx}`, val)}
                              placeholder={`Focus point ${kIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="CTA Text" value={pillar.ctaText} onChange={(val) => updateField(`proposition.pillars.${idx}.ctaText`, val)} />
                        <FormField label="CTA Link" value={pillar.ctaLink} onChange={(val) => updateField(`proposition.pillars.${idx}.ctaLink`, val)} />
                      </div>
                      <ImageUploadInput
                        label={`Pillar #${idx + 1} Background Image`}
                        value={pillar.bgImage}
                        onChange={(val) => updateField(`proposition.pillars.${idx}.bgImage`, val)}
                        folder="/saudagar-properties/services"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. FOUNDERS & LEADERSHIP */}
            {activeSectionTab === 'leadership' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Leadership &amp; Advisory Team</h3>
                  <p className="text-xs text-slate-400">Manage founders Mr. Arun Sharma &amp; Mrs. Suneeta Chawla, core team, and impact metrics</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.leadership?.badge} onChange={(val) => updateField('leadership.badge', val)} placeholder="Team of Experts" />
                  <FormField label="Title Main" value={formData?.leadership?.titleMain} onChange={(val) => updateField('leadership.titleMain', val)} placeholder="Visionary " />
                  <FormField label="Title Highlight" value={formData?.leadership?.titleItalic} onChange={(val) => updateField('leadership.titleItalic', val)} placeholder="Founders & Leadership" />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.leadership?.subtitle} onChange={(val) => updateField('leadership.subtitle', val)} rows={2} />

                {/* Visionary Founders */}
                <div className="space-y-6 pt-2">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Visionary Founders</h4>
                  {(formData?.leadership?.founders || []).map((f, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Founder #{idx + 1}: {f.name}</h5>
                        <span className="text-[10px] text-slate-400">{f.role}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Full Name" value={f.name} onChange={(val) => updateField(`leadership.founders.${idx}.name`, val)} />
                        <FormField label="Role / Title" value={f.role} onChange={(val) => updateField(`leadership.founders.${idx}.role`, val)} />
                        <FormField label="Badge" value={f.badge} onChange={(val) => updateField(`leadership.founders.${idx}.badge`, val)} />
                        <FormField label="Experience Chip" value={f.experienceBadge} onChange={(val) => updateField(`leadership.founders.${idx}.experienceBadge`, val)} />
                      </div>
                      <FormField label="Leadership Quote" value={f.quote} onChange={(val) => updateField(`leadership.founders.${idx}.quote`, val)} />
                      <TextAreaField label="Executive Biography" value={f.bio} onChange={(val) => updateField(`leadership.founders.${idx}.bio`, val)} rows={3} />

                      {/* 4 Founder Highlights */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="block text-xs font-medium text-slate-300">4 Key Career Highlights &amp; Strengths</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[0, 1, 2, 3].map((hIdx) => (
                            <FormField
                              key={hIdx}
                              label={`Highlight #${hIdx + 1}`}
                              value={f?.highlights?.[hIdx] || ''}
                              onChange={(val) => updateField(`leadership.founders.${idx}.highlights.${hIdx}`, val)}
                              placeholder={`Career milestone ${hIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <ImageUploadInput
                        label={`${f.name} Portrait Photo`}
                        value={f.image}
                        onChange={(val) => updateField(`leadership.founders.${idx}.image`, val)}
                        folder="/saudagar-properties/team"
                      />
                    </div>
                  ))}
                </div>

                {/* Senior Team Specialists */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Senior Team Specialists (Core Advisory &amp; Operations Carousel)</h4>
                      <p className="text-[11px] text-slate-400">Add or manage team members. 3 appear in the front view, and remaining members cycle in the carousel.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = formData?.leadership?.teamMembers || [];
                        const newMember = {
                          name: 'New Advisory Member',
                          designation: 'Senior Transaction Specialist',
                          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
                        };
                        updateField('leadership.teamMembers', [...current, newMember]);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Team Member</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(formData?.leadership?.teamMembers || []).map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative group">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">Member #{idx + 1}</span>
                          {(formData?.leadership?.teamMembers || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = (formData?.leadership?.teamMembers || []).filter((_, i) => i !== idx);
                                updateField('leadership.teamMembers', next);
                              }}
                              className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <FormField label="Name" value={m.name} onChange={(val) => updateField(`leadership.teamMembers.${idx}.name`, val)} />
                        <FormField label="Designation" value={m.designation} onChange={(val) => updateField(`leadership.teamMembers.${idx}.designation`, val)} />
                        <ImageUploadInput
                          label={`${m.name || 'Member'} Photo`}
                          value={m.image}
                          onChange={(val) => updateField(`leadership.teamMembers.${idx}.image`, val)}
                          folder="/saudagar-properties/team"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Impact Stats */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">3 Milestone Impact Counters</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(formData?.leadership?.impactStats || [
                      { value: 100, suffix: "+", label: "CR Saves In Property Investment", desc: "Optimized value and negotiations" },
                      { value: 1000, suffix: "+", label: "Happy Clients", desc: "Families & corporate executives" },
                      { value: 25, suffix: "+", label: "Years of Trust and Experience", desc: "DLF Gurugram market authority" }
                    ]).map((stat, stIdx) => (
                      <div key={stIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Metric #{stIdx + 1}</span>
                        <div className="grid grid-cols-2 gap-2">
                          <FormField label="Value" value={stat.value} onChange={(val) => updateField(`leadership.impactStats.${stIdx}.value`, Number(val) || val)} />
                          <FormField label="Suffix" value={stat.suffix} onChange={(val) => updateField(`leadership.impactStats.${stIdx}.suffix`, val)} />
                        </div>
                        <FormField label="Label" value={stat.label} onChange={(val) => updateField(`leadership.impactStats.${stIdx}.label`, val)} />
                        <FormField label="Description" value={stat.desc} onChange={(val) => updateField(`leadership.impactStats.${stIdx}.desc`, val)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. WHY CHOOSE US (7 PILLARS & MATRIX) */}
            {activeSectionTab === 'whyChooseUs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Why Choose Us (7 Distinction Pillars &amp; Comparison Matrix)</h3>
                  <p className="text-xs text-slate-400">Manage the 7 strategic pillars and the transparency comparison matrix</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.whyChooseUs?.badge} onChange={(val) => updateField('whyChooseUs.badge', val)} placeholder="Why Choose Saudagar Properties • Fiduciary Distinction" />
                  <FormField label="Title Main" value={formData?.whyChooseUs?.titleMain} onChange={(val) => updateField('whyChooseUs.titleMain', val)} placeholder="The Saudagar Distinction: 7 Strategic Pillars of Trust & " />
                  <FormField label="Title Highlight" value={formData?.whyChooseUs?.titleItalic} onChange={(val) => updateField('whyChooseUs.titleItalic', val)} placeholder="Market Leadership" />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.whyChooseUs?.subtitle} onChange={(val) => updateField('whyChooseUs.subtitle', val)} rows={2} />

                {/* 7 Strategic Pillars */}
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="border-b border-white/10 pb-4">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">7 Strategic Distinction Pillars</h4>
                    <p className="text-[11px] text-slate-400">Pillar #1 is displayed as the prominent lead hero card. Pillars #2–7 are featured in a dedicated 6-card grid below.</p>
                  </div>

                  {/* 6-Card Dedicated Section Header Settings */}
                  <div className="p-4 rounded-xl bg-brand-gold/5 border border-brand-gold/20 space-y-3">
                    <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider">6 Strategic Pillars Section Header (Pillars 2–7)</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="6-Pillars Badge"
                        value={formData?.whyChooseUs?.gridBadge}
                        onChange={(val) => updateField('whyChooseUs.gridBadge', val)}
                        placeholder="Core Strategic Advisory Pillars • Generational Authority"
                      />
                      <FormField
                        label="6-Pillars Section Heading"
                        value={formData?.whyChooseUs?.gridTitle}
                        onChange={(val) => updateField('whyChooseUs.gridTitle', val)}
                        placeholder="Strategic Pillars of Client Excellence & Asset Protection"
                      />
                    </div>
                    <TextAreaField
                      label="6-Pillars Introductory Paragraph"
                      value={formData?.whyChooseUs?.gridSubtitle}
                      onChange={(val) => updateField('whyChooseUs.gridSubtitle', val)}
                      placeholder="Beyond founder-level representation, Saudagar Properties adheres to six rigorous advisory disciplines..."
                      rows={2}
                    />
                  </div>

                  {(formData?.whyChooseUs?.pillars || []).map((pillar, pIdx) => (
                    <div key={pIdx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                          Pillar #{pillar.number || pIdx + 1} {pIdx === 0 ? '(Lead Hero Card - 21:9)' : '(Card Grid - 16:10)'}: {pillar.title}
                        </h5>
                        <span className="text-[10px] text-slate-400">{pillar.badge}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField label="Number" value={pillar.number} onChange={(val) => updateField(`whyChooseUs.pillars.${pIdx}.number`, val)} />
                        <FormField label="Badge" value={pillar.badge} onChange={(val) => updateField(`whyChooseUs.pillars.${pIdx}.badge`, val)} />
                        <FormField label="Title" value={pillar.title} onChange={(val) => updateField(`whyChooseUs.pillars.${pIdx}.title`, val)} />
                      </div>
                      <TextAreaField label="Description" value={pillar.description} onChange={(val) => updateField(`whyChooseUs.pillars.${pIdx}.description`, val)} rows={2} />

                      {/* Pillar Image */}
                      <ImageUploadInput
                        label={`Pillar #${pillar.number || pIdx + 1} Image`}
                        value={pillar.image || ''}
                        onChange={(val) => updateField(`whyChooseUs.pillars.${pIdx}.image`, val)}
                        folder="/saudagar-properties/about"
                        recommendedRatio={pIdx === 0 ? "21:9" : "16:10"}
                        cardContext={pIdx === 0 ? "Lead Hero Card Banner" : "Pillar Card Stage"}
                        description={`Upload or browse an image for Pillar ${pillar.number || pIdx + 1} (${pillar.badge || 'Strategic Pillar'})`}
                      />

                      {/* 3 Pillar Bullets */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="block text-xs font-medium text-slate-300">3 Bullet Points</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[0, 1, 2].map((bIdx) => (
                            <FormField
                              key={bIdx}
                              label={`Bullet #${bIdx + 1}`}
                              value={pillar?.bullets?.[bIdx] || ''}
                              onChange={(val) => updateField(`whyChooseUs.pillars.${pIdx}.bullets.${bIdx}`, val)}
                              placeholder={`Bullet ${bIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fiduciary Comparison Matrix */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Transparency Benchmark Comparison Matrix</h4>
                    <p className="text-xs text-slate-400">4 benchmark comparisons between traditional brokerage and Saudagar advisory</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData?.whyChooseUs?.comparisonMatrix || []).map((row, rIdx) => (
                      <div key={rIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Benchmark #{rIdx + 1}</span>
                        <FormField label="Feature Name" value={row.feature} onChange={(val) => updateField(`whyChooseUs.comparisonMatrix.${rIdx}.feature`, val)} placeholder="e.g. Deal Representation" />
                        <FormField label="Traditional Brokerage (Red ✕)" value={row.traditional} onChange={(val) => updateField(`whyChooseUs.comparisonMatrix.${rIdx}.traditional`, val)} placeholder="Volume brokers chasing quick turnover" />
                        <FormField label="Saudagar Advisory (Green ✓)" value={row.saudagar} onChange={(val) => updateField(`whyChooseUs.comparisonMatrix.${rIdx}.saudagar`, val)} placeholder="Founders personally attend every transaction" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. CONSULTATION BANNER */}
            {activeSectionTab === 'consultationCta' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Consultation CTA Banner</h3>
                  <p className="text-xs text-slate-400">Manage the bottom executive consultation invitation chassis</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Title Main" value={formData?.consultationCta?.titleMain} onChange={(val) => updateField('consultationCta.titleMain', val)} placeholder="Request a Private " />
                  <FormField label="Title Highlight" value={formData?.consultationCta?.titleItalic} onChange={(val) => updateField('consultationCta.titleItalic', val)} placeholder="Executive Consultation" />
                  <FormField label="Direct Telephone Line" value={formData?.consultationCta?.phone} onChange={(val) => updateField('consultationCta.phone', val)} placeholder="+91 98112 21207" />
                  <FormField label="WhatsApp URL" value={formData?.consultationCta?.whatsappUrl} onChange={(val) => updateField('consultationCta.whatsappUrl', val)} placeholder="https://wa.me/919718511207..." />
                </div>
                <TextAreaField label="Subtitle" value={formData?.consultationCta?.subtitle} onChange={(val) => updateField('consultationCta.subtitle', val)} rows={3} />

                {/* 4 VIP Assurances */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <label className="block text-xs font-medium text-slate-300">4 VIP Advisory Assurances</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((aIdx) => (
                      <FormField
                        key={aIdx}
                        label={`Assurance #${aIdx + 1}`}
                        value={formData?.consultationCta?.assurances?.[aIdx] || ''}
                        onChange={(val) => updateField(`consultationCta.assurances.${aIdx}`, val)}
                        placeholder={`Assurance guarantee ${aIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================= CONTACT PAGE ======================= */}
        {pageParam === 'contact' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Contact Hero Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Title Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} />
                <ImageUploadInput
                  label="Hero Background Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/contact"
                />
              </div>
            )}

            {activeSectionTab === 'contactInfo' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Headquarters Address &amp; Phones</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Office Name" value={formData?.contactInfo?.officeName} onChange={(val) => updateField('contactInfo.officeName', val)} />
                  <FormField label="Office Address" value={formData?.contactInfo?.address} onChange={(val) => updateField('contactInfo.address', val)} />
                  <FormField label="Direct Line 1" value={formData?.contactInfo?.phone1} onChange={(val) => updateField('contactInfo.phone1', val)} />
                  <FormField label="Direct Line 2" value={formData?.contactInfo?.phone2} onChange={(val) => updateField('contactInfo.phone2', val)} />
                  <FormField label="Email Desk" value={formData?.contactInfo?.email} onChange={(val) => updateField('contactInfo.email', val)} />
                  <FormField label="Office Hours" value={formData?.contactInfo?.hours} onChange={(val) => updateField('contactInfo.hours', val)} />
                </div>
              </div>
            )}

            {activeSectionTab === 'form' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Inquiry Form Copy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Form Title" value={formData?.form?.title} onChange={(val) => updateField('form.title', val)} />
                  <FormField label="Submit Button Text" value={formData?.form?.buttonText} onChange={(val) => updateField('form.buttonText', val)} />
                  <FormField label="WhatsApp CTA Button Text" value={formData?.form?.whatsappCtaText} onChange={(val) => updateField('form.whatsappCtaText', val)} />
                  <FormField label="WhatsApp Direct Number (digits only)" value={formData?.form?.whatsappNumber} onChange={(val) => updateField('form.whatsappNumber', val)} placeholder="e.g. 919718511207" />
                </div>
                <TextAreaField label="Form Subtitle" value={formData?.form?.subtitle} onChange={(val) => updateField('form.subtitle', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= BLOG PAGE ======================= */}
        {pageParam === 'blog' && (
          <>
            {activeSectionTab === 'masthead' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Blog Archive Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.masthead?.badge} onChange={(val) => updateField('masthead.badge', val)} />
                  <FormField label="Title Prefix" value={formData?.masthead?.titleMain} onChange={(val) => updateField('masthead.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.masthead?.titleItalic} onChange={(val) => updateField('masthead.titleItalic', val)} />
                </div>
                <TextAreaField label="Description" value={formData?.masthead?.description} onChange={(val) => updateField('masthead.description', val)} />
                <ImageUploadInput
                  label="Masthead Background Image"
                  value={formData?.masthead?.bgImage}
                  onChange={(val) => updateField('masthead.bgImage', val)}
                  folder="/saudagar-properties/blog"
                />
              </div>
            )}

            {activeSectionTab === 'marketPulse' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Market Pulse 4-Point Indicator Bar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(formData?.marketPulse || []).map((card, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                      <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Indicator #{idx + 1}</h4>
                      <FormField label="Label" value={card.label} onChange={(val) => updateField(`marketPulse.${idx}.label`, val)} />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField label="Value" value={card.value} onChange={(val) => updateField(`marketPulse.${idx}.value`, val)} />
                        <FormField label="Unit" value={card.unit} onChange={(val) => updateField(`marketPulse.${idx}.unit`, val)} />
                      </div>
                      <FormField label="Subtext" value={card.subtext} onChange={(val) => updateField(`marketPulse.${idx}.subtext`, val)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectionTab === 'spotlight' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Editorial Spotlight &amp; Cover Dossier</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.spotlight?.badge} onChange={(val) => updateField('spotlight.badge', val)} />
                  <FormField label="Title Main" value={formData?.spotlight?.titleMain} onChange={(val) => updateField('spotlight.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.spotlight?.titleItalic} onChange={(val) => updateField('spotlight.titleItalic', val)} />
                </div>
                <TextAreaField label="Description" value={formData?.spotlight?.description} onChange={(val) => updateField('spotlight.description', val)} />
              </div>
            )}

            {activeSectionTab === 'corridors' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Location-Based Corridor Spotlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.corridors?.badge} onChange={(val) => updateField('corridors.badge', val)} />
                  <FormField label="Title Main" value={formData?.corridors?.titleMain} onChange={(val) => updateField('corridors.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.corridors?.titleItalic} onChange={(val) => updateField('corridors.titleItalic', val)} />
                </div>
                <TextAreaField label="Description" value={formData?.corridors?.description} onChange={(val) => updateField('corridors.description', val)} />
              </div>
            )}

            {activeSectionTab === 'researchLibrary' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Research Library &amp; Complete Archives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.researchLibrary?.badge} onChange={(val) => updateField('researchLibrary.badge', val)} />
                  <FormField label="Title Main" value={formData?.researchLibrary?.titleMain} onChange={(val) => updateField('researchLibrary.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.researchLibrary?.titleItalic} onChange={(val) => updateField('researchLibrary.titleItalic', val)} />
                </div>
                <TextAreaField label="Description" value={formData?.researchLibrary?.description} onChange={(val) => updateField('researchLibrary.description', val)} />
                <FormField label="Search Box Placeholder" value={formData?.researchLibrary?.searchPlaceholder} onChange={(val) => updateField('researchLibrary.searchPlaceholder', val)} />
              </div>
            )}

            {activeSectionTab === 'newsletter' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Advisory Newsletter Subscription</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.newsletter?.badge} onChange={(val) => updateField('newsletter.badge', val)} />
                  <FormField label="WhatsApp Hotline" value={formData?.newsletter?.whatsappNumber} onChange={(val) => updateField('newsletter.whatsappNumber', val)} />
                  <FormField label="Title Main" value={formData?.newsletter?.titleMain} onChange={(val) => updateField('newsletter.titleMain', val)} />
                  <FormField label="Button Text" value={formData?.newsletter?.buttonText} onChange={(val) => updateField('newsletter.buttonText', val)} />
                </div>
                <TextAreaField label="Description" value={formData?.newsletter?.description} onChange={(val) => updateField('newsletter.description', val)} />
              </div>
            )}
          </>
        )}

        {/* ======================= MICRO-MARKET CORRIDORS ======================= */}
        {pageParam === 'corridors' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">
                    Corridor Hero Masthead &amp; Key Highlights
                  </h3>
                  <span className="text-xs text-brand-gold font-mono">
                    Editing: {CORRIDOR_LIST.find(c => c.slug === selectedCorridor)?.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Starting Price Tag" value={formData?.hero?.priceStarting} onChange={(val) => updateField('hero.priceStarting', val)} />
                  <FormField label="Heading Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Heading Highlight" value={formData?.hero?.titleHighlight} onChange={(val) => updateField('hero.titleHighlight', val)} />
                  <FormField label="Direct Hotline Phone" value={formData?.hero?.directPhone} onChange={(val) => updateField('hero.directPhone', val)} />
                  <FormField label="WhatsApp Digits" value={formData?.hero?.whatsappNumber} onChange={(val) => updateField('hero.whatsappNumber', val)} />
                </div>
                <TextAreaField label="Corridor Overview Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} rows={3} />
                <ImageUploadInput
                  label="Corridor Hero Main Background Banner Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/corridors"
                  recommendedRatio="21:9"
                  cardContext="Hero Backdrop Banner"
                  description="Wide panoramic architectural banner displayed in the masthead header"
                />

                <div className="pt-2">
                  <ListField
                    label="Micro-Market Feature Highlight Chips (Under Subtitle)"
                    description="Enter each key highlight chip displayed beneath the hero subtitle."
                    items={formData?.hero?.keyHighlights || []}
                    onChange={(val) => updateField('hero.keyHighlights', val)}
                    placeholder="100% Freehold Conveyance&#10;250 to 1,000 Sq. Yds Footprints&#10;Direct Access to Golf Course Rd"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <ListField
                    label="Trust Credentials Strip (Under Action Buttons)"
                    description="Three institutional trust badges displayed below the Call and WhatsApp buttons."
                    items={formData?.hero?.trustBadges || [
                      '25+ Years Authority',
                      '100% Freehold Title Vetted',
                      'Direct Seller Mandates'
                    ]}
                    onChange={(val) => updateField('hero.trustBadges', val)}
                    rows={3}
                  />
                  <FormField
                    label="Micro-Market Intelligence Strip Tagline"
                    description="Header text for the bottom intelligence bar."
                    value={formData?.hero?.intelligenceTagline}
                    onChange={(val) => updateField('hero.intelligenceTagline', val)}
                    placeholder="e.g. DLF Phase 1 Micro-Market Intelligence"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gallery Showcase Perspectives (Right Column Stage)</h4>
                      <p className="text-[11px] text-slate-400">Manage the high-resolution architectural gallery images &amp; tags.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = formData?.hero?.galleryImages || [];
                        updateField('hero.galleryImages', [...current, { url: '', title: 'Perspective View', tag: 'Luxury Estate' }]);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Perspective</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(formData?.hero?.galleryImages || []).map((img, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-gold">Perspective 0{idx + 1}</span>
                          {(formData?.hero?.galleryImages || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = (formData?.hero?.galleryImages || []).filter((_, i) => i !== idx);
                                updateField('hero.galleryImages', next);
                              }}
                              className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete Photo"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <ImageUploadInput
                          label={`Photo 0${idx + 1}`}
                          value={img.url}
                          onChange={(val) => updateField(`hero.galleryImages.${idx}.url`, val)}
                          folder="/saudagar-properties/corridors"
                          recommendedRatio="16:10"
                          cardContext="Perspective Stage Card"
                        />
                        <FormField label="Title / Caption" value={img.title} onChange={(val) => updateField(`hero.galleryImages.${idx}.title`, val)} />
                        <FormField label="Badge / Tag" value={img.tag} onChange={(val) => updateField(`hero.galleryImages.${idx}.tag`, val)} placeholder="e.g. Featured Estate" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'metrics' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">4 Real-Time Corridor Benchmarks</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData?.metrics || [];
                      updateField('metrics', [...current, { label: 'Metric', value: '100%', desc: 'Description' }]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Benchmark</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(formData?.metrics || []).map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Benchmark #{idx + 1}</h4>
                        {(formData?.metrics || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = (formData?.metrics || []).filter((_, i) => i !== idx);
                              updateField('metrics', next);
                            }}
                            className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Benchmark"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <FormField label="Label" value={m.label} onChange={(val) => updateField(`metrics.${idx}.label`, val)} />
                      <FormField label="Value" value={m.value} onChange={(val) => updateField(`metrics.${idx}.value`, val)} />
                      <FormField label="Description" value={m.desc} onChange={(val) => updateField(`metrics.${idx}.desc`, val)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectionTab === 'overview' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Locality Profile &amp; Distinct Character</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData?.overview?.paragraphs || [];
                      updateField('overview.paragraphs', [...current, 'New descriptive paragraph about this micro-market.']);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Paragraph</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Tag" value={formData?.overview?.tag} onChange={(val) => updateField('overview.tag', val)} />
                  <FormField label="Overview Title" value={formData?.overview?.title} onChange={(val) => updateField('overview.title', val)} />
                </div>
                
                {/* Locality Profile Architectural Image */}
                <ImageUploadInput
                  label="Locality Profile Architectural Showcase Image"
                  value={formData?.overview?.image}
                  onChange={(val) => updateField('overview.image', val)}
                  folder="/saudagar-properties/corridors"
                  recommendedRatio="16:10"
                  cardContext="Locality Profile Right Card"
                  description="High-resolution architectural image displayed beside the locality profile narrative"
                />
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-200">Editorial Paragraphs</label>
                  {(formData?.overview?.paragraphs || []).map((para, idx) => (
                    <div key={idx} className="relative group p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-gold">Paragraph #{idx + 1}</span>
                        {(formData?.overview?.paragraphs || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = (formData?.overview?.paragraphs || []).filter((_, i) => i !== idx);
                              updateField('overview.paragraphs', next);
                            }}
                            className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Paragraph"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <TextAreaField
                        label=""
                        value={para}
                        onChange={(val) => updateField(`overview.paragraphs.${idx}`, val)}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectionTab === 'typologies' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Core Asset Typologies (3 Cards)</h3>
                    <p className="text-[11px] text-slate-400">Builder Floor, Independent Kothi &amp; Freehold Plot investment cards displayed in the dark locality section.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData?.overview?.typologies || [];
                      updateField('overview.typologies', [
                        ...current,
                        {
                          title: 'Luxury Asset Typology',
                          specs: '4 BHK • 350 Sq. Yds • Private Lift',
                          price: '₹5.00 Cr Onwards',
                          highlights: ['Private lift and dedicated stilt parking', 'Immediate registry and mutation']
                        }
                      ]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Typology</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(formData?.overview?.typologies || []).map((t, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold">Typology #{idx + 1}</span>
                        {(formData?.overview?.typologies || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = (formData?.overview?.typologies || []).filter((_, i) => i !== idx);
                              updateField('overview.typologies', next);
                            }}
                            className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Typology"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <FormField label="Typology Title" value={t.title} onChange={(val) => updateField(`overview.typologies.${idx}.title`, val)} />
                      <FormField label="Specifications / Layout" value={t.specs} onChange={(val) => updateField(`overview.typologies.${idx}.specs`, val)} placeholder="e.g. 4 BHK • 300 to 500 Sq. Yds • Private Lift" />
                      <FormField label="Price Benchmark" value={t.price} onChange={(val) => updateField(`overview.typologies.${idx}.price`, val)} placeholder="e.g. ₹4.50 Cr – ₹12.00 Cr" />
                      <ListField
                        label="Bullet Highlights"
                        items={t.highlights || []}
                        onChange={(val) => updateField(`overview.typologies.${idx}.highlights`, val)}
                        placeholder="Bullet feature 1&#10;Bullet feature 2"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectionTab === 'locationSection' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Strategic Urban Equilibrium &amp; Quick Callout Box</h3>
                  <p className="text-[11px] text-slate-400">Customize Section 3 narrative, strategic key points, and the right-hand direct hotline card.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Left Narrative Column</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Eyebrow Tag" value={formData?.locationSection?.tag} onChange={(val) => updateField('locationSection.tag', val)} />
                    <FormField label="Section Title" value={formData?.locationSection?.title} onChange={(val) => updateField('locationSection.title', val)} />
                  </div>
                  <FormField label="Subtitle (Italic)" value={formData?.locationSection?.subtitle} onChange={(val) => updateField('locationSection.subtitle', val)} />
                  <TextAreaField
                    label="Editorial Description"
                    value={formData?.locationSection?.description}
                    onChange={(val) => updateField('locationSection.description', val)}
                    rows={4}
                  />
                  <ListField
                    label="Equilibrium Advantage Chips (Bottom row)"
                    items={formData?.locationSection?.highlights || [
                      'MG Road & Cyber City Access',
                      'Aravalli Green Canopy',
                      '100% Freehold Mutation'
                    ]}
                    onChange={(val) => updateField('locationSection.highlights', val)}
                    rows={3}
                  />
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">Right Column: Architectural Image Showcase</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      Replaces CTA Box
                    </span>
                  </div>
                  
                  <ImageUploadInput
                    label="Urban Balance Architectural Showcase Image"
                    value={formData?.locationSection?.image}
                    onChange={(val) => updateField('locationSection.image', val)}
                    folder="/saudagar-properties/corridors"
                    recommendedRatio="16:10"
                    cardContext="Section 3 Architectural Card"
                    description="High-resolution estate perspective image displayed on the right side of Section 3"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label="Floating Photo Badge" value={formData?.locationSection?.cardBadge} onChange={(val) => updateField('locationSection.cardBadge', val)} placeholder="Prime Location Estate" />
                    <FormField label="Caption Tag" value={formData?.locationSection?.cardTag} onChange={(val) => updateField('locationSection.cardTag', val)} placeholder="Direct Sector Mandate" />
                    <FormField label="Caption Headline" value={formData?.locationSection?.cardTitle} onChange={(val) => updateField('locationSection.cardTitle', val)} placeholder="Prime Micro-Market" />
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Fallback Advisory Hotlines</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Hotline Direct Phone" value={formData?.quickCallout?.phone} onChange={(val) => updateField('quickCallout.phone', val)} />
                      <FormField label="WhatsApp Action URL" value={formData?.quickCallout?.whatsappUrl} onChange={(val) => updateField('quickCallout.whatsappUrl', val)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'whyLiveHere' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Why You Should Consider Living in this Corridor</h3>
                    <p className="text-[11px] text-slate-400">Pinnacle of residential prestige and 8 strategic reasons.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData?.whyLiveHere?.pillars || [];
                      const nextNum = (current.length + 1).toString().padStart(2, '0');
                      updateField('whyLiveHere.pillars', [...current, { number: nextNum, title: 'Strategic Advantage', desc: 'Advantage description...' }]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Reason</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.whyLiveHere?.badge} onChange={(val) => updateField('whyLiveHere.badge', val)} />
                  <FormField label="Section Title" value={formData?.whyLiveHere?.title} onChange={(val) => updateField('whyLiveHere.title', val)} />
                </div>
                <TextAreaField label="Introductory Paragraph" value={formData?.whyLiveHere?.intro} onChange={(val) => updateField('whyLiveHere.intro', val)} rows={2} />
                
                <div className="space-y-3 pt-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Strategic Reasons &amp; Pillars</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(formData?.whyLiveHere?.pillars || []).map((p, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-gold">Pillar #{p.number || idx + 1}</span>
                          {(formData?.whyLiveHere?.pillars || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = (formData?.whyLiveHere?.pillars || []).filter((_, i) => i !== idx);
                                updateField('whyLiveHere.pillars', next);
                              }}
                              className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete Pillar"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-1">
                            <FormField label="No." value={p.number} onChange={(val) => updateField(`whyLiveHere.pillars.${idx}.number`, val)} />
                          </div>
                          <div className="col-span-3">
                            <FormField label="Title" value={p.title} onChange={(val) => updateField(`whyLiveHere.pillars.${idx}.title`, val)} />
                          </div>
                        </div>
                        <TextAreaField label="Description" value={p.desc} onChange={(val) => updateField(`whyLiveHere.pillars.${idx}.desc`, val)} rows={2} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'nearestPlaces' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Transit &amp; Commute Radar</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData?.nearestPlaces?.places || [];
                      updateField('nearestPlaces.places', [
                        ...current,
                        { name: 'New Landmark', category: 'Connectivity Hub', distance: '5 km', time: '8 Mins', desc: 'Direct transit access via highway.' }
                      ]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Landmark</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.nearestPlaces?.badge} onChange={(val) => updateField('nearestPlaces.badge', val)} />
                  <FormField label="Title" value={formData?.nearestPlaces?.title} onChange={(val) => updateField('nearestPlaces.title', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.nearestPlaces?.subtitle} onChange={(val) => updateField('nearestPlaces.subtitle', val)} rows={2} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {(formData?.nearestPlaces?.places || []).map((place, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold">Landmark #{idx + 1}</span>
                        {(formData?.nearestPlaces?.places || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = (formData?.nearestPlaces?.places || []).filter((_, i) => i !== idx);
                              updateField('nearestPlaces.places', next);
                            }}
                            className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Landmark"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <FormField label="Landmark Name" value={place.name} onChange={(val) => updateField(`nearestPlaces.places.${idx}.name`, val)} />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField label="Distance" value={place.distance} onChange={(val) => updateField(`nearestPlaces.places.${idx}.distance`, val)} />
                        <FormField label="Transit Time" value={place.time} onChange={(val) => updateField(`nearestPlaces.places.${idx}.time`, val)} />
                      </div>
                      <FormField label="Category" value={place.category} onChange={(val) => updateField(`nearestPlaces.places.${idx}.category`, val)} />
                      <ImageUploadInput
                        label="Landmark Photo"
                        description="High-resolution photo of this landmark or connectivity hub."
                        value={place.image}
                        onChange={(url) => updateField(`nearestPlaces.places.${idx}.image`, url)}
                      />
                      <TextAreaField label="Commute Details" value={place.desc} onChange={(val) => updateField(`nearestPlaces.places.${idx}.desc`, val)} rows={2} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectionTab === 'howWeHelp' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">How Can We Help You? (Turnkey Acquisition Platform)</h3>
                  <p className="text-[11px] text-slate-400">Customize client acquisition services, narrative, checklist, and advisory feature photo.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Badge" value={formData?.howWeHelp?.badge} onChange={(val) => updateField('howWeHelp.badge', val)} placeholder="Turnkey Acquisition Platform" />
                    <FormField label="Section Title" value={formData?.howWeHelp?.title} onChange={(val) => updateField('howWeHelp.title', val)} />
                  </div>

                  <ImageUploadInput
                    label="Turnkey Platform Advisory Photo"
                    description="Grand feature photo displayed beside the editorial narrative and services checklist."
                    value={formData?.howWeHelp?.image}
                    onChange={(url) => updateField('howWeHelp.image', url)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <FormField
                      label="Advisory Glassmorphism Card Title"
                      description="Badge headline overlaid on the advisory image."
                      value={formData?.howWeHelp?.cardBadgeTitle}
                      onChange={(val) => updateField('howWeHelp.cardBadgeTitle', val)}
                      placeholder="Turnkey Due Diligence"
                    />
                    <FormField
                      label="Advisory Glassmorphism Card Description"
                      description="Subtitle text overlaid on the advisory image."
                      value={formData?.howWeHelp?.cardBadgeDesc}
                      onChange={(val) => updateField('howWeHelp.cardBadgeDesc', val)}
                      placeholder="Title clearance, registry representation & architect consultation"
                    />
                  </div>

                  <ListField
                    label="Editorial Narrative Paragraphs"
                    description="Separate paragraphs by pressing Enter."
                    items={formData?.howWeHelp?.paragraphs || []}
                    onChange={(val) => updateField('howWeHelp.paragraphs', val)}
                    rows={4}
                  />

                  <ListField
                    label="Services Checklist (Bullet Items)"
                    description="Services verified for this corridor."
                    items={formData?.howWeHelp?.servicesChecklist || []}
                    onChange={(val) => updateField('howWeHelp.servicesChecklist', val)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeSectionTab === 'whyChooseSaudagar' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Why Choose Saudagar Properties</h3>
                  <p className="text-[11px] text-slate-400">Customize the 25+ years corridor authority section, image, founders signature desk, and institutional metric cards.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Badge" value={formData?.whyChooseSaudagar?.badge} onChange={(val) => updateField('whyChooseSaudagar.badge', val)} placeholder="25+ Years Experience" />
                    <FormField label="Section Title" value={formData?.whyChooseSaudagar?.title} onChange={(val) => updateField('whyChooseSaudagar.title', val)} />
                    <FormField label="Founder Name" value={formData?.whyChooseSaudagar?.founderName} onChange={(val) => updateField('whyChooseSaudagar.founderName', val)} placeholder="Arun Sharma & Suneeta Chawla" />
                    <FormField label="Founder Designation" value={formData?.whyChooseSaudagar?.founderTitle} onChange={(val) => updateField('whyChooseSaudagar.founderTitle', val)} placeholder="Founders, Saudagar Properties Pvt Ltd" />
                  </div>

                  <ImageUploadInput
                    label="Corridor Authority Feature Image"
                    description="Showcases premier corridor architecture with 25+ years badge overlay."
                    value={formData?.whyChooseSaudagar?.image}
                    onChange={(url) => updateField('whyChooseSaudagar.image', url)}
                  />

                  <TextAreaField
                    label="Authority Narrative Content"
                    value={formData?.whyChooseSaudagar?.content}
                    onChange={(val) => updateField('whyChooseSaudagar.content', val)}
                    rows={6}
                  />

                  {/* 3 Institutional Stat Pillars */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider">3 Institutional Stat Pillars</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <FormField label="Pillar 1 Value" value={formData?.whyChooseSaudagar?.stats?.[0]?.value || '25+ Yrs'} onChange={(val) => updateField('whyChooseSaudagar.stats.0.value', val)} />
                        <FormField label="Pillar 1 Label" value={formData?.whyChooseSaudagar?.stats?.[0]?.label || 'Micro-Market Authority'} onChange={(val) => updateField('whyChooseSaudagar.stats.0.label', val)} />
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <FormField label="Pillar 2 Value" value={formData?.whyChooseSaudagar?.stats?.[1]?.value || '100%'} onChange={(val) => updateField('whyChooseSaudagar.stats.1.value', val)} />
                        <FormField label="Pillar 2 Label" value={formData?.whyChooseSaudagar?.stats?.[1]?.label || 'Clean Freehold Titles'} onChange={(val) => updateField('whyChooseSaudagar.stats.1.label', val)} />
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                        <FormField label="Pillar 3 Value" value={formData?.whyChooseSaudagar?.stats?.[2]?.value || '₹500+ Cr'} onChange={(val) => updateField('whyChooseSaudagar.stats.2.value', val)} />
                        <FormField label="Pillar 3 Label" value={formData?.whyChooseSaudagar?.stats?.[2]?.label || 'Transactions Facilitated'} onChange={(val) => updateField('whyChooseSaudagar.stats.2.label', val)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'inventorySection' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Curated Verified Inventory Showcase</h3>
                  <p className="text-[11px] text-slate-400">
                    Customize the heading, eyebrow badge, and catalog link for properties matching this corridor.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Section Eyebrow Badge"
                      value={formData?.inventorySection?.badge}
                      onChange={(val) => updateField('inventorySection.badge', val)}
                      placeholder="Verified Real Estate"
                    />
                    <FormField
                      label="Section Title"
                      value={formData?.inventorySection?.title}
                      onChange={(val) => updateField('inventorySection.title', val)}
                      placeholder={`Available Properties in ${CORRIDOR_LIST.find(c => c.slug === selectedCorridor)?.name || 'Corridor'}`}
                    />
                  </div>
                  <FormField
                    label="View Full Catalog Button Text"
                    value={formData?.inventorySection?.linkText}
                    onChange={(val) => updateField('inventorySection.linkText', val)}
                    placeholder="View Full Catalog"
                  />
                  
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-200">
                      <p className="font-semibold mb-1">Dynamic Database Inventory Integration</p>
                      <p className="text-emerald-300/80 leading-relaxed text-[11px]">
                        Property cards displayed in this section are automatically pulled from the live properties database matching the location name (&ldquo;{CORRIDOR_LIST.find(c => c.slug === selectedCorridor)?.name}&rdquo;). To add or edit inventory items, use the <Link href="/admin/properties" className="underline font-bold text-white hover:text-brand-gold">Properties Manager</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'inquiryForm' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Direct Property Inquiry &amp; Consultation Form Copy</h3>
                  <p className="text-[11px] text-slate-400">
                    Customize the confidential advisory desk copy, heading, description, button label, and privacy notice.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Eyebrow Badge"
                      value={formData?.inquiryForm?.badge}
                      onChange={(val) => updateField('inquiryForm.badge', val)}
                      placeholder="Confidential Inquiry Desk"
                    />
                    <FormField
                      label="Section Headline"
                      value={formData?.inquiryForm?.title}
                      onChange={(val) => updateField('inquiryForm.title', val)}
                      placeholder={`Consult Directly for ${CORRIDOR_LIST.find(c => c.slug === selectedCorridor)?.name || 'Corridor'}`}
                    />
                  </div>

                  <TextAreaField
                    label="Editorial Guidance Description"
                    description="Explains response timeline and senior partner consultation."
                    value={formData?.inquiryForm?.description}
                    onChange={(val) => updateField('inquiryForm.description', val)}
                    rows={2}
                    placeholder="Fill out the form below. Arun Sharma or our senior partners will contact you within 2 business hours."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Confidentiality Assurance Note"
                      value={formData?.inquiryForm?.confidentialityNote}
                      onChange={(val) => updateField('inquiryForm.confidentialityNote', val)}
                      placeholder="Strict client confidentiality. Zero spam."
                    />
                    <FormField
                      label="Submit Button Text"
                      value={formData?.inquiryForm?.buttonText}
                      onChange={(val) => updateField('inquiryForm.buttonText', val)}
                      placeholder="Send Inquiry"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'mapShowcase' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Strategic Cartography &amp; Master Plan Maps</h3>
                  <p className="text-[11px] text-slate-400">
                    Configure both the live interactive Google Map embed and upload the high-resolution static layout / master plan image.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Section Badge"
                    value={formData?.mapShowcase?.badge}
                    onChange={(val) => updateField('mapShowcase.badge', val)}
                    placeholder="Strategic Cartography & Master Planning"
                  />
                  <FormField
                    label="Section Title"
                    value={formData?.mapShowcase?.title}
                    onChange={(val) => updateField('mapShowcase.title', val)}
                    placeholder="Strategic Location & Master Plan"
                  />
                </div>

                <TextAreaField
                  label="Section Description"
                  value={formData?.mapShowcase?.description}
                  onChange={(val) => updateField('mapShowcase.description', val)}
                  rows={2}
                  placeholder="Explore the geographic positioning alongside official sector master layout planning."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Map 1: Google Map Embed */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
                        Map 1: Live Interactive Google Map Embed
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Paste the Google Maps embed URL (the URL inside the src attribute of Google Maps &apos;Share &gt; Embed a map&apos; iframe).
                      </p>
                    </div>
                    <TextAreaField
                      label="Google Maps Embed URL (iframe src)"
                      value={formData?.mapShowcase?.googleMapEmbed}
                      onChange={(val) => updateField('mapShowcase.googleMapEmbed', val)}
                      rows={3}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    {formData?.mapShowcase?.googleMapEmbed && (
                      <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10 mt-2 bg-slate-900">
                        <iframe
                          src={formData.mapShowcase.googleMapEmbed}
                          title="Google Map Preview"
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {/* Map 2: Static Map Image */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
                        Map 2: High-Resolution Static Master Plan / Layout Blueprint
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Upload your static layout map or sector zoning blueprint. Visitors can click to inspect it in full high resolution.
                      </p>
                    </div>
                    <ImageUploadInput
                      label="Master Plan / Static Map Image"
                      description="Upload layout map via ImageKit or paste image URL."
                      value={formData?.mapShowcase?.staticMapImage}
                      onChange={(url) => updateField('mapShowcase.staticMapImage', url)}
                    />
                    {formData?.mapShowcase?.staticMapImage && (
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10 mt-2 bg-slate-950 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.mapShowcase.staticMapImage}
                          alt="Static Map Blueprint Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSectionTab === 'faqs' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Frequently Asked Questions &amp; Section Header</h3>
                    <p className="text-[11px] text-slate-400">Manage FAQ header copy, badge, and accordion questions &amp; answers.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newFaqs = [...(formData?.faqs || []), { question: 'New Question', answer: 'New Answer' }];
                      updateField('faqs', newFaqs);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Section Badge"
                      value={formData?.faqsInfo?.badge}
                      onChange={(val) => updateField('faqsInfo.badge', val)}
                      placeholder="Expert Guidance & Insights"
                    />
                    <FormField
                      label="Section Title"
                      value={formData?.faqsInfo?.title}
                      onChange={(val) => updateField('faqsInfo.title', val)}
                      placeholder="Frequently Asked Questions"
                    />
                  </div>
                  <TextAreaField
                    label="Section Subtitle"
                    value={formData?.faqsInfo?.subtitle}
                    onChange={(val) => updateField('faqsInfo.subtitle', val)}
                    rows={2}
                    placeholder={`Key questions answered regarding acquisitions, pricing benchmarks, and zoning in ${CORRIDOR_LIST.find(c => c.slug === selectedCorridor)?.name || 'this corridor'}.`}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Accordion Q&amp;A Items</h4>
                  {(formData?.faqs || []).map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold">FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = (formData?.faqs || []).filter((_, i) => i !== idx);
                            updateField('faqs', newFaqs);
                          }}
                          className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <FormField label="Question" value={faq.question} onChange={(val) => updateField(`faqs.${idx}.question`, val)} />
                      <TextAreaField label="Answer" value={faq.answer} onChange={(val) => updateField(`faqs.${idx}.answer`, val)} rows={3} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================= TERMS OF SERVICE ======================= */}
        {pageParam === 'terms' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Terms Page Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Page Title" value={formData?.hero?.title} onChange={(val) => updateField('hero.title', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} rows={2} />
              </div>
            )}

            {activeSectionTab === 'sections' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Terms Articles &amp; Clauses</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs = [...(formData?.sections || []), { heading: 'New Clause Heading', content: 'Clause content here...' }];
                      updateField('sections', newSecs);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Clause</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData?.sections || []).map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold">Clause #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSecs = (formData?.sections || []).filter((_, i) => i !== idx);
                            updateField('sections', newSecs);
                          }}
                          className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Clause"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <FormField label="Heading" value={sec.heading} onChange={(val) => updateField(`sections.${idx}.heading`, val)} />
                      <TextAreaField label="Content / Legal Text" value={sec.content} onChange={(val) => updateField(`sections.${idx}.content`, val)} rows={3} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================= PRIVACY POLICY ======================= */}
        {pageParam === 'privacy' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Privacy Page Masthead</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge Text" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Page Title" value={formData?.hero?.title} onChange={(val) => updateField('hero.title', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.hero?.subtitle} onChange={(val) => updateField('hero.subtitle', val)} rows={2} />
              </div>
            )}

            {activeSectionTab === 'sections' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-semibold text-white">Privacy Articles &amp; Safeguards</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs = [...(formData?.sections || []), { heading: 'New Privacy Safeguard', content: 'Safeguard details here...' }];
                      updateField('sections', newSecs);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Article</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData?.sections || []).map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold">Article #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSecs = (formData?.sections || []).filter((_, i) => i !== idx);
                            updateField('sections', newSecs);
                          }}
                          className="p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <FormField label="Heading" value={sec.heading} onChange={(val) => updateField(`sections.${idx}.heading`, val)} />
                      <TextAreaField label="Content / Safeguard Text" value={sec.content} onChange={(val) => updateField(`sections.${idx}.content`, val)} rows={3} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold hover:brightness-110 text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(208,154,22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
