import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  title: { type: String, required: true },
  description: String,
  pricing:{
    per_day: { type:Number, required: true},
    per_week: { type: Number },
    per_month: { type: Number }
  },
  condition: {
    type: String,
    enum: ['new', 'good', 'used'],
    default: 'good'
  },
  // availability: { type: Boolean, default: true },
  //   rental_start_date: Date,
  //   rental_end_date: Date,
 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
  quantity: { type: Number, default: 1 },
  rental_start_date: Date,
  rental_end_date: Date,

}, { timestamps: true });
const Item = mongoose.models.Item|| mongoose.model('Item', itemSchema);
export default Item;