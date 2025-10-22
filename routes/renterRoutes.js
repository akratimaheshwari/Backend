import express from 'express';
import { getRenterDashboardData } from '../controllers/renterController.js'; 
import { verifyToken } from '../middleware/authMiddleware.js'; // Use your existing auth middleware

const router = express.Router();

// Route: GET /api/renter/dashboard
// Purpose: Fetch all user-specific data (rentals, history, stats)
router.get('/dashboard', verifyToken, getRenterDashboardData);

export default router;