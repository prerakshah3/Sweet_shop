const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');

router.post('/', sweetController.addSweet);
router.delete('/:sweetId', sweetController.deleteSweet);
router.get('/', sweetController.getAllSweets);
router.get('/search', sweetController.searchSweets);
router.get('/sort', sweetController.sortSweets);
router.put('/purchase', sweetController.purchaseSweet);

module.exports = router;