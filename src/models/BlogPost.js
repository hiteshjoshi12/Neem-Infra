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

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    featuredImageAlt: { type: String, trim: true },
    
    // Relationships
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    authorSlug: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    categorySlug: { type: String, trim: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    propertyType: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PropertyType' }],
    relatedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }],
    relatedLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    
    // Status and Dates
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'archived'],
      default: 'draft',
      required: true
    },
    publishedAt: { type: Date },
    featured: { type: Boolean, default: false },
    readingTime: { type: Number, default: 0 },
    
    // SEO & Meta
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    focusKeyword: { type: String, trim: true },
    secondaryKeywords: [{ type: String, trim: true }],
    
    // Social
    socialTitle: { type: String, trim: true },
    socialDescription: { type: String, trim: true },
    socialImage: { type: String },
    
    // Structured Data / Extra
    tableOfContents: [
      {
        id: { type: String },
        title: { type: String },
        level: { type: Number }
      }
    ],
    faq: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],
    schemaData: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
