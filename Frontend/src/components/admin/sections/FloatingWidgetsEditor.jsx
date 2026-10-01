import React from 'react';
import { Phone } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

export default function FloatingWidgetsEditor({ formData, updateField }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Phone}
        title="Floating WhatsApp & Back-To-Top Quick Action Widgets"
        subtitle="Configure the persistent bottom-right floating quick contact widgets and default message templates"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="WhatsApp Target Number (Country Code + Number, no + sign)"
          placeholder="919718511207"
          value={formData.whatsappNumber}
          onChange={(e) => updateField('whatsappNumber', e.target.value)}
        />
        <FormInput
          label="WhatsApp Hover Tooltip Text"
          placeholder="Chat on WhatsApp"
          value={formData.whatsappTooltip}
          onChange={(e) => updateField('whatsappTooltip', e.target.value)}
        />
        <FormInput
          label="Back To Top Hover Tooltip Text"
          placeholder="Back to top"
          value={formData.backToTopTooltip}
          onChange={(e) => updateField('backToTopTooltip', e.target.value)}
        />
      </div>

      <FormTextarea
        label="Pre-filled WhatsApp Message"
        rows={3}
        placeholder="Hello Saudagar Properties, I am interested in luxury properties in DLF Gurugram."
        subtext="When a visitor clicks the WhatsApp widget, their WhatsApp app will open with this message pre-populated ready to send."
        value={formData.whatsappPrefill}
        onChange={(e) => updateField('whatsappPrefill', e.target.value)}
      />
    </div>
  );
}
