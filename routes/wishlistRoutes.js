import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist,toggleWishlist } from '../controllers/wishlistController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getWishlist);
router.post('/add', verifyToken, addToWishlist);
router.delete('/remove/:itemId', verifyToken, removeFromWishlist);
router.post('/toggle/:itemId', verifyToken, toggleWishlist);

export default router;

