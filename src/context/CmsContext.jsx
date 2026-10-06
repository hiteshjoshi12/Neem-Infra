"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FEATURED_PROPERTIES_DATA } from '../constants';

const CmsContext = createContext(null);

// Fallback default contents in case the backend is booting up or offline
const DEFAULT_SECTIONS = {
  navbar: {
    phone: "+91 98112 21207",
    phoneRaw: "+919811221207",
    ctaText: "Contact Us",
    ctaHref: "/contact",
    corridorsBadge: "Prime Corridors",
    mobileNavHeader: "Saudagar Properties",
    mobileConsultationTitle: "Private Consultation",
    links: [
      { label: "HOME", href: "/" },
      { label: "ABOUT US", href: "/about" },
      {
        label: "SERVICES",
        href: "#",
        dropdown: [
          { label: "Property In DLF Phase 1", href: "/services/dlf-phase-1", desc: "Ultra-luxury villas & floors" },
          { label: "Property In DLF Phase 2", href: "/services/dlf-phase-2", desc: "Prime central estates" },
          { label: "Property In DLF Phase 3", href: "/services/dlf-phase-3", desc: "Cybercity proximity residences" },
          { label: "Property In DLF Phase 4", href: "/services/dlf-phase-4", desc: "Golf course adjacent homes" },
          { label: "Property In Sushant Lok", href: "/services/sushant-lok", desc: "Serene bespoke properties" },
          { label: "Property In Udyog Vihar", href: "/services/udyog-vihar", desc: "High-value commercial & assets" },
        ]
      },
      { label: "FEATURED", href: "/ready-to-move" },
      { label: "OUR TEAM", href: "/our-team" },
      { label: "BLOG", href: "/blog" },
    ]
  },
  footer: {
    officeTitle: "Corporate Office",
    officeName: "Address",
    officeAddress: "38, Akashneem Marg, DLF-II, Gurgaon-122002",
    phoneTitle: "Direct Line",
    phoneSubtitle: "Phone No",
    phones: [
      { number: "+91 97185 11207", label: "(IND)", href: "tel:+919718511207" },
      { number: "+91 98112 21207", label: "(IND)", href: "tel:+919811221207" }
    ],
    emailTitle: "Confidential Desk",
    emailSubtitle: "Email",
    email: "Saudagar.Properties@Yahoo.In",
    aboutText: "Saudagar Properties helps clients— both families and corporates to find their dream home or commercial space that lives up to their needs and promises a high Return on Investment. Keeping customer satisfaction on top priority, we're highly trusted by our clients which has helped us to be the leaders and the best property dealers in Gurgaon.",
    menuTitle: "Menu",
    menuLinks: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Featured Property", href: "/#featured" },
      { label: "Our Team", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact" }
    ],
    servicesTitle: "Services",
    servicesLinks: [
      { label: "Property DLF Phase 1", href: "/services/dlf-phase-1" },
      { label: "Property DLF Phase 2", href: "/services/dlf-phase-2" },
      { label: "Property DLF Phase 3", href: "/services/dlf-phase-3" },
      { label: "Property DLF Phase 4", href: "/services/dlf-phase-4" },
      { label: "Property In Sushant Lok", href: "/services/sushant-lok" },
      { label: "Property In Udyog Vihar", href: "/services/udyog-vihar" }
    ],
    followTitle: "Follow Us",
    followDesc: "Connect with our senior partners for off-market builder floors & confidential acquisitions.",
    callCtaText: "Call Now",
    callCtaPhone: "+919718511207",
    socialLinks: [
      { platform: "Facebook", href: "#" },
      { platform: "Instagram", href: "#" },
      { platform: "Pinterest", href: "#" },
      { platform: "LinkedIn", href: "#" },
      { platform: "YouTube", href: "#" }
    ],
    copyright: "Copyright © Saudagar Properties",
    copyrightSuffix: "All Right Reserved",
    legalLinks: [
      { label: "Clients", href: "/clients" },
      { label: "Term Of Service", href: "/terms" },
      { label: "Privacy & Policy", href: "/privacy-policy" }
    ]
  },
  floatingWidgets: {
    whatsappNumber: "919718511207",
    whatsappPrefill: "Hello Saudagar Properties, I am interested in luxury properties in DLF Gurugram.",
    backToTopTooltip: "Back to top",
    whatsappTooltip: "Chat on WhatsApp"
  },
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
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      phone: "+919811221207"
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
    categories: [
      { title: "Residential", subtitle: "Floors & Villas", icon: "Building" },
      { title: "Commercial", subtitle: "Offices & Retail", icon: "Building2" },
      { title: "Industrial", subtitle: "Plots & Assets", icon: "Factory" }
    ],
    videoTour: {
      badge: "Sushant Lok & DLF Tour",
      title: "Exclusive DLF & Sushant Lok Walkthrough",
      subtitle: "Experience Gurgaon's finest properties with curated virtual walkthroughs.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    },
    ctaBanner: {
      title: "Ready to Invest or Buy in DLF Gurugram?",
      description: "Get priority access to off-market inventory, bespoke site visits, and personalized ROI projections from our executive directors.",
      phone: "+91 98112 21207",
      buttonText: "Connect Now",
      buttonHref: "/contact"
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
    cards: [
      {
        id: "01",
        category: "RESIDENTIAL REAL ESTATE",
        title: "Residential",
        badge: "Plots • Builder Floors • Kothis • Apartments",
        description: "From residential plots and builder floors in DLF to apartments in Sushant Lok and premium kothis in Gurgaon, we specialize in properties that fit your lifestyle and your family’s future. Whether you're looking to buy or sell, we recommend options that combine comfort, location, and long-term value.",
        highlights: ["DLF Phase 1–5 Floors", "Sushant Lok & Golf Course", "Verified Legal Titles", "Luxury Kothis"],
        bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        link: "/services/residential"
      },
      {
        id: "02",
        category: "COMMERCIAL REAL ESTATE",
        title: "Commercial",
        badge: "Office Spaces • Retail • Corporate Hubs",
        description: "Great ideas need the right environment to thrive. Our team helps you find and lease office spaces in Gurgaon, including top locations like Udyog Vihar and Golf Course Road. With a deep understanding of commercial real estate in Gurugram, we streamline your search and provide tailored options that suit your business needs.",
        highlights: ["Udyog Vihar Offices", "Golf Course Road Hubs", "Corporate Lease", "High-Yield Assets"],
        bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        link: "/services/commercial"
      },
      {
        id: "03",
        category: "INDUSTRIAL REAL ESTATE",
        title: "Industrial",
        badge: "Warehouses • Industrial Plots • Factories",
        description: "Whether you’re expanding or relocating, we offer smart, reliable options for industrial plots, warehouses, and factory leasing opportunities in Udyog Vihar and surrounding hubs. Our mission is to find industrial properties that support growth, productivity, and scalability for your business.",
        highlights: ["Industrial Warehouses", "Factory Land Leasing", "Scalable Outlets", "Prime Connectivity"],
        bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        link: "/services/industrial"
      }
    ],
    experienceCounter: {
      badge: "25+ Years of Unmatched Advisory",
      headline: "Years of Experience as a Top Real Estate Consultant in DLF Gurugram",
      description: "Our stellar team, trusted property dealers in Gurgaon and experts in commercial real estate in Gurugram, ensures you have a hassle-free experience finding the right property. We are committed to serving our clients with dedication, putting their needs above all else. Providing personalized solutions for all your property-related queries, we know that a satisfied customer is our greatest asset.",
      yearsCount: 25,
      statsList: [
        {
          title: "100% Client Satisfaction",
          desc: "Putting client interests first with bespoke, personalized property advisory."
        },
        {
          title: "DLF Micro-Market Leaders",
          desc: "Unmatched expertise across DLF Phase 1–5, Sushant Lok, and Cybercity."
        },
        {
          title: "Verified Legal Titles",
          desc: "Comprehensive due diligence ensuring 100% safe and secure transactions."
        },
        {
          title: "Discreet & Ethical Advisory",
          desc: "Trusted by India's top corporate executives and high-net-worth families."
        }
      ]
    },
    howWeWork: {
      badge: "Process & Methodology",
      titleMain: "How Do We",
      titleItalic: "Work?",
      description: "Want to know how we get started with your property journey? Here’s a simple overview of our process:",
      steps: [
        {
          step: "01",
          phase: "STEP 01",
          title: "Understanding your Purpose",
          tagline: "Tailored to your budget & aspirations",
          shortDesc: "At Saudagar Properties, your trusted top real estate consultant in DLF Gurugram, we serve as a reliable platform to buy, rent, sell, or lease residential, commercial, and industrial properties.",
          fullDesc: "Whether you’re looking for a flat, villa, or kothi in Gurgaon or DLF Phase 2, or office space in Udyog Vihar, we are your one-stop solution to meet all your property needs within your budget and convenience.",
          highlights: ["Detailed requirement discovery", "Budget & location alignment", "Exclusive off-market inventory check"]
        },
        {
          step: "02",
          phase: "STEP 02",
          title: "Planning with our experts",
          tagline: "Direct consultation without middlemen",
          shortDesc: "Our dedicated team of professionals provides personalized guidance, answering all your queries and helping you avoid the hassle of middlemen like brokers and financers.",
          fullDesc: "We assist you in selecting the perfect property whether residential or commercial and handle the formalities efficiently, ensuring you stay within your budget.",
          highlights: ["Direct consultation with directors", "Zero hidden broker fees", "Clear financial & legal roadmap"]
        },
        {
          step: "03",
          phase: "STEP 03",
          title: "Implementation as per plan",
          tagline: "Transparent execution & smooth closing",
          shortDesc: "Once your needs are clear, our experts actively search for the best property options tailored to you. We pride ourselves on dedication and transparency.",
          fullDesc: "We ensure smooth coordination and keep you informed throughout the process. Reach out to us today, and let’s discuss how we can help you find your ideal property in DLF Gurugram.",
          highlights: ["Hand-picked property site tours", "Title verification & due diligence", "Seamless registration & handover"]
        }
      ]
    },
    dlfCallout: {
      badge: "DLF Gurgaon Dedicated Desk",
      headline: "Are you looking for a property in DLF Gurgaon? Simply connect with us!",
      description: "Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties tailored to your preferences and convenience. Contact us to discuss your requirements and find the perfect property solution.",
      phone: "+91 98112 21207",
      phoneRaw: "+919811221207",
      statsCards: [
        {
          number: 100,
          suffix: "+",
          label: "CR Saves In Property Investment",
          subtext: "Maximized financial yield & smart negotiation"
        },
        {
          number: 1000,
          suffix: "+",
          label: "Happy Clients",
          subtext: "Discerning families & corporate enterprises"
        },
        {
          number: 25,
          suffix: "+",
          label: "Years of Trust and Experience",
          subtext: "Unbroken leadership in DLF Gurugram"
        }
      ]
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
      p2: "We're your one-stop platform for smart property solutions combining local expertise with the best deals to match your needs and budget.",
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      phone: "+91 98112 21207"
    },
    reasons: [
      {
        id: "01",
        title: "Understanding Your Requirements",
        badge: "Personalized Discovery",
        description: "We begin by understanding what matters most to you: the location, budget, property type, and your purpose for buying, selling, or renting. Whether you're looking for a flat in Sushant Lok, a builder floor in DLF, or a commercial office in Udyog Vihar, we tailor our approach to match your goals.",
        tags: ["Goal Alignment", "Budget Optimization", "Prime Location Match"]
      },
      {
        id: "02",
        title: "Experience in Real Estate Industry",
        badge: "25+ Years Market Insight",
        description: "With deep insight into Gurgaon's property market, we understand local price trends, demand and supply dynamics, and what makes a location valuable. As an experienced top real estate consultant in DLF Gurugram, we guide you to the right property whether residential, commercial, or industrial with complete transparency and expertise.",
        tags: ["Micro-Market Mastery", "Price Trend Forecasting", "100% Transparency"]
      },
      {
        id: "03",
        title: "Properties by Categories",
        badge: "Comprehensive Portfolio",
        description: "From luxury homes and builder floors to industrial warehouses and commercial spaces, we offer an extensive selection to fit your needs and budget. You'll find options that align perfectly with your lifestyle, investment goals, or business plans.",
        tags: ["DLF Floors & Plots", "Udyog Vihar Commercial", "Industrial Hubs"]
      }
    ]
  },
  testimonials: {
    badge: "Client Perspectives",
    titleMain: "Words of",
    titleItalic: "Distinction",
    subBadge: "Testimonial"
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
  },
  dlfCallout: {
    badge: "DLF Gurgaon Dedicated Desk",
    headline: "Are you looking for a property in DLF Gurgaon? Simply connect with us!",
    description: "Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties tailored to your preferences and convenience. Contact us to discuss your requirements and find the perfect property solution.",
    phone: "+91 98112 21207",
    phoneRaw: "+919811221207",
    ctaText: "Explore Deals",
    ctaLink: "/contact",
    statsCards: [
      {
        number: 100,
        suffix: "+",
        label: "CR Saves In Property Investment",
        subtext: "Maximized financial yield & smart negotiation"
      },
      {
        number: 1000,
        suffix: "+",
        label: "Happy Clients",
        subtext: "Discerning families & corporate enterprises"
      },
      {
        number: 25,
        suffix: "+",
        label: "Years of Trust and Experience",
        subtext: "Unbroken leadership in DLF Gurugram"
      }
    ]
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
    // eslint-disable-next-line
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
