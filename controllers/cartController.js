import User from '../models/user.js';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.item_id');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { item_id, quantity, rental_type, rental_start_date, rental_end_date } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart.push({ item_id, quantity, rental_type, rental_start_date, rental_end_date });
    await user.save();

    res.status(201).json({ message: 'Item added to cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(item => item._id.toString() !== itemId);
    await user.save();

    res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // cartItemId ka use karke user.cart ke andar ka ek item nikalo
    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    // quantity update
    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

