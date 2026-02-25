import React from 'react';
import { Outlet } from 'react-router-dom';

// AdminLayout provides a clean shell for strictly admin-facing pages
// Intentionally omitting standard Header/Chatbot to isolate the admin flow
const AdminLayout = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export default AdminLayout;
