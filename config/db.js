const mongoose = require('mongoose');

const url = process.env.mongoURI

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;