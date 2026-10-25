"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import { animate, inView, stagger } from 'framer-motion';
import api from '@/services/api';
import { useCms } from '@/context/CmsContext';

export default function ContactClient({ initialData }) {
  const { sections } = useCms();
  const cms = sections?.page_contact || initialData || {};
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    purpose: 'Buy',
    propertyType: 'Luxury Builder Floor',
    budget: '₹5 Cr - ₹10 Cr'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const formBoxRef = useRef(null);
  const contentSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
        );
      }

      // 2. Left and Right Content Staggered Reveal
      if (leftColRef.current && formBoxRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentSectionRef.current,
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );

        gsap.fromTo(
          formBoxRef.current,
          { opacity: 0, x: 40, rotateY: -6 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentSectionRef.current,
              start: "top 85%",
              once: true
            },
            clearProps: "transform"
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Purpose: ${formData.purpose}\nProperty Type: ${formData.propertyType}\nBudget: ${formData.budget}\n\nMessage:\n${formData.message}`,
        source: 'Main Contact Page',
        type: 'general_contact'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to send inquiry. Please try the direct contact options below.');
    } finally {
      setLoading(false);
    }
  };

  const formattedMessage = `*New Inquiry from Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Purpose:* ${formData.purpose}%0A*Property Type:* ${formData.propertyType}%0A*Budget:* ${formData.budget}%0A*Message:* ${formData.message}`;
  const targetWhatsapp = (cms.form?.whatsappNumber || cms.contactInfo?.phone1 || '919718511207').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${formattedMessage}`;

  return (
    <>
      {/* Page Header with Clearly Visible Architectural Background Image */}
      <div className="relative pt-32 pb-20 md:pb-24 bg-brand-obsidian text-white text-center px-4 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <Image
            src={cms.hero?.bgImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"}
            alt={cms.hero?.bgImageAlt || cms.hero?.imageAlt || "Saudagar Properties Headquarters Gurugram"}
            fill
            sizes="100vw"
            priority
            className="w-full h-full object-cover brightness-[0.88] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-obsidian/85 via-brand-obsidian/45 to-brand-obsidian/95" />
        </div>

        {/* Ambient Golden Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(197,154,39,0.18) 0%, rgba(197,154,39,0) 70%)' }}
        />

        <div ref={headerRef} className="max-w-3xl mx-auto relative z-10">
          {/* Illuminated Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-brand-gold flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
              <span>Contact Us</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
            {cms.hero?.titleMain || "Connect With Our Senior "} <span className="italic font-serif text-brand-gold">{cms.hero?.titleItalic || "Partners"}</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-normal leading-relaxed">
            {cms.hero?.subtitle || "Get in touch with Saudagar Properties for premium real estate advisory in Gurugram. We are here to assist you with buying, selling, or leasing luxury properties."}
          </p>
        </div>
      </div>

      <div 
        ref={contentSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        
        {/* Left Column: Contact Information */}
        <div ref={leftColRef} className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] text-brand-gold uppercase mb-2">
              {cms.contactInfo?.officeBadge || "Corporate Headquarters"}
            </h2>
            <h3 className="text-3xl font-serif text-brand-navy mb-6">
              {cms.contactInfo?.officeName || "Saudagar Properties Pvt. Ltd"}
            </h3>
            <p className="text-brand-slate leading-relaxed mb-8">
              Whether you are looking to invest in DLF Phase 1-5, require commercial space, or need expert property valuation, our founders are personally available to guide you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-brand-cream-border shadow-sm hover:shadow-md hover:border-brand-gold/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-ivory-warm flex items-center justify-center shrink-0">
                <MapPin className="text-brand-gold" size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-navy mb-1">
                  {cms.contactInfo?.officeBadge || "Headquarters"}
                </h4>
                <p className="text-sm text-brand-slate leading-relaxed">
                  {cms.contactInfo?.address || "38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-brand-cream-border shadow-sm hover:shadow-md hover:border-brand-gold/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-ivory-warm flex items-center justify-center shrink-0">
                <Phone className="text-brand-gold" size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-navy mb-1">
                  {cms.contactInfo?.phoneBadge || "Phone"}
                </h4>
                <div className="flex flex-col gap-1">
                  <a href={`tel:${cms.contactInfo?.phone1 || '+919718511207'}`} className="text-sm text-brand-slate hover:text-brand-gold transition-colors">
                    {cms.contactInfo?.phone1 || "+91 97185 11207"}
                  </a>
                  <a href={`tel:${cms.contactInfo?.phone2 || '+919811221207'}`} className="text-sm text-brand-slate hover:text-brand-gold transition-colors">
                    {cms.contactInfo?.phone2 || "+91 98112 21207"}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-brand-cream-border shadow-sm hover:shadow-md hover:border-brand-gold/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-ivory-warm flex items-center justify-center shrink-0">
                <Mail className="text-brand-gold" size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-brand-navy mb-1">
                  {cms.contactInfo?.emailBadge || "Email"}
                </h4>
                <a href={`mailto:${cms.contactInfo?.email || 'Saudagar.Properties@Yahoo.In'}`} className="text-sm text-brand-slate hover:text-brand-gold transition-colors">
                  {cms.contactInfo?.email || "Saudagar.Properties@Yahoo.In"}
                </a>
              </div>
            </div>

            {cms.contactInfo?.hours && (
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-brand-cream-border shadow-sm hover:shadow-md hover:border-brand-gold/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-ivory-warm flex items-center justify-center shrink-0">
                  <Clock className="text-brand-gold" size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-navy mb-1">
                    {cms.contactInfo?.hoursBadge || "Office Timings"}
                  </h4>
                  <p className="text-sm text-brand-slate leading-relaxed">
                    {cms.contactInfo?.hours}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div ref={formBoxRef} className="lg:col-span-7">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-brand-cream-border">
            <h3 className="text-2xl font-serif text-brand-navy mb-2">{cms.form?.title || "Send an Inquiry"}</h3>
            <p className="text-xs text-brand-slate-light mb-6">{cms.form?.subtitle || "Fill out the form below and an executive advisor will contact you within 2 hours."}</p>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-brand-navy">Inquiry Received!</h4>
                <p className="text-brand-slate max-w-sm">
                  Your details have been securely sent to our team. For an instant response, you can forward this message directly to our founders via WhatsApp.
                </p>
                <div className="flex justify-center w-full pt-4">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon size={20} />
                    <span>Connect instantly on WhatsApp</span>
                  </a>
                </div>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '', purpose: 'Buy', propertyType: 'Luxury Builder Floor', budget: '₹5 Cr - ₹10 Cr' }); }}
                  className="text-sm text-brand-gold font-semibold hover:underline mt-4 cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Full Name *</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy"
                      placeholder="Arjun Singhania"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Phone Number *</label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy"
                      placeholder="+91 98123 45678"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Email Address *</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy"
                    placeholder="arjun.s@example.in"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-purpose" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Purpose</label>
                    <div className="relative">
                      <select 
                        id="contact-purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy appearance-none cursor-pointer"
                      >
                        <option>Buy</option>
                        <option>Sell</option>
                        <option>Rent / Lease</option>
                        <option>General Inquiry</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-slate">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="contact-property-type" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Property Type</label>
                    <div className="relative">
                      <select 
                        id="contact-property-type"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy appearance-none cursor-pointer"
                      >
                        <option>Luxury Builder Floor</option>
                        <option>Independent Villa</option>
                        <option>Commercial Space</option>
                        <option>Plot / Land</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-slate">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-budget" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Budget</label>
                    <div className="relative">
                      <select 
                        id="contact-budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy appearance-none cursor-pointer"
                      >
                        <option>Under ₹5 Cr</option>
                        <option>₹5 Cr - ₹10 Cr</option>
                        <option>₹10 Cr - ₹25 Cr</option>
                        <option>₹25 Cr+</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-slate">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Message *</label>
                  <textarea 
                    id="contact-message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-brand-cream-border bg-brand-ivory-warm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-colors text-brand-navy resize-none"
                    placeholder="Tell us about your exact property requirements, preferred locations within DLF, or any specific amenities you need..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-navy-deep rounded-xl font-bold tracking-widest uppercase text-xs transition-colors duration-300 shadow-lg shadow-brand-gold/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
