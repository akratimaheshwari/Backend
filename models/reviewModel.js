import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
