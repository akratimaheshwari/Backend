import mongoose from 'mongoose';

const order = new mongoose.Schema({
  renter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  order_date: { type: Date, default: Date.now },
  delivery_date: Date,
  delivery_slot: String,
  delivery_partner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'returned'],
    default: 'pending'
  }
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model('Order', order);
export default Order;