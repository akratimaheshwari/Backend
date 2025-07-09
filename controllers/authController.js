import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ isAdmin included here in token
    const token = jwt.sign(
      { id: user._id,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin  // ✅ send it in response too
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

