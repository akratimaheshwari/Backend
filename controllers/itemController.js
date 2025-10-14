import Item from '../models/item.js';

export const createItem = async (req, res) => {
  try {
    const { title, description, pricing, condition, category, images, rental_start_date, rental_end_date, quantity } = req.body;

    if (!title || !pricing?.per_day || !description) {
      return res.status(400).json({ message: 'Title, per_day pricing and description are required' });
    }

    const item = await Item.create({
      owner_id: req.user._id,
      title,
      description,
      pricing,
      condition,
      category,
      images,
      rental_start_date,
      rental_end_date,
      quantity
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner_id', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure the logged-in user is the owner
    if (item.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not your item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure the logged-in user is the owner
    if (item.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not your item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};