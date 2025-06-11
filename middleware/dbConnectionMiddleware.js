const connectToDatabase = require('../utils/dbConnect');

/**
 * Middleware to ensure database connection is established before processing requests
 * This is especially important in serverless environments where connections may be dropped
 * 
 * This middleware includes:
 * - Connection retry logic
 * - Detailed error reporting
 * - Performance optimization with connection caching
 */
const ensureDatabaseConnection = async (req, res, next) => {
  try {
    // Log the request path for debugging
    console.log(`Database connection check for: ${req.method} ${req.path}`);
    
    // Check MongoDB connection state before attempting to connect
    const currentState = mongoose.connection.readyState;
    if (currentState !== 1) {
      console.log(`MongoDB not connected. Current state: ${currentState}. Attempting to connect...`);
    }
    
    // Try to connect with retry logic built into the connectToDatabase function
    await connectToDatabase();
    
    // If we get here, connection was successful
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Service temporarily unavailable. Please try again later.';
    let statusCode = 503;
    
    // Customize error message based on error type
    if (error.name === 'MongooseServerSelectionError') {
      errorMessage = 'Unable to reach database server. Please try again later.';
    } else if (error.name === 'MongooseTimeoutError') {
      errorMessage = 'Database connection timed out. Please try again later.';
    } else if (error.message && error.message.includes('ENOTFOUND')) {
      errorMessage = 'Database host not found. Please try again later.';
    } else if (error.message && error.message.includes('MONGODB_URI environment variable is not defined')) {
      errorMessage = 'Database configuration error. Please contact support.';
      statusCode = 500;
    }
    
    return res.status(statusCode).json({
      success: false,
      message: 'Database connection failed',
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Make sure mongoose is available
const mongoose = require('mongoose');

module.exports = ensureDatabaseConnection;