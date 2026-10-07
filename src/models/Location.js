import mongoose from 'mongoose';

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    city: {
      type: String,
      default: 'Gurugram',
      trim: true
    },
    state: {
      type: String,
      default: 'Haryana',
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    marketOverview: {
      avgPriceRange: { type: String, trim: true },
      typicalPlotSizes: [{ type: String, trim: true }],
      inventoryType: { type: String, trim: true },
      keyStrengths: [{ type: String, trim: true }],
      connectivity: [{ type: String, trim: true }],
      zoningNorms: { type: String, trim: true }
    },
    // Verified coordinates (only verified, never invented)
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    propertyTypes: [{ type: String, trim: true }],
    nearbyLocations: [
      {
        slug: { type: String, trim: true },
        name: { type: String, trim: true },
        distance: { type: String, trim: true },
        highlights: { type: String, trim: true }
      }
    ],
    relatedServices: [
      {
        title: { type: String, trim: true },
        href: { type: String, trim: true },
        description: { type: String, trim: true }
      }
    ],
    faqs: [
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true }
      }
    ],
    seoTitle: {
      type: String,
      trim: true
    },
    seoDescription: {
      type: String,
      trim: true
    },
    canonicalUrl: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

locationSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
  }
});

export default mongoose.models.Location || mongoose.model('Location', locationSchema);

