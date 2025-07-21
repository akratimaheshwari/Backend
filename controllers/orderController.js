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
    const ownerId = req.user.id;

    const itemsOwned = await Item.find({ owner_id: ownerId }).select('_id');
    const itemIds = itemsOwned.map(item => item._id);

    const orders = await Order.find({ 'items.item': { $in: itemIds } })
      .populate('items.item')
      .populate('user', 'name email');

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching owner orders' });
  }
};



import Item from '../models/item.js';

export const checkout = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

     console.log('🛒 Checkout request body:', req.body);
    console.log('👤 Renter ID:', req.user.id);
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    // ✅ Fetch item details from DB to check ownership
    // const itemIds = items.map(i => i.item_id);
    // const dbItems = await Item.find({ _id: { $in: itemIds } });

    // const selfOwnedItem = dbItems.find(item => {
    //   const ownerId = item.owner_id?.toString();
    //   return ownerId === req.user.id;
    // });

    // if (selfOwnedItem) {
    //   return res.status(400).json({
    //     message: `❌ You cannot rent your own item: "${selfOwnedItem.title}". Please remove it from cart.`
    //   });
    // }

    const newOrder = new Order({
      renter_id: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: err.message });
  }
};

