import mongoose from 'mongoose';
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ match controller field
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]  // ✅ match controller field
}, { timestamps: true });

// const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;