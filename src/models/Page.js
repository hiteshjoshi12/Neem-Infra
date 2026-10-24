import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    pageType: {
      type: String,
      enum: ['system', 'custom', 'corridor', 'service'],
      default: 'custom',
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },

    // On-Page Content Elements
    h1: {
      type: String,
      trim: true,
      default: '',
    },
    h2: {
      type: String,
      trim: true,
      default: '',
    },
    directAnswer: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    sections: [
      {
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        content: { type: String, default: '' },
        image: { type: String, default: '' },
        imageAlt: { type: String, default: '' },
        buttonText: { type: String, default: '' },
        buttonLink: { type: String, default: '' },
      },
    ],

    // Primary SEO & Meta
    metaTitle: {
      type: String,
      trim: true,
      default: '',
    },
    metaDescription: {
      type: String,
      trim: true,
      default: '',
    },
    canonicalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    focusKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // Meta Robots Directives
    robots: {
      index: { type: Boolean, default: true },
      follow: { type: Boolean, default: true },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
    },

    // Social Sharing (Open Graph & Twitter Cards)
    ogTitle: { type: String, trim: true, default: '' },
    ogDescription: { type: String, trim: true, default: '' },
    ogImage: { type: String, default: '' },
    ogImageAlt: { type: String, trim: true, default: '' },
    ogType: { type: String, default: 'website' },
    twitterCard: { type: String, default: 'summary_large_image' },

    // Breadcrumbs Navigation
    breadcrumbs: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    // Structured Data (JSON-LD Schema)
    schemaType: {
      type: String,
      enum: ['WebPage', 'AboutPage', 'ContactPage', 'RealEstateAgent', 'FAQPage', 'Article', 'Custom'],
      default: 'WebPage',
    },
    customSchemaJson: {
      type: String,
      default: '',
    },

    // FAQ Accordion & FAQPage Schema Generator
    faq: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    // Internal Linking Recommendations & In-Page Links
    internalLinks: [
      {
        text: { type: String, required: true },
        url: { type: String, required: true },
        target: { type: String, default: '_self' },
      },
    ],

    // Featured Image & Alt Text
    featuredImage: { type: String, default: '' },
    featuredImageAlt: { type: String, trim: true, default: '' },

    views: {
      type: Number,
      default: 0,
    },
    lastUpdatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

pageSchema.index({ slug: 1, status: 1 });
pageSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.models.Page || mongoose.model('Page', pageSchema);
