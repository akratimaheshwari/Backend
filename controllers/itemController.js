import Item from '../models/item.js';

export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      pricing,
      condition,
      category,
      deposit,
      location,
      availability,
      contactInfo,
      images,
      rental_start_date,
      rental_end_date,
      quantity
    } = req.body;

    // ✅ Required fields validation (deposit is optional)
    if (
      !title ||
      !description ||
      !pricing?.per_day ||
      !category ||
      !condition ||
      !location ||
      !availability?.startDate ||
      !availability?.endDate ||
      !contactInfo?.phone ||
      !contactInfo?.email ||
      !images?.length
    ) {
      return res.status(400).json({ message: 'All required fields must be filled (deposit is optional).' });
    }

    const itemData = {
      owner_id: req.user._id,
      title,
      description,
      pricing,
      condition,
      category,
      images,
      location,
      availability,
      contactInfo,
      rental_start_date,
      rental_end_date,
      quantity
    };

    // ✅ Only add deposit if present and valid
    if (deposit !== undefined && !isNaN(deposit)) {
      itemData.deposit = Number(deposit);
    }

    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Error creating item:", err.message);
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
// controllers/itemController.js

export const getItemsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    const items = await Item.find({ owner_id: ownerId });
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// In your item controller (e.g. itemController.js)
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email'); // populate only necessary fields
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};
