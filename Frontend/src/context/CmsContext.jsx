import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FEATURED_PROPERTIES_DATA } from '../constants';

const CmsContext = createContext(null);

// Fallback default contents in case the backend is booting up or offline
const DEFAULT_SECTIONS = {
  hero: {
    badge: "Luxury Builder Floors & Estates",
    headlinePrefix: "Gurgaon's Premier",
    headlineHighlight: "Real Estate",
    headlineSuffix: "Partner.",
    description: "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas in DLF Phase 1–4, Sushant Lok & Golf Course Ext.",
    trendingTags: ["DLF Phase 1 Floors", "Sushant Lok Villas", "Golf Course Ext.", "Under 5 Cr"],
    spotlight: {
      badge: "Spotlight Property",
      tag: "DLF Phase 1",
      title: "Ultra-Luxury Independent Floor",
      specs: "4 BHK • 500 Sq. Yds • Private Stilt Parking & Elevator",
      price: "₹6.75 Cr Onwards",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    }
  },
  topConsultant: {
    badge: "Bespoke Real Estate Advisory",
    headlineMain: "Top Real Estate Consultant",
    headlineItalic: "In DLF Gurugram",
    summaryQuote: "Authorized advisor and trusted partner for DLF Phase 1–4, Sushant Lok, and Cybercity’s most exclusive residential & commercial estates.",
    cardBadge: "DLF Authorized & Verified",
    paragraph1: "At Saudagar Properties, we are proud to be recognized as the premier real estate consultant in DLF Gurugram. We provide personalized, end-to-end solutions across residential, commercial, and industrial sectors with maximum ROI.",
    paragraph2: "Whether you are seeking an ultra-luxury builder floor in DLF Phase 1–4, a high-street commercial office in Udyog Vihar, or an investment-ready plot, our veteran team guides you through transparent transactions and seamless legal title verification.",
    videoTour: {
      badge: "Sushant Lok & DLF Tour",
      title: "Exclusive DLF & Sushant Lok Walkthrough",
      subtitle: "Experience Gurgaon's finest properties with curated virtual walkthroughs.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    },
    ctaBanner: {
      title: "Ready to Invest or Buy in DLF Gurugram?",
      description: "Get priority access to off-market inventory, bespoke site visits, and personalized ROI projections from our executive directors.",
      phone: "+91 98112 21207"
    }
  },
  curatedCorridors: {
    badge: "Featured Portfolio",
    titleMain: "Featured",
    titleItalic: "Properties",
    description: "Handpicked luxury builder floors and independent villas in DLF Phase 1–4, Sushant Lok & Udyog Vihar."
  },
  services: {
    badge: "Bespoke Property Solutions",
    titleMain: "Our",
    titleItalic: "Services",
    description: "As the top real estate consultant in DLF Gurugram, let’s explore where our expertise lies and how it translates into real value for you.",
    experienceCounter: {
      badge: "25+ Years of Unmatched Advisory",
      headline: "Years of Experience as a Top Real Estate Consultant in DLF Gurugram",
      description: "Our stellar team, trusted property dealers in Gurgaon and experts in commercial real estate in Gurugram, ensures you have a hassle-free experience finding the right property.",
      yearsCount: 25
    },
    howWeWork: {
      badge: "Process & Methodology",
      titleMain: "How Do We",
      titleItalic: "Work?",
      description: "Want to know how we get started with your property journey? Here’s a simple overview of our process:"
    },
    dlfCallout: {
      badge: "DLF Gurgaon Dedicated Desk",
      headline: "Are you looking for a property in DLF Gurgaon? Simply connect with us!",
      description: "Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties tailored to your preferences and convenience.",
      phone: "+91 98112 21207"
    }
  },
  whyChooseUs: {
    badge: "The Saudagar Advantage",
    titleMain: "Why Choose",
    titleItalic: "Our Company?",
    description: "Decades of unmatched local authority, ethical advisory, and client-first commitment across Gurgaon.",
    trustCard: {
      badge: "Trusted Partner",
      title: "Property Dealers in Gurgaon You Can Trust",
      p1: "We help customers buy, sell, and rent residential, commercial, and industrial properties across prime areas of Gurgaon and Gurugram, including DLF, Sushant Lok, and Udyog Vihar.",
      p2: "We're your one-stop platform for smart property solutions combining local expertise with the best deals to match your needs and budget."
    }
  },
  location: {
    badge: "Visit Our Office",
    titleMain: "Where to",
    titleItalic: "Find Us",
    description: "Drop by our headquarters for a private, one-on-one consultation regarding Gurgaon's premier luxury properties.",
    officeName: "Saudagar Properties Pvt. Ltd",
    address: "38, Akashneem Marg, DLF Phase 2, Gurugram, Haryana 122002",
    phones: ["+91 97185 11207", "+91 98112 21207"],
    email: "Saudagar.Properties@Yahoo.In",
    gmapsUrl: "https://www.google.com/maps/place/Saudagar+Properties+Pvt.Ltd/@28.4847851,77.0842655,17z/data=!3m1!4b1!4m6!3m5!1s0x390d193a8eabbb6b:0x3d99d3fce74198d5!8m2!3d28.4847851!4d77.0842655!16s%2Fg%2F11f03pch1x",
    embedUrl: "https://maps.google.com/maps?q=Saudagar+Properties+Pvt.Ltd,+Akashneem+Marg,+DLF+Phase+2,+Gurugram&t=&z=16&ie=UTF8&iwloc=&output=embed"
  },
  newsletter: {
    badge: "Market Intelligence",
    titleMain: "Subscribe To",
    titleItalic: "Saudagar Properties",
    titleSuffix: "Newsletter",
    description: "Sign up with your email address to receive curated off-market opportunities, DLF price trends, and the latest Gurgaon real estate updates.",
    guaranteeText: "Zero spam. Complete confidentiality. Unsubscribe at any time."
  }
};

export const CmsProvider = ({ children }) => {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [properties, setProperties] = useState(FEATURED_PROPERTIES_DATA);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCmsData = useCallback(async () => {
    try {
      // 1. Fetch Sections
      const secRes = await api.getSections().catch(() => null);
      if (secRes && secRes.success && secRes.data) {
        setSections((prev) => ({
          ...prev,
          ...secRes.data
        }));
      }

      // 2. Fetch Properties
      const propRes = await api.getProperties().catch(() => null);
      if (propRes && propRes.success && propRes.data && propRes.data.length > 0) {
        setProperties(propRes.data);
      }

      // 3. Fetch Testimonials
      const testRes = await api.getTestimonials().catch(() => null);
      if (testRes && testRes.success && testRes.data && testRes.data.length > 0) {
        setTestimonials(testRes.data);
      }
    } catch (err) {
      console.warn('[CmsContext] Using cached/default data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  return (
    <CmsContext.Provider
      value={{
        sections,
        properties,
        testimonials,
        loading,
        refetch: fetchCmsData
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
