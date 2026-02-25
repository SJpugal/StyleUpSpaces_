import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Check, ChevronRight, ChevronLeft, Building, User, FileText, CreditCard } from 'lucide-react';
import './AgreementForm.css';

const STEPS = [
    { id: 1, title: 'Contract Terms', icon: FileText },
    { id: 2, title: 'Property', icon: Building },
    { id: 3, title: 'Landlord', icon: User },
    { id: 4, title: 'Tenant', icon: User },
    { id: 5, title: 'Summary', icon: Check }
];

const AgreementForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Auto-scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const [formData, setFormData] = useState({
        // Contract
        rentAmount: '',
        depositAmount: '',
        startDate: '',
        noticePeriod: '1 Month',
        lockInPeriod: '6 Months',
        // Property
        houseNumber: '',
        buildingName: '',
        location: '',
        city: 'Bangalore',
        pincode: '',
        // Landlord
        landlordName: '',
        landlordPhone: '',
        landlordEmail: '',
        landlordPan: '',
        // Tenant
        tenantName: '',
        tenantPhone: '',
        tenantEmail: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Move to summary
        handleNext();
    };

    const handleFinalConfirm = () => {
        let user = null;
        try {
            const stored = localStorage.getItem('styleUpUser');
            if (stored) {
                user = JSON.parse(stored);
            }
        } catch (e) {
            console.error(e);
            localStorage.removeItem('styleUpUser');
        }

        const newBooking = {
            id: `AGR-${Math.floor(Math.random() * 1000000)}`,
            customerName: user ? user.name : (formData.tenantName || 'Guest'),
            customerEmail: user ? user.email : (formData.tenantEmail || 'Not Provided'),
            serviceName: 'Rental Agreement Drafting',
            type: 'Rental Agreement',
            date: new Date().toISOString().split('T')[0], // Today
            timeSlot: 'Processing',
            totalPrice: 499, // Standard fee
            status: 'Pending',
            createdAt: new Date().toISOString(),
            address: `${formData.houseNumber}, ${formData.buildingName}, ${formData.location}, ${formData.city} - ${formData.pincode}`,
            // Add specific agreement data so Admin can view it
            details: `Landlord: ${formData.landlordName} (${formData.landlordPhone}). Tenant: ${formData.tenantName} (${formData.tenantPhone}). Rent: ₹${formData.rentAmount}/mo. Deposit: ₹${formData.depositAmount}.`
        };

        const existingBookings = JSON.parse(localStorage.getItem('styleUpBookings')) || [];
        localStorage.setItem('styleUpBookings', JSON.stringify([...existingBookings, newBooking]));

        alert("Agreement drafted! Request sent to Admin for final stamping and payment.");
        navigate('/profile');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-step-content animation-fade-in">
                        <h3>Contract Terms</h3>
                        <p className="step-desc">Enter the financial and duration details of the tenancy.</p>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Monthly Rent (₹)</label>
                                <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} placeholder="e.g. 15000" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Security Deposit (₹)</label>
                                <input type="number" name="depositAmount" value={formData.depositAmount} onChange={handleChange} placeholder="e.g. 50000" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Agreement Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Notice Period</label>
                                <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} className="form-input">
                                    <option>1 Month</option>
                                    <option>2 Months</option>
                                    <option>3 Months</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Lock-in Period</label>
                                <select name="lockInPeriod" value={formData.lockInPeriod} onChange={handleChange} className="form-input">
                                    <option>No Lock-in</option>
                                    <option>6 Months</option>
                                    <option>11 Months</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="form-step-content animation-fade-in">
                        <h3>Property Information</h3>
                        <p className="step-desc">Where is the rental property located?</p>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Flat / House Number</label>
                                <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} placeholder="e.g. 402, Block A" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Building / Society Name</label>
                                <input type="text" name="buildingName" value={formData.buildingName} onChange={handleChange} placeholder="e.g. Prestige Shantiniketan" className="form-input" required />
                            </div>
                            <div className="form-group full-width">
                                <label>Locality / Area</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Whitefield" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <select name="city" value={formData.city} onChange={handleChange} className="form-input">
                                    <option>Bangalore</option>
                                    <option>Mumbai</option>
                                    <option>Delhi</option>
                                    <option>Chennai</option>
                                    <option>Hyderabad</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 560048" className="form-input" required />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="form-step-content animation-fade-in">
                        <h3>Landlord (Owner) Details</h3>
                        <p className="step-desc">Information about the property owner.</p>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Name</label>
                                <input type="text" name="landlordName" value={formData.landlordName} onChange={handleChange} placeholder="As per Aadhaar/PAN" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="tel" name="landlordPhone" value={formData.landlordPhone} onChange={handleChange} placeholder="10-digit mobile number" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="landlordEmail" value={formData.landlordEmail} onChange={handleChange} placeholder="Email for communication" className="form-input" />
                            </div>
                            <div className="form-group full-width">
                                <label>PAN Number (Optional)</label>
                                <input type="text" name="landlordPan" value={formData.landlordPan} onChange={handleChange} placeholder="Required if rent > 83,333/month" className="form-input" />
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="form-step-content animation-fade-in">
                        <h3>Tenant Details</h3>
                        <p className="step-desc">Information about the person renting the property.</p>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Full Name</label>
                                <input type="text" name="tenantName" value={formData.tenantName} onChange={handleChange} placeholder="As per Aadhaar/PAN" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="tel" name="tenantPhone" value={formData.tenantPhone} onChange={handleChange} placeholder="10-digit mobile number" className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="tenantEmail" value={formData.tenantEmail} onChange={handleChange} placeholder="Email for document delivery" className="form-input" required />
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="form-step-content animation-fade-in">
                        <h3>Agreement Summary</h3>
                        <p className="step-desc">Please review the details before proceeding to payment.</p>

                        <div className="summary-cards">
                            <div className="summary-card">
                                <h4>Contract Terms</h4>
                                <ul>
                                    <li><strong>Rent:</strong> ₹{formData.rentAmount} / month</li>
                                    <li><strong>Deposit:</strong> ₹{formData.depositAmount}</li>
                                    <li><strong>Start Date:</strong> {formData.startDate}</li>
                                    <li><strong>Notice Period:</strong> {formData.noticePeriod}</li>
                                    <li><strong>Lock-in:</strong> {formData.lockInPeriod}</li>
                                </ul>
                            </div>
                            <div className="summary-card">
                                <h4>Property</h4>
                                <ul>
                                    <li><strong>Number:</strong> {formData.houseNumber}</li>
                                    <li><strong>Building:</strong> {formData.buildingName}</li>
                                    <li><strong>Area:</strong> {formData.location}</li>
                                    <li><strong>City & Pin:</strong> {formData.city} - {formData.pincode}</li>
                                </ul>
                            </div>
                            <div className="summary-card">
                                <h4>Parties Involved</h4>
                                <ul>
                                    <li><strong>Landlord:</strong> {formData.landlordName || 'N/A'}</li>
                                    <li><strong>Contact:</strong> {formData.landlordPhone}</li>
                                    <li><strong>Tenant:</strong> {formData.tenantName || 'N/A'}</li>
                                    <li><strong>Contact:</strong> {formData.tenantPhone}</li>
                                </ul>
                            </div>
                        </div>

                        <div className="payment-alert">
                            <CreditCard size={32} className="text-primary" />
                            <div>
                                <h5>Ready to Draft!</h5>
                                <p>By proceeding, you agree to pay the drafting and stamping fees. You can review the actual document draft on the next screen before Aadhaar E-Signing.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-wrapper agreement-wizard-page">
            <Header />
            <main className="wizard-main">
                <div className="container wizard-container">

                    {/* Horizontal Stepper Progress */}
                    <div className="stepper-horizontal">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const isCompleted = currentStep > step.id;
                            const isActive = currentStep === step.id;

                            return (
                                <div key={step.id} className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                                    </div>
                                    <div className="step-text">
                                        <span className="step-label">Step {step.id}</span>
                                        <span className="step-title">{step.title}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Area underneath */}
                    <div className="wizard-content-area">
                        <form className="wizard-form" onSubmit={handleSubmit}>
                            {renderStepContent()}

                            <div className="wizard-actions">
                                <button
                                    type="button"
                                    className={`btn btn-outline ${currentStep === 1 ? 'hidden' : ''}`}
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft size={18} /> Back
                                </button>

                                {currentStep < STEPS.length ? (
                                    <button type="button" className="btn btn-primary ml-auto" onClick={handleNext}>
                                        Save & Continue <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary ml-auto checkout-btn" onClick={handleFinalConfirm}>
                                        Proceed to Payment <Check size={18} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AgreementForm;
