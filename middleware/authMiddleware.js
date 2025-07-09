import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ DEBUG LOGS
  console.log("🔐 Token received:", token);
  console.log("🔑 Verifying with secret:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };

    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


/// middleware/verifyAdmin.js
export const verifyAdmin = (req, res, next) => {
  console.log("🔐 Admin check:", req.user?.isAdmin); 
  if (!req.user?.isAdmin) {
    
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  console.log("🔐 Admin check:", req.user?.isAdmin);

  next();
};


// Check if user is active
// export const verifyActive = (req, res, next) => {
//   if (!req.user || req.user.isActive === false) {
//     return res.status(403).json({ message: 'Account is deactivated' });
//   }
//   next();
// };

