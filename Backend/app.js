require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db');
const sweetRoutes = require('./routes/sweetRoutes');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://prerakshah3.github.io'
  ],
  credentials: false
}));
app.use(express.json());

// Health and root routes (placed early for Render health checks)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.status(200).send('Sweet Shop API is running');
});

// Routes
app.use('/api/sweets', sweetRoutes);

// Serve static files for frontend
app.use(express.static('frontend/build'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));