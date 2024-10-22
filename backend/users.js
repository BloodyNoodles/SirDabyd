const express = require("express");
const router = express.Router();
const db = require("./db"); // Adjust to your DB connection file

// Get all users
router.get("/", (req, res) => {
  const sql = "SELECT id, firstname, lastname FROM users"; // Explicitly select only needed fields

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(result); // Return the filtered user data
  });
});

module.exports = router;
