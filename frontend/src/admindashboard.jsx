import React, { useState, useEffect } from "react";
import axios from "axios";
import './AdminDashboard.css'; // Adjust the path as necessary

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]); 
  const [formData, setFormData] = useState({
    title: "",         // Updated field names for tasks
    description: "",
    due_date: "",
    status: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchTasks(); // Updated to fetch tasks
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/tasks"); // Updated endpoint
    setTasks(response.data);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`http://localhost:5000/tasks/${currentId}`, formData); // Updated endpoint
      setIsEdit(false);
    } else {
      await axios.post("http://localhost:5000/tasks", formData); // Updated endpoint
    }
    fetchTasks(); // Fetch updated task list
    setFormData({ title: "", description: "", due_date: "", status: "" }); // Reset form
  };

  // Handle edit
  const handleEdit = (task) => {
    setFormData(task);
    setIsEdit(true);
    setCurrentId(task.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`); // Updated endpoint
    fetchTasks(); // Fetch updated task list
  };

  return (
    <div className="container">
      <h1>Task Management System</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title" // Updated placeholder
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Description" // Updated placeholder
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <input
          type="date" // Updated input type for due date
          placeholder="Due Date"
          value={formData.due_date}
          onChange={(e) =>
            setFormData({ ...formData, due_date: e.target.value })
          }
          required
        />
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          required
        >
          <option value="">Select Status</option> // Added a dropdown for status
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>
        <button type="submit">
          {isEdit ? "Update Task" : "Add Task"} 
        </button>
      </form>
      <h2>Task List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th> 
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => ( 
            <tr key={task.id}>
              <td>{task.title}</td> 
              <td>{task.description}</td>
              <td>{task.due_date}</td>
              <td>{task.status}</td>
              <td>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
