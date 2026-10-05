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
    price: '',
    location: 'DLF Phase 2, Gurugram',
    specs: '4 BHK • 3,200 Sq.Ft',
    tag: 'Luxury Floor',
    desc: '',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    link: '/ready-to-move',
    category: 'residential',
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
      price: prop.price || '',
      location: prop.location || '',
      specs: prop.specs || '',
      tag: prop.tag || '',
      desc: prop.desc || '',
      img: prop.img || '',
      link: prop.link || '/ready-to-move',
      category: prop.category || 'residential',
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
      if (editingId) {
        await api.updateProperty(editingId, formData);
        setToast('Property updated successfully!');
      } else {
        await api.createProperty(formData);
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
          className="px-6 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(197,168,128,0.3)] active:scale-95 cursor-pointer"
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
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" width={800} height={600}
                  src={prop.img}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
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
              className="w-full max-w-2xl bg-[#141A29] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-lg font-serif font-bold text-white">
                  {editingId ? 'Edit Property Listing' : 'Add New Property Listing'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Property Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="DLF Phase 2 Luxury Floor"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Price Tag *</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="₹5.75 Cr"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="DLF Phase 2, Gurugram"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Specs Details *</label>
                    <input
                      type="text"
                      required
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      placeholder="4 BHK • 3,200 Sq.Ft • Park Facing"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#121724] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                    >
                      <option value="residential">Residential Floor/Plot</option>
                      <option value="villa">Luxury Villa</option>
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
                      placeholder="Exclusive Floor"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder="Architect-designed luxury floor with high-end fixtures..."
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

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
                    <span>Highlight in 3D Slider</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Property' : 'Create Listing'}
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


