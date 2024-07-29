require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const shareRoutes = require('./routes/shareRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const uri = process.env.MONGODB_URI; // Use environment variable for MongoDB URI

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
}

connectDB();

// Middleware
app.use(cors({
  origin: 'https://66a6e9c8c81f7ab5b9946e32--vermillion-smakager-28e6d8.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
