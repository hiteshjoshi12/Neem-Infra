import React from 'react';
import { Layers, ArrowUpRight, Plus, Trash2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import SectionHeader from '../common/SectionHeader';

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    phase: "STEP 01",
    title: "Understanding your Purpose",
    tagline: "Tailored to your budget & aspirations",
    shortDesc: "At Saudagar Properties, your trusted top real estate consultant in DLF Gurugram, we serve as a reliable platform to buy, rent, sell, or lease residential, commercial, and industrial properties.",
    fullDesc: "Whether you’re looking for a flat, villa, or kothi in Gurgaon or DLF Phase 2, or office space in Udyog Vihar, we are your one-stop solution to meet all your property needs within your budget and convenience.",
    highlights: ["Detailed requirement discovery", "Budget & location alignment", "Exclusive off-market inventory check"]
  },
  {
    step: "02",
    phase: "STEP 02",
    title: "Planning with our experts",
    tagline: "Direct consultation without middlemen",
    shortDesc: "Our dedicated team of professionals provides personalized guidance, answering all your queries and helping you avoid the hassle of middlemen like brokers and financers.",
    fullDesc: "We assist you in selecting the perfect property whether residential or commercial and handle the formalities efficiently, ensuring you stay within your budget.",
    highlights: ["Direct consultation with directors", "Zero hidden broker fees", "Clear financial & legal roadmap"]
  },
  {
    step: "03",
    phase: "STEP 03",
    title: "Implementation as per plan",
    tagline: "Transparent execution & smooth closing",
    shortDesc: "Once your needs are clear, our experts actively search for the best property options tailored to you. We pride ourselves on dedication and transparency.",
    fullDesc: "We ensure smooth coordination and keep you informed throughout the process. Reach out to us today, and let’s discuss how we can help you find your ideal property in DLF Gurugram.",
    highlights: ["Hand-picked property site tours", "Title verification & due diligence", "Seamless registration & handover"]
  }
];

export default function ServicesEditor({ formData, updateField, onNavigateTab }) {
  const cards = formData.cards || [];
  const experienceCounter = formData.experienceCounter || {};
  const howWeWork = formData.howWeWork || {};
  const dlfCallout = formData.dlfCallout || {};

  const steps = (howWeWork.steps && howWeWork.steps.length > 0)
    ? howWeWork.steps
    : DEFAULT_PROCESS_STEPS;

  const handleCardChange = (index, field, value) => {
    const copy = [...cards];
    copy[index] = { ...copy[index], [field]: value };
    updateField('cards', copy);
  };

  const handleStepChange = (index, field, value) => {
    const currentSteps = (howWeWork.steps && howWeWork.steps.length > 0)
      ? JSON.parse(JSON.stringify(howWeWork.steps))
      : JSON.parse(JSON.stringify(DEFAULT_PROCESS_STEPS));
    
    currentSteps[index] = { ...currentSteps[index], [field]: value };
    updateField('howWeWork.steps', currentSteps);
  };

  const handleAddStep = () => {
    const currentSteps = (howWeWork.steps && howWeWork.steps.length > 0)
      ? JSON.parse(JSON.stringify(howWeWork.steps))
      : JSON.parse(JSON.stringify(DEFAULT_PROCESS_STEPS));
    const nextNum = String(currentSteps.length + 1).padStart(2, '0');
    currentSteps.push({
      step: nextNum,
      phase: `STEP ${nextNum}`,
      title: 'New Process Milestone',
      tagline: 'Tailored milestone description',
      shortDesc: 'Brief overview of this process milestone...',
      fullDesc: 'Comprehensive details and guidance for this process step...',
      highlights: ['Step highlight 1', 'Step highlight 2']
    });
    updateField('howWeWork.steps', currentSteps);
  };

  const handleRemoveStep = (index) => {
    const currentSteps = (howWeWork.steps && howWeWork.steps.length > 0)
      ? JSON.parse(JSON.stringify(howWeWork.steps))
      : JSON.parse(JSON.stringify(DEFAULT_PROCESS_STEPS));
    const updated = currentSteps.filter((_, i) => i !== index);
    updateField('howWeWork.steps', updated);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Layers}
        title="Our Services Section"
        subtitle="Manage the service cards, 25+ years experience counter, 3-step process methodology, and DLF callout banner"
      />

      {/* Main Section Header */}
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

      {/* Sub-section 1: Service Cards */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h4 className="text-sm font-serif font-bold text-[#D09A16]">
          1. Three Core Service Pillars (Residential, Commercial, Industrial)
        </h4>
        <div className="space-y-4">
          {cards.map((card, cIdx) => (
            <div key={cIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Card #{cIdx + 1}: {card.title} ({card.category})
                </span>
                <span className="text-[10px] text-[#D09A16] uppercase tracking-widest">{card.id}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput
                  label="Title"
                  value={card.title}
                  onChange={(e) => handleCardChange(cIdx, 'title', e.target.value)}
                />
                <FormInput
                  label="Category"
                  value={card.category}
                  onChange={(e) => handleCardChange(cIdx, 'category', e.target.value)}
                />
                <FormInput
                  label="Sub-badge"
                  value={card.badge}
                  onChange={(e) => handleCardChange(cIdx, 'badge', e.target.value)}
                />
              </div>
              <FormTextarea
                label="Description"
                rows={2}
                value={card.description}
                onChange={(e) => handleCardChange(cIdx, 'description', e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Card Background Image URL"
                  value={card.bgImage}
                  onChange={(e) => handleCardChange(cIdx, 'bgImage', e.target.value)}
                />
                <FormInput
                  label="CTA Button Text"
                  placeholder="Inquire Service"
                  value={card.ctaText}
                  onChange={(e) => handleCardChange(cIdx, 'ctaText', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-section 2: Experience Counter Spotlight */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h4 className="text-sm font-serif font-bold text-[#D09A16]">
          2. 25+ Years Experience Counter Spotlight
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            type="number"
            label="Years Count (Number)"
            value={experienceCounter.yearsCount ?? 25}
            onChange={(e) => updateField('experienceCounter.yearsCount', Number(e.target.value))}
          />
          <FormInput
            label="Counter Label"
            placeholder="Years of Authority"
            value={experienceCounter.counterLabel}
            onChange={(e) => updateField('experienceCounter.counterLabel', e.target.value)}
          />
          <FormInput
            label="Badge"
            value={experienceCounter.badge}
            onChange={(e) => updateField('experienceCounter.badge', e.target.value)}
          />
        </div>
        <FormInput
          label="Headline"
          value={experienceCounter.headline}
          onChange={(e) => updateField('experienceCounter.headline', e.target.value)}
        />
        <FormTextarea
          label="Description Paragraph"
          rows={3}
          value={experienceCounter.description}
          onChange={(e) => updateField('experienceCounter.description', e.target.value)}
        />
      </div>

      {/* Sub-section 3: How Do We Work Process */}
      <div className="pt-6 border-t border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-serif font-bold text-[#D09A16]">
              3. How Do We Work? Process Methodology ({steps.length} Steps)
            </h4>
            <p className="text-xs text-slate-400">
              Customize the step badges, titles, descriptions, and interactive highlights shown in the process cards
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStep}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Step</span>
          </button>
        </div>

        {/* Process Header Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Process Badge"
            value={howWeWork.badge}
            onChange={(e) => updateField('howWeWork.badge', e.target.value)}
          />
          <FormInput
            label="Title Main"
            value={howWeWork.titleMain}
            onChange={(e) => updateField('howWeWork.titleMain', e.target.value)}
          />
          <FormInput
            label="Title Italic"
            value={howWeWork.titleItalic}
            onChange={(e) => updateField('howWeWork.titleItalic', e.target.value)}
          />
        </div>

        <FormInput
          label="Overview Description"
          value={howWeWork.description}
          onChange={(e) => updateField('howWeWork.description', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Expand Button Label (Full View)"
            placeholder="Read Full Overview"
            value={howWeWork.fullViewText}
            onChange={(e) => updateField('howWeWork.fullViewText', e.target.value)}
          />
          <FormInput
            label="Collapse Button Label (Brief View)"
            placeholder="Show Brief View"
            value={howWeWork.briefViewText}
            onChange={(e) => updateField('howWeWork.briefViewText', e.target.value)}
          />
        </div>

        {/* Individual Step Cards */}
        <div className="space-y-4">
          {steps.map((st, sIdx) => {
            const highlightsText = Array.isArray(st.highlights)
              ? st.highlights.join('\n')
              : (st.highlights || '');

            return (
              <div key={sIdx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4 relative group">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D09A16]/15 text-[#D09A16] text-[10px] font-bold tracking-wider uppercase">
                      {st.phase || `STEP ${sIdx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {st.title || `Step ${sIdx + 1}`}
                    </span>
                  </div>

                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(sIdx)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormInput
                    label="Phase Tag"
                    placeholder="STEP 01"
                    value={st.phase}
                    onChange={(e) => handleStepChange(sIdx, 'phase', e.target.value)}
                  />
                  <FormInput
                    label="Step Title"
                    placeholder="Understanding your Purpose"
                    value={st.title}
                    onChange={(e) => handleStepChange(sIdx, 'title', e.target.value)}
                  />
                  <FormInput
                    label="Tagline / Subtitle"
                    placeholder="Tailored to your budget & aspirations"
                    value={st.tagline}
                    onChange={(e) => handleStepChange(sIdx, 'tagline', e.target.value)}
                  />
                </div>

                <FormTextarea
                  label="Short Description (Card Summary)"
                  rows={2}
                  value={st.shortDesc}
                  onChange={(e) => handleStepChange(sIdx, 'shortDesc', e.target.value)}
                />

                <FormTextarea
                  label="Full Description (Expanded View)"
                  rows={3}
                  value={st.fullDesc}
                  onChange={(e) => handleStepChange(sIdx, 'fullDesc', e.target.value)}
                />

                <FormTextarea
                  label="Checklist Highlights (Enter one bullet point per line)"
                  rows={3}
                  placeholder={"Hand-picked property site tours\nTitle verification & due diligence\nSeamless registration & handover"}
                  value={highlightsText}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    handleStepChange(sIdx, 'highlights', lines);
                  }}
                  subtext="Each line will appear as an individual gold checkmarked highlight in the card."
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-section 4: DLF Property Callout Banner Link */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-serif font-bold text-[#D09A16]">
            4. DLF Property Callout Banner & Stats
          </h4>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('dlfCallout')}
              className="px-3 py-1.5 rounded-lg bg-[#D09A16] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer hover:brightness-110"
            >
              <span>Open Tab 6: DLF Callout & Stats</span>
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput
            label="Banner Badge"
            value={dlfCallout.badge}
            onChange={(e) => updateField('dlfCallout.badge', e.target.value)}
          />
          <FormInput
            label="Call Phone Number"
            value={dlfCallout.phone}
            onChange={(e) => updateField('dlfCallout.phone', e.target.value)}
          />
          <FormInput
            label="Explore Button Text"
            placeholder="Explore Deals"
            value={dlfCallout.ctaText}
            onChange={(e) => updateField('dlfCallout.ctaText', e.target.value)}
          />
        </div>
        <FormInput
          label="Banner Title"
          value={dlfCallout.headline}
          onChange={(e) => updateField('dlfCallout.headline', e.target.value)}
        />
        <FormTextarea
          label="Banner Description"
          rows={2}
          value={dlfCallout.description}
          onChange={(e) => updateField('dlfCallout.description', e.target.value)}
        />
      </div>
    </div>
  );
}
