import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually if dotenv is not loaded
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      if (k && v.length) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  });
}

import Property from '../src/models/Property.js';
import { LUXURY_PROPERTIES_DETAILED } from '../src/constants/propertiesData.js';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGO_URI is not set in environment or .env.local');
  process.exit(1);
}

async function seedProperties() {
  console.log('--- Connecting to MongoDB ---');
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB Connected successfully.');

  console.log(`Seeding ${LUXURY_PROPERTIES_DETAILED.length} luxury properties with complete specifications...`);

  for (let i = 0; i < LUXURY_PROPERTIES_DETAILED.length; i++) {
    const item = LUXURY_PROPERTIES_DETAILED[i];
    const docData = {
      title: item.title,
      slug: item.slug,
      price: item.price,
      location: item.location,
      specs: item.specs,
      desc: item.desc,
      img: item.img,
      images: item.images || [],
      tag: item.tag || 'Exclusive Floor',
      category: item.category || 'residential',
      bhk: item.bhk,
      bathrooms: item.bathrooms,
      plotArea: item.plotArea,
      builtUpArea: item.builtUpArea,
      facing: item.facing,
      floor: item.floor,
      furnishing: item.furnishing,
      parking: item.parking,
      possession: item.possession,
      reraNumber: item.reraNumber,
      features: item.features || [],
      nearbyLandmarks: item.nearbyLandmarks || [],
      order: i,
      isFeatured: true,
      isActive: true,
    };

    const updated = await Property.findOneAndUpdate(
      { slug: item.slug },
      { $set: docData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[OK] Property seeded: "${updated.title}" (slug: ${updated.slug}, ID: ${updated._id})`);
  }

  const count = await Property.countDocuments();
  console.log(`Total properties currently in database: ${count}`);
  await mongoose.disconnect();
  console.log('--- Seeding Complete ---');
}

seedProperties().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
