import User from '../models/user.js';
export const getAdminDashboard = (req, res) => {
//   const user = req.user; // this comes from the verifyAdmin middleware

  res.status(200).json({
    message: 'Welcome to Admin Dashboard',
    // admin: {
    //   id: user.id,
    //   email: user.email || 'N/A',
    //   isAdmin: user.isAdmin
    // }
  });
};
export const makeUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: 'User promoted to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
