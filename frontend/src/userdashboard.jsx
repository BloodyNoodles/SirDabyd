import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './UserDashboard.module.css'; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null); // To handle the task being edited
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending'
  });

  const handleLogout = () => {
    // Remove token from local storage and redirect to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/tasks");
    setTasks(response.data);
  };

  // Populate the form with the task data for editing
  const handleEditClick = (task) => {
    setCurrentTask(task.id); // Set the current task being edited
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date.split('T')[0], // Format the due date for the input
      status: task.status
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle the form submission to update the task
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (currentTask) {
      // Update the task
      try {
        await axios.put(`http://localhost:5000/tasks/${currentTask}`, formData);
        fetchTasks(); // Refetch tasks after update
        setCurrentTask(null); // Clear current task after update
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setCurrentTask(null); // Clear current task, exit edit mode
    setFormData({
      title: '',
      description: '',
      due_date: '',
      status: 'pending'
    });
  };

  return (
    <div className={styles.pageContainer}> {/* Scoped to UserDashboard */}
      <div className={styles.tasksContainer}>
        <h2>User Dashboard</h2>
        <p>Welcome to your dashboard!</p>
        <button onClick={handleLogout}>Logout</button>

        <h2>Tasks</h2>
        <table className={styles.taskstable}> 
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
                <td>{task.due_date.split('T')[0]}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => handleEditClick(task)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Task Form */}
      {currentTask && (
        <form onSubmit={handleFormSubmit} className={styles.editTaskForm}>
          <h3 className={styles.formHeading}>Edit Task</h3>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="task-title"
            name="title"
            className={styles.formInput}
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="task-description"
            name="description"
            className={styles.formInput}
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="due_date">Due Date:</label>
          <input
            type="date"
            id="task-due-date"
            name="due_date"
            className={styles.formInput}
            value={formData.due_date}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="status">Status:</label>
          <select
            id="task-status"
            name="status"
            className={styles.formSelect}
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <br />
          <button type="submit" className={styles.formButton}>Update Task</button>
          <button type="button" className={`${styles.formButton} ${styles.cancelButton}`} onClick={handleCancelEdit}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default UserDashboard;