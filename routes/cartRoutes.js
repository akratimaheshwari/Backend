import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getCart);                  // GET /api/cart
router.post('/add', addToCart);            // POST /api/cart/add
router.delete('/:itemId', removeFromCart); // DELETE /api/cart/:itemId

export default router;
