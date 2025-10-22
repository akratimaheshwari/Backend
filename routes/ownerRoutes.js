import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js'; // Assuming you reuse this middleware
import { getOwnerDashboardData } from '../controllers/ownerController.js';

const router = express.Router();

// GET /api/owner/dashboard - Protected route to fetch all owner stats, listings, and bookings
router.get('/dashboard', verifyToken, getOwnerDashboardData);

// You can add other owner routes here (e.g., managing inventory, approving returns)

export default router;
