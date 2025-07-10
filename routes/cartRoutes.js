import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity
} from '../controllers/cartController.js';

import { verifyToken } from '../middleware/authMiddleware.js'; // ✅ ye import karo

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.delete('/remove/:itemId', verifyToken, removeFromCart);
router.patch('/update/:cartItemId', verifyToken, updateCartQuantity); // ✅ quantity update route

export default router;

