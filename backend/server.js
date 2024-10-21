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
  database: "task_management_system",  // Changed to task_management_system
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

// Get all tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks"; 

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    res.json(result);
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { title, description, due_date, status } = req.body;

  const sql =
    "INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)";  // Task-specific columns

  db.query(sql, [title, description, due_date, status], (err, result) => {
    if (err) throw err;

    res.json({ id: result.insertId, ...req.body });
  });
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, status } = req.body;

  const sql =
    "UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?"; // Task-specific fields

  db.query(sql, [title, description, due_date, status, id], (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ?";  

  db.query(sql, [id], (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
