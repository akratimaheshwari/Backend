import express from 'express';
import { createUser, 
    getUsers,
    createUserAndRedirect,
    loginUserAndRedirect,
    updateUser,
    deleteUser,
    getLoggedInUser } 
    from '../controllers/userController.js';

import { verifyToken,verifyAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Public routes
router.post('/', createUser);                        // Signup API
router.post('/form', createUserAndRedirect);         // Signup via HTML form
router.post('/login', loginUserAndRedirect);         // Login via form

// Protected routes
router.get('/admin/users', verifyToken, verifyAdmin, getUsers); // ✅ Admin only 
router.put('/:id', verifyToken, updateUser);         // Update user (auth required)
router.delete('/:id', verifyToken, deleteUser);      // Delete user (auth required)
// Only logged-in user can get their own data
router.get('/profile', verifyToken, getLoggedInUser);


export default router;

