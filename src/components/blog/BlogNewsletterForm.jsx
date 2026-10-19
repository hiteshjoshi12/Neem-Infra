'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/services/api';

export default function BlogNewsletterForm({ placeholder = "Enter your confidential email...", buttonText = "Subscribe" }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.createInquiry({
        email: email.trim(),
        type: 'newsletter',
        source: 'Editorial Journal Newsletter',
        message: 'Subscriber joined the Saudagar Properties Luxury Real Estate Journal registry.'
      });

      if (res?.success) {
        setSubmitted(true);
        setEmail('');
      } else {
        setError(res?.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold max-w-md mx-auto mb-6">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>Thank you for joining our private advisory registry.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto mb-6">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold shadow-sm transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 text-brand-obsidian font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-brand-obsidian border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{buttonText}</span>
            <Send size={13} />
          </>
        )}
      </button>
      {error && (
        <div className="w-full text-rose-400 text-[11px] flex items-center gap-1 mt-1 justify-center">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
