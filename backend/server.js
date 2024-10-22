const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const userRoutes = require("./users"); // Adjust path as necessary
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

// Set your admin ID here (this is just an example)
const adminId = 1; // Change this to your actual admin user ID

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
app.use("/auth/users", userRoutes);

// Get all tasks (admin can see all tasks)
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks"; 

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    res.json(result);
  });
});

// Add a new task (admin can assign to specific user)
app.post("/tasks", (req, res) => {
  const { title, description, due_date, status, assigned_user_id } = req.body; // Include assigned_user_id

  // Check if the admin is trying to assign the task to themselves
  if (assigned_user_id == adminId) {
    return res.status(400).json({ message: "Admin cannot assign tasks to themselves." });
  }

  const sql = "INSERT INTO tasks (title, description, due_date, status, assigned_user_id) VALUES (?, ?, ?, ?, ?)";  // Task-specific columns

  db.query(sql, [title, description, due_date, status, assigned_user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding task" });
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// Update a task (admin can update task details)
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, status, assigned_user_id } = req.body; // Include assigned_user_id

  // Check if the admin is trying to assign the task to themselves
  if (assigned_user_id == adminId) {
    return res.status(400).json({ message: "Admin cannot assign tasks to themselves." });
  }

  const sql = "UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, assigned_user_id = ? WHERE id = ?"; // Task-specific fields

  db.query(sql, [title, description, due_date, status, assigned_user_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating task" });
    }
    res.json(result);
  });
});

// Other routes...

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
