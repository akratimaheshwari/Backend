import Review from '../models/reviewModel.js';
import Item from '../models/item.js'; // optional, if you want to verify item exists
import User from '../models/user.js'; // optional, only if needed

export const getItemReviews = async (req, res) => {
  try {
    const itemId = req.params.id; // matches /api/items/:id/reviews
    // Optionally check item exists:
    // const itemExists = await Item.findById(itemId);
    // if (!itemExists) return res.status(404).json({ message: 'Item not found' });

    const reviews = await Review.find({ item: itemId }).populate('user', 'name');
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('getItemReviews error', error);
    return res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const createItemReview = async (req, res) => {
  try {
    const itemId = req.params.id; // POST /api/items/:id/reviews
    const userId = req.user?._id || req.userId; // depends on your verifyToken middleware
    const { rating, comment } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!rating) return res.status(400).json({ message: 'Rating is required' });

    const review = new Review({
      item: itemId,
      user: userId,
      rating,
      comment,
    });

    await review.save();
    const populated = await review.populate('user', 'name').execPopulate?.() || await Review.findById(review._id).populate('user', 'name');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('createItemReview error', error);
    return res.status(500).json({ message: 'Error creating review' });
  }
};
