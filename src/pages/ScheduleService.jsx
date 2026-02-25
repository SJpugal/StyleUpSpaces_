import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronRight, Home, Navigation, CheckCircle, ShieldCheck } from 'lucide-react';
import './ScheduleService.css';

const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
];

const ScheduleService = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form state
    const [formData, setFormData] = useState({
        city: 'Bangalore',
        address: '',
        landmark: '',
        date: '',
        timeSlot: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateSelect = (e) => {
        setFormData({ ...formData, date: e.target.value });
    };

    const handleTimeSelect = (slot) => {
        setFormData({ ...formData, timeSlot: slot });
    };

    const handleNext = () => {
        if (step === 1 && (!formData.address || !formData.city)) {
            alert("Please provide complete address details");
            return;
        }
        if (step === 2 && (!formData.date || !formData.timeSlot)) {
            alert("Please select a date and time slot");
            return;
        }

        if (step < 3) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleConfirmBooking = () => {
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

        // Grab pending cart from local storage 
        const pendingCart = JSON.parse(localStorage.getItem('styleUpPendingService')) || [];
        const combinedServiceName = pendingCart.length > 0
            ? pendingCart.map(item => item.name).join(', ')
            : 'Home Service';

        const totalEstimatedPrice = pendingCart.reduce((sum, item) => sum + item.price, 0) || 149;

        const newBooking = {
            id: `BKG-${Math.floor(Math.random() * 100000)}`,
            customerName: user ? user.name : 'Guest User',
            customerEmail: user ? user.email : 'Not Provided',
            city: formData.city,
            address: formData.address,
            landmark: formData.landmark,
            date: formData.date,
            timeSlot: formData.timeSlot,
            status: 'Pending',
            serviceType: combinedServiceName,
            totalPrice: totalEstimatedPrice,
            createdAt: new Date().toISOString()
        };

        const existingBookings = JSON.parse(localStorage.getItem('styleUpBookings')) || [];
        existingBookings.push(newBooking);
        localStorage.setItem('styleUpBookings', JSON.stringify(existingBookings));

        // Clear cart
        localStorage.removeItem('styleUpPendingService');

        alert("Booking Confirmed! Our professional will reach out to you shortly.");
        navigate('/profile');
    };

    // Helper to generate next 7 days for date picker (safely without locale rendering errors)
    const getNext7Days = () => {
        const dates = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);

            dates.push({
                fullDate: d.toISOString().split('T')[0],
                dayName: days[d.getDay()],
                dayNum: d.getDate(),
                month: months[d.getMonth()]
            });
        }
        return dates;
    };

    const availableDates = getNext7Days();

    return (
        <div className="page-wrapper schedule-page">
            
            <main className="schedule-main">
                <div className="container schedule-container">

                    {/* Left Side - Form Steps */}
                    <div className="schedule-content">

                        {/* Progress Header */}
                        <div className="schedule-progress">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                                <div className="p-icon"><MapPin size={18} /></div>
                                <span>Location</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                                <div className="p-icon"><Calendar size={18} /></div>
                                <span>Schedule</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                                <div className="p-icon"><CheckCircle size={18} /></div>
                                <span>Confirm</span>
                            </div>
                        </div>

                        {/* Step 1: Location */}
                        {step === 1 && (
                            <div className="schedule-step-box animation-fade-in">
                                <h3>Where do you need the service?</h3>
                                <p className="text-light-muted">Provide your exact address so our partner can reach you on time.</p>

                                <div className="form-group mt-4">
                                    <label>City</label>
                                    <div className="input-with-icon">
                                        <Navigation size={18} className="icon-left" />
                                        <select name="city" value={formData.city} onChange={handleChange} className="form-input has-icon">
                                            <option>Bangalore</option>
                                            <option>Mumbai</option>
                                            <option>Delhi</option>
                                            <option>Chennai</option>
                                            <option>Hyderabad</option>
                                            <option>Pune</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Complete Address</label>
                                    <div className="input-with-icon">
                                        <Home size={18} className="icon-left" />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="House No, Building Name, Street Area"
                                            className="form-input has-icon"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        placeholder="E.g. Near Apollo Pharmacy"
                                        className="form-input"
                                    />
                                </div>

                                <button className="btn btn-primary full-width mt-4" onClick={handleNext}>
                                    Select Date & Time <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Schedule */}
                        {step === 2 && (
                            <div className="schedule-step-box animation-fade-in">
                                <h3>When should the professional arrive?</h3>
                                <p className="text-light-muted">Select a convenient date and time slot.</p>

                                <div className="date-selection mt-4">
                                    <h4>Select Date</h4>
                                    <div className="date-chips">
                                        {availableDates.map(dateObj => {
                                            const isSelected = formData.date === dateObj.fullDate;

                                            return (
                                                <div
                                                    key={dateObj.fullDate}
                                                    className={`date-chip ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleDateSelect({ target: { value: dateObj.fullDate } })}
                                                >
                                                    <span className="day-name">{dateObj.dayName}</span>
                                                    <span className="day-num">{dateObj.dayNum}</span>
                                                    <span className="day-month">{dateObj.month}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="time-selection mt-4">
                                    <h4>Select Time Slot</h4>
                                    <div className="time-grid">
                                        {TIME_SLOTS.map(slot => (
                                            <div
                                                key={slot}
                                                className={`time-chip ${formData.timeSlot === slot ? 'selected' : ''}`}
                                                onClick={() => handleTimeSelect(slot)}
                                            >
                                                <Clock size={14} /> {slot}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="step-actions mt-4">
                                    <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn btn-primary" onClick={handleNext}>Proceed to Confirm</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Summary / Confirm */}
                        {step === 3 && (
                            <div className="schedule-step-box animation-fade-in">
                                <h3>Booking Summary</h3>
                                <p className="text-light-muted">Review your service details before confirming.</p>

                                <div className="summary-boxes mt-4">
                                    <div className="s-box">
                                        <div className="s-box-header">
                                            <MapPin size={18} /> Location Details
                                            <button className="text-link" onClick={() => setStep(1)}>Edit</button>
                                        </div>
                                        <div className="s-box-content">
                                            <p>{formData.address}</p>
                                            {formData.landmark && <p>Landmark: {formData.landmark}</p>}
                                            <p>{formData.city}</p>
                                        </div>
                                    </div>

                                    <div className="s-box">
                                        <div className="s-box-header">
                                            <Calendar size={18} /> Schedule Details
                                            <button className="text-link" onClick={() => setStep(2)}>Edit</button>
                                        </div>
                                        <div className="s-box-content">
                                            <p><strong>Date:</strong> {formData.date}</p>
                                            <p><strong>Time:</strong> {formData.timeSlot}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-info mt-4">
                                    <div className="info-row">
                                        <span>Visiting Charge</span>
                                        <span>₹149</span>
                                    </div>
                                    <div className="info-row highlight">
                                        <span>Estimated Service Cost</span>
                                        <span>{JSON.parse(localStorage.getItem('styleUpPendingService'))?.length > 0 ? `₹${JSON.parse(localStorage.getItem('styleUpPendingService')).reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}` : 'As per cart rates'}</span>
                                    </div>
                                    <p className="small-note">* Final bill will be generated after service completion based on actual work done and spare parts used.</p>
                                </div>

                                <button className="btn btn-primary full-width mt-4" onClick={handleConfirmBooking}>
                                    Confirm Booking
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Right Side - Trust / Info */}
                    <div className="schedule-sidebar">
                        <div className="sidebar-card">
                            <h4>Why Book with Us?</h4>
                            <ul className="perks-list">
                                <li>
                                    <ShieldCheck size={20} className="text-primary" />
                                    <div>
                                        <strong>Verified Professionals</strong>
                                        <p>Background checked and trained</p>
                                    </div>
                                </li>
                                <li>
                                    <CheckCircle size={20} className="text-success" />
                                    <div>
                                        <strong>180-Day Warranty</strong>
                                        <p>On all repairs and installations</p>
                                    </div>
                                </li>
                                <li>
                                    <Clock size={20} className="text-warning" />
                                    <div>
                                        <strong>On-time Service</strong>
                                        <p>Professionals arrive exactly on schedule</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ScheduleService;
