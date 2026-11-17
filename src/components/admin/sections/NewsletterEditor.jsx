import React from 'react';
import { Mail } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function NewsletterEditor({ formData, updateField }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Mail}
        title="Newsletter Subscription Banner Settings"
        subtitle="Manage the email subscription headline, input placeholders, privacy disclaimer, and success confirmation"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <FormInput
          label="Badge"
          placeholder="Market Intelligence"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />
        <FormInput
          label="Title Main"
          placeholder="Subscribe To"
          value={formData.titleMain}
          onChange={(e) => updateField('titleMain', e.target.value)}
        />
        <FormInput
          label="Title Italic"
          placeholder="Saudagar Properties"
          value={formData.titleItalic}
          onChange={(e) => updateField('titleItalic', e.target.value)}
        />
        <FormInput
          label="Title Suffix (Optional)"
          placeholder="Newsletter"
          value={formData.titleSuffix}
          onChange={(e) => updateField('titleSuffix', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Description"
        rows={3}
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Input Placeholder"
          placeholder="Enter your email address..."
          value={formData.placeholder}
          onChange={(e) => updateField('placeholder', e.target.value)}
        />
        <FormInput
          label="Subscribe Button Text"
          placeholder="Sign Up"
          value={formData.buttonText}
          onChange={(e) => updateField('buttonText', e.target.value)}
        />
      </div>

      <FormInput
        label="Privacy / Anti-Spam Guarantee Subtext"
        placeholder="Zero spam. Complete confidentiality. Unsubscribe at any time."
        value={formData.disclaimer}
        onChange={(e) => updateField('disclaimer', e.target.value)}
      />

      {/* VIP Benefit Pills */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-sm font-serif font-bold text-brand-gold">
          VIP Benefit Highlights (3 Pills)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Pill 1 Text"
            placeholder="Off-Market Inventory"
            value={formData.pill1 || 'Off-Market Inventory'}
            onChange={(e) => updateField('pill1', e.target.value)}
          />
          <FormInput
            label="Pill 2 Text"
            placeholder="Quarterly Price Index"
            value={formData.pill2 || 'Quarterly Price Index'}
            onChange={(e) => updateField('pill2', e.target.value)}
          />
          <FormInput
            label="Pill 3 Text"
            placeholder="Confidential Dispatch"
            value={formData.pill3 || 'Confidential Dispatch'}
            onChange={(e) => updateField('pill3', e.target.value)}
          />
        </div>
      </div>

      {/* Right Column: Market Dispatch Preview Card */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <div>
          <h4 className="text-sm font-serif font-bold text-brand-gold">
            Market Dispatch Preview Card (Right Column)
          </h4>
          <p className="text-xs text-slate-400">
            Customize the editorial document preview teaser displayed on the right side of the newsletter banner
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Report Title"
            placeholder="SAUDAGAR MARKET REPORT"
            value={formData.reportTitle || 'SAUDAGAR MARKET REPORT'}
            onChange={(e) => updateField('reportTitle', e.target.value)}
          />
          <FormInput
            label="Report Edition"
            placeholder="Q1 · 2026 EDITION"
            value={formData.reportEdition || 'Q1 · 2026 EDITION'}
            onChange={(e) => updateField('reportEdition', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Coverage Label"
            placeholder="DLF Micro-Markets Covered"
            value={formData.reportCoverageLabel || 'DLF Micro-Markets Covered'}
            onChange={(e) => updateField('reportCoverageLabel', e.target.value)}
          />
          <FormInput
            label="Coverage Value"
            placeholder="5 DLF Phases · 7 Corridors"
            value={formData.reportCoverageValue || '5 DLF Phases · 7 Corridors'}
            onChange={(e) => updateField('reportCoverageValue', e.target.value)}
          />
        </div>

        {/* 2 Middle Stat Cards: Properties Listed & Years in DLF Gurugram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
              Stat Card 1 (Properties Listed)
            </h5>
            <FormInput
              label="Card 1 Label"
              placeholder="Properties Listed"
              value={formData.stat1Label !== undefined ? formData.stat1Label : (formData.propertiesListedLabel || 'Properties Listed')}
              onChange={(e) => {
                updateField('stat1Label', e.target.value);
                updateField('propertiesListedLabel', e.target.value);
              }}
            />
            <FormInput
              label="Card 1 Value"
              placeholder="9 Active"
              value={formData.stat1Value !== undefined ? formData.stat1Value : (formData.propertiesListedValue || '')}
              onChange={(e) => {
                updateField('stat1Value', e.target.value);
                updateField('propertiesListedValue', e.target.value);
              }}
            />
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
              Stat Card 2 (Years in DLF Gurugram)
            </h5>
            <FormInput
              label="Card 2 Label"
              placeholder="Years in DLF Gurugram"
              value={formData.stat2Label !== undefined ? formData.stat2Label : (formData.yearsExperienceLabel || 'Years in DLF Gurugram')}
              onChange={(e) => {
                updateField('stat2Label', e.target.value);
                updateField('yearsExperienceLabel', e.target.value);
              }}
            />
            <FormInput
              label="Card 2 Value"
              placeholder="27+ Years"
              value={formData.stat2Value !== undefined ? formData.stat2Value : (formData.yearsExperienceValue || '')}
              onChange={(e) => {
                updateField('stat2Value', e.target.value);
                updateField('yearsExperienceValue', e.target.value);
              }}
            />
          </div>
        </div>

        <FormTextarea
          label="Preview Quote"
          rows={2}
          placeholder="Independent advisory on verified builder floors, luxury villas, and commercial assets across DLF Phase 1–5."
          value={formData.reportQuote}
          onChange={(e) => updateField('reportQuote', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Footer Stamp Left"
            placeholder="DLF GURUGRAM DESK"
            value={formData.reportFooterLeft || 'DLF GURUGRAM DESK'}
            onChange={(e) => updateField('reportFooterLeft', e.target.value)}
          />
          <FormInput
            label="Footer Stamp Right"
            placeholder="CONFIDENTIAL DISPATCH"
            value={formData.reportFooterRight || 'CONFIDENTIAL DISPATCH'}
            onChange={(e) => updateField('reportFooterRight', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        <FormInput
          label="Success Title"
          placeholder="Thank You for Subscribing!"
          value={formData.successTitle}
          onChange={(e) => updateField('successTitle', e.target.value)}
        />
        <FormInput
          label="Subscribe Another Button Text"
          placeholder="Subscribe another email"
          value={formData.subscribeAnotherText}
          onChange={(e) => updateField('subscribeAnotherText', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Success Message"
        rows={2}
        placeholder="You have been added to our private advisory list..."
        value={formData.successMessage}
        onChange={(e) => updateField('successMessage', e.target.value)}
      />
    </div>
  );
}
