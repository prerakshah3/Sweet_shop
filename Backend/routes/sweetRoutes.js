const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const { upload } = require('../utils/cloudinary');

router.post('/', upload.single('image'), sweetController.addSweet);
router.delete('/:sweetId', sweetController.deleteSweet);
router.get('/', sweetController.getAllSweets);
router.get('/search', sweetController.searchSweets);
router.get('/sort', sweetController.sortSweets);
router.put('/purchase', sweetController.purchaseSweet);
router.put('/restock', sweetController.restockSweet);
router.put('/:sweetId', upload.single('image'), sweetController.updateSweet);

module.exports = router;