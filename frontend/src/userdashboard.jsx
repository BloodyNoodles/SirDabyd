import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns"; // Import date-fns
import styles from './UserDashboard.module.css'; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending',
    assigned_user_id: localStorage.getItem('userId')
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleEditClick = (task) => {
    setCurrentTask(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      due_date: format(parseISO(task.due_date), 'yyyy-MM-dd'), // Format the due date for the input
      status: task.status,
      assigned_user_id: task.assigned_user_id
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (currentTask) {
      try {
        await axios.put(`http://localhost:5000/tasks/${currentTask}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchTasks();
        setCurrentTask(null);
        setFormData({
          title: '',
          description: '',
          due_date: '',
          status: 'pending',
          assigned_user_id: localStorage.getItem('userId')
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setCurrentTask(null);
    setFormData({
      title: '',
      description: '',
      due_date: '',
      status: 'pending',
      assigned_user_id: localStorage.getItem('userId')
    });
  };

  // Get current date in yyyy-MM-dd format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.pageContainer}>
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
            {tasks
              .filter(task => task.assigned_user_id == localStorage.getItem('userId'))
              .map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{format(parseISO(task.due_date), 'yyyy-MM-dd')}</td> {/* Format the date for display */}
                  <td>{task.status}</td>
                  <td>
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

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
            min={today} // Set minimum date to today
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
