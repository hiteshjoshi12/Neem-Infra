import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['newsletter', 'property_inquiry', 'general_contact'],
      default: 'newsletter'
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
    status: {
      type: String,
      enum: ['new', 'contacted', 'resolved'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
