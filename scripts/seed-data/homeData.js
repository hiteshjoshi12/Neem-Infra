/**
 * Structured Fallback Data for Home Page Sections
 * Segregated to keep component files clean, lightweight, and performant.
 */

export const DEFAULT_TOP_CONSULTANT_DATA = {
  badge: "Bespoke Real Estate Advisory",
  headlineMain: "Top Real Estate Consultant",
  headlineItalic: "In DLF Gurugram",
  summaryQuote: "Authorized advisor and trusted partner for DLF Phase 1–4, Sushant Lok, and Cybercity’s most exclusive residential & commercial estates.",
  cardBadge: "DLF Authorized & Verified",
  paragraph1: "At Saudagar Properties, we are proud to be recognized as the premier real estate consultant in DLF Gurugram. We provide personalized, end-to-end solutions across residential, commercial, and industrial sectors with maximum ROI.",
  paragraph2: "Whether you are seeking an ultra-luxury builder floor in DLF Phase 1–4, a high-street commercial office in Udyog Vihar, or an investment-ready plot, our veteran team guides you through transparent transactions and seamless legal title verification.",
  categories: [
    { title: "Residential", subtitle: "Floors & Villas", icon: "Building", href: "/services/residential" },
    { title: "Commercial", subtitle: "Offices & Retail", icon: "Building2", href: "/services/commercial" },
    { title: "Industrial", subtitle: "Plots & Assets", icon: "Factory", href: "/services/industrial" }
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
};

export const DEFAULT_WHY_CHOOSE_US_DATA = {
  badge: "The Saudagar Advantage",
  titleMain: "Why Elite Families & Investors Choose",
  titleItalic: "Saudagar Properties",
  description: "Beyond conventional broking, our advisory model delivers fiduciary integrity, exclusive off-market inventory, and rigorous due diligence across DLF Phase 1–5 and prime Gurugram micro-markets.",
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
};

export const DEFAULT_TESTIMONIALS_DATA = [
  {
    name: "Deepak Arora",
    role: "Investor",
    location: "Dubai, UAE",
    propertyType: "DLF Phase 1 Floor",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: "Selecting a best real estate consultant in Gurugram, especially one who is trustworthy, experienced, and honest, is the basic pillar of investment. From their before sales to after sales service, I can definitely say that customer satisfaction is in the company's DNA. Extremely happy to approach them for my investment decisions and will look up to the same in future too.",
    tag: "NRI Investment Advisory"
  },
  {
    name: "Kedarnath Gupta",
    role: "Investor",
    location: "Dubai, UAE",
    propertyType: "DLF Phase 2 Floor",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    quote: "Choosing the right home is a very important aspect of any individual's life. With their decade-long experience in the Gurgaon real estate market, Saudagar Properties Pvt. Ltd. played a key role in ensuring that I was making the right decision while choosing my dream home by providing the right push when needed, and cautioning me when necessary. I owe the team a huge part of my dream.",
    tag: "High-Value Transaction"
  },
  {
    name: "Saravjit Dasaan",
    role: "Investor & End User",
    location: "India",
    propertyType: "Sushant Lok Villa",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    quote: "The team seamlessly took over everything, from research, visit, paperwork to maintenance. Amidst a plethora of options, Saudagar Properties shortlisted the best residential properties in Gurgaon according to my needs and comfort. It has been a delight working with the highly-qualified and seasoned team. I would recommend their services to all my friends and acquaintances.",
    tag: "End-to-End Concierge"
  }
];
