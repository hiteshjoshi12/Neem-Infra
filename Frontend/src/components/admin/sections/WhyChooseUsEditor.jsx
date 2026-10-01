import React from 'react';
import { ShieldCheck } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function WhyChooseUsEditor({ formData, updateField }) {
  const trustCard = formData.trustCard || {};
  const reasons = formData.reasons || [];

  const handleReasonChange = (index, field, value) => {
    const copy = [...reasons];
    copy[index] = { ...copy[index], [field]: value };
    updateField('reasons', copy);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ShieldCheck}
        title="Why Choose Our Company Settings"
        subtitle="Manage the value proposition header, featured trust card, and 3 pillars of distinction"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          label="Badge"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Title Main"
          value={formData.titleMain}
          onChange={(e) => updateField('titleMain', e.target.value)}
        />
        <FormInput
          label="Title Italic"
          value={formData.titleItalic}
          onChange={(e) => updateField('titleItalic', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Header Description"
        rows={2}
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      {/* Left Featured Trust Card */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h4 className="text-sm font-serif font-bold text-[#C5A880]">
          Featured Trust Card (Left Side)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Card Badge"
            value={trustCard.badge}
            onChange={(e) => updateField('trustCard.badge', e.target.value)}
          />
          <FormInput
            label="Card Title"
            value={trustCard.title}
            onChange={(e) => updateField('trustCard.title', e.target.value)}
          />
          <FormInput
            label="CTA Button Text"
            placeholder="Learn More About Us"
            value={trustCard.ctaText}
            onChange={(e) => updateField('trustCard.ctaText', e.target.value)}
          />
          <FormInput
            label="CTA Button Link"
            placeholder="/about"
            value={trustCard.ctaLink}
            onChange={(e) => updateField('trustCard.ctaLink', e.target.value)}
          />
        </div>
        <FormTextarea
          label="Paragraph 1"
          rows={2}
          value={trustCard.p1}
          onChange={(e) => updateField('trustCard.p1', e.target.value)}
        />
        <FormTextarea
          label="Paragraph 2"
          rows={2}
          value={trustCard.p2}
          onChange={(e) => updateField('trustCard.p2', e.target.value)}
        />
      </div>

      {/* 3 Pillar Reasons */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h4 className="text-sm font-serif font-bold text-[#C5A880]">
          Three Value Pillars (Right Side)
        </h4>
        <div className="space-y-4">
          {reasons.map((reason, rIdx) => (
            <div key={rIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Pillar #{reason.id || rIdx + 1}: {reason.title}
                </span>
                <span className="text-[10px] text-[#C5A880] uppercase tracking-widest">{reason.badge}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Pillar Title"
                  value={reason.title}
                  onChange={(e) => handleReasonChange(rIdx, 'title', e.target.value)}
                />
                <FormInput
                  label="Badge Tag"
                  value={reason.badge}
                  onChange={(e) => handleReasonChange(rIdx, 'badge', e.target.value)}
                />
              </div>
              <FormTextarea
                label="Description"
                rows={2}
                value={reason.description}
                onChange={(e) => handleReasonChange(rIdx, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
