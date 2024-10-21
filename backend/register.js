const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db'); // Ensure this file exports your database connection

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, userType } = req.body;

  console.log('Received registration data:', { email, password, userType });

  if (!email || !password || !userType) {
    return res.status(400).json({ message: 'Email, password, and user type are required' });
  }

  // Check if the user already exists
  const sqlCheck = 'SELECT * FROM users WHERE email = ?';
  db.query(sqlCheck, [email], async (err, result) => {
    if (err) {
      // Log error and return a proper response
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const sqlInsert = 'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)';
      db.query(sqlInsert, [email, hashedPassword, userType], (err, result) => {
        if (err) {
          // Log error and return a proper response
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Error registering user', error: err.message });
        }
        return res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Error processing registration', error: err.message });
    }
  });
});

module.exports = router;
