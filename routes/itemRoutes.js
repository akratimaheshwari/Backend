import express from 'express';
import { createItem, getItems,updateItem,deleteItem } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; 
import Category from "../models/category.js";
import Item from "../models/item.js"; // ✅ Add this line

// const upload = multer({ storage });
const router = express.Router();

router.post('/', verifyToken, upload.array("images", 5), createItem);
router.get('/', getItems);
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
export default router;
