import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null); // To handle task being edited

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  // Fetch all tasks (same as admin)
  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/tasks");
    setTasks(response.data);
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); // Refetch tasks after updating status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    // Remove token from local storage and redirect to login
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
      <h2>User Dashboard</h2>
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
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
