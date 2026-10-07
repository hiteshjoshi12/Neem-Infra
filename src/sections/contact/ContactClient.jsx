"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap/animations";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { animate, inView, stagger } from 'framer-motion';
import api from '@/services/api';

export default function ContactClient() {
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
  const whatsappUrl = `https://wa.me/919718511207?text=${formattedMessage}`;

  return (
    <>
      {/* Page Header */}
      <div className="pt-32 pb-16 bg-[#1D263B] text-white text-center px-4">
        <div ref={headerRef} className="max-w-3xl mx-auto">
          {/* Illuminated Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <Link href="/" className="hover:text-[#D09A16] transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#D09A16] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16] shadow-[0_0_8px_#D09A16]" />
              <span>Contact Us</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-[#CBD5E1] max-w-2xl mx-auto text-sm md:text-base font-light">
            Get in touch with Saudagar Properties for premium real estate advisory in Gurugram. We are here to assist you with buying, selling, or leasing luxury properties.
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
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#D09A16] uppercase mb-2">Get in Touch</h2>
            <h3 className="text-3xl font-serif text-[#1D263B] mb-6">Reach Out Directly</h3>
            <p className="text-[#475569] leading-relaxed mb-8">
              Whether you are looking to invest in DLF Phase 1-5, require commercial space, or need expert property valuation, our founders are personally available to guide you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[#E8E4DA] shadow-sm hover:shadow-md hover:border-[#D09A16]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <MapPin className="text-[#D09A16]" size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1D263B] mb-1">Headquarters</h4>
                <p className="text-sm text-[#475569] leading-relaxed">
                  38, Akashneem Marg<br />
                  DLF Phase 2<br />
                  Gurugram, Haryana 122002
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[#E8E4DA] shadow-sm hover:shadow-md hover:border-[#D09A16]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <Phone className="text-[#D09A16]" size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1D263B] mb-1">Phone</h4>
                <div className="flex flex-col gap-1">
                  <a href="tel:+919718511207" className="text-sm text-[#475569] hover:text-[#D09A16] transition-colors">+91 97185 11207</a>
                  <a href="tel:+919811221207" className="text-sm text-[#475569] hover:text-[#D09A16] transition-colors">+91 98112 21207</a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[#E8E4DA] shadow-sm hover:shadow-md hover:border-[#D09A16]/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <Mail className="text-[#D09A16]" size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1D263B] mb-1">Email</h4>
                <a href="mailto:saudagar.properties@yahoo.in" className="text-sm text-[#475569] hover:text-[#D09A16] transition-colors">
                  saudagar.properties@yahoo.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div ref={formBoxRef} className="lg:col-span-7">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E8E4DA]">
            <h3 className="text-2xl font-serif text-[#1D263B] mb-6">Send an Inquiry</h3>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-[#1D263B]">Inquiry Received!</h4>
                <p className="text-[#475569] max-w-sm">
                  Your details have been securely sent to our team. For an instant response, you can forward this message directly to our founders via WhatsApp.
                </p>
                <div className="flex justify-center w-full pt-4">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    <span>Connect instantly on WhatsApp</span>
                  </a>
                </div>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '', purpose: 'Buy', propertyType: 'Luxury Builder Floor', budget: '₹5 Cr - ₹10 Cr' }); }}
                  className="text-sm text-[#D09A16] font-semibold hover:underline mt-4 cursor-pointer"
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
                    <label htmlFor="contact-name" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Full Name *</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B]"
                      placeholder="Arjun Singhania"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Phone Number *</label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B]"
                      placeholder="+91 98123 45678"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Email Address *</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B]"
                    placeholder="arjun.s@example.in"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-purpose" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Purpose</label>
                    <div className="relative">
                      <select 
                        id="contact-purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B] appearance-none cursor-pointer"
                      >
                        <option>Buy</option>
                        <option>Sell</option>
                        <option>Rent / Lease</option>
                        <option>General Inquiry</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569]">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="contact-property-type" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Property Type</label>
                    <div className="relative">
                      <select 
                        id="contact-property-type"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B] appearance-none cursor-pointer"
                      >
                        <option>Luxury Builder Floor</option>
                        <option>Independent Villa</option>
                        <option>Commercial Space</option>
                        <option>Plot / Land</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569]">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-budget" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Budget</label>
                    <div className="relative">
                      <select 
                        id="contact-budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B] appearance-none cursor-pointer"
                      >
                        <option>Under ₹5 Cr</option>
                        <option>₹5 Cr - ₹10 Cr</option>
                        <option>₹10 Cr - ₹25 Cr</option>
                        <option>₹25 Cr+</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569]">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-[#1D263B] uppercase tracking-wider">Message *</label>
                  <textarea 
                    id="contact-message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E8E4DA] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D09A16]/30 focus:border-[#D09A16] transition-colors text-[#1D263B] resize-none"
                    placeholder="Tell us about your exact property requirements, preferred locations within DLF, or any specific amenities you need..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#D09A16] hover:bg-[#D09A16] text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-colors duration-300 shadow-[0_10px_30px_rgba(208, 154, 22,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
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
