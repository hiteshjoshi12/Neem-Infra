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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
