import mongoose from 'mongoose';

const notFoundLogSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    referrer: {
      type: String,
      default: '',
      trim: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    ip: {
      type: String,
      default: '',
    },
    hits: {
      type: Number,
      default: 1,
    },
    lastHitAt: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedRedirectTo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

notFoundLogSchema.index({ path: 1, resolved: 1 });
notFoundLogSchema.index({ hits: -1 });
// 30-day TTL index to automatically purge old 404 logs and bound collection size
notFoundLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.models.NotFoundLog || mongoose.model('NotFoundLog', notFoundLogSchema);
