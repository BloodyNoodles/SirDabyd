import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './admindashboard'; // Admin Dashboard component
import Register from './register'; // Register component
import Login from './login'; // Login component
import NotFound from './notfound'; // Import your NotFound component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} /> {/* Register route */}
      <Route path="/AdminDashboard" element={<AdminDashboard />} /> {/* Admin Dashboard route */}
      <Route path="/login" element={<Login />} /> {/* Login route */}
      <Route path="*" element={<NotFound />} /> {/* 404 Not Found route */}
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
