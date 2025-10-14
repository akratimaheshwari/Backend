import express from 'express';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser); // POST /api/auth/login

export default router;
