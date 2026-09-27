import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

// Refined, smoother animations
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

export default function AboutUs() {
  return (
    <div className="w-full bg-[#F9F8F4] min-h-screen pt-32 pb-20 selection:bg-[#A89069] selection:text-white">
      
      {/* 1. Modern Editorial Header */}
      <section className="container mx-auto px-6 md:px-12 mb-20 lg:mb-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.span variants={fadeUp} className="block text-xs tracking-[0.3em] text-[#A89069] uppercase font-semibold mb-6">
            About Saudagar Properties Realty
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#2C302E] leading-[1.1] mb-12">
            A boutique real estate advisory firm <span className="italic text-[#A89069] font-light">based in Gurgaon.</span>
          </motion.h1>
        </motion.div>

        {/* Feature Image - Full width with parallax feel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden mb-16 shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80" 
            alt="Luxury Gurgaon Property" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Intro Text - Magazine Column Style */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto text-[#5A605C] font-light text-lg leading-relaxed"
        >
          <motion.p variants={fadeUp}>
            <strong className="font-medium text-[#2C302E]">Saudagar Properties Realty Pvt. Ltd.</strong> was founded with the vision of offering strategic, transparent, and relationship-driven property advisory services. With deep market understanding and years of experience in Gurgaon's dynamic real estate landscape, we help clients navigate property decisions with clarity and confidence.
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6">
            <p>
              Our approach combines research-driven insights, curated property opportunities, and personalised advisory, ensuring that every client receives solutions aligned with their lifestyle goals and investment objectives.
            </p>
            <p>
              By combining market knowledge, ethical practices, and personalised attention, we aim to create long-term value and trusted relationships with every client we serve.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Our Expertise (Modern Grid) */}
      <section className="bg-white py-24 mb-24 lg:mb-32 border-y border-[#E5E0D8]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-5 sticky top-32"
            >
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif text-[#2C302E] mb-6">
                Our Expertise
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#5A605C] font-light leading-relaxed mb-8 text-lg">
                We specialise in identifying high-value real estate opportunities across Gurgaon's most sought-after and high-growth corridors. 
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#2C302E] text-xl font-serif italic border-l-2 border-[#A89069] pl-6 py-2">
                "We don't just show properties; we provide Strategic Property Advisory."
              </motion.p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {[
                { title: 'Strategic Property Advisory', icon: TrendingUp },
                { title: 'End-to-End Transaction Support', icon: ShieldCheck },
                { title: 'Investment Planning & Insights', icon: Building2 },
                { title: 'Builder Coordination & Due Diligence', icon: ArrowUpRight }
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-[#F9F8F4] p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
                  <item.icon className="text-[#A89069] w-8 h-8 mb-6" strokeWidth={1.5} />
                  <h4 className="text-[#2C302E] font-serif text-xl mb-3">{item.title}</h4>
                  <p className="text-[#5A605C] font-light text-sm">Comprehensive support across prime, emerging, and high-growth corridors in Gurgaon.</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Core Services (Minimalist Cards) */}
      <section className="container mx-auto px-6 md:px-12 mb-24 lg:mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C302E] mb-6">Our Core Services</h2>
          <p className="text-[#5A605C] font-light text-lg">
            We help you buy, sell, and invest in Gurgaon properties without confusion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              title: "Luxury Residential Advisory",
              desc: "Find the right luxury home—high-rise, penthouse, or villa—based on location, lifestyle, and long-term value.",
              img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "Commercial & Strategic",
              desc: "Identify commercial properties that generate steady rental income in high-demand locations.",
              img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "End-to-End Support",
              desc: "From shortlisting to final paperwork, we handle the entire process so you can close deals seamlessly.",
              img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
            }
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-serif text-[#2C302E] mb-3 group-hover:text-[#A89069] transition-colors">{service.title}</h3>
              <p className="text-[#5A605C] font-light text-base leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Founders (High-End Portrait Layout) */}
      <section className="bg-[#2F3E35] py-24 mb-24 lg:mb-32 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] text-[#A89069] uppercase font-semibold mb-4 block">The Expertise</span>
            <h2 className="text-4xl md:text-5xl font-serif">Meet Our Founders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            {/* Rohit Bali */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8 border border-[#4A574F]">
                <img src="https://neeminfra.com/wp-content/uploads/2026/03/1-4-1536x1536.png" alt="Rohit Bali" className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="text-3xl font-serif mb-2">Rohit Bali</h3>
              <p className="text-[#A89069] text-sm tracking-widest uppercase mb-6">Founder</p>
              <p className="text-[#B5BCB7] font-light leading-relaxed">
                With over <strong className="font-medium text-white">25 years of experience</strong>, Rohit's journey began at HSBC, leading to roles at Knight Frank and JLL. For Rohit, real estate is built on trust, driving him to create a personalized, advisory-led alternative to traditional brokerage.
              </p>
            </motion.div>

            {/* Priya Bali */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:pt-24" /* Staggered layout on desktop */
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8 border border-[#4A574F]">
                <img src="https://neeminfra.com/wp-content/uploads/2026/03/2-3-1536x1536.png" alt="Priya Bali" className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="text-3xl font-serif mb-2">Priya Bali</h3>
              <p className="text-[#A89069] text-sm tracking-widest uppercase mb-6">Co-Founder</p>
              <p className="text-[#B5BCB7] font-light leading-relaxed">
                Priya brings over <strong className="font-medium text-white">17 years of expertise</strong> in strategic consulting. She bridges the gap between market data and client experience, ensuring every interaction is professional, transparent, and centered around the client's unique needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Clean, Ultra-Legible Split Form */}
      <section className="container mx-auto px-6 md:px-12 mb-24 lg:mb-32">
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgb(44,48,46,0.08)] flex flex-col lg:flex-row border border-[#E5E0D8]">
          
          {/* Left Side: Solid Form Area (100% Legible) */}
          <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-serif text-[#2C302E] mb-4">Request a Consultation</h2>
            <p className="text-[#5A605C] font-light mb-10">Get clear insights on Gurgaon's property market and explore verified luxury homes.</p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#2C302E]">First Name</label>
                  <input type="text" className="w-full bg-[#F9F8F4] border border-[#E5E0D8] rounded-lg p-3 text-sm text-[#2C302E] outline-none focus:border-[#A89069] transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#2C302E]">Last Name</label>
                  <input type="text" className="w-full bg-[#F9F8F4] border border-[#E5E0D8] rounded-lg p-3 text-sm text-[#2C302E] outline-none focus:border-[#A89069] transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#2C302E]">Email Address</label>
                  <input type="email" className="w-full bg-[#F9F8F4] border border-[#E5E0D8] rounded-lg p-3 text-sm text-[#2C302E] outline-none focus:border-[#A89069] transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-[#2C302E]">Phone Number</label>
                  <input type="tel" className="w-full bg-[#F9F8F4] border border-[#E5E0D8] rounded-lg p-3 text-sm text-[#2C302E] outline-none focus:border-[#A89069] transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-[#2C302E]">Property Interest</label>
                <select className="w-full bg-[#F9F8F4] border border-[#E5E0D8] rounded-lg p-3 text-sm text-[#2C302E] outline-none focus:border-[#A89069] transition-colors cursor-pointer">
                  <option>Luxury Apartment</option>
                  <option>Penthouse</option>
                  <option>Villa</option>
                  <option>Commercial Property</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[#2F3E35] text-white py-4 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-[#1E2822] transition-colors mt-4">
                Submit Request
              </button>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-auto hidden md:block">
            <img src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=80" alt="Consultation" className="w-full h-full object-cover" />
          </div>

        </div>
      </section>

      {/* 6. Guide for Buyers & Sellers (Modern Cards) */}
      <section className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-serif text-[#2C302E] mb-4">Market Insights</h2>
            <p className="text-[#5A605C] font-light text-lg">
              Get clear insights on Gurgaon's property market, latest listings, and price trends.
            </p>
          </div>
          <button className="text-[#A89069] font-medium tracking-widest uppercase text-sm hover:text-[#2C302E] transition-colors flex items-center gap-2">
            View All Guides <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Clean, Legible Cards - Image on top, Text on bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Golf Course Road vs Dwarka Expressway", 
            "What Makes Gurgaon a Hub for Luxury?", 
            "Top Reasons to Invest in Golf Course Road"
          ].map((title, idx) => (
             <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-[#E5E0D8] group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80&sig=${idx}`} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <span className="text-xs text-[#A89069] tracking-widest uppercase font-semibold mb-3 block">Real Estate Guide</span>
                  <h4 className="text-[#2C302E] font-serif text-xl leading-snug group-hover:text-[#A89069] transition-colors">
                    {title}
                  </h4>
                </div>
             </div>
          ))}
        </div>
      </section>

    </div>
  );
}