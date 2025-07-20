import Order from '../models/order.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const createOrder = async (req, res) => {
  try {
    const {
      item_id,
      quantity,
      rentalPeriod,
      startDate,
      endDate,
      totalAmount
    } = req.body;

    const newOrder = new Order({
      renter_id: req.user.id,
      item_id,
      quantity,
      rentalPeriod,
      startDate,
      endDate,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: 'Booking confirmed', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ renter_id: req.user.id })
      .populate('renter_id', 'name email phone')
      .populate('items.item_id', 'title description pricing images');

    const cleanedOrders = orders.map(order => {
      const filteredItems = order.items.filter(i => i.item_id !== null);
      return {
        ...order._doc,
        items: filteredItems
      };
    });

    res.status(200).json(cleanedOrders);
  } catch (err) {
    console.error('Failed to get orders:', err);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};



export const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'item',
        match: { owner_id: req.user._id }, // filter items owned by logged-in user
      })
      .populate('renter_id', 'name email phone');

    const filteredOrders = orders.filter(order => order.item !== null);

    res.json(filteredOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch owner orders' });
  }
};



export const checkout = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;


    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }
    // check for self order
    for (const item of items) {
      const dbItem = await Item.findById(item.item_id);
      if (!dbItem) {
        return res.status(404).json({ message: 'Item not found' });
      }

      if (dbItem.owner_id.toString() === userId) {
        return res.status(403).json({ message: 'You cannot rent your own item' });
      }
    }
    const newOrder = new Order({
      renter_id: req.user.id,
      items,
      totalAmount,
      shippingAddress, // Embedded address snapshot
     paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    });

    await newOrder.save();
    // await Cart.deleteMany({ user_id: req.user.id });
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: err.message });
  }
};

