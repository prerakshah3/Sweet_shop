require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db');
const sweetRoutes = require('./routes/sweetRoutes');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sweets', sweetRoutes);

// Serve static files for frontend
app.use(express.static('frontend/build'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));