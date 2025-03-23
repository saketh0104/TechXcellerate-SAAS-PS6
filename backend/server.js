const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Example route file
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// ✅ Enable CORS for your frontend
const allowedOrigins = ['https://tech-xcellerate-saas-ps-6-962nmog4e.vercel.app'];
app.use(cors({
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
