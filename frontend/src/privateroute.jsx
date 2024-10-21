import React from 'react';
import { Navigate } from 'react-router-dom';


function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token'); // Get token from local storage

    if (!token) {
        return <Navigate to="/login" replace />; // Redirect to login if no token
    }

    // Decode the token manually using the parseJwt function
    let decodedToken;
    try {
        decodedToken = parseJwt(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return <Navigate to="/login" replace />; // Redirect if token is invalid
    }

    if (!decodedToken || !allowedRoles.includes(decodedToken.userType)) {
        return <Navigate to="/" replace />; // Redirect if user type is not allowed
    }

    return children; // Render children if token and role are valid
};

export default PrivateRoute;
