import express from 'express';
const router = express.Router();
import { createOrder, getOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);

export default router;

