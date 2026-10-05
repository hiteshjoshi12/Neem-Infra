"use client";

import React, { useState } from 'react';
import { useRouter as useNavigate } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
const logoImg = '/logo.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@saudagarproperties.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate.push('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0C101A] relative overflow-hidden p-6">
      {/* Background Architectural Ambient Lighting */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#D09A16_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D09A16]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Outer Luxury 3D Card */}
        <div className="rounded-3xl bg-[#141A29]/95 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Top Gold Corner Accents */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D09A16] to-transparent" />
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#D09A16]/40 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#D09A16]/40 rounded-tr-lg" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3.5 rounded-2xl bg-white/95 border border-[#D09A16]/30 shadow-md mb-4">
              <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" width={800} height={600}
                src={logoImg}
                alt="Saudagar Properties"
                className="h-9 w-auto object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#D09A16] uppercase mb-2">
              <ShieldCheck size={12} />
              <span>Executive CMS Portal</span>
            </div>

            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Sign In to Management
            </h1>
            <p className="text-xs text-[#94A3B8] font-normal mt-1">
              Saudagar Properties Content & Listings Control Panel
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-[#D09A16]/80 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@saudagarproperties.com"
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-[#D09A16] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:bg-white/[0.08]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-[#D09A16]/80 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/15 focus:border-[#D09A16] rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:bg-white/[0.08]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-[#D09A16] transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-[#D09A16] via-[#D8BF9A] to-[#D09A16] hover:brightness-110 text-[#0C101A] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_10px_25px_rgba(197,168,128,0.3)] active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#0C101A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Development Default Credentials Note */}
          <div className="mt-8 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-gray-400 font-light">
              Default credentials: <span className="text-[#D09A16] font-mono">admin@saudagarproperties.com</span> / <span className="text-[#D09A16] font-mono">admin123</span>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}


