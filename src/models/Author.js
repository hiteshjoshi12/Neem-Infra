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

const authorSchema = new mongoose.Schema(
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
    bio: {
      type: String,
      trim: true
    },
    image: {
      type: String
    },
    jobTitle: {
      type: String,
      trim: true
    },
    expertise: [
      {
        type: String,
        trim: true
      }
    ],
    socialProfiles: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true }
    },
    email: {
      type: String,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    publishedPostCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

authorSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
  }
});

export default mongoose.models.Author || mongoose.model('Author', authorSchema);
