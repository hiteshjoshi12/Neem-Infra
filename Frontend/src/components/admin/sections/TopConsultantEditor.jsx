import React from 'react';
import { Award } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function TopConsultantEditor({ formData, updateField }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Award}
        title="Top Consultant in DLF Gurugram Settings"
        subtitle="Manage advisory headlines, story paragraphs, video walkthrough showcase, and trust CTA banner"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Badge Text"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Card Shield Badge"
          value={formData.cardBadge}
          onChange={(e) => updateField('cardBadge', e.target.value)}
        />
        <FormInput
          label="Headline Main"
          value={formData.headlineMain}
          onChange={(e) => updateField('headlineMain', e.target.value)}
        />
        <FormInput
          label="Headline Italic Gold"
          value={formData.headlineItalic}
          onChange={(e) => updateField('headlineItalic', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Side Summary Quote"
        rows={2}
        value={formData.summaryQuote}
        onChange={(e) => updateField('summaryQuote', e.target.value)}
      />

      <FormTextarea
        label="Card Paragraph 1"
        rows={3}
        value={formData.paragraph1}
        onChange={(e) => updateField('paragraph1', e.target.value)}
      />

      <FormTextarea
        label="Card Paragraph 2"
        rows={3}
        value={formData.paragraph2}
        onChange={(e) => updateField('paragraph2', e.target.value)}
      />

      {/* Video Tour Showcase Card */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-sm font-serif font-bold text-[#C5A880] mb-4">
          Cinematic Video Walkthrough Showcase Card
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Badge"
            value={formData.videoTour?.badge}
            onChange={(e) => updateField('videoTour.badge', e.target.value)}
          />
          <FormInput
            label="Card Title"
            value={formData.videoTour?.title}
            onChange={(e) => updateField('videoTour.title', e.target.value)}
          />
          <FormInput
            label="Subtitle"
            value={formData.videoTour?.subtitle}
            onChange={(e) => updateField('videoTour.subtitle', e.target.value)}
          />
          <FormInput
            label="Poster Image URL"
            value={formData.videoTour?.image}
            onChange={(e) => updateField('videoTour.image', e.target.value)}
          />
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-sm font-serif font-bold text-[#C5A880] mb-4">
          Bottom Trust & Action Banner
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Banner Title"
            value={formData.ctaBanner?.title}
            onChange={(e) => updateField('ctaBanner.title', e.target.value)}
          />
          <FormInput
            label="Phone Number"
            value={formData.ctaBanner?.phone}
            onChange={(e) => updateField('ctaBanner.phone', e.target.value)}
          />
          <FormInput
            label="Button Text"
            value={formData.ctaBanner?.buttonText}
            onChange={(e) => updateField('ctaBanner.buttonText', e.target.value)}
          />
          <FormInput
            label="Button Destination Link"
            value={formData.ctaBanner?.buttonHref}
            onChange={(e) => updateField('ctaBanner.buttonHref', e.target.value)}
          />
          <div className="md:col-span-2">
            <FormTextarea
              label="Banner Description"
              rows={2}
              value={formData.ctaBanner?.description}
              onChange={(e) => updateField('ctaBanner.description', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
