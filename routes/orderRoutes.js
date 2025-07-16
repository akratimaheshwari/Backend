import express from 'express';
const router = express.Router();
import { createOrder, getOrders,getOwnerOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/owner', verifyToken, getOwnerOrders); // ✅ Owner's rental orders
export default router;

