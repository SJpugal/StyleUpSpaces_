import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if user session exists in localStorage
    const userSession = localStorage.getItem('styleUpUser');

    // If not authenticated, redirect to the login page
    if (!userSession) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child route components via Outlet
    return <Outlet />;
};

export default ProtectedRoute;
