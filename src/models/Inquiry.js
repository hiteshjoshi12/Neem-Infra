import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['newsletter', 'property_inquiry', 'general_contact', 'contact_form', 'consultation', 'viewing_request', 'corridor_inquiry'],
      default: 'contact_form'
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    propertyTitle: {
      type: String,
      default: ''
    },
    preferredDate: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: 'website'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'resolved'],
      default: 'new'
    }
  },
  { timestamps: true }
);

// Performance Indexes for fast admin querying and CRM status filtering
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ type: 1 });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
