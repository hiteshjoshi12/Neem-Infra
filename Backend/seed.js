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
      experienceCounter: {
        badge: "25+ Years of Unmatched Advisory",
        headline: "Years of Experience as a Top Real Estate Consultant in DLF Gurugram",
        description: "Our stellar team, trusted property dealers in Gurgaon and experts in commercial real estate in Gurugram, ensures you have a hassle-free experience finding the right property. We are committed to serving our clients with dedication, putting their needs above all else. Providing personalized solutions for all your property-related queries, we know that a satisfied customer is our greatest asset.",
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
        description: "Our expert team is ready to assist you with a wide range of residential, commercial, and industrial properties tailored to your preferences and convenience. Contact us to discuss your requirements and find the perfect property solution.",
        phone: "+91 98112 21207"
      }
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
        p2: "We're your one-stop platform for smart property solutions combining local expertise with the best deals to match your needs and budget."
      }
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
