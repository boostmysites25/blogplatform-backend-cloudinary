const mongoose = require('mongoose');

// Cache the MongoDB connection
let cachedDb = null;
let connectionPromise = null;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_INTERVAL = 2000; // 2 seconds

// MongoDB connection options - using only supported options
const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 60000, // 60 seconds
  socketTimeoutMS: 60000, // 60 seconds
  connectTimeoutMS: 60000, // 60 seconds
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 0,
  dbName: 'blog-platform'
};

/**
 * Connect to MongoDB with optimized settings for serverless environments
 * This function implements connection pooling, caching, and retry logic
 * for better performance and reliability in serverless environments like Vercel
 */
async function connectToDatabase() {
  // If we already have a valid connection, return it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return mongoose;
  }

  // If a connection attempt is already in progress, wait for it
  if (isConnecting && connectionPromise) {
    console.log('Connection attempt already in progress, waiting...');
    return connectionPromise;
  }

  // Reset connection attempts if we're not in a retry cycle
  if (!isConnecting) {
    connectionAttempts = 0;
  }

  // Start a new connection attempt
  isConnecting = true;
  connectionPromise = (async () => {
    try {
      // Check if we need to close an existing broken connection
      if (mongoose.connection.readyState !== 0) {
        console.log(`Closing existing connection in state: ${mongoose.connection.readyState}`);
        await mongoose.connection.close();
      }

      console.log(`Creating new database connection (attempt ${connectionAttempts + 1}/${MAX_RETRY_ATTEMPTS})`);
      
      // Validate MongoDB URI
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }

      // Log connection attempt (without exposing credentials)
      const sanitizedUri = process.env.MONGODB_URI.replace(
        /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
        'mongodb$1://$2:****@'
      );
      console.log(`Connecting to MongoDB: ${sanitizedUri}`);

      // Connect with optimized settings for serverless
      // Using only supported options from our CONNECTION_OPTIONS object
      const conn = await mongoose.connect(process.env.MONGODB_URI, CONNECTION_OPTIONS);

      // Cache the connection
      cachedDb = conn;
      
      // Set global query timeout
      mongoose.set('maxTimeMS', 60000);
      
      // Reset connection state and attempts
      isConnecting = false;
      connectionAttempts = 0;
      
      console.log('MongoDB connected successfully');
      
      // Set up connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        cachedDb = null;
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        cachedDb = null;
      });
      
      // Verify connection with a simple operation
      await mongoose.connection.db.admin().ping();
      
      return mongoose;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      
      // Increment connection attempts
      connectionAttempts++;
      
      // If we haven't reached max retries, try again
      if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
        console.log(`Retrying connection in ${RETRY_INTERVAL}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        isConnecting = false;
        return connectToDatabase();
      }
      
      // Reset connection state
      isConnecting = false;
      connectionPromise = null;
      
      // Throw the error to be handled by the caller
      throw error;
    }
  })();

  return connectionPromise;
}

module.exports = connectToDatabase;