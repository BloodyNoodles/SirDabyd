import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './admindashboard'; // Admin Dashboard component
import UserDashboard from './userdashboard';  // User Dashboard component
import Register from './register'; // Register component
import Login from './login'; // Login component
import NotFound from './notfound'; // Import your NotFound component
import PrivateRoute from './privateroute'; // Import your PrivateRoute component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} /> {/* Register route */}
      <Route path="/login" element={<Login />} /> {/* Login route */}
      
      {/* Protected Routes */}
      <Route 
        path="/admindashboard" 
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } 
      /> {/* Admin Dashboard route */}
      
      <Route 
        path="/userdashboard" 
        element={
          <PrivateRoute allowedRoles={['user']}>
            <UserDashboard />
          </PrivateRoute>
        } 
      /> {/* User Dashboard route */}

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} /> {/* 404 Not Found route */}
    </Routes>
  );
};

export default App;
