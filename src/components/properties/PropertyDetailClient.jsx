"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Calendar,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/icons/WhatsAppIcon';
import api from '@/services/api';

export default function PropertyDetailClient({ property }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleSent, setScheduleSent] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    notes: ''
  });

  // Collect authentic gallery photography only (zero stock photos)
  const allImages = React.useMemo(() => {
    const list = [];
    if (property.img && typeof property.img === 'string' && !property.img.includes('unsplash.com')) {
      list.push(property.img);
    }
    if (Array.isArray(property.images)) {
      property.images.forEach(img => {
        if (img && typeof img === 'string' && !list.includes(img) && !img.includes('unsplash.com')) {
          list.push(img);
        }
      });
    }
    return list;
  }, [property]);

  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance gallery photography every 4.5 seconds
  React.useEffect(() => {
    if (allImages.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % allImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [allImages.length, isHovered]);

  // Normalize features into clean editorial list
  const featuresList = React.useMemo(() => {
    if (Array.isArray(property.features) && property.features.length > 0) {
      return property.features;
    }
    if (typeof property.features === 'string' && property.features.trim()) {
      return property.features.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [
      "Private elevator landing with digital access control",
      "Italian Statuario & Botticino marble living expanses",
      "100% DG power backup with automatic transfer switch",
      "Dedicated stilt staff quarters with en-suite bath",
      "Custom Italian modular kitchen with integrated appliances",
      "Vastu-harmonized orientation and layout",
      "Schüco / Fenesta double-glazed acoustic sound insulation",
      "24/7 Gated sector surveillance and perimeter security"
    ];
  }, [property.features]);

  // Normalize landmarks
  const landmarksList = React.useMemo(() => {
    if (Array.isArray(property.nearbyLandmarks) && property.nearbyLandmarks.length > 0) {
      return property.nearbyLandmarks;
    }
    if (typeof property.nearbyLandmarks === 'string' && property.nearbyLandmarks.trim()) {
      return property.nearbyLandmarks.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    }
    return [
      "DLF Cyber City & Cyber Hub — 5 Mins",
      "MG Road & Sikanderpur Rapid Metro — 4 Mins",
      "Galleria Market & Cross Point — 6 Mins",
      "The Shri Ram & Shiv Nadar Schools — 8 Mins",
      "Fortis & Max Super Speciality Hospital — 10 Mins"
    ];
  }, [property.nearbyLandmarks]);
  const corridorHref = React.useMemo(() => {
    const l = (property.location || '').toLowerCase();
    if (l.includes('phase 1') || l.includes('phase1')) return '/property/dlf-phase-1';
    if (l.includes('phase 2')) return '/property/dlf-phase-2';
    if (l.includes('phase 3')) return '/property/dlf-phase-3';
    if (l.includes('phase 4')) return '/property/dlf-phase-4';
    if (l.includes('sushant lok') || l.includes('shushant')) return '/property/shushant-lok';
    if (l.includes('udyog vihar')) return '/property/udyog-vihar';
    return null;
  }, [property.location]);

  const whatsappInquiryUrl = `https://wa.me/919718511207?text=${encodeURIComponent(
    `Hello Saudagar Properties, I am interested in private inspection of "${property.title}" (${property.location}, Valuation: ${property.price}). Please share the structural floor plan and available viewing slots.`
  )}`;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleLoading(true);
    setScheduleError('');

    try {
      const cleanPhone = scheduleForm.phone.replace(/\D/g, '');
      const userEnteredEmail = scheduleForm.email?.trim();
      const clientEmail = userEnteredEmail || (cleanPhone ? `${cleanPhone}@lead.saudagarproperties.com` : 'viewing.lead@saudagarproperties.com');

      await api.createInquiry({
        type: 'property_inquiry',
        propertyTitle: property.title,
        name: scheduleForm.name,
        phone: scheduleForm.phone,
        email: clientEmail,
        preferredDate: scheduleForm.preferredDate || 'Flexible',
        source: `Property Detail - ${property.title}`,
        message: `[Private Viewing Request]\nProperty: ${property.title}\nLocation: ${property.location}\nValuation: ${property.price}\nPreferred Date: ${scheduleForm.preferredDate || 'Flexible'}\nNotes: ${scheduleForm.notes || 'None'}`
      });

      setScheduleSent(true);
      setTimeout(() => {
        setIsScheduleOpen(false);
        setScheduleSent(false);
        setScheduleForm({ name: '', phone: '', email: '', preferredDate: '', notes: '' });
      }, 3000);
    } catch (err) {
      console.error('Schedule viewing submission error:', err);
      setScheduleError(err.message || 'Unable to submit viewing request. Please reach out via WhatsApp or call us directly.');
    } finally {
      setScheduleLoading(false);
    }
  };

  // Structured specification pairs
  const specifications = [
    { label: "Configuration", value: property.bhk || "4 BHK Luxury" },
    { label: "Plot Area", value: property.plotArea || "500 Sq. Yds." },
    { label: "Built-Up Area", value: property.builtUpArea || "3,800 Sq. Ft." },
    { label: "Bathrooms", value: property.bathrooms || "4 En-Suite" },
    { label: "Orientation", value: property.facing || "North-East (Park Facing)" },
    { label: "Floor Level", value: property.floor || "2nd Floor (Stilt + 4)" },
    { label: "Furnishing Status", value: property.furnishing || "Designer Semi-Furnished" },
    { label: "Car Parking", value: property.parking || "2 Covered Stilt Bays" },
    { label: "Possession", value: property.possession || "Immediate Possession" },
    { label: "Title Status", value: property.reraNumber || "Freehold Title Verified" },
  ];

  return (
    <div className="w-full min-h-screen bg-brand-ivory text-brand-navy pb-24 selection:bg-brand-gold selection:text-brand-navy-deep">
      
      {/* =========================================================================
          SECTION 1: EDITORIAL HEADER
      ========================================================================= */}
      <section 
        className="relative overflow-hidden bg-brand-obsidian text-white pt-28 pb-12 sm:pt-32 sm:pb-16 border-b border-white/10"
      >
        {/* Architectural Backdrop Image */}
        {(property?.image || property?.images?.[0]) && (
          <div className="absolute inset-0 z-0 opacity-60 pointer-events-none select-none">
            <Image
              src={property.image || property.images[0]}
              alt={property.imgAlt || (property.imagesAlt && property.imagesAlt[0]) || property.title}
              fill
              priority
              sizes="100vw"
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-obsidian/95 via-brand-obsidian/75 to-brand-obsidian/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-brand-obsidian/70" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar: Clean Breadcrumb & Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
              <span className="text-slate-600">/</span>
              <Link href="/properties" className="hover:text-brand-gold transition-colors">Properties</Link>
              <span className="text-slate-600">/</span>
              {corridorHref ? (
                <>
                  <Link href={corridorHref} className="hover:text-brand-gold transition-colors">{property.location}</Link>
                  <span className="text-slate-600">/</span>
                  <span className="text-brand-gold truncate max-w-[200px] sm:max-w-xs">{property.title}</span>
                </>
              ) : (
                <span className="text-brand-gold truncate max-w-[200px] sm:max-w-xs">{property.location}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={13} className="text-brand-gold" /> : <Share2 size={13} />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>

              <Link
                href="/properties"
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>All Properties</span>
              </Link>
            </div>
          </div>

          {/* Title and Price */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="max-w-3xl space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-gold">
                {property.location} • {property.category ? `${property.category} Property` : 'Residential Luxury'}
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.14]">
                {property.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans pt-1">
                {property.specs || `${property.bhk || '4 BHK'} • ${property.plotArea || '500 Sq. Yds.'}`}
              </p>
            </div>

            {/* Valuation */}
            <div className="lg:text-right shrink-0 pt-2 lg:pt-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
                Asking Valuation
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-gold tracking-tight">
                {property.price}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Clear Freehold Title
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: IMAGE SHOWCASE
      ========================================================================= */}
      <section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"
      >
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-brand-cream-border shadow-sm">
          {/* Main Viewer */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-900 mb-4 border border-brand-cream-border/50 select-none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIdx}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <div className="w-full h-full relative overflow-hidden bg-slate-100">
                  <Image
                    src={allImages[activeImageIdx] || property.img}
                    alt={(property.imagesAlt && property.imagesAlt[activeImageIdx]) || (activeImageIdx === 0 ? property.imgAlt : null) || `${property.title} - View ${activeImageIdx + 1}`}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="w-full h-full object-cover object-center"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Manual Navigation Controls */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg hover:scale-105"
                  aria-label="Previous property photo"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((prev) => (prev + 1) % allImages.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg hover:scale-105"
                  aria-label="Next property photo"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Bottom Meta Pill & Auto-Advance Progress */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 font-sans">
              <span>{activeImageIdx + 1} of {allImages.length}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{property.location}</span>
              {allImages.length > 1 && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-brand-gold text-[11px] font-medium tracking-wide">
                    {isHovered ? "Paused" : "Auto-advance"}
                  </span>
                </>
              )}
            </div>

            {/* Subtle Time Progression Bar */}
            {allImages.length > 1 && !isHovered && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
                <motion.div
                  key={activeImageIdx}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  className="h-full bg-brand-gold"
                />
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 luxury-scrollbar">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-24 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-brand-gold shadow-sm scale-[1.02]'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <div className="relative w-full h-full bg-slate-100 overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={(property.imagesAlt && property.imagesAlt[idx]) || `${property.title} — Photo ${idx + 1}`}
                      fill
                      sizes="112px"
                      className="object-cover object-center"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: ARCHITECTURAL CONTENT GRID
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          
          {/* LEFT 2 COLUMNS: SPECIFICATIONS, DESCRIPTION, INCLUSIONS */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Architectural Specifications Table */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-border shadow-sm"
            >
              <h2 className="text-xl font-serif font-bold text-brand-navy mb-6 pb-3 border-b border-brand-cream-border">
                Property Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                {specifications.map((spec, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-baseline justify-between py-2 border-b border-brand-ivory text-xs sm:text-sm"
                  >
                    <span className="text-brand-slate font-medium">{spec.label}</span>
                    <span className="font-semibold text-brand-navy text-right font-serif">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Editorial Narrative */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-border shadow-sm space-y-4"
            >
              <h2 className="text-xl font-serif font-bold text-brand-navy pb-3 border-b border-brand-cream-border">
                Architectural Overview
              </h2>
              
              <div className="text-sm sm:text-base text-brand-slate leading-relaxed font-sans whitespace-pre-wrap">
                {property.desc}
              </div>
            </motion.div>

            {/* Key Inclusions & Features */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-border shadow-sm"
            >
              <h2 className="text-xl font-serif font-bold text-brand-navy mb-6 pb-3 border-b border-brand-cream-border">
                Key Inclusions &amp; Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {featuresList.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-slate">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Strategic Landmarks */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream-border shadow-sm"
            >
              <h2 className="text-xl font-serif font-bold text-brand-navy mb-6 pb-3 border-b border-brand-cream-border">
                Proximity &amp; Connectivity
              </h2>

              <div className="space-y-3">
                {landmarksList.map((landmark, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-slate py-1 border-b border-brand-ivory last:border-none">
                    <MapPin size={13} className="text-brand-gold shrink-0" />
                    <span>{landmark}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: STICKY PRIVATE VIEWING CARD */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-brand-cream-border shadow-md space-y-6"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold mb-1">
                  Private Client Desk
                </p>
                <h3 className="text-xl font-serif font-bold text-brand-navy">
                  Inquire or Schedule Viewing
                </h3>
                <p className="text-xs text-brand-slate mt-1.5 leading-relaxed">
                  Connect with our senior partners for verified title records and discreet on-site viewings.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Authentic WhatsApp Button */}
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <WhatsAppIcon size={16} />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Call Button */}
                <a
                  href="tel:+919811221207"
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-obsidian hover:bg-brand-navy text-brand-ivory font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone size={14} className="text-brand-gold" />
                  <span>Call +91 98112 21207</span>
                </a>

                {/* Schedule Viewing Modal Trigger */}
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-brand-ivory hover:bg-brand-cream text-brand-navy border border-brand-cream-border font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Calendar size={14} className="text-brand-gold" />
                  <span>Request Private Viewing</span>
                </button>
              </div>

              <div className="pt-4 border-t border-brand-cream-border text-[11px] text-brand-slate-light space-y-1">
                <p>• 100% Freehold Title Verification</p>
                <p>• Direct Partner Accompaniment</p>
                <p>• Confidential Buyer Privacy Guaranteed</p>
              </div>

              {corridorHref && (
                <div className="pt-4 mt-4 border-t border-brand-cream-border">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-gold-deep mb-2">Micro-Market Hub</p>
                  <Link
                    href={corridorHref}
                    className="group flex items-center justify-between p-3 rounded-xl bg-brand-ivory hover:bg-brand-gold/10 border border-brand-cream-border hover:border-brand-gold/30 transition-all text-xs font-semibold text-brand-navy"
                  >
                    <span>Explore all {property.location} listings</span>
                    <ChevronRight size={14} className="text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SCHEDULE VIEWING MODAL
      ========================================================================= */}
      <AnimatePresence>
        {isScheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-cream-border"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-cream-border mb-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-navy">
                    Schedule Private Inspection
                  </h3>
                  <p className="text-xs text-brand-slate mt-0.5">{property.title}</p>
                </div>
                <button
                  onClick={() => setIsScheduleOpen(false)}
                  className="w-8 h-8 rounded-full bg-brand-ivory hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {scheduleSent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-brand-navy">
                    Inspection Request Received
                  </h4>
                  <p className="text-xs text-brand-slate">
                    Our advisory desk will confirm your preferred viewing slot shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-brand-navy font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajiv Malhotra"
                      value={scheduleForm.name}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-cream-border text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-navy font-semibold mb-1">Contact Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={scheduleForm.phone}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-cream-border text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-navy font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. rajiv@example.com"
                      value={scheduleForm.email}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-cream-border text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-navy font-semibold mb-1">Preferred Date / Time</label>
                    <input
                      type="date"
                      value={scheduleForm.preferredDate}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-cream-border text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-navy font-semibold mb-1">Special Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Prefer afternoon viewing, require floor plans in advance"
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-cream-border text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  {scheduleError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium">
                      {scheduleError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={scheduleLoading}
                    className="w-full py-3.5 rounded-xl bg-brand-obsidian hover:bg-brand-gold disabled:opacity-60 disabled:cursor-not-allowed text-white hover:text-brand-obsidian font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    {scheduleLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>Confirm Private Viewing Request</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
