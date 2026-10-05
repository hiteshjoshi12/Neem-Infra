import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUpRight } from 'lucide-react';
import FormInput from '../common/FormInput';
import SectionHeader from '../common/SectionHeader';

export default function TestimonialsEditor({ formData, updateField }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={MessageSquare}
        title="Testimonials Header Settings"
        subtitle="Manage the testimonials section badge, title styling, and access client feedback reviews"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Top Badge"
          placeholder="Client Perspectives"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Sub-badge Label"
          placeholder="Testimonial"
          value={formData.subBadge}
          onChange={(e) => updateField('subBadge', e.target.value)}
        />
        <FormInput
          label="Title Main"
          placeholder="Words of"
          value={formData.titleMain}
          onChange={(e) => updateField('titleMain', e.target.value)}
        />
        <FormInput
          label="Title Italic"
          placeholder="Distinction"
          value={formData.titleItalic}
          onChange={(e) => updateField('titleItalic', e.target.value)}
        />
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between gap-4">
        <div>
          <h5 className="font-bold text-white mb-1">Client Reviews & Testimonial Cards</h5>
          <p className="text-slate-400">
            Add, edit client quotes, ratings, investor titles, and avatars in the dedicated Testimonials Manager.
          </p>
        </div>
        <Link
          to="/admin/testimonials"
          className="px-4 py-2 rounded-xl bg-[#D09A16] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:brightness-110"
        >
          <span>Manage Client Reviews</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
