const Sweet = require('../models/Sweet');

// Add a new sweet
exports.addSweet = async (req, res) => {
  try {
    const { sweetId, name, category, price, quantity } = req.body;
    const sweet = new Sweet({ sweetId, name, category, price, quantity });
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findOneAndDelete({ sweetId: req.params.sweetId });
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ message: 'Sweet deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search sweets
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = new RegExp(category, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sortSweets = async (req, res) => {
  try {
    const { sortBy, order = 'asc' } = req.query;
    const sortOrder = order === 'asc' ? 1 : -1;
    const sweets = await Sweet.find().sort({ [sortBy]: sortOrder });
    res.json(sweets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Purchase sweets
exports.purchaseSweet = async (req, res) => {
  try {
    const { sweetId, quantity } = req.body;
    const sweet = await Sweet.findOne({ sweetId });
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    sweet.quantity -= quantity;
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
