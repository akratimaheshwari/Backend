import express from 'express';
import { createItem, getItems,updateItem,deleteItem } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

// const upload = multer({ storage });
const router = express.Router();

router.post('/', verifyToken, createItem);
router.get('/', getItems);
router.put('/:id', verifyToken, updateItem);   // 🔐 Protected
router.delete('/:id', verifyToken, deleteItem);

export default router;
