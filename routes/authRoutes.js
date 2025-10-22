import express from 'express';
import { loginUser } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModel.js'; // adjust path to your user model

const router = express.Router();

// Existing login route
router.post('/login', loginUser); // POST /api/auth/login

// New Google login route
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        profileImage: picture,
        password: null, // password is not needed for Google login
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: 'Google login failed' });
  }
});

export default router;
