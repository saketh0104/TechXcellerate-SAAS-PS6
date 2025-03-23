const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const scheduleRenewalReminders = require("./cronJobs/renewalReminders");
const authRoutes = require("./routes/auth");

dotenv.config(); // Load environment variables

const app = express();

// ✅ Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://saas-subscription-manager-1.onrender.com",
  "https://saas-subscription-manager.onrender.com",
  "https://tech-xcellerate-saas-ps-6.vercel.app" // ✅ Corrected Vercel frontend URL
];

// ✅ Dynamic CORS Handling
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON requests

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ API Health Check
app.get("/api", (req, res) => {
  res.status(200).json({ message: "✅ API is running successfully!" });
});

// ✅ API Routes
app.use("/api", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// ✅ Start Cron Jobs (If needed)
scheduleRenewalReminders();

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
