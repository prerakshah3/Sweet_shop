const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');

router.post('/', sweetController.addSweet);


module.exports = router;