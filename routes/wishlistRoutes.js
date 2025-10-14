import express from 'express';
import { addToWishlist, getWishlist } from '../controllers/wishlistController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, addToWishlist);
router.get('/', verifyToken, getWishlist);
export default router;
