"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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
  Plus,
  Trash2
} from 'lucide-react';
import { useCms, DEFAULT_SECTIONS } from '@/context/CmsContext';
import api from '@/services/api';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

const PAGE_CONFIGS = {
  properties: {
    pageKey: 'page_properties',
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
    title: 'Residential Services Page CMS',
    desc: 'Manage luxury builder floor typologies, DLF Phase 1–5 metrics, micro-markets, 7-point due diligence roadmap, and private consultation CTA.',
    icon: Building2,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'metrics', label: 'Key Performance Metrics' },
      { id: 'assetClasses', label: 'Asset Classes & Pricing' },
      { id: 'microMarkets', label: 'Micro-Markets' },
      { id: 'dueDiligenceSteps', label: '7-Point Due Diligence' },
      { id: 'cta', label: 'Consultation Banner' }
    ]
  },
  commercial: {
    pageKey: 'page_commercial',
    title: 'Commercial Services Page CMS',
    desc: 'Manage Cyber City & Udyog Vihar corporate suites, high-street retail, pre-leased yields, lease structuring framework, and leasing desk copy.',
    icon: Layers,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'metrics', label: 'Commercial Yield Metrics' },
      { id: 'assetClasses', label: 'Office & Retail Classes' },
      { id: 'yieldBenchmarks', label: 'Yield Benchmarks' },
      { id: 'leaseFramework', label: 'Lease Framework' },
      { id: 'cta', label: 'Corporate Advisory Banner' }
    ]
  },
  industrial: {
    pageKey: 'page_industrial',
    title: 'Industrial Services Page CMS',
    desc: 'Manage logistics parks, HSIIDC plots, warehousing specs, transport corridors, compliance steps, and BTS manufacturing land copy.',
    icon: LayoutList,
    sections: [
      { id: 'hero', label: 'Hero & Masthead' },
      { id: 'metrics', label: 'Logistics Metrics' },
      { id: 'assetClasses', label: 'Industrial & Land Classes' },
      { id: 'corridors', label: 'Industrial Corridors' },
      { id: 'complianceSteps', label: 'HSIIDC Compliance' },
      { id: 'cta', label: 'Industrial Advisory Banner' }
    ]
  },
  team: {
    pageKey: 'page_team',
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
    title: 'About Us Page CMS',
    desc: 'Customize company leadership narrative, legacy video tour, property categories, value proposition, why choose us distinction, and private advisory CTA.',
    icon: Users,
    sections: [
      { id: 'hero', label: 'Hero & Mission' },
      { id: 'videoShowcase', label: 'Video Showcase' },
      { id: 'offerings', label: 'Property Categories' },
      { id: 'proposition', label: 'Value Proposition' },
      { id: 'leadership', label: 'Founders & Leadership' },
      { id: 'whyChooseUs', label: 'Why Choose Us' },
      { id: 'consultationCta', label: 'Consultation Banner' }
    ]
  },
  contact: {
    pageKey: 'page_contact',
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
    title: 'Blog Page CMS',
    desc: 'Customize market intelligence headlines, corridor spotlights, research library, and newsletter text.',
    icon: BookOpen,
    sections: [
      { id: 'masthead', label: 'Hero Masthead' },
      { id: 'spotlight', label: 'Editorial Spotlight' },
      { id: 'researchLibrary', label: 'Research Library Archive' },
      { id: 'newsletter', label: 'Advisory Newsletter' }
    ]
  }
};

// Simple reusable input components
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
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#D09A16] text-white text-xs outline-none transition-colors"
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
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#D09A16] text-white text-xs outline-none transition-colors leading-relaxed"
      />
    </div>
  );
}

export default function AdminPageCMS({ params }) {
  const unwrappedParams = params ? (params.page ? params : use(params)) : useParams();
  const pageParam = unwrappedParams?.page || 'properties';
  const config = PAGE_CONFIGS[pageParam] || PAGE_CONFIGS.properties;

  const { sections, refetch, updateLocalSection } = useCms();
  const [activeSectionTab, setActiveSectionTab] = useState(config.sections[0]?.id || '');
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Sync state when page changes, initializing from context/defaults and fetching live from DB
  useEffect(() => {
    let isMounted = true;
    const pageDefault = DEFAULT_SECTIONS[config.pageKey] || {};
    const pageSaved = sections[config.pageKey] || {};
    const merged = { ...pageDefault, ...pageSaved };
    setFormData(merged);
    setActiveSectionTab(config.sections[0]?.id || '');
    setStatusMsg({ type: '', text: '' });

    api.getPage(config.pageKey)
      .then((res) => {
        if (isMounted && res?.success && res.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => {
        console.warn(`[Admin] Fresh fetch for page '${config.pageKey}':`, err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [config.pageKey]);

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
      const res = await api.updatePage(config.pageKey, formData, config.title);
      if (res && res.success) {
        setStatusMsg({ type: 'success', text: `Page content saved and updated live successfully!` });
        const savedData = res.data || formData;
        setFormData(savedData);
        if (updateLocalSection) {
          updateLocalSection(config.pageKey, savedData);
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
          ? 'Your admin login session has expired or is unauthorized. Please log in again to save changes.'
          : (err.message || 'Network error saving changes')
      });
    } finally {
      setSaving(false);
    }
  };

  const PageIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#D09A16]/10 border border-[#D09A16]/30 text-[#D09A16] text-[11px] font-bold uppercase tracking-wider mb-2">
            <PageIcon size={12} />
            <span>Page Content CMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {config.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {config.desc}
          </p>
        </div>

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

      {/* Section Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {config.sections.map((sec) => {
          const isActive = activeSectionTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSectionTab(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#D09A16] text-[#0C101A] shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status Alert */}
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

        {/* ======================= RESIDENTIAL SERVICES ======================= */}
        {pageParam === 'residential' && (
          <>
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Hero Banner & Masthead</h3>
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
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Residential Asset Classes & Typologies</h3>
                {(formData?.assetClasses || []).map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Asset Class #{idx + 1}: {item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Class Title" value={item.title} onChange={(val) => updateField(`assetClasses.${idx}.title`, val)} />
                      <FormField label="Locations" value={item.locations} onChange={(val) => updateField(`assetClasses.${idx}.locations`, val)} />
                      <FormField label="Specifications Summary" value={item.specs} onChange={(val) => updateField(`assetClasses.${idx}.specs`, val)} />
                      <FormField label="Price Bracket" value={item.price} onChange={(val) => updateField(`assetClasses.${idx}.price`, val)} />
                    </div>
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
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Micro-Market #{idx + 1}: {market.phase}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Corridor / Phase Name" value={market.phase} onChange={(val) => updateField(`microMarkets.${idx}.phase`, val)} />
                      <FormField label="Character Tag" value={market.character} onChange={(val) => updateField(`microMarkets.${idx}.character`, val)} />
                      <FormField label="Livability Score" value={market.livabilityScore} onChange={(val) => updateField(`microMarkets.${idx}.livabilityScore`, val)} />
                      <FormField label="Price Range / Valuation" value={market.priceRange} onChange={(val) => updateField(`microMarkets.${idx}.priceRange`, val)} />
                      <FormField label="Rental Yield" value={market.rentalYield} onChange={(val) => updateField(`microMarkets.${idx}.rentalYield`, val)} />
                    </div>
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
              </div>
            )}

            {activeSectionTab === 'metrics' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Commercial Yield & Performance Metrics</h3>
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
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Office & Retail Asset Classes</h3>
                {(formData?.assetClasses || []).map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Asset Class #{idx + 1}: {item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Title" value={item.title} onChange={(val) => updateField(`assetClasses.${idx}.title`, val)} />
                      <FormField label="Locations" value={item.locations} onChange={(val) => updateField(`assetClasses.${idx}.locations`, val)} />
                      <FormField label="Specs" value={item.specs} onChange={(val) => updateField(`assetClasses.${idx}.specs`, val)} />
                      <FormField label="Price / Rental Yield" value={item.price} onChange={(val) => updateField(`assetClasses.${idx}.price`, val)} />
                    </div>
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
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Commercial Hub #{idx + 1}: {market.hub}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Commercial Hub Name" value={market.hub} onChange={(val) => updateField(`yieldBenchmarks.${idx}.hub`, val)} />
                      <FormField label="Category / Asset Class" value={market.category} onChange={(val) => updateField(`yieldBenchmarks.${idx}.category`, val)} />
                      <FormField label="Yield Range (%)" value={market.yieldRange} onChange={(val) => updateField(`yieldBenchmarks.${idx}.yieldRange`, val)} />
                      <FormField label="Lease Rate / Valuation" value={market.capitalValuation} onChange={(val) => updateField(`yieldBenchmarks.${idx}.capitalValuation`, val)} />
                      <FormField label="Average Occupancy Rate" value={market.occupancyRate} onChange={(val) => updateField(`yieldBenchmarks.${idx}.occupancyRate`, val)} />
                    </div>
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
              </div>
            )}

            {activeSectionTab === 'metrics' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Logistics & Warehousing Metrics</h3>
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
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Industrial & Logistics Asset Classes</h3>
                {(formData?.assetClasses || []).map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Asset Class #{idx + 1}: {item.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Title" value={item.title} onChange={(val) => updateField(`assetClasses.${idx}.title`, val)} />
                      <FormField label="Locations" value={item.locations} onChange={(val) => updateField(`assetClasses.${idx}.locations`, val)} />
                      <FormField label="Specs" value={item.specs} onChange={(val) => updateField(`assetClasses.${idx}.specs`, val)} />
                      <FormField label="Pricing / Lease Rate" value={item.price} onChange={(val) => updateField(`assetClasses.${idx}.price`, val)} />
                    </div>
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
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Corridor #{idx + 1}: {corridor.corridor || corridor.hub}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Corridor / Hub Name" value={corridor.corridor || corridor.hub} onChange={(val) => { updateField(`corridors.${idx}.corridor`, val); updateField(`corridors.${idx}.hub`, val); }} />
                      <FormField label="Zoning / Category" value={corridor.zoning || corridor.category} onChange={(val) => { updateField(`corridors.${idx}.zoning`, val); updateField(`corridors.${idx}.category`, val); }} />
                      <FormField label="Lease Pricing Range" value={corridor.pricing} onChange={(val) => updateField(`corridors.${idx}.pricing`, val)} />
                      <FormField label="Freight / Connectivity" value={corridor.connectivity || corridor.freightAccess} onChange={(val) => { updateField(`corridors.${idx}.connectivity`, val); updateField(`corridors.${idx}.freightAccess`, val); }} />
                      <div className="sm:col-span-2">
                        <FormField label="Ideal Industry / Occupiers" value={corridor.idealFor} onChange={(val) => updateField(`corridors.${idx}.idealFor`, val)} />
                      </div>
                    </div>
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
              </div>
            )}

            {activeSectionTab === 'founders' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Founders & Leadership Principals</h3>
                {(formData?.founders || []).map((f, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Leadership #{idx + 1}: {f.name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Full Name" value={f.name} onChange={(val) => updateField(`founders.${idx}.name`, val)} />
                      <FormField label="Role / Title" value={f.role} onChange={(val) => updateField(`founders.${idx}.role`, val)} />
                      <FormField label="Experience Badge" value={f.badge} onChange={(val) => updateField(`founders.${idx}.badge`, val)} />
                      <FormField label="Direct Hotline Phone" value={f.phone} onChange={(val) => updateField(`founders.${idx}.phone`, val)} />
                    </div>
                    <TextAreaField label="Executive Biography" value={f.bio} onChange={(val) => updateField(`founders.${idx}.bio`, val)} rows={3} />
                    <FormField label="Personal Quote / Philosophy" value={f.quote} onChange={(val) => updateField(`founders.${idx}.quote`, val)} />
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
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Senior Principals &amp; Transaction Specialists</h3>
                {(formData?.teamMembers || []).map((member, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Advisor #{idx + 1}: {member.name}</h4>
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
                    <h4 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Fiduciary Pillar #{idx + 1}: {pillar.title}</h4>
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
            {activeSectionTab === 'hero' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Hero & Mission</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.hero?.badge} onChange={(val) => updateField('hero.badge', val)} />
                  <FormField label="Years Experience (e.g. 25+)" value={formData?.hero?.experienceYears} onChange={(val) => updateField('hero.experienceYears', val)} />
                  <FormField label="Title Prefix" value={formData?.hero?.titleMain} onChange={(val) => updateField('hero.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.hero?.titleItalic} onChange={(val) => updateField('hero.titleItalic', val)} />
                </div>
                <TextAreaField label="Hero Subtitle" value={formData?.hero?.description} onChange={(val) => updateField('hero.description', val)} />
                <FormField label="Mission Heading" value={formData?.hero?.missionTitle} onChange={(val) => updateField('hero.missionTitle', val)} />
                <TextAreaField label="Mission Statement" value={formData?.hero?.missionText} onChange={(val) => updateField('hero.missionText', val)} />
                <ImageUploadInput
                  label="About Hero Background Image"
                  value={formData?.hero?.bgImage}
                  onChange={(val) => updateField('hero.bgImage', val)}
                  folder="/saudagar-properties/cms"
                />
              </div>
            )}

            {activeSectionTab === 'videoShowcase' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Video Showcase & Legacy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.videoShowcase?.badge} onChange={(val) => updateField('videoShowcase.badge', val)} />
                  <FormField label="Video MP4 URL" value={formData?.videoShowcase?.videoUrl} onChange={(val) => updateField('videoShowcase.videoUrl', val)} />
                  <FormField label="Title Main" value={formData?.videoShowcase?.titleMain} onChange={(val) => updateField('videoShowcase.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.videoShowcase?.titleItalic} onChange={(val) => updateField('videoShowcase.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.videoShowcase?.subtitle} onChange={(val) => updateField('videoShowcase.subtitle', val)} />
              </div>
            )}

            {activeSectionTab === 'offerings' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Core Property Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.offerings?.badge} onChange={(val) => updateField('offerings.badge', val)} />
                  <FormField label="Title Main" value={formData?.offerings?.titleMain} onChange={(val) => updateField('offerings.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.offerings?.titleItalic} onChange={(val) => updateField('offerings.titleItalic', val)} />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.offerings?.subtitle} onChange={(val) => updateField('offerings.subtitle', val)} />

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">3 Property Category Cards</h4>
                  {(formData?.offerings?.items || []).map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h5 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Card #{idx + 1}: {item.title}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Tag" value={item.tag} onChange={(val) => updateField(`offerings.items.${idx}.tag`, val)} />
                        <FormField label="Title" value={item.title} onChange={(val) => updateField(`offerings.items.${idx}.title`, val)} />
                        <FormField label="Button Label" value={item.ctaText} onChange={(val) => updateField(`offerings.items.${idx}.ctaText`, val)} />
                        <FormField label="Button Link" value={item.ctaLink} onChange={(val) => updateField(`offerings.items.${idx}.ctaLink`, val)} />
                      </div>
                      <TextAreaField label="Description" value={item.description} onChange={(val) => updateField(`offerings.items.${idx}.description`, val)} rows={2} />
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

            {activeSectionTab === 'proposition' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Three Pillars of Value Proposition</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.proposition?.badge} onChange={(val) => updateField('proposition.badge', val)} />
                  <FormField label="Title Main" value={formData?.proposition?.titleMain} onChange={(val) => updateField('proposition.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.proposition?.titleItalic} onChange={(val) => updateField('proposition.titleItalic', val)} />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.proposition?.subtitle} onChange={(val) => updateField('proposition.subtitle', val)} />

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pillars (Residential, Commercial, Industrial)</h4>
                  {(formData?.proposition?.pillars || []).map((pillar, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h5 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Pillar #{pillar.number || idx + 1}: {pillar.title}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Number" value={pillar.number} onChange={(val) => updateField(`proposition.pillars.${idx}.number`, val)} />
                        <FormField label="Tag" value={pillar.tag} onChange={(val) => updateField(`proposition.pillars.${idx}.tag`, val)} />
                        <FormField label="Pillar Title" value={pillar.title} onChange={(val) => updateField(`proposition.pillars.${idx}.title`, val)} />
                        <FormField label="Headline" value={pillar.headline} onChange={(val) => updateField(`proposition.pillars.${idx}.headline`, val)} />
                      </div>
                      <TextAreaField label="Advisory Quote / Philosophy" value={pillar.quote} onChange={(val) => updateField(`proposition.pillars.${idx}.quote`, val)} rows={2} />
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

            {activeSectionTab === 'leadership' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Leadership &amp; Advisory Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.leadership?.badge} onChange={(val) => updateField('leadership.badge', val)} />
                  <FormField label="Title Main" value={formData?.leadership?.titleMain} onChange={(val) => updateField('leadership.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.leadership?.titleItalic} onChange={(val) => updateField('leadership.titleItalic', val)} />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.leadership?.subtitle} onChange={(val) => updateField('leadership.subtitle', val)} />

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Visionary Founders</h4>
                  {(formData?.leadership?.founders || []).map((f, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h5 className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">Founder #{idx + 1}: {f.name}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField label="Full Name" value={f.name} onChange={(val) => updateField(`leadership.founders.${idx}.name`, val)} />
                        <FormField label="Role / Title" value={f.role} onChange={(val) => updateField(`leadership.founders.${idx}.role`, val)} />
                        <FormField label="Badge / Experience" value={f.badge || f.experienceBadge} onChange={(val) => { updateField(`leadership.founders.${idx}.badge`, val); updateField(`leadership.founders.${idx}.experienceBadge`, val); }} />
                      </div>
                      <TextAreaField label="Executive Biography" value={f.bio} onChange={(val) => updateField(`leadership.founders.${idx}.bio`, val)} rows={3} />
                      <FormField label="Leadership Quote" value={f.quote} onChange={(val) => updateField(`leadership.founders.${idx}.quote`, val)} />
                      <ImageUploadInput
                        label={`${f.name} Portrait Photo`}
                        value={f.image}
                        onChange={(val) => updateField(`leadership.founders.${idx}.image`, val)}
                        folder="/saudagar-properties/team"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Senior Team Specialists</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(formData?.leadership?.teamMembers || []).map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
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
              </div>
            )}

            {activeSectionTab === 'whyChooseUs' && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Why Choose Us Distinction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Badge" value={formData?.whyChooseUs?.badge} onChange={(val) => updateField('whyChooseUs.badge', val)} />
                  <FormField label="Title Main" value={formData?.whyChooseUs?.titleMain} onChange={(val) => updateField('whyChooseUs.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.whyChooseUs?.titleItalic} onChange={(val) => updateField('whyChooseUs.titleItalic', val)} />
                </div>
                <TextAreaField label="Section Subtitle" value={formData?.whyChooseUs?.subtitle} onChange={(val) => updateField('whyChooseUs.subtitle', val)} />
              </div>
            )}

            {activeSectionTab === 'consultationCta' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Consultation CTA Banner</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Badge" value={formData?.consultationCta?.badge} onChange={(val) => updateField('consultationCta.badge', val)} />
                  <FormField label="Phone Number" value={formData?.consultationCta?.phone} onChange={(val) => updateField('consultationCta.phone', val)} />
                  <FormField label="Title Main" value={formData?.consultationCta?.titleMain} onChange={(val) => updateField('consultationCta.titleMain', val)} />
                  <FormField label="Title Highlight" value={formData?.consultationCta?.titleItalic} onChange={(val) => updateField('consultationCta.titleItalic', val)} />
                </div>
                <TextAreaField label="Subtitle" value={formData?.consultationCta?.subtitle} onChange={(val) => updateField('consultationCta.subtitle', val)} />
                <FormField label="WhatsApp URL" value={formData?.consultationCta?.whatsappUrl} onChange={(val) => updateField('consultationCta.whatsappUrl', val)} />
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
              </div>
            )}

            {activeSectionTab === 'contactInfo' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Headquarters Address & Phones</h3>
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

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D09A16] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(208,154,22,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
