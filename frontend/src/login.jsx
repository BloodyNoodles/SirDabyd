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

      // Get user type from response
      const userType = response.data.userType;

      setSuccess('Login successful! Redirecting...');
      setError('');

      // Redirect based on user type
      setTimeout(() => {
        console.log('User Type:', userType); // Debugging log
        if (userType === 'admin') {
          navigate('/admindashboard'); // Admin dashboard route
        } else if (userType === 'user') {
          navigate('/userdashboard'); // User dashboard route
        } else {
          navigate('/'); // Default route if userType is unknown
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
