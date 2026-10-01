import mongoose from 'mongoose';

const sectionContentSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {}
    },
    lastUpdatedBy: {
      type: String,
      default: 'Admin'
    }
  },
  { timestamps: true }
);

export default mongoose.model('SectionContent', sectionContentSchema);
