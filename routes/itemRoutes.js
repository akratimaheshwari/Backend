import express from 'express';
const router = express.Router();
import { createItem, getItems,updateItem,deleteItem } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/', verifyToken, createItem);
router.get('/', getItems);
router.put('/:id', verifyToken, updateItem);   // 🔐 Protected
router.delete('/:id', verifyToken, deleteItem);

export default router;
