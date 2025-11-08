import express from 'express';
import { createItem, getItems,updateItem,deleteItem ,getItemsByOwner,getFeaturedItems,checkItemAvailability} from '../controllers/itemController.js';
import { getItemReviews, createItemReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; 
import Category from "../models/category.js";
import Item from "../models/item.js"; //  Add this line

// const upload = multer({ storage });
const router = express.Router();
router.post('/', verifyToken, upload.array("images", 5), createItem);
router.get('/', getItems);
// GET /api/items/owner
router.get('/owner', verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).populate('category');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});
router.get('/featured', getFeaturedItems);
router.get("/search", async (req, res) => {
  try {
    const { q, loc } = req.query;
    console.log("Incoming search:", { q, loc });

    if (!q && !loc) {
      return res.status(400).json({ message: "Search query or location is required" });
    }

    let searchCriteria = {};

    if (q) {
      const searchRegex = new RegExp(q, 'i');
      searchCriteria.$or = [
        { title: { $regex: searchRegex } },
        { name: { $regex: searchRegex } },
       
      ];
    }

    if (loc) {
      const locationCriteria = { location: { $regex: new RegExp(loc, 'i') } };
      searchCriteria = searchCriteria.$or
        ? { $and: [searchCriteria, locationCriteria] }
        : locationCriteria;
    }

    console.log("Final searchCriteria:", JSON.stringify(searchCriteria, null, 2));

    const items = await Item.find(searchCriteria);
    console.log("Found items:", items.length);

    res.json(items);
  } catch (error) {
    console.error("Search API Error:", error.message);
    res.status(500).json({ message: "Server error during search", error: error.message });
  }
});

router.put('/:id', verifyToken, updateItem);   //  Protected
router.delete('/:id', verifyToken, deleteItem);
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category')
      .populate('owner', 'name email'); // ✅ populate only needed fields

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET /api/items/category/:slug
router.get('/category/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const items = await Item.find({ category: category._id }).populate("category", "title slug");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/check-availability', verifyToken, checkItemAvailability);

router.get('/:id/reviews', getItemReviews); // public read
router.post('/:id/reviews', verifyToken, createItemReview); // protected: add review



export default router;