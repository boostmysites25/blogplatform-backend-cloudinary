/**
 * Validates required environment variables and their formats
 * @returns {Object} Object with validation results
 */
function validateEnvironment() {
  const results = {
    isValid: true,
    errors: []
  };

  // Check for required environment variables
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET'
  ];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      results.isValid = false;
      results.errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Validate MongoDB URI format if it exists
  if (process.env.MONGODB_URI) {
    const mongoUriPattern = /^mongodb(\+srv)?:\/\/.+/;
    if (!mongoUriPattern.test(process.env.MONGODB_URI)) {
      results.isValid = false;
      results.errors.push('MONGODB_URI has invalid format. Should start with mongodb:// or mongodb+srv://');
    }
  }

  // Validate JWT_SECRET minimum length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
    results.errors.push('Warning: JWT_SECRET should be at least 16 characters long for security');
  }

  return results;
}

module.exports = { validateEnvironment };