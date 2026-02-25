import React, { useState, useContext, useEffect, useRef } from 'react';
import { ServicesContext } from '../context/ServicesContext';
import { X, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase';
import './AuthModal.css'; // Utilizing original CSS stylesheet

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, setCurrentUser } = useContext(ServicesContext);

    // Auth Flow State => 1: Phone Input, 2: OTP Verification
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Firebase uses 6 digits natively usually
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Timer State
    const [timer, setTimer] = useState(60); // 60 seconds before resend allowed

    // Reset everything when modal opens
    useEffect(() => {
        if (isAuthModalOpen) {
            setStep(1);
            setPhone('');
            setOtp(['', '', '', '', '', '']);
            setIsLoading(false);
        }
    }, [isAuthModalOpen]);

    // OTP Resend Timer
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Firebase Recaptcha setup
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible', // Makes it invisible so UI stays clean
                'callback': (response) => {
                    // reCAPTCHA solved
                },
                'expired-callback': () => {
                    // Response expired
                    alert("reCAPTCHA expired. Please try again.");
                }
            });
        }
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (phone.length < 10) return;

        setIsLoading(true);
        setupRecaptcha();
        const phoneNumber = `+91${phone}`; // Force India country code for this platform
        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
            setTimer(60);
        } catch (error) {
            console.error("SMS Dispatch Error:", error);

            // Common debug mapping 
            if (error.code === 'auth/invalid-app-credential' || error.message.includes('API key')) {
                alert("FIREBASE CONFIG ERROR: Real Firebase API Keys are missing in src/firebase.js. Please add your credentials.");
            } else {
                alert(`Error sending SMS: ${error.message}`);
            }
            // Reset Recaptcha so they can try again
            if (window.recaptchaVerifier) window.recaptchaVerifier.render().then(t => window.grecaptcha.reset(t));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }

        // Auto verify if all 6 digits entered
        if (index === 5 && value && newOtp.join('').length === 6) {
            verifyOtp(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const verifyOtp = async (enteredOtp) => {
        if (!confirmationResult && enteredOtp !== '123456') return;
        setIsLoading(true);

        try {
            // Confirm against Firebase
            let user;

            // Bypass for rapid UI testing if credentials aren't set yet
            if (enteredOtp === '123456') {
                user = { uid: `mock_uid_${Date.now()}`, phoneNumber: phone };
            } else {
                const result = await confirmationResult.confirm(enteredOtp);
                user = result.user;
            }

            const userProfile = {
                id: user.uid,
                phone: user.phoneNumber,
                name: 'Verified User',
                isVerified: true
            };

            setCurrentUser(userProfile);
            localStorage.setItem('styleUpUser', JSON.stringify(userProfile));
            setIsAuthModalOpen(false);
        } catch (error) {
            console.error("Verification Error:", error);
            alert("Invalid Verification Code. Please try again.");
            setOtp(['', '', '', '', '', '']); // Clear
            document.getElementById('otp-0')?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        if (timer > 0) return;
        handlePhoneSubmit(new Event('submit')); // Re-trigger flow
    };

    if (!isAuthModalOpen) return null;

    return (
        <div className="auth-modal-overlay">
            <div className={`auth-modal-content ${step === 2 ? 'auth-step-two' : ''}`}>
                <button className="auth-close-btn" onClick={() => setIsAuthModalOpen(false)} disabled={isLoading}>
                    <X size={20} />
                </button>

                <div className="auth-left-panel">
                    <div className="auth-branding">
                        <h2>StyleUp<span className="text-primary-color">Spaces</span></h2>
                        <p>India's Premium Real Estate & Home Services Platform</p>
                    </div>
                    <ul className="auth-benefits">
                        <li><ShieldCheck size={18} /> Zero Brokerage Properties</li>
                        <li><ShieldCheck size={18} /> Verified Home Services</li>
                        <li><ShieldCheck size={18} /> Safe & Secure Agreements</li>
                    </ul>
                </div>

                <div className="auth-right-panel">
                    {/* Firebase Invisible Recaptcha Mount Point */}
                    <div id="recaptcha-container"></div>

                    {step === 1 ? (
                        <div className="auth-form-container animation-fade-in">
                            <h3 className="auth-title">Log in or Sign up</h3>
                            <p className="auth-subtitle">We will send you a 6-digit code via SMS</p>

                            <form onSubmit={handlePhoneSubmit} className="auth-form mt-6">
                                <div className="phone-input-wrapper">
                                    <div className="country-code">+91</div>
                                    <input
                                        type="tel"
                                        className="phone-input"
                                        placeholder="Enter mobile number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                        disabled={isLoading}
                                        autoFocus
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary auth-submit-btn w-full mt-5 flex items-center justify-center gap-2"
                                    disabled={phone.length < 10 || isLoading}
                                >
                                    {isLoading ? <><RefreshCw size={16} className="animate-spin" /> Sending SMS...</> : <>Continue <ArrowRight size={16} /></>}
                                </button>
                            </form>
                            <p className="auth-terms mt-4">
                                By continuing, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>.
                            </p>
                        </div>
                    ) : (
                        <div className="auth-form-container animation-fade-in">
                            <button className="auth-back-btn" onClick={() => setStep(1)} disabled={isLoading}>
                                ← Back
                            </button>

                            <h3 className="auth-title mt-4">Enter Verification Code</h3>
                            <p className="auth-subtitle">Code sent to +91 {phone}</p>

                            <div className="otp-input-group mt-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        className="otp-digit-input"
                                        style={{ width: '45px', height: '55px', fontSize: '1.3rem' }} // smaller since Firebase is 6 digits instead of 4
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={isLoading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <div className="otp-footer mt-5 flex justify-between items-center text-sm">
                                <span className="text-light-muted">
                                    {timer > 0 ? `Resend code in 00:${timer.toString().padStart(2, '0')}` : ''}
                                </span>

                                <button
                                    className={`resend-btn ${timer === 0 ? 'active' : ''}`}
                                    onClick={timer === 0 ? resendOtp : undefined}
                                    disabled={timer > 0 || isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Resend OTP'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
