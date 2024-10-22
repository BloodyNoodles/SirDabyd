const express = require("express");
const router = express.Router();
const db = require("./db"); // Adjust to your DB connection file

// Get all users
router.get("/", (req, res) => {
  const sql = "SELECT * FROM users"; // Adjust the SQL query if needed

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err); // Log the error for debugging
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(result);
  });
});

module.exports = router;
