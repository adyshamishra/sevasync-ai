// 1. DNS Fix for University Networks (Prevents Gmail/MongoDB timeouts)
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 

require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');

// 2. Import Route Handlers
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes'); // New Auth Logic

const app = express();

// 3. Connect to MongoDB Atlas
connectDB();

// 4. Middleware
app.use(cors()); // Allows your React (Port 3000) to talk to this Server (Port 5000)
app.use(express.json()); // Allows the server to read JSON data sent from the frontend

// 5. Activate API Routes
app.use('/api/posts', postRoutes); // Handles Dashboard posts and SOS
app.use('/api/auth', authRoutes);   // Handles Forgot Password and Reset

// 6. Health Check Route (Verify if server is live by visiting http://localhost:5000)
app.get('/', (req, res) => {
  res.send('🚀 SevaSync AI Backend is Running and Auth is Linked');
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📡 Monitoring for Auth requests at http://localhost:${PORT}/api/auth`);
});