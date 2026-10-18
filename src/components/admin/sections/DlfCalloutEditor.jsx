import React from 'react';
import { TrendingUp, Plus, Trash2, Sparkles, Image as ImageIcon, MapPin, Phone, Layers } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';
import ImageUploadInput from '../ImageUploadInput';

export default function DlfCalloutEditor({ formData, updateField }) {
  const statsCards = formData.statsCards || [];

  const handleAddStat = () => {
    updateField('statsCards', [
      ...statsCards,
      { number: 50, suffix: '+', label: 'New Metric Stat', subtext: 'Excellence in Gurgaon real estate' }
    ]);
  };

  const handleRemoveStat = (index) => {
    updateField('statsCards', statsCards.filter((_, i) => i !== index));
  };

  const handleStatChange = (index, field, value) => {
    const copy = [...statsCards];
    copy[index] = { ...copy[index], [field]: value };
    updateField('statsCards', copy);
  };

  // Convert array to comma-separated string for tags editor
  const tagsString = Array.isArray(formData.ctaTags) 
    ? formData.ctaTags.join(', ') 
    : (formData.ctaTags || "Residential Villas, Luxury Floors, Commercial HQs, Industrial Assets");

  const handleTagsChange = (val) => {
    const arr = val.split(',').map(s => s.trim()).filter(Boolean);
    updateField('ctaTags', arr);
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        icon={TrendingUp}
        title="DLF Property Callout & Stats Banner"
        subtitle="Manage the luxury DLF Gurugram editorial showcase, architectural photo, metrics strip, and private property desk CTA panel."
      />

      {/* ========================================================
          CARD 1: TOP EDITORIAL HERO (MATCHING FRONTEND DESIGN)
      ======================================================== */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Sparkles size={16} className="text-[#D09A16]" />
          <h3 className="text-base font-serif font-bold text-white">
            1. Top Editorial Hero & Architectural Visual
          </h3>
        </div>

        {/* Eyebrows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Gold Eyebrow Badge"
            placeholder="DLF Gurgaon Dedicated Desk"
            value={formData.badge}
            onChange={(e) => updateField('badge', e.target.value)}
          />
          <FormInput
            label="Location Eyebrow Tag"
            placeholder="DLF GURUGRAM"
            value={formData.locationTag}
            onChange={(e) => updateField('locationTag', e.target.value)}
          />
          <FormInput
            label="Expertise Sub-Tag"
            placeholder="LOCAL PROPERTY EXPERTISE"
            value={formData.expertiseTag}
            onChange={(e) => updateField('expertiseTag', e.target.value)}
          />
        </div>

        {/* Big Serif Heading (Main + Italic Gold) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Headline Main (White Text)"
            placeholder="DLF Gurugram,"
            value={formData.titleMain}
            onChange={(e) => updateField('titleMain', e.target.value)}
          />
          <FormInput
            label="Headline Highlight (Gold Italic)"
            placeholder="considered differently."
            value={formData.titleItalic}
            onChange={(e) => updateField('titleItalic', e.target.value)}
          />
        </div>

        {/* Editorial Description */}
        <FormTextarea
          label="Editorial Description Paragraph"
          rows={3}
          placeholder="Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties..."
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
        />

        {/* Architectural Image & Overlay Coordinates */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={14} className="text-[#D09A16]" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Right-Side Architectural Image & Coordinates
            </h4>
          </div>

          <ImageUploadInput
            label="Architectural Image"
            value={formData.image}
            onChange={(val) => updateField('image', val)}
            folder="/saudagar-properties/dlf-callout"
            recommendedRatio="16:9"
            description="Luxury architectural photography displayed on the right-hand feature showcase card"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Coordinate Tag Label (Bottom Left)"
              placeholder="DLF PHASE V · PRIVATE DESK"
              value={formData.coordinateLabel}
              onChange={(e) => updateField('coordinateLabel', e.target.value)}
            />
            <FormInput
              label="Coordinate Location Value (Bottom Right)"
              placeholder="28°27'N 77°05'E"
              value={formData.coordinateValue}
              onChange={(e) => updateField('coordinateValue', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD 2: 3D ANIMATED METRIC STATS STRIP
      ======================================================== */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#D09A16]" />
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                2. Horizontal Metric Stats Strip ({statsCards.length} Metrics)
              </h3>
              <p className="text-xs text-slate-400">
                Large dynamic serif numbers with animated counting displayed right across the section
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddStat}
            className="px-3.5 py-1.5 rounded-lg bg-[#D09A16] text-[#0C101A] hover:brightness-110 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Plus size={14} />
            <span>Add Metric</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((stat, sIdx) => (
            <div key={sIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group hover:border-[#D09A16]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D09A16] uppercase tracking-wider">
                  Metric #{sIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveStat(sIdx)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  type="number"
                  label="Number Value"
                  value={stat.number ?? 0}
                  onChange={(e) => handleStatChange(sIdx, 'number', Number(e.target.value))}
                />
                <FormInput
                  label="Suffix"
                  placeholder="+"
                  value={stat.suffix}
                  onChange={(e) => handleStatChange(sIdx, 'suffix', e.target.value)}
                />
              </div>

              <FormInput
                label="Metric Heading / Title"
                placeholder="CR Saves In Property Investment"
                value={stat.label}
                onChange={(e) => handleStatChange(sIdx, 'label', e.target.value)}
              />

              <FormInput
                label="Subtext Description"
                placeholder="Maximized financial yield & smart negotiation"
                value={stat.subtext}
                onChange={(e) => handleStatChange(sIdx, 'subtext', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          CARD 3: PRIVATE PROPERTY DESK CTA PANEL
      ======================================================== */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Phone size={16} className="text-[#D09A16]" />
          <div>
            <h3 className="text-base font-serif font-bold text-white">
              3. Private Property Desk CTA Panel
            </h3>
            <p className="text-xs text-slate-400">
              The high-impact bottom consultation box with phone link, explore button, and property tags
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Pulse Indicator Badge"
            placeholder="PRIVATE PROPERTY DESK · ACTIVE INQUIRIES"
            value={formData.ctaBadge}
            onChange={(e) => updateField('ctaBadge', e.target.value)}
          />
          <FormInput
            label="Trust Statement / Sub-footer"
            placeholder="Confidential Advisory · Verified Titles"
            value={formData.trustStatement}
            onChange={(e) => updateField('trustStatement', e.target.value)}
          />
        </div>

        <FormInput
          label="CTA Panel Headline"
          placeholder="Are you looking for a property in DLF Gurgaon? Simply connect with us!"
          value={formData.ctaHeadline || formData.headline}
          onChange={(e) => {
            updateField('ctaHeadline', e.target.value);
            updateField('headline', e.target.value);
          }}
        />

        <FormTextarea
          label="CTA Panel Subtitle / Description"
          rows={2}
          placeholder="Direct access to off-market inventory, verified titles, and bespoke consultation across DLF Phase 1–5, Golf Course Road & Cybercity."
          value={formData.ctaDescription}
          onChange={(e) => updateField('ctaDescription', e.target.value)}
        />

        <FormInput
          label="Property Type Badges (Comma-separated)"
          placeholder="Residential Villas, Luxury Floors, Commercial HQs, Industrial Assets"
          value={tagsString}
          onChange={(e) => handleTagsChange(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            label="Phone (Display)"
            placeholder="+91 98112 21207"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <FormInput
            label="Dialable Phone (tel:)"
            placeholder="+919811221207"
            value={formData.phoneRaw}
            onChange={(e) => updateField('phoneRaw', e.target.value)}
          />
          <FormInput
            label="Button Text"
            placeholder="Explore Deals"
            value={formData.ctaText}
            onChange={(e) => updateField('ctaText', e.target.value)}
          />
          <FormInput
            label="Button Destination Link"
            placeholder="/contact"
            value={formData.ctaLink}
            onChange={(e) => updateField('ctaLink', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
