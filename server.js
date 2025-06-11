const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectToDatabase = require('./utils/dbConnect');
const ensureDatabaseConnection = require('./middleware/dbConnectionMiddleware');
const { checkDatabaseHealth } = require('./utils/dbHealthCheck');

// Import routes
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const authorRoutes = require("./routes/author.routes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Increased JSON payload size limit to 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// No longer serving uploaded files from filesystem as we're using base64 images

// Connect to MongoDB using our optimized connection helper for serverless environments
connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");

    // Add a global timeout handler for all MongoDB operations
    const originalExec = mongoose.Query.prototype.exec;
    mongoose.Query.prototype.exec = function(...args) {
      // Set a default timeout if not already set
      if (!this.options.maxTimeMS) {
        this.options.maxTimeMS = 60000; // 60 seconds default timeout
      }
      
      // Add better error handling for timeouts
      return originalExec.apply(this, args).catch(err => {
        if (err.message && err.message.includes('buffering timed out')) {
          console.error(`MongoDB query timeout: ${this.getQuery()}`);
          err.message = 'Query timed out. Try using pagination or narrowing your search criteria.';
        }
        throw err;
      });
    };

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    // Log more detailed error information
    if (err.name === "MongoServerSelectionError") {
      console.error(
        "MongoDB Server Selection Error. Please check your connection string and network."
      );
    }
  });

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Apply database connection middleware to all API routes
app.use("/api", ensureDatabaseConnection);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/authors", authorRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Database health check route
app.get("/db-health", async (req, res) => {
  try {
    const dbStatus = await checkDatabaseHealth();
    
    if (dbStatus.isConnected) {
      res.status(200).json({
        status: "ok",
        database: dbStatus
      });
    } else {
      // Try to reconnect if not connected
      try {
        await connectToDatabase();
        const updatedStatus = await checkDatabaseHealth();
        
        res.status(updatedStatus.isConnected ? 200 : 503).json({
          status: updatedStatus.isConnected ? "ok" : "error",
          database: updatedStatus,
          message: updatedStatus.isConnected ? 
            "Database reconnected successfully" : 
            "Failed to reconnect to database"
        });
      } catch (reconnectError) {
        res.status(503).json({
          status: "error",
          database: dbStatus,
          error: reconnectError.message,
          message: "Failed to reconnect to database"
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Special handling for MongoDB timeout errors
  if ((err.name === 'MongooseError' || err.name === 'MongooseTimeoutError') && 
      err.message.includes('buffering timed out')) {
    return res.status(504).json({
      success: false,
      message: "Database query timed out. Try using pagination or narrowing your search criteria.",
      error: err.message,
      solution: "Try adding pagination parameters (limit and page) or use more specific search terms."
    });
  }
  
  // Handle MongoDB connection errors
  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: "Service temporarily unavailable. Please try again later.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
  
  // Handle other MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError' || 
      err.name === 'MongooseError') {
    return res.status(500).json({
      success: false,
      message: "Database error occurred",
      error: process.env.NODE_ENV === "development" ? err.message : "Database operation failed",
    });
  }
  
  // Default error handler
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
  });
});

module.exports = app;
