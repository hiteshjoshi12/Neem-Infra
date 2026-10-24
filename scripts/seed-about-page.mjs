import mongoose from 'mongoose';
import { DEFAULT_SECTIONS } from './legacy-constants/defaultSections.js';

async function seedAbout() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  const aboutContent = { ...DEFAULT_SECTIONS.page_about };

  // Ensure clean ImageKit / Unsplash image URLs for founders
  if (aboutContent.leadership?.founders) {
    aboutContent.leadership.founders = [
      {
        name: "Mr. Arun Sharma",
        role: "Founder & Managing Director",
        badge: "Founder • 20+ Years Authority",
        experienceBadge: "20+ Years",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        bio: "Our co-founder and an esteemed veteran in the Real Estate market, Suneeta Chawla has been in the Real Estate Business for more than a decade now. Her keen instincts in the real estate business are remarkable. Her expertise and pragmatic approach has led to many successful deals in the past. We shall now and forever value her resourcefulness and integrity. She is one of the pillars that hold this venture sturdily.",
        highlights: [
          "Over a decade of astute market transactions",
          "Pragmatic approach delivering high-ROI results",
          "Remarkable instincts in luxury real estate",
          "A foundational pillar of resourcefulness & integrity"
        ],
        quote: "Resourcefulness and integrity turn property decisions into lifelong generational wealth."
      }
    ];
  }

  const res = await db.collection('sectioncontents').updateOne(
    { sectionKey: 'page_about' },
    {
      $set: {
        sectionKey: 'page_about',
        page: 'about',
        name: 'About Us Page Content',
        content: aboutContent,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );

  console.log('Seeded page_about to MongoDB:', res);
  await mongoose.disconnect();
}

seedAbout();
