import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Building,
  Quote,
  Inbox,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    propertiesCount: 0,
    testimonialsCount: 0,
    inquiriesCount: 0,
    sectionsCount: 12,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [propsRes, testsRes, inqRes] = await Promise.allSettled([
          api.getProperties({ all: true }),
          api.getTestimonials({ all: true }),
          api.getInquiries()
        ]);

        const pCount = propsRes.status === 'fulfilled' && propsRes.value.count ? propsRes.value.count : 5;
        const tCount = testsRes.status === 'fulfilled' && testsRes.value.count ? testsRes.value.count : 3;
        const inqs = inqRes.status === 'fulfilled' && inqRes.value.data ? inqRes.value.data : [];

        setStats({
          propertiesCount: pCount,
          testimonialsCount: tCount,
          inquiriesCount: inqs.length,
          sectionsCount: 12
        });
        setRecentInquiries(inqs.slice(0, 5));
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardItems = [
    {
      title: 'Active Sections',
      value: stats.sectionsCount,
      subtext: 'Hero, Consultant, Services, Location...',
      icon: Layers,
      link: '/admin/sections',
      color: '#D09A16'
    },
    {
      title: 'Managed Properties',
      value: stats.propertiesCount,
      subtext: 'Featured in 3D Corridors slider',
      icon: Building,
      link: '/admin/properties',
      color: '#60A5FA'
    },
    {
      title: 'Client Perspectives',
      value: stats.testimonialsCount,
      subtext: 'Verified testimonial cards',
      icon: Quote,
      link: '/admin/testimonials',
      color: '#34D399'
    },
    {
      title: 'Customer Inquiries',
      value: stats.inquiriesCount,
      subtext: 'Newsletter & property leads',
      icon: Inbox,
      link: '/admin/inquiries',
      color: '#F472B6'
    }
  ];

  return (
    <div className="space-y-10">

      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#172033] via-[#121826] to-[#0F141F] p-8 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D09A16]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-[#D09A16] uppercase">
              <Sparkles size={12} />
              <span>Saudagar Properties Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white">
              Executive CMS Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              Manage live homepage content, curated builder floor listings, video tours, client testimonials, and incoming leads in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/sections"
              className="px-6 py-3 rounded-xl bg-[#D09A16] hover:bg-[#B5986D] text-[#0C101A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md active:scale-95"
            >
              <span>Edit Sections CMS</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/admin/properties"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300"
            >
              <span>Manage Properties</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.link}
              className="group p-6 rounded-3xl bg-[#121724] border border-white/10 hover:border-[#D09A16]/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon size={22} />
                </div>
                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div className="text-3xl font-serif font-bold text-white mb-1">
                {loading ? '...' : item.value}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {item.subtext}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Quick CMS Section Navigation */}
        <div className="lg:col-span-7 rounded-3xl bg-[#121724] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Homepage Section Editors</h3>
              <p className="text-xs text-slate-400">Quickly jump into any section to edit copy & media</p>
            </div>
            <Link to="/admin/sections" className="text-xs text-[#D09A16] hover:underline font-semibold">
              Open All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: '1. Navbar & Header', desc: 'Logo, links, dropdowns, CTA & phones', tab: 'navbar' },
              { name: '2. Hero Section', desc: 'Title, tags, search bar & spotlight card', tab: 'hero' },
              { name: '3. Top Consultant', desc: 'Copy, 3 categories, video walkthrough', tab: 'topConsultant' },
              { name: '4. Featured Properties', desc: 'Section header and corridor copy', tab: 'curatedCorridors' },
              { name: '5. Our Services', desc: '3 core cards, 25+ yrs counter, process steps', tab: 'services' },
              { name: '6. DLF Callout & Stats', desc: 'Dedicated DLF desk, phone, explore & 3 stats cards', tab: 'dlfCallout' },
              { name: '7. Why Choose Us', desc: 'Trust card, advantage copy & pillars', tab: 'whyChooseUs' },
              { name: '8. Testimonials Header', desc: 'Section title, gold badges & subtitle', tab: 'testimonials' },
              { name: '9. Location & Map', desc: 'Office address, Google Map pin & phones', tab: 'location' },
              { name: '10. Newsletter Section', desc: 'Subscription banner & intelligence copy', tab: 'newsletter' },
              { name: '11. Footer & Socials', desc: 'About copy, addresses, phone list & socials', tab: 'footer' },
              { name: '12. Floating Widgets', desc: 'WhatsApp number, prefill text & scroll-to-top', tab: 'floatingWidgets' }
            ].map((sec, i) => (
              <Link
                key={i}
                to={`/admin/sections?tab=${sec.tab}`}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#D09A16]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#D09A16] transition-colors">
                    {sec.name}
                  </h4>
                  <ArrowUpRight size={13} className="text-slate-500 group-hover:text-[#D09A16]" />
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  {sec.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="lg:col-span-5 rounded-3xl bg-[#121724] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Recent Inquiries</h3>
              <p className="text-xs text-slate-400">Newsletter and property lead captures</p>
            </div>
            <Link to="/admin/inquiries" className="text-xs text-[#D09A16] hover:underline font-semibold">
              View All
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
              No new inquiries yet. Submissions from the website will appear here in real time.
            </div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{inq.email}</p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {inq.type.replace('_', ' ')} • {new Date(inq.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
