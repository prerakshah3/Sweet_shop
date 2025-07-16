const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');

router.post('/', sweetController.addSweet);
router.delete('/:sweetId', sweetController.deleteSweet);

module.exports = router;