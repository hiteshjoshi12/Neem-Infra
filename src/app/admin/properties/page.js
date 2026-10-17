"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Building,
  CheckCircle2,
  X,
  ExternalLink,
  MapPin,
  RefreshCw
} from 'lucide-react';
import api from '@/services/api';
import { useCms } from '@/context/CmsContext';
import Image from 'next/image';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const { refetch } = useCms();

  const initialForm = {
    title: '',
    slug: '',
    price: '',
    location: 'DLF Phase 2, Gurugram',
    specs: '4 BHK • 4 Baths • 500 Sq. Yds.',
    tag: 'Exclusive Floor',
    desc: '',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    link: '/properties',
    category: 'residential',
    bhk: '4 BHK',
    bathrooms: '4 Baths',
    plotArea: '500 Sq. Yds.',
    builtUpArea: '3,800 Sq. Ft.',
    facing: 'North-East Facing',
    floor: '2nd Floor of 4',
    furnishing: 'Semi-Furnished (Italian Modular Kitchen)',
    parking: '2 Covered Stilt Car Parks',
    possession: 'Ready to Move (Immediate)',
    reraNumber: 'Freehold Municipal Sanction • Clean Title',
    features: 'Private Automated Elevator, Italian Botticino Marble, 100% DG Power Backup, Dedicated Servant Room, Vastu Compliant',
    nearbyLandmarks: 'DLF Cyber City — 6 Mins\nMG Road Metro Station — 4 Mins\nGalleria Market — 8 Mins\nFortis & Max Hospital — 10 Mins',
    images: '',
    order: 0,
    isActive: true,
    isFeatured: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getProperties({ all: true });
      if (res.success && res.data) {
        setProperties(res.data);
      }
    } catch (err) {
      console.warn('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await api.getProperties({ all: true });
        if (!ignore && res.success && res.data) {
          setProperties(res.data);
        }
      } catch (err) {
        console.warn('Error fetching properties:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (prop) => {
    setEditingId(prop._id);
    setFormData({
      title: prop.title || '',
      slug: prop.slug || '',
      price: prop.price || '',
      location: prop.location || '',
      specs: prop.specs || '',
      tag: prop.tag || '',
      desc: prop.desc || '',
      img: prop.img || '',
      link: prop.link || '/properties',
      category: prop.category || 'residential',
      bhk: prop.bhk || '',
      bathrooms: prop.bathrooms || '',
      plotArea: prop.plotArea || '',
      builtUpArea: prop.builtUpArea || '',
      facing: prop.facing || '',
      floor: prop.floor || '',
      furnishing: prop.furnishing || '',
      parking: prop.parking || '',
      possession: prop.possession || '',
      reraNumber: prop.reraNumber || '',
      features: Array.isArray(prop.features) ? prop.features.join(', ') : (prop.features || ''),
      nearbyLandmarks: Array.isArray(prop.nearbyLandmarks) ? prop.nearbyLandmarks.join('\n') : (prop.nearbyLandmarks || ''),
      images: Array.isArray(prop.images) ? prop.images.join('\n') : (prop.images || ''),
      order: prop.order || 0,
      isActive: prop.isActive !== undefined ? prop.isActive : true,
      isFeatured: prop.isFeatured !== undefined ? prop.isFeatured : true
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        features: typeof formData.features === 'string'
          ? formData.features.split(',').map(s => s.trim()).filter(Boolean)
          : formData.features,
        nearbyLandmarks: typeof formData.nearbyLandmarks === 'string'
          ? formData.nearbyLandmarks.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
          : formData.nearbyLandmarks,
        images: typeof formData.images === 'string'
          ? formData.images.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
          : formData.images,
      };

      if (editingId) {
        await api.updateProperty(editingId, payload);
        setToast('Property updated successfully!');
      } else {
        await api.createProperty(payload);
        setToast('Property added successfully!');
      }
      closeModal();
      await fetchProperties();
      await refetch();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.deleteProperty(id);
      setToast('Property deleted successfully');
      await fetchProperties();
      await refetch();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#D09A16] uppercase mb-2">
            <Building size={12} />
            <span>Inventory Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Properties & Listings
          </h1>
          <p className="text-xs text-slate-400">
            Control the luxury floors, penthouses, and villas displayed across the 3D showcase
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(208, 154, 22,0.3)] active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Properties Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-[#D09A16]" />
          <span>Loading luxury portfolio...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#121724] border border-white/10 text-center">
          <p className="text-sm text-slate-300 mb-4">No properties listed yet.</p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#D09A16] text-[#0C101A] text-xs font-bold uppercase tracking-wider"
          >
            Create First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop._id}
              className="rounded-3xl bg-[#121724] border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-[#D09A16]/50 transition-all duration-300"
            >
              {/* Image Preview with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-[#0C101A]">
                <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" width={800} height={600}
                  src={prop.img}
                  alt={prop.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-[#1D263B]/90 backdrop-blur-md text-[10px] font-bold text-[#D09A16] uppercase tracking-wider border border-white/10">
                    {prop.tag || 'Luxury'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    prop.isActive ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                  }`}>
                    {prop.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D09A16] font-serif font-bold text-sm">
                  {prop.price}
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-white line-clamp-1 mb-1">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
                    <MapPin size={13} className="text-[#D09A16] shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-light line-clamp-2 leading-relaxed">
                    {prop.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[160px]">{prop.specs}</span>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(prop)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-[#D09A16] hover:text-[#0C101A] text-slate-300 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(prop._id, prop.title)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-300 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Create/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#141A29] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {editingId ? 'Edit Luxury Property Dossier' : 'Add New Luxury Property Listing'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in architectural specifications, transit landmarks, amenities & gallery images to build the luxury details page.
                  </p>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {/* PART 1: CORE COMMERCIAL IDENTIFIERS */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#D09A16] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16]" />
                    <span>1. Core Listing Information</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Property Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="4 BHK Luxury Independent Floor in DLF Phase 1"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Custom URL Slug (Optional)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. 4-bhk-floor-dlf-phase-1"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Benchmark Ask / Price *</label>
                      <input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="₹4.25 Cr"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Location / Micro-Market *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="DLF Phase 1, Gurugram"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Asset Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#121724] border border-white/20 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      >
                        <option value="residential">Builder Floor</option>
                        <option value="villa">Luxury Villa / Kothi</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="commercial">Commercial Hub</option>
                        <option value="industrial">Industrial Asset</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={formData.tag}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        placeholder="FOR SALE • DLF PHASE 1"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Catalog Specs Summary</label>
                      <input
                        type="text"
                        value={formData.specs}
                        onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                        placeholder="4 BHK • 4 Baths • 500 Sq. Yds."
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>
                  </div>
                </div>

                {/* PART 2: ARCHITECTURAL SPECIFICATIONS (BUILDS VIEW DETAILS PAGE) */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-[11px] font-bold text-[#D09A16] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16]" />
                    <span>2. Architectural & Unit Specifications</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Configuration (BHK)</label>
                      <input
                        type="text"
                        value={formData.bhk}
                        onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                        placeholder="4 BHK"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Bathrooms</label>
                      <input
                        type="text"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        placeholder="4 Baths + Powder"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Plot Area</label>
                      <input
                        type="text"
                        value={formData.plotArea}
                        onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
                        placeholder="500 Sq. Yds."
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Built-Up Area</label>
                      <input
                        type="text"
                        value={formData.builtUpArea}
                        onChange={(e) => setFormData({ ...formData, builtUpArea: e.target.value })}
                        placeholder="3,800 Sq. Ft."
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Facing / Orientation</label>
                      <input
                        type="text"
                        value={formData.facing}
                        onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                        placeholder="North-East (Park Facing)"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Floor Level</label>
                      <input
                        type="text"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        placeholder="2nd Floor of 4"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Furnishing Status</label>
                      <input
                        type="text"
                        value={formData.furnishing}
                        onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                        placeholder="Semi-Furnished (Italian Modular)"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Dedicated Parking</label>
                      <input
                        type="text"
                        value={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                        placeholder="2 Stilt Car Parks"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Possession Status</label>
                      <input
                        type="text"
                        value={formData.possession}
                        onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                        placeholder="Ready to Move (Immediate / OC Received)"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">RERA / Sanction Number</label>
                      <input
                        type="text"
                        value={formData.reraNumber}
                        onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                        placeholder="Freehold Municipal Sanction • Clean 30-Yr Title"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>
                  </div>
                </div>

                {/* PART 3: AMENITIES & TRANSIT CONNECTIVITY */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-[11px] font-bold text-[#D09A16] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16]" />
                    <span>3. Key Amenities & Nearby Landmarks</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Curated Features & Amenities (Comma-separated)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        placeholder="Private Automated Elevator, Italian Botticino Marble, 100% DG Power Backup, Dedicated Servant Room, Vastu-Compliant"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Transit & Landmarks (Comma or Newline-separated)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.nearbyLandmarks}
                        onChange={(e) => setFormData({ ...formData, nearbyLandmarks: e.target.value })}
                        placeholder="DLF Cyber City — 6 Mins&#10;MG Road Metro Station — 4 Mins&#10;Shiv Nadar School — 8 Mins&#10;Fortis & Max Hospital — 10 Mins"
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-[#D09A16]"
                      />
                    </div>
                  </div>
                </div>

                {/* PART 4: IMAGERY & MEDIA */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-[11px] font-bold text-[#D09A16] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16]" />
                    <span>4. Gallery & Media Assets (ImageKit Enabled)</span>
                  </h4>
                  <div className="space-y-4">
                    <ImageUploadInput
                      label="Primary Cover Image *"
                      value={formData.img}
                      onChange={(url) => setFormData({ ...formData, img: url })}
                      folder="/saudagar-properties/properties"
                      placeholder="Browse or upload cover image..."
                    />

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        Additional Gallery Image URLs (Newline or comma separated)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                        placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                        className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-[#D09A16] mb-2 font-mono text-xs"
                      />
                      <ImageUploadInput
                        label="Browse & Add Gallery Photo"
                        value=""
                        onChange={(url) => {
                          if (url) {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images ? `${prev.images}\n${url}` : url
                            }));
                          }
                        }}
                        folder="/saudagar-properties/properties"
                        placeholder="Browse to upload and append a gallery photo..."
                      />
                    </div>
                  </div>
                </div>

                {/* PART 5: ARCHITECTURAL OVERVIEW */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-[11px] font-bold text-[#D09A16] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D09A16]" />
                    <span>5. Architectural Narrative & Overview *</span>
                  </h4>
                  <div>
                    <textarea
                      rows={3}
                      required
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      placeholder="Newly constructed, ready-to-move builder floor strategically located in DLF Phase 1. Park facing with top schools & markets nearby. Featuring expansive balconies, independent terrace rights, dedicated stilt car parking..."
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>
                </div>

                {/* PART 6: PUBLISHING STATUS */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[#D09A16]"
                    />
                    <span>Active & Visible on Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#D09A16]"
                    />
                    <span>Highlight in Featured Portfolio</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#D09A16] hover:bg-[#E5AC2B] text-[#0C101A] font-bold uppercase tracking-wider transition-colors disabled:opacity-60 cursor-pointer shadow-md"
                  >
                    {submitting ? 'Saving Property...' : editingId ? 'Update Property Dossier' : 'Create Property Dossier'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


