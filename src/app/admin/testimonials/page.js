"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Quote, Star, CheckCircle2, X, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { useCms } from '@/context/CmsContext';
import Image from 'next/image';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const { refetch } = useCms();

  const initialForm = {
    name: '',
    role: 'Investor',
    location: 'Gurugram, India',
    propertyType: 'DLF Luxury Floor',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: '',
    tag: 'Verified Client',
    order: 0,
    isActive: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getTestimonials({ all: true });
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.warn('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await api.getTestimonials({ all: true });
        if (!ignore && res.success && res.data) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.warn('Error fetching testimonials:', err);
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

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name || '',
      role: item.role || 'Investor',
      location: item.location || '',
      propertyType: item.propertyType || '',
      rating: item.rating || 5,
      avatar: item.avatar || '',
      quote: item.quote || '',
      tag: item.tag || 'Verified Client',
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
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
        await api.updateTestimonial(editingId, formData);
        setToast('Testimonial updated successfully!');
      } else {
        await api.createTestimonial(formData);
        setToast('Testimonial added successfully!');
      }
      closeModal();
      await fetchTestimonials();
      await refetch();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;

    try {
      await api.deleteTestimonial(id);
      setToast('Testimonial removed');
      await fetchTestimonials();
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
            <Quote size={12} />
            <span>Reputation & Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Client Perspectives (Testimonials)
          </h1>
          <p className="text-xs text-slate-400">
            Manage high-profile client endorsements and verified reviews
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3.5 rounded-xl bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_6px_20px_rgba(197,168,128,0.3)] active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-[#D09A16]" />
          <span>Loading client reviews...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#121724] border border-white/10 text-center">
          <p className="text-sm text-slate-300 mb-4">No testimonials available yet.</p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#D09A16] text-[#0C101A] text-xs font-bold uppercase tracking-wider"
          >
            Add First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl bg-[#121724] border border-white/10 p-6 flex flex-col justify-between group hover:border-[#D09A16]/50 transition-all duration-300 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#D09A16] gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="#D09A16" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-[#D09A16] border border-white/10">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed mb-6 italic">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" width={800} height={600}
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D09A16]/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-[#D09A16]">{item.role}, {item.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-[#D09A16] hover:text-[#0C101A] text-slate-300 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-300 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141A29] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-lg font-serif font-bold text-white">
                  {editingId ? 'Edit Testimonial' : 'Add Client Perspective'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Deepak Arora"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Role / Designation *</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Investor / Homeowner"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Dubai, UAE"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Star Rating (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Quote / Review *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="From before-sales to handover, customer satisfaction is in Saudagar Properties' DNA..."
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-white outline-none focus:border-[#D09A16]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-[#D09A16] text-[#0C101A] font-bold uppercase tracking-wider"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
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


