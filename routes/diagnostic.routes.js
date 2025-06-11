const express = require('express');
const mongoose = require('mongoose');
const { checkDatabaseHealth } = require('../utils/dbHealthCheck');
const connectToDatabase = require('../utils/dbConnect');
const { validateEnvironment } = require('../utils/validateEnv');

const router = express.Router();

// @route   GET /api/diagnostic/test-connection
// @desc    Test MongoDB connection with minimal options
// @access  Public
router.get('/test-connection', async (req, res) => {
  try {
    console.log('Testing MongoDB connection with minimal options...');
    
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({
        success: false,
        message: 'MONGODB_URI environment variable is not defined'
      });
    }
    
    // Log sanitized connection string
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log(`Connecting to: ${sanitizedUri}`);
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing existing connection');
      await mongoose.connection.close();
    }
    
    // Connect with minimal options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      dbName: 'blog-platform'
    });
    
    console.log('Connection successful!');
    
    // Test a simple operation
    const pingResult = await mongoose.connection.db.admin().ping();
    
    // Close this test connection
    await mongoose.connection.close();
    
    // Return success
    res.json({
      success: true,
      message: 'MongoDB connection test successful',
      details: {
        ping: pingResult,
        uri: sanitizedUri
      }
    });
  } catch (error) {
    console.error('MongoDB test connection failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'MongoDB connection test failed',
      error: error.name,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/diagnostic/status
// @desc    Get system status information
// @access  Public
router.get('/status', async (req, res) => {
  try {
    // Get environment validation first (doesn't require DB)
    const envStatus = validateEnvironment();
    
    // Get Node.js info
    const nodeInfo = {
      version: process.version,
      environment: process.env.NODE_ENV || 'development',
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    // Get package info
    const packageInfo = {
      name: 'blog-platform-backend',
      dependencies: {
        mongoose: mongoose.version,
        express: require('express/package.json').version
      }
    };
    
    // Try to get database health, but don't fail if it's not available
    let dbStatus = { isConnected: false, connectionState: 'unknown' };
    try {
      dbStatus = await checkDatabaseHealth();
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      dbStatus.error = dbError.message;
    }
    
    // Return comprehensive status
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      status: dbStatus.isConnected ? 'healthy' : 'degraded',
      database: {
        ...dbStatus,
        // Don't expose sensitive connection details
        host: dbStatus.host ? 'connected' : null
      },
      environment: {
        isValid: envStatus.isValid,
        errors: envStatus.errors,
        nodeInfo
      },
      application: packageInfo,
      vercel: {
        isVercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION || 'unknown',
        environment: process.env.VERCEL_ENV || 'unknown'
      }
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  }
});

// @route   GET /api/diagnostic/db-reconnect
// @desc    Force a database reconnection
// @access  Public
router.get('/db-reconnect', async (req, res) => {
  try {
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      console.log('Closing existing database connection');
      await mongoose.connection.close();
    }
    
    // Attempt to reconnect
    console.log('Forcing database reconnection');
    
    // Log the MongoDB URI (without credentials)
    const sanitizedUri = process.env.MONGODB_URI 
      ? process.env.MONGODB_URI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@')
      : 'Not configured';
    console.log(`Attempting to connect to: ${sanitizedUri}`);
    
    await connectToDatabase();
    
    // Check health after reconnection
    const dbStatus = await checkDatabaseHealth();
    
    res.json({
      success: true,
      message: 'Database reconnection attempt completed',
      database: dbStatus
    });
  } catch (error) {
    console.error('Database reconnection error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to reconnect to database';
    
    if (error.name === 'MongoParseError') {
      errorMessage = 'Invalid MongoDB connection string format or options';
    } else if (error.name === 'MongooseServerSelectionError') {
      errorMessage = 'Unable to reach MongoDB server. Check network and credentials.';
    }
    
    res.status(500).json({
      success: false,
      message: 'Database reconnection failed',
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;