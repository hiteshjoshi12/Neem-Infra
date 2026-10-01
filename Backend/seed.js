import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import SectionContent from './models/SectionContent.js';
import Property from './models/Property.js';
import Testimonial from './models/Testimonial.js';

dotenv.config();

const INITIAL_PROPERTIES = [
  {
    title: "DLF Phase 2 Luxury Floor",
    price: "₹5.75 Cr",
    location: "DLF Phase 2, Gurugram",
    specs: "4 BHK • 3,200 Sq.Ft • Park Facing",
    tag: "Exclusive Floor",
    desc: "Italian marble flooring, private terrace garden, all-ensuite bedrooms with modular Italian kitchen and bespoke wardrobe fittings in DLF Phase 2.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    link: "/ready-to-move",
    category: "residential",
    order: 1,
    isFeatured: true,
    isActive: true
  },
  {
    title: "Sushant Lok 1 Executive Villa",
    price: "₹8.90 Cr",
    location: "Sushant Lok 1, Gurugram",
    specs: "5 BHK • 5,000 Sq.Ft • Private Pool",
    tag: "Designer Villa",
    desc: "Architect-designed independent villa featuring expansive double-height living spaces, home theatre room, private elevator and heated dip pool.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    link: "/ready-to-move",
    category: "villa",
    order: 2,
    isFeatured: true,
    isActive: true
  },
  {
    title: "DLF Phase 1 Green View Kothi",
    price: "₹12.50 Cr",
    location: "DLF Phase 1, Gurugram",
    specs: "500 Sq. Yds • 6 BHK • Private Lift",
    tag: "Grand Kothi",
    desc: "Imposing modern colonial facade with mature manicured lawns, basement recreation lounge, staff quarters, and dedicated 4-car stilt parking.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    link: "/ready-to-move",
    category: "residential",
    order: 3,
    isFeatured: true,
    isActive: true
  },
  {
    title: "Golf Course Ext. Sky Penthouse",
    price: "₹9.25 Cr",
    location: "Golf Course Ext. Road",
    specs: "4 BHK Duplex • 4,800 Sq.Ft",
    tag: "Sky Penthouse",
    desc: "Panoramic 360-degree Aravali range views, wrap-around sunset deck, double-height ceiling, automated climate controls and private rooftop lounge.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    link: "/ready-to-move",
    category: "penthouse",
    order: 4,
    isFeatured: true,
    isActive: true
  },
  {
    title: "DLF Phase 4 Corner Terrace Floor",
    price: "₹4.95 Cr",
    location: "DLF Phase 4, Gurugram",
    specs: "3 BHK + Lounge • 2,600 Sq.Ft",
    tag: "Prime Corner",
    desc: "Sunlit corner plot facing wide boulevard, exclusive rooftop barbecue deck with pergola, designer light accents and premium security automation.",
    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    link: "/ready-to-move",
    category: "residential",
    order: 5,
    isFeatured: true,
    isActive: true
  }
];

const INITIAL_TESTIMONIALS = [
  {
    name: "Deepak Arora",
    role: "Investor",
    location: "Dubai, UAE",
    propertyType: "DLF Phase 2 Luxury Floor",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: "Selecting a best real estate consultant in Gurugram, especially one who is trustworthy, experienced, and honest, is the basic pillar of investment. From their before sales to after sales service, I can definitely say that customer satisfaction is in the company's DNA. Extremely happy to approach them for my investment decisions and will look up to the same in future too.",
    tag: "NRI Investment Advisory",
    order: 1,
    isActive: true
  },
  {
    name: "Kedarnath Gupta",
    role: "Investor",
    location: "Dubai, UAE",
    propertyType: "Sushant Lok 1 Villa Estate",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    quote: "Choosing the right home is a very important aspect of any individual's life. With their decade-long experience in the Gurgaon real estate market, Saudagar Properties Pvt. Ltd. played a key role in ensuring that I was making the right decision while choosing my dream home by providing the right push when needed, and cautioning me when necessary. I owe the team a huge part of my dream.",
    tag: "High-Value Transaction",
    order: 2,
    isActive: true
  },
  {
    name: "Saravjit Dasaan",
    role: "Investor & End User",
    location: "Gurugram, India",
    propertyType: "Golf Course Ext. Duplex",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    quote: "The team seamlessly took over everything, from research, visit, paperwork to maintenance. Amidst a plethora of options, Saudagar Properties shortlisted the best residential properties in Gurgaon according to my needs and comfort. It has been a delight working with the highly-qualified and seasoned team. I would recommend their services to all my friends and acquaintances.",
    tag: "End-to-End Concierge",
    order: 3,
    isActive: true
  }
];

const INITIAL_SECTIONS = [
  {
    sectionKey: 'navbar',
    title: 'Navigation Bar & Brand Header',
    data: {
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
    }
  },
  {
    sectionKey: 'footer',
    title: 'Footer & Corporate Contact Strip',
    data: {
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
        { label: "Blog", href: "/blogs" },
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
    }
  },
  {
    sectionKey: 'floatingWidgets',
    title: 'Floating Action Widgets',
    data: {
      whatsappNumber: "919718511207",
      whatsappPrefill: "Hello Saudagar Properties, I am interested in luxury properties in DLF Gurugram.",
      backToTopTooltip: "Back to top",
      whatsappTooltip: "Chat on WhatsApp"
    }
  },
  {
    sectionKey: 'hero',
    title: 'Hero Section',
    data: {
      badge: "Luxury Builder Floors & Estates",
      headlinePrefix: "Gurgaon's Premier",
      headlineHighlight: "Real Estate",
      headlineSuffix: "Partner.",
      description: "Discover an exclusive portfolio of luxury builder floors, high-rise penthouses, and bespoke villas in DLF Phase 1–4, Sushant Lok & Golf Course Ext.",
      bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80",
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
    }
  },
  {
    sectionKey: 'topConsultant',
    title: 'Top Consultant Section',
    data: {
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
    }
  },
  {
    sectionKey: 'curatedCorridors',
    title: 'Curated Corridors Section',
    data: {
      badge: "Featured Portfolio",
      titleMain: "Featured",
      titleItalic: "Properties",
      description: "Handpicked luxury builder floors and independent villas in DLF Phase 1–4, Sushant Lok & Udyog Vihar."
    }
  },
  {
    sectionKey: 'services',
    title: 'Our Services Section',
    data: {
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
    }
  },
  {
    sectionKey: 'dlfCallout',
    title: 'DLF Property Callout & Stats',
    data: {
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
  },
  {
    sectionKey: 'whyChooseUs',
    title: 'Why Choose Us Section',
    data: {
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
    }
  },
  {
    sectionKey: 'testimonials',
    title: 'Testimonials Section',
    data: {
      badge: "Client Perspectives",
      titleMain: "Words of",
      titleItalic: "Distinction",
      subBadge: "Testimonial"
    }
  },
  {
    sectionKey: 'location',
    title: 'Location & Map Section',
    data: {
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
    }
  },
  {
    sectionKey: 'newsletter',
    title: 'Newsletter Section',
    data: {
      badge: "Market Intelligence",
      titleMain: "Subscribe To",
      titleItalic: "Saudagar Properties",
      titleSuffix: "Newsletter",
      description: "Sign up with your email address to receive curated off-market opportunities, DLF price trends, and the latest Gurgaon real estate updates.",
      guaranteeText: "Zero spam. Complete confidentiality. Unsubscribe at any time."
    }
  }
];

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting database seed...');

    // 1. Seed or Update Default Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@saudagarproperties.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({
        name: 'Saudagar Executive Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin'
      });
      console.log(`[Seeder] Created default admin account: ${adminEmail}`);
    } else {
      console.log(`[Seeder] Admin account already exists: ${adminEmail}`);
    }

    // 2. Seed Section Contents
    for (const sec of INITIAL_SECTIONS) {
      await SectionContent.findOneAndUpdate(
        { sectionKey: sec.sectionKey },
        {
          sectionKey: sec.sectionKey,
          title: sec.title,
          data: sec.data,
          lastUpdatedBy: 'System Seeder'
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`[Seeder] Seeded ${INITIAL_SECTIONS.length} homepage CMS sections.`);

    // 3. Seed Properties if none exist
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      await Property.insertMany(INITIAL_PROPERTIES);
      console.log(`[Seeder] Seeded ${INITIAL_PROPERTIES.length} initial properties.`);
    } else {
      console.log(`[Seeder] Database already has ${propertyCount} properties.`);
    }

    // 4. Seed Testimonials if none exist
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(INITIAL_TESTIMONIALS);
      console.log(`[Seeder] Seeded ${INITIAL_TESTIMONIALS.length} client testimonials.`);
    } else {
      console.log(`[Seeder] Database already has ${testimonialCount} testimonials.`);
    }

    console.log('[Seeder] Database seed completed successfully!');
  } catch (error) {
    console.error('[Seeder Error]', error);
  }
};

// If run directly via `node seed.js`
if (process.argv[1]?.includes('seed.js')) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('[Seeder] Connected to MongoDB Atlas.');
      await seedDatabase();
      process.exit(0);
    } catch (err) {
      console.error('[Seeder Failed]', err.message);
      process.exit(1);
    }
  })();
}
