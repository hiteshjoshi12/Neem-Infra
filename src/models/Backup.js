import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      trim: true,
      default: 'Manual System Backup',
    },
    sizeBytes: {
      type: Number,
      default: 0,
    },
    itemCounts: {
      pages: { type: Number, default: 0 },
      blogs: { type: Number, default: 0 },
      properties: { type: Number, default: 0 },
      categories: { type: Number, default: 0 },
      redirects: { type: Number, default: 0 },
      settings: { type: Number, default: 1 },
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

backupSchema.index({ createdAt: -1 });

export default mongoose.models.Backup || mongoose.model('Backup', backupSchema);
