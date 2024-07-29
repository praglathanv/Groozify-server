require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const shareRoutes = require('./routes/shareRoutes');
const userRoutes = require('./routes/userRoutes');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();

const uri = "mongodb+srv://groozify:yFLxe8VHoQp7bHeO@groozify.zecup2h.mongodb.net/?appName=Groozify";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
}

connectDB();

// Middleware
app.use(cors({
  origin: 'https://66a6e9c8c81f7ab5b9946e32--vermillion-smakager-28e6d8.netlify.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies, etc.)
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello world');
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/share', shareRoutes);

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
