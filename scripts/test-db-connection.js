/**
 * Simple script to test MongoDB connection
 * Run with: node scripts/test-db-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  // Validate MongoDB URI
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not defined');
    process.exit(1);
  }
  
  // Log sanitized connection string
  const sanitizedUri = process.env.MONGODB_URI.replace(
    /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
    'mongodb$1://$2:****@'
  );
  console.log(`Connecting to: ${sanitizedUri}`);
  
  try {
    // Connect with minimal options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      dbName: 'blog-platform'
    });
    
    console.log('Connection successful!');
    console.log(`Connection state: ${mongoose.connection.readyState}`);
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    
    // Test a simple operation
    console.log('Testing ping operation...');
    const pingResult = await mongoose.connection.db.admin().ping();
    console.log('Ping result:', pingResult);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });