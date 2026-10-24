import { connectDB } from '../src/lib/mongodb.js';

async function main() {
  const m = await connectDB();
  const db = m.connection.db;

  const currentYears = Math.max(1, new Date().getFullYear() - 1999);
  console.log(`Current years calculated from 1999: ${currentYears}`);

  // Helper to deep replace in any object/string
  function replaceTokensInObject(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      return obj
        .replace(/\b25\+\s*Years of Dedicated Authority/gi, `{{yearsExperience}}+ Years of Dedicated Authority`)
        .replace(/\b25\+\s*Years of Trust and Experience/gi, `{{yearsExperience}}+ Years of Trust and Experience`)
        .replace(/\b25\+\s*Years of Real Estate Excellence/gi, `{{yearsExperience}}+ Years of Real Estate Excellence`)
        .replace(/\b25\+\s*Years of Unmatched Advisory/gi, `{{yearsExperience}}+ Years of Unmatched Advisory`)
        .replace(/\b25\+\s*years of dedicated authority/gi, `{{yearsExperience}}+ years of dedicated authority`)
        .replace(/\b25\+\s*years of trusted advisory/gi, `{{yearsExperience}}+ years of trusted advisory`)
        .replace(/\b25\+\s*years of trusted real estate advisory/gi, `{{yearsExperience}}+ years of trusted real estate advisory`)
        .replace(/\b25\+\s*years of authority/gi, `{{yearsExperience}}+ years of authority`)
        .replace(/\b25\+\s*years of experience/gi, `{{yearsExperience}}+ years of experience`)
        .replace(/\b25\+\s*years/gi, `{{yearsExperience}}+ years`)
        .replace(/\b25\+\s*Years/gi, `{{yearsExperience}}+ Years`)
        .replace(/\b25\+/g, `{{yearsExperience}}+`);
    }
    if (Array.isArray(obj)) {
      return obj.map(replaceTokensInObject);
    }
    if (typeof obj === 'object') {
      const updated = {};
      for (const [k, v] of Object.entries(obj)) {
        updated[k] = replaceTokensInObject(v);
      }
      return updated;
    }
    return obj;
  }

  // 1. Pages
  const pages = await db.collection('pages').find({}).toArray();
  for (const p of pages) {
    const updated = replaceTokensInObject(p);
    delete updated._id;
    await db.collection('pages').updateOne({ _id: p._id }, { $set: updated });
    console.log(`Updated page: ${p.slug}`);
  }

  // 2. SectionContents
  const sections = await db.collection('sectioncontents').find({}).toArray();
  for (const s of sections) {
    const updated = replaceTokensInObject(s);
    delete updated._id;
    await db.collection('sectioncontents').updateOne({ _id: s._id }, { $set: updated });
    console.log(`Updated section: ${s.sectionKey}`);
  }

  // 3. BusinessProfiles
  const profiles = await db.collection('businessprofiles').find({}).toArray();
  for (const bp of profiles) {
    const updated = replaceTokensInObject(bp);
    delete updated._id;
    await db.collection('businessprofiles').updateOne({ _id: bp._id }, { $set: updated });
    console.log(`Updated businessprofile: ${bp.singletonKey}`);
  }

  console.log('--- Migration completed successfully ---');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
