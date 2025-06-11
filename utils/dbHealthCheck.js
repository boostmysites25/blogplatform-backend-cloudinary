const mongoose = require('mongoose');

/**
 * Performs a health check on the MongoDB connection
 * @returns {Object} Status object with connection information
 */
async function checkDatabaseHealth() {
  try {
    const status = {
      isConnected: mongoose.connection.readyState === 1,
      connectionState: getConnectionStateName(mongoose.connection.readyState),
      dbName: mongoose.connection.db ? mongoose.connection.db.databaseName : null,
      host: mongoose.connection.host || null,
      timestamp: new Date().toISOString()
    };
    
    // If connected, try a simple ping operation
    if (status.isConnected && mongoose.connection.db) {
      try {
        // Set a short timeout for the ping
        const pingResult = await mongoose.connection.db.admin().ping();
        status.pingSuccess = pingResult && pingResult.ok === 1;
      } catch (pingError) {
        status.pingSuccess = false;
        status.pingError = pingError.message;
      }
    }
    
    return status;
  } catch (error) {
    return {
      isConnected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Converts MongoDB connection state code to a readable name
 * @param {Number} state - Connection state code
 * @returns {String} Human-readable connection state name
 */
function getConnectionStateName(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  return states[state] || `unknown(${state})`;
}

module.exports = { checkDatabaseHealth };