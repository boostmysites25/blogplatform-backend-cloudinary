const mongoose = require('mongoose');

// Cache the MongoDB connection
let cachedConnection = null;

/**
 * Connect to MongoDB with optimized settings for serverless environments
 * This function implements connection pooling and caching for better performance
 * in serverless environments like Vercel
 */
async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  // No cached connection or connection is not ready, create a new one
  console.log('Creating new database connection');
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Serverless optimized settings
      serverSelectionTimeoutMS: 60000, // 60 seconds
      socketTimeoutMS: 60000, // 60 seconds
      connectTimeoutMS: 60000, // 60 seconds
      // Disable buffering for serverless
      bufferCommands: false,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 0,
      // Other settings
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoReconnect: true,
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutes
      // Always use blog-platform as the database name
      dbName: 'blog-platform'
    });

    // Cache the connection
    cachedConnection = conn;
    
    // Set global query timeout
    mongoose.set('maxTimeMS', 60000);
    
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectToDatabase;