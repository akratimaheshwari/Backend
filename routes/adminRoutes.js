// import express from 'express';
// import { makeUserAdmin,getAdminDashboard } from '../controllers/adminController.js';
// import { getAllUsers } from '../controllers/userController.js';
// import { verifyToken } from '../middleware/authMiddleware.js';
// import { verifyAdmin } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.get('/users', verifyToken, verifyAdmin, (req, res) => {
//   console.log("✅ Admin route hit");
//   res.send("Admin access granted");
// });

// router.put('/users/:id/make-admin', verifyToken, verifyAdmin, makeUserAdmin);
// router.get('/dashboard', getAdminDashboard);
// router.get('/users', verifyToken, verifyAdmin, getAllUsers); // localhost:5000/admin/users
// export default router;
import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, getAllUsers);

router.get('/test', (req, res) => {
  console.log("✅ Admin /test route hit");
  res.send("Test route working");
});
export default router;

