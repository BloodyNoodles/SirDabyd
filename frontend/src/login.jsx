import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Store the user ID or user data in localStorage
      const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1])); // Decode the JWT token
      localStorage.setItem('userId', tokenPayload.id); // Store user ID in local storage

      // Log the saved data from localStorage for debugging
      console.log("Saved Token:", localStorage.getItem('token'));
      console.log("Saved UserID:", localStorage.getItem('userId'));

      const userType = tokenPayload.userType; // Get user type from the token payload

      setSuccess('Login successful! Redirecting...');
      setError('');

      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'admin') {
          navigate('/admindashboard');
        } else if (userType === 'user') {
          navigate('/userdashboard');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
      setSuccess('');
    }
  };


  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
