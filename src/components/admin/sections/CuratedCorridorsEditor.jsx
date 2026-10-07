import React from 'react';
import Link from 'next/link';
import { Building2, ArrowUpRight } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function CuratedCorridorsEditor({ formData, updateField }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Building2}
        title="Featured Properties Copy & CTA"
        subtitle="Manage the section headline, introductory description, and portfolio CTA button"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Gold Badge"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Headline Main"
          value={formData.titleMain}
          onChange={(e) => updateField('titleMain', e.target.value)}
        />
        <FormInput
          label="Headline Italic"
          value={formData.titleItalic}
          onChange={(e) => updateField('titleItalic', e.target.value)}
        />
        <FormInput
          label="Bottom CTA Button Text"
          placeholder="View Complete Featured Inventory"
          value={formData.ctaText}
          onChange={(e) => updateField('ctaText', e.target.value)}
        />
        <FormInput
          label="Bottom CTA Link Destination"
          placeholder="/properties"
          value={formData.ctaLink}
          onChange={(e) => updateField('ctaLink', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Header Description"
        rows={3}
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between gap-4">
        <div>
          <h5 className="font-bold text-white mb-1">Featured Properties 3D Inventory</h5>
          <p className="text-slate-400">
            Add, edit, or delete individual luxury builder floors, villas, and apartments shown in the 3D rotating stage.
          </p>
        </div>
        <Link href="/admin/properties"
          className="px-4 py-2 rounded-xl bg-[#D09A16] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:brightness-110 transition-colors"
        >
          <span>Open Properties Manager</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
