import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Menu, User, Bell } from 'lucide-react';
import './Header.css';

// Logo Path from public directory
const LOGO_PATH = "/logo.png";

const Header = () => {
    const navigate = useNavigate();

    let user = null;
    try {
        const stored = localStorage.getItem('styleUpUser');
        if (stored) {
            user = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('styleUpUser');
    }

    return (
        <header className="header">
            <div className="container header-container">
                {/* Logo Section */}
                <div className="logo-section" onClick={() => navigate('/')}>
                    <img
                        src={LOGO_PATH}
                        alt="StyleUpSpaces Logo"
                        className="header-logo"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <span className="brand-name">StyleUpSpaces</span>
                </div>

                {/* Actions Section */}
                <div className="actions-section">
                    <div
                        className="notification-icon"
                        onClick={() => navigate('/notifications')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '10px', position: 'relative' }}
                    >
                        <Bell size={24} color="var(--text-dark)" />
                        {/* Red dot for new notifications */}
                        <span style={{ position: 'absolute', top: '0', right: '2px', width: '8px', height: '8px', backgroundColor: '#ff4757', borderRadius: '50%' }}></span>
                    </div>

                    {!user ? (
                        <div className="auth-buttons">
                            <button className="btn btn-login" onClick={() => navigate('/admin-login')} style={{ background: 'rgba(0,0,0,0.05)', color: '#333' }}>Admin</button>
                            <button className="btn btn-login" onClick={() => navigate('/login')}>Login</button>
                            <button className="btn btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div className="menu-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <User size={20} />
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', marginLeft: '8px' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                            </div>
                            <button
                                className="btn btn-login"
                                onClick={() => {
                                    localStorage.removeItem('styleUpUser');
                                    window.location.href = '/';
                                }}
                                style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-dark)' }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                    <div className="mobile-menu-toggle ml-3">
                        <Menu size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
