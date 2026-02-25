import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, User, MapPin, ArrowRight } from 'lucide-react';
import './Login.css'; // Re-use the same powerful layout styles as Login

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        // In a real app, this would register the new user via an API
        console.log("Signup attempt with:", { name, phone, email, location });
        // Redirect to login page after creating the account
        navigate('/login');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header-bar"></div>

                <div className="login-content">
                    <div className="login-logo-wrapper">
                        <img src="/logo.png" alt="StyleUpSpaces Logo" className="login-logo" />
                    </div>

                    <h1 className="login-title">Create an Account</h1>
                    <p className="login-subtitle">
                        Join StyleUpSpaces today to discover your dream home and book premium services.
                    </p>

                    <form onSubmit={handleSignup}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="name"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone Number</label>
                            <div className="input-with-icon">
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="tel"
                                    id="phone"
                                    className="form-input"
                                    placeholder="Enter your 10-digit mobile number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="location">Your Location</label>
                            <div className="input-with-icon">
                                <MapPin size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="location"
                                    className="form-input"
                                    placeholder="Enter your city or area"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-continue flex items-center justify-center gap-2">
                            Create Account
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="login-footer">
                        Already have an account? <br />
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log In Here</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
