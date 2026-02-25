import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('PHONE'); // 'PHONE' or 'OTP'
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP

    const handleContinue = (e) => {
        e.preventDefault();
        // Move to OTP step on continue
        setStep('OTP');
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        // Update OTP state
        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input automatically
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const verifyOtpAndLogin = (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length === 6) {
            console.log("Verified OTP:", code);

            // Save user session data
            const sessionData = {
                name: 'New StyleUpSpaces User',
                phone: phone || '+91-XXXXX-XXXXX',
                email: email || 'customer@example.com',
                location: 'Bangalore, India'
            };
            localStorage.setItem('styleUpUser', JSON.stringify(sessionData));

            // After successful verification, go to the Home page
            window.location.href = '/';
        } else {
            alert('Please enter a valid 6-digit OTP code.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header-bar"></div>

                <div className="login-content">
                    <div className="login-logo-wrapper">
                        <img src="/logo.png" alt="StyleUpSpaces Logo" className="login-logo" />
                    </div>

                    {step === 'PHONE' ? (
                        <>
                            <h1 className="login-title">Welcome to StyleUpSpaces</h1>
                            <p className="login-subtitle">
                                Enter your details to access your account and manage your home services.
                            </p>

                            <form onSubmit={handleContinue}>
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

                                <button type="submit" className="btn-continue flex items-center justify-center gap-2">
                                    Continue
                                    <ArrowRight size={18} />
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Don't have an account? </span>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/signup')}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </form>

                            <div className="login-footer">
                                By continuing, you agree to StyleUpSpaces <br />
                                <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                            </div>
                        </>
                    ) : (
                        <div className="otp-container">
                            <h1 className="login-title">Verify Mobile Number</h1>
                            <p className="login-subtitle">
                                An OTP has been sent to <span className="otp-number">{phone || '+91-XXXXX-XXXXX'}</span>
                            </p>

                            <form onSubmit={verifyOtpAndLogin}>
                                <div className="otp-input-group">
                                    {otp.map((data, index) => {
                                        return (
                                            <input
                                                className="otp-input"
                                                type="text"
                                                name="otp"
                                                maxLength="1"
                                                key={index}
                                                value={data}
                                                onChange={e => handleOtpChange(e.target, index)}
                                                onFocus={e => e.target.select()}
                                                required
                                            />
                                        );
                                    })}
                                </div>

                                <button type="submit" className="btn-continue">
                                    Verify & Login
                                </button>

                                <button type="button" className="btn-secondary" onClick={() => setStep('PHONE')}>
                                    Change Mobile Number
                                </button>
                            </form>

                            <div className="login-footer" style={{ marginTop: '20px' }}>
                                Didn't receive the code? <a href="#">Resend OTP</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
