const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Example route file
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(cors({ origin: "https://tech-xcellerate-saas-ps-6.vercel.app" }));

// If you want to allow multiple origins
// app.use(cors({ origin: ["https://your-frontend.com", "https://another.com"] }));

// If you want to allow all origins (not recommended for production)
// app.use(cors());

app.use(express.json());app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Example API route for login
app.use('/api', authRoutes);

// ✅ Default route
app.get('/', (req, res) => {
    res.send('SaaS Subscription Manager API is running...');
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
