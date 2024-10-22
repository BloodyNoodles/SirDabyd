import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { format, parseISO } from "date-fns";
const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
    assigned_user_id: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch all users and filter out admin users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/users");
      const filteredUsers = response.data.filter(
        (user) => user.user_type !== "admin" // Exclude admin users
      );
      setUsers(filteredUsers);

      // Create user map for easy lookup
      const userMapObj = {};
      filteredUsers.forEach((user) => {
        userMapObj[user.id] = `${user.firstname} ${user.lastname}`;
      });
      setUserMap(userMapObj);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Format date to display only the date (without time)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Invalid Date"; // Handle invalid date cases
    }
    return date.toLocaleDateString();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/tasks/${currentId}`, formData);
        setIsEdit(false);
      } else {
        await axios.post("http://localhost:5000/tasks", formData);
      }
      fetchTasks();
      setFormData({
        title: "",
        description: "",
        due_date: "",
        status: "",
        assigned_user_id: "",
      });
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert("Admin cannot be assigned tasks.");
    }
  };

  // Handle edit
  const handleEdit = (task) => {
    const formattedDueDate = format(parseISO(task.due_date), "yyyy-MM-dd");
    setFormData({
      ...task,
      due_date: formattedDueDate,
    });
    setIsEdit(true);
    setCurrentId(task.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container">
      <h1>Task Management System</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <input
          type="date"
          placeholder="Due Date"
          value={formData.due_date}
          min={today}
          onChange={(e) =>
            setFormData({ ...formData, due_date: e.target.value })
          }
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>
        <select
          id="assignedUser"
          value={formData.assigned_user_id}
          onChange={(e) =>
            setFormData({ ...formData, assigned_user_id: e.target.value })
          }
          required
        >
          <option value="">Assign User</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.lastname}
              </option>
            ))
          ) : (
            <option value="">No users found</option>
          )}
        </select>

        <button type="submit">{isEdit ? "Update Task" : "Add Task"}</button>
      </form>
      <h2>Task List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Assigned User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{formatDate(task.due_date)}</td>
              <td>{task.status}</td>
              <td>{userMap[task.assigned_user_id] || "Unassigned"}</td>
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
