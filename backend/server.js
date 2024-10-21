const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const cors = require("cors");


const registerRoutes = require("./register");
const loginRoutes = require("./login");
const app = express();
app.use(cors());

app.use(bodyParser.json()); // Middleware to parse JSON
  
// MySQL connection

const db = mysql.createConnection({
  host: "localhost",

  user: "root",

  port: "3306",

  database: "student_management_system",
});

db.connect((err) => {
    if (err) {
      console.error("Database connection error:", err);
      process.exit(1); // Exits the server process
    } else {
      console.log("Connected to MySQL");
    }
  });

const authRoutes = require("./auth"); // Adjust path if needed
app.use("/auth", authRoutes);

// Get all students

app.get("/students", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, result) => {
    if (err) {
        return res.status(500).json({ message: 'Error fetching students' });
      }
    res.json(result);
  });
});

// Add a new student

app.post("/students", (req, res) => {
  const { first_name, last_name, age, email } = req.body;

  const sql =
    "INSERT INTO students (first_name, last_name, age, email) VALUES (?, ?, ?, ?)";

  db.query(sql, [first_name, last_name, age, email], (err, result) => {
    if (err) throw err;

    res.json({ id: result.insertId, ...req.body });
  });
});

// Update a student

app.put("/students/:id", (req, res) => {
  const { id } = req.params;

  const { first_name, last_name, age, email } = req.body;

  const sql =
    "UPDATE students SET first_name = ?, last_name = ?, age = ?, email = ? WHERE id = ?";

  db.query(sql, [first_name, last_name, age, email, id], (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

// Delete a student

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

// Start the server

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
