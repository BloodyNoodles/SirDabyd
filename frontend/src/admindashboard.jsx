import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Adjust the path as necessary

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // State for users
  const [userMap, setUserMap] = useState({}); // State for user map (id -> user object)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "",
    assigned_user_id: "", // Field for assigned user
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers(); // Fetch users when the component mounts
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

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/users");
      setUsers(response.data);
      // Map users by ID for easier lookup
      const userMapObj = {};
      response.data.forEach((user) => {
        userMapObj[user.id] = `${user.firstname} ${user.lastname}`;
      });
      setUserMap(userMapObj); // Save the user map
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  // Handle edit
  const handleEdit = (task) => {
    setFormData(task);
    setIsEdit(true);
    setCurrentId(task.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Task Management System</h1>
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
              <td>{task.due_date}</td>
              <td>{task.status}</td>
              <td>
                {userMap[task.assigned_user_id]
                  ? userMap[task.assigned_user_id]
                  : "Unassigned"}
              </td>
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
