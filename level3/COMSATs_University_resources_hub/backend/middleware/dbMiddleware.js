const mongoose = require('mongoose');

const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected! Ready state:', mongoose.connection.readyState);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB is running!'
    });
  }
  next();
};

module.exports = { checkMongoConnection };
