import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Chatbot from '../components/Chatbot';

// MainLayout provides the common shell for all user-facing pages
const MainLayout = () => {
    return (
        <>
            <Header />
            {/* The Outlet renders the current route's element */}
            <Outlet />
            <Chatbot />
        </>
    );
};

export default MainLayout;
