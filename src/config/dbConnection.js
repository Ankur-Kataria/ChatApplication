const mongoose = require('mongoose');
const ENV = require("./DBConfig");
const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('MongoDB Connected');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
