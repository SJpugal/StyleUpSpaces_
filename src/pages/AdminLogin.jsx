import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AtSign, ArrowRight, Building, UserPlus, Eye, EyeOff } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ companyName: '', username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize default admin if no admins exist
    useEffect(() => {
        const existingAdmins = localStorage.getItem('styleUpRegisteredAdmins');
        if (!existingAdmins) {
            localStorage.setItem('styleUpRegisteredAdmins', JSON.stringify([{
                companyName: 'StyleUp',
                username: 'admin',
                password: 'admin123'
            }]));
        }
    }, []);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setSuccess('');
        setCredentials({ companyName: '', username: '', password: '' });
    };

    const handleAuth = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        setTimeout(() => {
            const registeredAdmins = JSON.parse(localStorage.getItem('styleUpRegisteredAdmins')) || [];

            if (isLoginMode) {
                // Login Flow
                const matchedAdmin = registeredAdmins.find(
                    admin => admin.username === credentials.username && admin.password === credentials.password
                );

                if (matchedAdmin) {
                    localStorage.setItem('styleUpAdminSession', JSON.stringify({
                        role: 'admin',
                        company: matchedAdmin.companyName,
                        username: matchedAdmin.username,
                        timestamp: new Date().getTime()
                    }));
                    navigate('/admin');
                } else {
                    setError('Invalid admin credentials. Access denied.');
                }
            } else {
                // Signup Flow
                if (!credentials.companyName || !credentials.username || !credentials.password) {
                    setError('All fields are required.');
                } else if (registeredAdmins.some(admin => admin.username === credentials.username)) {
                    setError('Admin username already exists.');
                } else {
                    const newAdmin = {
                        companyName: credentials.companyName,
                        username: credentials.username,
                        password: credentials.password
                    };
                    localStorage.setItem('styleUpRegisteredAdmins', JSON.stringify([...registeredAdmins, newAdmin]));
                    setSuccess('Admin Account Created! You can now log in.');
                    setIsLoginMode(true);
                    setCredentials({ companyName: '', username: '', password: '' });
                }
            }
            setIsLoading(false);
        }, 800); // Simulate network delay
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-container animation-fade-in">

                <div className="admin-login-brand">
                    <h2>StyleUpSpaces</h2>
                    <span className="admin-badge">{isLoginMode ? 'Admin Portal' : 'Admin Registration'}</span>
                </div>

                <div className="admin-login-card">
                    <div className="admin-lock-icon">
                        {isLoginMode ? <Lock size={32} /> : <UserPlus size={32} />}
                    </div>
                    <h3>{isLoginMode ? 'Restricted Access' : 'Create Admin Account'}</h3>
                    <p>{isLoginMode ? 'Please enter your administrative credentials.' : 'Register to manage services and bookings.'}</p>

                    <form onSubmit={handleAuth} className="admin-login-form">

                        {error && <div className="admin-error-msg">{error}</div>}
                        {success && <div className="admin-success-msg">{success}</div>}

                        {!isLoginMode && (
                            <div className="admin-input-group">
                                <label>Company Name</label>
                                <div className="admin-input-wrapper">
                                    <Building size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="e.g. StyleUpSpaces Ltd"
                                        value={credentials.companyName}
                                        onChange={(e) => setCredentials({ ...credentials, companyName: e.target.value })}
                                        required={!isLoginMode}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="admin-input-group">
                            <label>Admin Username</label>
                            <div className="admin-input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder={isLoginMode ? "e.g. admin" : "Choose a username"}
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-input-group">
                            <label>Password</label>
                            <div className="admin-input-wrapper">
                                <AtSign size={18} className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={isLoginMode ? "Enter secure password" : "Create a password"}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="admin-submit-btn" disabled={isLoading}>
                            {isLoading ? 'Processing...' : (
                                <>{isLoginMode ? 'Secure Login' : 'Register Admin'} <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="admin-toggle-mode">
                        {isLoginMode ? (
                            <p>Don't have an admin account? <span onClick={toggleMode} className="accent-text">Sign Up</span></p>
                        ) : (
                            <p>Already have an admin account? <span onClick={toggleMode} className="accent-text">Login</span></p>
                        )}
                    </div>
                </div>

                <div className="admin-login-footer">
                    <p onClick={() => navigate('/')}>&larr; Return to Customer site</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
