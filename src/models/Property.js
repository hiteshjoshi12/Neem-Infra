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
    order: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
