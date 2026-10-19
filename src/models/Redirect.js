import mongoose from 'mongoose';

const redirectSchema = new mongoose.Schema(
  {
    fromPath: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    toPath: {
      type: String,
      required: true,
      trim: true,
    },
    statusCode: {
      type: Number,
      enum: [301, 302],
      default: 301,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    hits: {
      type: Number,
      default: 0,
    },
    lastHitAt: {
      type: Date,
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

redirectSchema.index({ fromPath: 1, isActive: 1 });

export default mongoose.models.Redirect || mongoose.model('Redirect', redirectSchema);
