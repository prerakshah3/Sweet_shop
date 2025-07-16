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
