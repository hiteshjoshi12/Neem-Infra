import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import logo from '../../assets/logo.png';

const NAV_LINKS = [
  { label: "Ready To Move", href: "/ready-to-move" },
  { label: "New Launches", href: "/new-launches" },
  { label: "Under Construction", href: "/under-construction" },
  { label: "Developers", href: "/developers" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out ${
          isScrolled ? 'top-4 px-4' : 'top-0 px-0'
        }`}
      >
        <div 
          className={`w-full flex justify-between items-center transition-all duration-500 ease-out ${
            isScrolled 
              ? 'max-w-6xl mx-auto rounded-full py-3 px-8 backdrop-blur-md bg-[#282828]/85 border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.3)]' 
              : 'max-w-none rounded-none py-6 px-6 md:px-12 bg-transparent border-b border-transparent'
          }`}
        >
          {/* Logo Area */}
          <Link to="/" className="flex items-center z-50 group">
            <div className="py-1 px-2 rounded-lg transition-colors group-hover:bg-white/5">
              <img 
                src={logo} 
                alt="Neem Infra Realty" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label} 
                to={link.href}
                className="text-xs text-gray-200 hover:text-white font-medium tracking-[0.12em] uppercase transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#A89069] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Contact Button & Mobile Toggle */}
          <div className="flex items-center gap-4 z-50">
            <a 
              href="tel:+919810422282" 
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-white bg-white/10 border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-[#2F3E35] transition-all duration-300 group"
            >
              <Phone size={13} className="text-[#A89069] group-hover:text-[#2F3E35] transition-colors" />
              <span>Let's Talk</span>
            </a>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X strokeWidth={1.5} size={24} /> : <Menu strokeWidth={1.5} size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#1A231E] flex flex-col justify-center items-center lg:hidden px-6"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.label} 
                  to={link.href}
                  className="text-2xl font-serif text-white hover:text-[#A89069] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-12 flex flex-col items-center gap-4">
              <span className="text-[0.65rem] tracking-[0.25em] text-[#A89069] uppercase font-semibold">Get in touch</span>
              <a href="tel:+919810422282" className="text-lg font-light text-white border-b border-white/20 pb-1">
                +91 98104 22282
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}