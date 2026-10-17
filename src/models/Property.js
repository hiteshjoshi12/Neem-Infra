import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // sparse allows null or missing, but enforces unique if present
      trim: true
    },
    price: {
      type: String,
      required: true,
      trim: true
    },
    priceNumeric: {
      type: Number,
      index: true,
      default: 0
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    specs: {
      type: String,
      required: true,
      trim: true
    },
    desc: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'Featured'
    },
    link: {
      type: String,
      default: '/services/residential'
    },
    category: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'villa', 'penthouse'],
      default: 'residential'
    },
    bhk: {
      type: String,
      trim: true
    },
    bathrooms: {
      type: String,
      trim: true
    },
    plotArea: {
      type: String,
      trim: true
    },
    builtUpArea: {
      type: String,
      trim: true
    },
    facing: {
      type: String,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    },
    furnishing: {
      type: String,
      trim: true
    },
    parking: {
      type: String,
      trim: true
    },
    possession: {
      type: String,
      trim: true
    },
    reraNumber: {
      type: String,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    nearbyLandmarks: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    order: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

// Performance Indexes for fast catalog browsing and micro-market filtering
propertySchema.index({ isActive: 1, isFeatured: 1, order: 1 });
propertySchema.index({ isActive: 1, order: 1, createdAt: -1 });
propertySchema.index({ isActive: 1, category: 1, createdAt: -1 });
propertySchema.index({ isActive: 1, priceNumeric: 1 });
propertySchema.index({ location: 1 });
propertySchema.index({ createdAt: -1 });

propertySchema.pre('save', function () {
  if (this.price && (!this.priceNumeric || this.isModified('price'))) {
    const str = String(this.price).replace(/[₹,\s]/g, '').toLowerCase();
    const crMatch = str.match(/([\d.]+)\s*cr/);
    if (crMatch) {
      this.priceNumeric = parseFloat(crMatch[1]) * 10000000;
    } else {
      const lakhMatch = str.match(/([\d.]+)\s*(?:lakh|lac)/);
      if (lakhMatch) {
        this.priceNumeric = parseFloat(lakhMatch[1]) * 100000;
      } else {
        const rawNum = parseFloat(str);
        this.priceNumeric = isNaN(rawNum) ? 0 : rawNum;
      }
    }
  }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
