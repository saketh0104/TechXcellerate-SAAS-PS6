const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const scheduleRenewalReminders = require('./cronJobs/renewalReminders');
const authRoutes = require('./routes/auth');

dotenv.config(); // Load environment variables from .env

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://saas-subscription-manager-1.onrender.com",
  "https://saas-subscription-manager.onrender.com"
];

// CORS Configuration
const corsOptions = {
  origin: "https://tech-xcellerate-saas-ps-6-962nmog4e.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file!");
  process.exit(1); // Exit process with failure
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// API Routes
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running successfully!' });
});

app.use('/api', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Start Cron Jobs
scheduleRenewalReminders();

// Server Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
