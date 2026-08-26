import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa6';
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Smartphone,
  ChevronUp
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2F3E35] text-[#F9F8F4] pt-12 relative">
      
      {/* Top CTA Banner */}
      <div className="container mx-auto px-6 md:px-12 border-b border-[#4A574F] pb-8 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-12 w-full lg:w-auto">
          {/* Footer Logo */}
          <Link to="/" className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-serif tracking-widest uppercase leading-none text-white">
              Neem<span className="text-[#A89069]">Infra</span>
            </span>
          </Link>
          
          <div className="hidden md:block w-px h-12 bg-[#4A574F]"></div>
          
          {/* Quick Contact */}
          <div className="flex items-center gap-4">
            <Smartphone className="text-[#A89069]" size={28} strokeWidth={1.5} />
            <div>
              <p className="text-xs text-[#A89069] tracking-wider uppercase mb-1">Call or WhatsApp</p>
              <a href="tel:+919810422282" className="text-lg font-light hover:text-[#A89069] transition-colors">
                +91-9810422282
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white text-[#2F3E35] px-6 py-3 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-[#E5E0D8] transition-colors">
            Enquire Now
          </button>
          <button className="flex-1 md:flex-none border border-[#A89069] text-[#A89069] px-6 py-3 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-[#A89069] hover:text-white transition-all">
            WhatsApp
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-2xl font-serif tracking-widest uppercase leading-none text-white mb-6">
            Neem<span className="text-[#A89069]">Infra</span>
          </span>
          <p className="text-[#B5BCB7] text-sm font-light leading-relaxed mb-8">
            Your trusted partner for premium real estate, high-quality homes, and modern apartments in Gurgaon.
          </p>
          <div className="flex gap-4">
            {[FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn].map((Icon, idx) => (
              <a key={idx} href="#" className="w-10 h-10 rounded-full border border-[#4A574F] flex items-center justify-center text-[#B5BCB7] hover:border-[#A89069] hover:text-[#A89069] hover:bg-[#4A574F]/20 transition-all">
                <Icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-serif text-white mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {['Home', 'New Launches', 'Developers', 'Contact'].map((link) => (
              <li key={link}>
                <Link to="#" className="text-[#B5BCB7] text-sm font-light hover:text-[#A89069] transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Find a Property */}
        <div>
          <h4 className="text-lg font-serif text-white mb-6">Find a Property</h4>
          <ul className="space-y-4">
            {['Ready to Move', 'Under Construction'].map((link) => (
              <li key={link}>
                <Link to="#" className="text-[#B5BCB7] text-sm font-light hover:text-[#A89069] transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Company & Contact */}
        <div>
          <h4 className="text-lg font-serif text-white mb-6">Company</h4>
          <ul className="space-y-4 mb-8">
            {['About Us', 'Meet Our Founders', 'Careers', 'Blogs'].map((link) => (
              <li key={link}>
                <Link to="#" className="text-[#B5BCB7] text-sm font-light hover:text-[#A89069] transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-3">
            <a href="tel:+919810422282" className="flex items-center gap-3 text-[#B5BCB7] text-sm hover:text-[#A89069] transition-colors font-light">
              <Phone size={16} className="text-[#A89069]" />
              +91 98104 22282
            </a>
            <a href="mailto:Rohit.bali@neeminfra.com" className="flex items-center gap-3 text-[#B5BCB7] text-sm hover:text-[#A89069] transition-colors font-light">
              <Mail size={16} className="text-[#A89069]" />
              Rohit.bali@neeminfra.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#4A574F] bg-[#27332C]">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#B5BCB7] text-xs font-light text-center md:text-left">
            © {new Date().getFullYear()} Neem Infra Realty Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#B5BCB7] font-light">
            <Link to="/privacy-policy" className="hover:text-[#A89069] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#A89069] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className="absolute bottom-6 right-6 w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-[#A89069] transition-colors z-50 shadow-lg"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>

    </footer>
  );
}