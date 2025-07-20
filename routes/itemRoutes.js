import express from 'express';
import { createItem, getItems,updateItem,deleteItem ,getItemsByOwner} from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; 
import Category from "../models/category.js";
import Item from "../models/item.js"; // ✅ Add this line

// const upload = multer({ storage });
const router = express.Router();

router.post('/', verifyToken, upload.array("images", 5), createItem);
router.get('/', getItems);
// GET /api/items/owner
router.get('/owner', verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ owner_id: req.user._id }).populate('category');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const items = await Item.find().limit(4); // Or add .sort() or filters if needed
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch featured items' });
  }
});

router.put('/:id', verifyToken, updateItem);   // 🔐 Protected
router.delete('/:id', verifyToken, deleteItem);
router.get("/category/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    // Step 1: Find category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 2: Find items with that category _id
    const items = await Item.find({ category: category._id }).populate("category", "title slug");

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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


router.get('/featured', async (req, res) => {
  try {
    const items = await Item.find().limit(4); // Or add .sort() or filters if needed
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch featured items' });
  }
});


// GET /api/items/category/:slug
router.get('/category/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const items = await Item.find({ category: category.name }); // or category._id if referenced by id
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;
