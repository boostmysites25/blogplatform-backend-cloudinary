const connectToDatabase = require('../utils/dbConnect');

/**
 * Middleware to ensure database connection is established before processing requests
 * This is especially important in serverless environments where connections may be dropped
 */
const ensureDatabaseConnection = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: 'Service temporarily unavailable. Please try again later.'
    });
  }
};

module.exports = ensureDatabaseConnection;