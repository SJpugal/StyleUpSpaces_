import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Edit2, LogOut, Settings, Home } from 'lucide-react';
import Header from '../components/Header';
import Login from './Login'; // Import Login component
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Simulating user data that would normally come from an API/Context after login
    // Now reads from localStorage to persist data from Login page
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('styleup_user');
        if (savedUser) {
            return JSON.parse(savedUser);
        }
        return {
            name: '',
            phone: '',
            email: '',
            location: '',
        };
    });

    const [isEditing, setIsEditing] = useState(false);

    // Check auth status on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('styleup_user');
        if (savedUser) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [userData]); // Re-run if userData somehow changes

    const handleLogout = () => {
        console.log("User logged out");
        // Clear local storage / session
        localStorage.removeItem('styleup_user');
        // Clear local state
        setUserData({ name: '', phone: '', email: '', location: '' });
        setIsAuthenticated(false);
        // Do not redirect, just let the state update to show Login
    };

    // If not authenticated, render the Login component directly within the Profile route context
    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="page-wrapper">
            <Header />
            <main className="profile-page">
                <div className="profile-container">

                    {/* Left Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar-wrapper">
                            <User size={60} />
                        </div>
                        <h2 className="profile-name">{userData.name}</h2>
                        <p className="profile-role">Premium Member</p>

                        <div className="profile-menu">
                            <button className="profile-menu-item active">
                                <User size={18} /> Profile Details
                            </button>
                            <button className="profile-menu-item" onClick={() => navigate('/home-service')}>
                                <Home size={18} /> My Bookings
                            </button>
                            <button className="profile-menu-item">
                                <Settings size={18} /> Settings
                            </button>
                            <button className="profile-menu-item logout" onClick={handleLogout}>
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="profile-main-content">
                        <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '30px', paddingBottom: '15px' }}>
                            <h1 className="profile-section-title" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                                Personal Information
                            </h1>
                            <button
                                className="btn btn-secondary"
                                style={{ width: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Edit2 size={16} />
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        </div>

                        <div className="profile-details-grid">
                            <div className="detail-group">
                                <label className="detail-label"><User size={16} /> Full Name</label>
                                <input
                                    className={`detail-value ${isEditing ? 'editable' : ''}`}
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="detail-group">
                                <label className="detail-label"><Phone size={16} /> Mobile Number</label>
                                <input
                                    className={`detail-value ${isEditing ? 'editable' : ''}`}
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="detail-group">
                                <label className="detail-label"><Mail size={16} /> Email Address</label>
                                <input
                                    className={`detail-value ${isEditing ? 'editable' : ''}`}
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    readOnly={!isEditing}
                                />
                            </div>

                            <div className="detail-group">
                                <label className="detail-label"><MapPin size={16} /> Location</label>
                                <input
                                    className={`detail-value ${isEditing ? 'editable' : ''}`}
                                    value={userData.location}
                                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="profile-actions">
                                <button
                                    className="btn btn-continue"
                                    style={{ width: 'auto', padding: '12px 30px' }}
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Save edited data to local storage so it persists
                                        localStorage.setItem('styleup_user', JSON.stringify(userData));
                                        console.log("Saved new profile dat:", userData);
                                        alert("Profile updated successfully!");
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Profile;
