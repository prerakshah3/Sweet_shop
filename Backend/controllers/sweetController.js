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

