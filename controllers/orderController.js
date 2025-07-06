import Order from '../models/order.js';
import jwt from 'jsonwebtoken';
export const createOrder = async (req, res) => {
  try {
    const { item_id, delivery_date, delivery_slot } = req.body;

    const order = await Order.create({
      renter_id: req.user._id, //  comes from token
      item_id,
      delivery_date,
      delivery_slot
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ renter_id: req.user._id })
      .populate('renter_id', 'name email phone')
      .populate('item_id', 'title description pricing rental_start_date rental_end_date quantity');

    const text = orders.map(order => {
      const startDate = order.item_id?.rental_start_date
        ? new Date(order.item_id.rental_start_date).toDateString()
        : 'N/A';
      const endDate = order.item_id?.rental_end_date
        ? new Date(order.item_id.rental_end_date).toDateString()
        : 'N/A';

      return `
Order ID: ${order._id}
User: ${order.renter_id?.name || 'N/A'} | ${order.renter_id?.email || 'N/A'} | ${order.renter_id?.phone || 'N/A'}
Item: ${order.item_id?.title || 'N/A'} - ${order.item_id?.description || 'N/A'}
Pricing: ₹${order.item_id?.pricing?.per_day || 0}/day, ₹${order.item_id?.pricing?.per_week || 0}/week, ₹${order.item_id?.pricing?.per_month || 0}/month

Rental Period: ${startDate} to ${endDate}
Quantity: ${order.item_id?.quantity || 1}
Status: ${order.status}
Date: ${new Date(order.createdAt).toDateString()}
---------------------------`;
    }).join('\n');

    res.set('Content-Type', 'text/plain');
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
};

