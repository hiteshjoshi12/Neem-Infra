import mongoose from 'mongoose';
import { WHY_CHOOSE_US_PILLARS, TRADITIONAL_VS_SAUDAGAR } from './legacy-constants/aboutData.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hitesh:hitesh@mom.ba5lcxw.mongodb.net/saudagar_properties';

async function seedCompleteAbout() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const pageAboutData = {
    hero: {
      badge: "About Saudagar Properties • 25+ Years Legacy",
      titleMain: "25+ Years of Leadership in ",
      titleItalic: "DLF Gurugram",
      description: "At Saudagar Properties, we aim to assist our customers by providing them optimal property solutions across commercial, industrial, and residential sectors in DLF Gurugram.",
      addressBadge: "Headquartered at 38, Akashneem Marg, DLF Phase 2, Gurugram",
      watchFilmText: "Watch corporate film",
      propositionBtnText: "Our Proposition",
      bgImage: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/cms/1792856162720_photo-1600585154340-be6161a56a0c_ySB-y7ArT.avif",
      stats: [
        { value: 25, suffix: "+", label: "Years Experience", subtext: "DLF Phase 1–5 Pioneers" },
        { value: 500, prefix: "₹", suffix: "Cr+", label: "Transaction Volume", subtext: "Delivered Seamlessly" },
        { value: 100, suffix: "%", label: "Direct & Transparent", subtext: "Zero Middlemen Fees" },
        { value: 5000, suffix: "+", label: "HNI Families & Corporates", subtext: "Enduring Relationships" }
      ]
    },
    videoShowcase: {
      badge: "Cinematic Film & Legacy",
      titleMain: "Inside Saudagar Properties: ",
      titleItalic: "Two Decades of Excellence",
      subtitle: "Take an exclusive inside look at our bespoke advisory, hands-on founder dedication, and turnkey property acquisitions across DLF Gurugram.",
      videoUrl: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/saudagar-hero.mp4"
    },
    offerings: {
      badge: "Prime Real Estate Portfolio",
      titleMain: "Our Core Property ",
      titleItalic: "Categories",
      subtitle: "Whether you seek an illustrious residential address, high-end commercial headquarters, or strategic investment land, we curate the finest options in DLF Gurugram.",
      items: [
        {
          id: 'kothis-flats',
          tag: 'Residential Distinction',
          title: 'Kothis / Flats',
          description: 'Want to stay in a lavish independent house or a premium apartment where you can get all the facilities and comforts? Let us find this for you in your desirable location.',
          features: [
            'Luxury Independent Builder Floors',
            'Grand Kothis & Mansions in DLF Phase 1–5',
            'Sky Penthouses on Golf Course Road',
            'Vastu-compliant architectural layouts'
          ],
          image: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/properties/1792833008161_JSpnTQfjQjNCzzkAQNnM-1024x768-1_mPxvFcTU2.webp',
          ctaText: 'Explore Residential',
          ctaLink: '/services/residential'
        },
        {
          id: 'office-spaces',
          tag: 'Commercial Elite',
          title: 'Office Spaces',
          description: 'Switch to modern office spaces with us which are spacious and extremely classy. We’ll help you to find the right space for you depending on the requirements and budget.',
          features: [
            'Grade-A Corporate Floor Plates',
            'Cyber City & Cyber Hub Proximity',
            'Flexible Leasing & Purchase Terms',
            'Strategic High-Footfall Commercial Hubs'
          ],
          image: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/properties/1792833139369_DLF-Phase-2_3wN55lC2N.avif',
          ctaText: 'Inquire Office Spaces',
          ctaLink: '/services/commercial'
        },
        {
          id: 'plots-land',
          tag: 'Capital Growth & ROI',
          title: 'Plots & Strategic Land',
          description: 'Looking for an optimum investment opportunity? Well, what could be better than investing your money on land and earn higher ROIs for all the coming years ahead with the property values increasing every year.',
          features: [
            'Freehold Residential Plots in DLF',
            'Commercial SCO (Shop-cum-Office) Plots',
            'Exponential Annual Capital Appreciation',
            'Thorough Due Diligence & Clean Titles'
          ],
          image: 'https://ik.imagekit.io/saudagarproperties/saudagar-properties/properties/1792833215284_Sushant-Lok-1_OcxYq8f0p.avif',
          ctaText: 'Discover Land Deals',
          ctaLink: '/services/industrial'
        }
      ]
    },
    proposition: {
      badge: "Our Proposition",
      titleMain: "Where Our ",
      titleItalic: "Expertise Lies",
      subtitle: "Let’s have a look at where our expertise lies and what it brings out for you.",
      pillars: [
        {
          id: "residential",
          number: "01",
          tag: "Residential Solutions",
          title: "Residential Plots, Kothis & Floors",
          headline: "Curating Dream Homes For Discerning Families",
          quote: "Our expertise lies in sale and purchase of Residential Plots, Kothis, Apartments & Builder floors. So, we suggest properties that can best serve your family’s needs.",
          keyPoints: [
            "Residential Plots & Kothis",
            "Designer Builder Floors",
            "Luxury Penthouses & Villas",
            "DLF Phase 1–5 & Sushant Lok"
          ],
          bgImage: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/properties/1792833276856_dlf-phase-2-block-k_dM3fS8n3D.avif",
          ctaText: "Explore Residential",
          ctaLink: "/services/residential"
        },
        {
          id: "commercial",
          number: "02",
          tag: "Commercial Advisory",
          title: "Strategic Corporate & Office Spaces",
          headline: "Where Visionary Ideas Flourish & Expand",
          quote: "Our experts offer advice to streamline and consolidate the right office space for you because we know that the greatest of ideas flourish when encouraged.",
          keyPoints: [
            "Modern Class-A Office Spaces",
            "Cyber City & Golf Course Road",
            "Corporate Floor Consolidation",
            "High-Yield Rental Opportunities"
          ],
          bgImage: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/properties/1792833327116_dlf-phase-2-j-block_F2m9oQW8k.avif",
          ctaText: "Inquire Office Spaces",
          ctaLink: "/services/commercial"
        },
        {
          id: "industrial",
          number: "03",
          tag: "Industrial Logistics",
          title: "Industrial Plots & Warehouses",
          headline: "Prime Logistics & Industrial Infrastructure",
          quote: "We offer unique solutions when it comes to buying industrial plots, warehouses, or grabbing other leasing opportunities. Finding the right space for you is our motto.",
          keyPoints: [
            "Strategic Industrial Plots",
            "High-Capacity Warehouses",
            "Institutional Long-term Leases",
            "Udyog Vihar & Key NCR Nodes"
          ],
          bgImage: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/properties/1792833777598_DLF-Phase-1_n8jY8L2kM.avif",
          ctaText: "Discover Industrial Deals",
          ctaLink: "/services/industrial"
        }
      ]
    },
    leadership: {
      badge: "Team of Experts",
      titleMain: "Visionary ",
      titleItalic: "Founders & Leadership",
      subtitle: "Meet the driving force behind Saudagar Properties, delivering two decades of real estate authority, personal attention, and unwavering integrity.",
      founders: [
        {
          name: "Mr. Arun Sharma",
          role: "Founder & Managing Director",
          badge: "Founder • 20+ Years Authority",
          experienceBadge: "20+ Years",
          image: "",
          bio: "Mr. Arun Sharma, the Founder of Saudagar properties Pvt Ltd is the force which drives us. A highly-experienced professional in Real Estate scenario with a career spanning more than two decades, his expertise includes skillful management of resources, and an astute and zealous work ethic. Inspite of years of experience behind him, he still ensures that every client is personally attended by him. His insistence on quality and consistency and his deft approach to the business has helped us scale new heights.",
          highlights: [
            "Over two decades of premier real estate leadership",
            "Personal involvement in every client consultation",
            "Astute & zealous management of resources",
            "Pioneering advisory in DLF Phase 1–5 & Gurugram"
          ],
          quote: "Quality, consistency, and personal dedication are the bedrock of lasting real estate value."
        },
        {
          name: "Mrs. Suneeta Chawla",
          role: "Co-Founder",
          badge: "Co-Founder • 10+ Years Veteran",
          experienceBadge: "10+ Years",
          image: "",
          bio: "Our co-founder and an esteemed veteran in the Real Estate market, Suneeta Chawla has been in the Real Estate Business for more than a decade now. Her keen instincts in the real estate business are remarkable. Her expertise and pragmatic approach has led to many successful deals in the past. We shall now and forever value her resourcefulness and integrity. She is one of the pillars that hold this venture sturdily.",
          highlights: [
            "Over a decade of astute market transactions",
            "Pragmatic approach delivering high-ROI results",
            "Remarkable instincts in luxury real estate",
            "A foundational pillar of resourcefulness & integrity"
          ],
          quote: "Resourcefulness and integrity turn property decisions into lifelong generational wealth."
        }
      ],
      teamMembers: [
        {
          name: "Ankit Sharma",
          designation: "Senior Client Advisory",
          image: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/team/1792856484183_Mohit-2-copy_mUTsqe8rH.avif"
        },
        {
          name: "Bhavishya Sharma",
          designation: "Luxury Investment Specialist",
          image: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/team/1792856494425_Bhavishyasharma-1_NtTbLEFNW.avif"
        },
        {
          name: "Shyam Upreti",
          designation: "Commercial & Portfolio Lead",
          image: "https://ik.imagekit.io/saudagarproperties/saudagar-properties/team/1792856511270_shyam-upreti_xnomqWNS4.avif"
        }
      ],
      impactStats: [
        { value: 100, suffix: "+", label: "CR Saves In Property Investment", desc: "Optimized value and negotiations" },
        { value: 1000, suffix: "+", label: "Happy Clients", desc: "Families & corporate executives" },
        { value: 25, suffix: "+", label: "Years of Trust and Experience", desc: "DLF Gurugram market authority" }
      ]
    },
    whyChooseUs: {
      badge: "Why Choose Saudagar Properties • Fiduciary Distinction",
      titleMain: "The Saudagar Distinction: 7 Strategic Pillars of Trust & ",
      titleItalic: "Market Leadership",
      subtitle: "Beyond standard brokerage, we provide institutional due diligence, verified 30-year deed tracing, and confidential executive advisory.",
      gridBadge: "Core Strategic Advisory Pillars • Generational Authority",
      gridTitle: "Strategic Pillars of Client Excellence & Asset Protection",
      gridSubtitle: "Beyond founder-level representation, Saudagar Properties adheres to six rigorous advisory disciplines...",
      pillars: WHY_CHOOSE_US_PILLARS,
      comparisonMatrix: TRADITIONAL_VS_SAUDAGAR
    },
    consultationCta: {
      badge: "Private Advisory Desk",
      titleMain: "Schedule a Confidential Consultation with ",
      titleItalic: "Senior Leadership",
      description: "Whether acquiring an off-market builder floor, leasing a Cyber City floor plate, or investing in strategic land, speak directly with our founders.",
      phone: "+91 97185 11207",
      whatsappUrl: "https://wa.me/919718511207?text=Hello%20Saudagar%20Properties%2C%20I%20would%20like%20to%20request%20a%20consultation%20for%20property%20in%20DLF%20Gurugram."
    }
  };

  const result = await db.collection('sectioncontents').updateOne(
    { sectionKey: 'page_about' },
    {
      $set: {
        sectionKey: 'page_about',
        title: 'About Us Page Content',
        data: pageAboutData,
        lastUpdatedBy: 'Admin (Complete Seed)'
      }
    },
    { upsert: true }
  );

  console.log('✓ Successfully seeded complete page_about into MongoDB sectioncontents!');
  console.log('Upserted/Modified Count:', result.upsertedCount || result.modifiedCount);
  await mongoose.disconnect();
}

seedCompleteAbout().catch(console.error);
