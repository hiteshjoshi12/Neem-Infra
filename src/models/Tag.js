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

const tagSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

tagSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
  }
});

export default mongoose.models.Tag || mongoose.model('Tag', tagSchema);
