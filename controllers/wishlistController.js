import Wishlist from '../models/wishlist.js';

export const addToWishlist = async (req, res) => {
  const { item_id } = req.body;
  const wishlist = await Wishlist.create({ user_id: req.user._id, item_id });
  res.status(201).json(wishlist);
};

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.find({ user_id: req.user._id }).populate('item_id');
  res.json(wishlist);
};

