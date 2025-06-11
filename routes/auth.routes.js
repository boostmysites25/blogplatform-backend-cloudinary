
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const { generateToken } = require('../utils/auth');
const connectToDatabase = require('../utils/dbConnect');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Ensure database connection is established
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email }).maxTimeMS(60000);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password
      // Role is set to 'user' by default in the model
    });
    
    // For first user in system, make them admin
    const userCount = await User.countDocuments({}).maxTimeMS(60000);
    if (userCount === 1) {
      user.role = 'admin';
      await user.save();
    }
    
    // Return user info with token
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle MongoDB timeout errors specifically
    if (error.message && error.message.includes('buffering timed out')) {
      return res.status(504).json({
        message: 'Registration request timed out',
        error: 'Database operation timed out. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Handle other MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError' || 
        error.name === 'MongooseError' || error.name === 'MongooseServerSelectionError') {
      return res.status(500).json({
        message: 'Registration failed due to database error',
        error: 'Database operation failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log login attempt (without exposing email)
    console.log(`Login attempt for user: ${email.substring(0, 3)}***@${email.split('@')[1]}`);
    
    // Ensure database connection is established with retry logic
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection failed during login:', dbError);
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
        error: 'Service temporarily unavailable. Please try again in a few moments.'
      });
    }
    
    // Set timeout for this specific query
    const user = await User.findOne({ email })
      .maxTimeMS(60000)
      .select('+password') // Ensure password field is included
      .exec();
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Log successful login
    console.log(`User logged in successfully: ${user._id}`);
    
    // Return user info with token
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle MongoDB timeout errors specifically
    if (error.message && error.message.includes('buffering timed out')) {
      return res.status(504).json({
        success: false,
        message: 'Login request timed out',
        error: 'Database operation timed out. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed',
        error: 'Service temporarily unavailable. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Handle other MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError' || 
        error.name === 'MongooseError') {
      return res.status(500).json({
        success: false,
        message: 'Login failed due to database error',
        error: 'Database operation failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

module.exports = router;
