import Wishlist from '../models/wishlist.js';

export const getWishlist = async (req, res) => {
  const userId = req.user.id;
  const wishlist = await Wishlist.findOne({ userId }).populate('items');
  res.json(wishlist?.items || []);
};

export const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) wishlist = new Wishlist({ userId, items: [itemId] });
  else if (!wishlist.items.includes(itemId)) wishlist.items.push(itemId);
  await wishlist.save();
  res.json({ success: true });
};

export const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const wishlist = await Wishlist.findOne({ userId });
  if (wishlist) {
    wishlist.items = wishlist.items.filter(id => id.toString() !== itemId);
    await wishlist.save();
  }
  res.json({ success: true });
};

export const toggleWishlist = async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [itemId] });
  } else {
    const index = wishlist.items.findIndex(id => id.toString() === itemId);
    if (index >= 0) {
      wishlist.items.splice(index, 1); // remove
    } else {
      wishlist.items.push(itemId); // add
    }
  }

  await wishlist.save();
  res.json({ success: true });
};


