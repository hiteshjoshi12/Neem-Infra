"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, Sparkles } from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import api from '@/services/api';

export default function LeadInquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only suppress if user has already submitted an inquiry in current browser session
    try {
      const isSubmitted = sessionStorage.getItem('sp_lead_popup_submitted');
      if (isSubmitted === 'true') return;
    } catch {
      // Ignore if sessionStorage is not accessible
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();
    const fullName = [trimmedFirstName, trimmedLastName].filter(Boolean).join(' ');
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!trimmedFirstName) {
      setError('Please provide your first name.');
      return;
    }

    if (!phone && !email) {
      setError('Please provide either your phone number or email address so we can reach you.');
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    setLoading(true);

    try {
      await api.createInquiry({
        name: fullName,
        phone: phone,
        email: email,
        message: message || 'Inquiry submitted from homepage consultation popup.',
        source: 'Homepage 5s Popup',
        type: 'consultation',
      });

      setSubmitted(true);
      try {
        sessionStorage.setItem('sp_lead_popup_dismissed', 'true');
      } catch {
        // Ignore
      }
    } catch (err) {
      console.error('[Lead Popup Submission Error]:', err);
      setError(err.message || 'Failed to send inquiry. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp quick connection URL
  const fullName = [formData.firstName.trim(), formData.lastName.trim()].filter(Boolean).join(' ');
  const formattedWhatsappMsg = `*New Inquiry from Website Popup*%0A%0A*Name:* ${encodeURIComponent(fullName)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Message:* ${encodeURIComponent(formData.message || 'Interested in properties')}`;
  const whatsappUrl = `https://wa.me/919718511207?text=${formattedWhatsappMsg}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-popup-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-brand-obsidian/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-brand-navy-deep border border-brand-gold/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_30px_rgba(240,185,43,0.12)] p-6 sm:p-8 text-white z-10"
          >
            {/* Ambient Gold Radial Accents */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-brand-gold/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-brand-gold/10 blur-3xl"
            />

            {/* Close Button (X) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10 hover:scale-105 active:scale-95"
            >
              <X size={18} />
            </button>

            {submitted ? (
              /* Success Screen */
              <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold mb-1">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-brand-text-on-dark-muted max-w-sm leading-relaxed">
                  Thank you for reaching out. Our DLF Gurugram luxury real estate experts will connect with you shortly.
                </p>

                <div className="w-full pt-4 space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon size={18} />
                    <span>Connect Instantly on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Form Screen */
              <div>
                {/* Header */}
                <div className="text-center pr-6 pl-2 sm:px-6 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold mb-2.5">
                    <Sparkles size={12} />
                    <span>DLF Advisory Desk</span>
                  </div>

                  <h2
                    id="lead-popup-title"
                    className="font-serif text-2xl sm:text-3xl font-bold !text-white tracking-tight leading-tight"
                  >
                    Get In Touch With Us!
                  </h2>

                  <p className="mt-2.5 text-xs sm:text-sm !text-slate-200 leading-relaxed max-w-md mx-auto">
                    Looking to <span className="font-bold !text-brand-gold">Buy, Sell, Rent, or Invest</span> in real estate? Fill in the details below, and our experts will reach out to you!
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-4 p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center justify-between">
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        aria-label="First Name"
                        className="w-full px-4 py-3 rounded-xl bg-white text-brand-slate placeholder:text-slate-400 font-medium text-sm border border-transparent focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        aria-label="Last Name"
                        className="w-full px-4 py-3 rounded-xl bg-white text-brand-slate placeholder:text-slate-400 font-medium text-sm border border-transparent focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      aria-label="Phone Number"
                      className="w-full px-4 py-3 rounded-xl bg-white text-brand-slate placeholder:text-slate-400 font-medium text-sm border border-transparent focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all shadow-xs"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      aria-label="Email Address"
                      className="w-full px-4 py-3 rounded-xl bg-white text-brand-slate placeholder:text-slate-400 font-medium text-sm border border-transparent focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all shadow-xs"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Message"
                      aria-label="Message"
                      className="w-full px-4 py-3 rounded-xl bg-white text-brand-slate placeholder:text-slate-400 font-medium text-sm border border-transparent focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all resize-none shadow-xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-brand-navy-deep/30 border-t-brand-navy-deep rounded-full animate-spin" />
                          <span>Sending...</span>
                        </span>
                      ) : (
                        <>
                          <span>Send</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Confidentiality & Call Note */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>🔒 100% Confidential Advisory</span>
                  <a
                    href="tel:+919811221207"
                    className="text-brand-gold hover:underline flex items-center gap-1"
                  >
                    <Phone size={10} />
                    <span>+91 98112 21207</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
