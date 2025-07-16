const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
    sweetId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    quantity: { 
        type: Number,
        required: true,
          min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Sweet', sweetSchema);