const express = require('express');
const registerRoutes = require('./register'); // Assuming your register code is in register.js
const loginRoutes = require('./login'); // Assuming your login code is in login.js
const userRoutes = require('./users'); // Import your new user routes

const router = express.Router();

// Use registration routes
router.use('/register', registerRoutes);

// Use login routes
router.use('/login', loginRoutes);

// Use user routes
router.use('/users', userRoutes); // Add this line

module.exports = router;
