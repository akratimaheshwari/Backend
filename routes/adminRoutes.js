import express from 'express';
import { makeUserAdmin,getAdminDashboard } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/users/:id/make-admin', verifyToken, verifyAdmin, makeUserAdmin);
router.get('/dashboard', getAdminDashboard);
export default router;
