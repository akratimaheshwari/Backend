import mongoose from 'mongoose';

const category = new mongoose.Schema({
  
  title: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', category);
export default Category;