import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, IndianRupee, Send, Loader } from 'lucide-react';
import './InteriorEnquiry.css';

const propertyTypes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa', 'Commercial'];
const budgetOptions = [
    '₹2 Lakhs - ₹4 Lakhs',
    '₹4 Lakhs - ₹7 Lakhs',
    '₹7 Lakhs - ₹10 Lakhs',
    '₹10 Lakhs - ₹15 Lakhs',
    '₹15 Lakhs +'
];

const InteriorEnquiry = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = setFormDataState();
    const [submitted, setSubmitted] = useState(false);

    function setFormDataState() {
        return useState({
            location: '',
            propertyType: '',
            budget: ''
        });
    }

    // Autocomplete state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);
    const suggestionRef = React.useRef(null);

    // Fetch real locations from OpenStreetMap (India only)
    React.useEffect(() => {
        if (formData.location.trim().length >= 2 && showSuggestions) {
            const fetchLocations = async () => {
                setIsLoadingLocations(true);
                try {
                    // Added accept-language=en to strictly enforce English responses
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location.trim())}&countrycodes=in&addressdetails=1&limit=5&accept-language=en`);
                    if (response.ok) {
                        const data = await response.json();

                        const formatted = data.map(item => {
                            if (item.address) {
                                const addr = item.address;
                                const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.village || addr.city_district || item.name;
                                const city = addr.city || addr.town || addr.county || addr.state_district;
                                const state = addr.state;

                                if (locality && city && state && locality !== city) {
                                    return `${locality}, ${city}, ${state}`;
                                } else if (city && state) {
                                    return `${city}, ${state}`;
                                } else if (locality && state) {
                                    return `${locality}, ${state}`;
                                }
                            }

                            // Fallback string manipulation if address details somehow miss
                            // Also good for highly specific places that OpenStreetMap doesn't categorize perfectly
                            return item.display_name.split(', ').slice(0, 3).join(', ');
                        });

                        // Remove duplicates and already selected locations
                        const uniqueLocs = [...new Set(formatted)].filter(loc => loc && loc.toLowerCase() !== formData.location.toLowerCase());
                        setSuggestions(uniqueLocs);
                    }
                } catch (error) {
                    console.error("Error fetching locations:", error);
                } finally {
                    setIsLoadingLocations(false);
                }
            };

            // Debounce the API call
            const timer = setTimeout(() => {
                fetchLocations();
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [formData.location, showSuggestions]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'location') {
            setShowSuggestions(true);
        }
    };

    const handleSelectLocation = (loc) => {
        setFormData(prev => ({
            ...prev,
            location: loc
        }));
        setShowSuggestions(false);
    };

    const handleSelectOption = (category, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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

        const newEnquiry = {
            id: `ENQ-${Math.floor(Math.random() * 100000)}`,
            customerName: user ? user.name : 'Guest User',
            customerEmail: user ? user.email : 'Not Provided',
            city: formData.location.split(',')[0] || 'Unknown',
            address: formData.location,
            landmark: '',
            date: 'ASAP',
            timeSlot: `Type: ${formData.propertyType} | Size: ${formData.propertySize}`,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            serviceType: 'Interior Design Enquiry'
        };

        const existingBookings = JSON.parse(localStorage.getItem('styleUpBookings')) || [];
        existingBookings.push(newEnquiry);
        localStorage.setItem('styleUpBookings', JSON.stringify(existingBookings));

        setSubmitted(true);
    };

    return (
        <div className="page-wrapper enquiry-page">
            

            <main className="enquiry-main">
                <div className="container enquiry-container">
                    <button className="back-btn" onClick={() => navigate('/interior-design')}>
                        <ArrowLeft size={20} /> Back to Interiors
                    </button>

                    <div className="form-card">
                        <div className="form-header">
                            <h2>Get Your Free Design Consultation</h2>
                            <p>Tell us a bit about your property, and our expert designers will reach out.</p>
                        </div>

                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">✓</div>
                                <h3>Thank you for your enquiry!</h3>
                                <p>Our luxury interior design experts will contact you within 24 hours.</p>
                                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
                                    Return to Home
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="enquiry-form">

                                {/* Location Info */}
                                <div className="form-section">
                                    <h3 className="section-title-sm">Location Details</h3>
                                    <div className="input-group location-input" style={{ width: '100%', position: 'relative' }} ref={suggestionRef}>
                                        <MapPin className="input-icon" size={20} />
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Location (e.g., Whitefield, Bangalore)"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            onFocus={() => setShowSuggestions(true)}
                                            autoComplete="off"
                                        />

                                        {/* Suggestions Dropdown */}
                                        {showSuggestions && formData.location.trim().length >= 2 && (
                                            <div className="autocomplete-dropdown" style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                backgroundColor: 'white',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '0 0 8px 8px',
                                                boxShadow: 'var(--shadow-md)',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                zIndex: 100,
                                                marginTop: '4px'
                                            }}>
                                                {isLoadingLocations ? (
                                                    <div style={{ padding: '12px 15px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div className="spinner-border spinner-border-sm" role="status" style={{ width: '1rem', height: '1rem', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spin .75s linear infinite' }}></div>
                                                        Searching...
                                                    </div>
                                                ) : suggestions.length > 0 ? (
                                                    suggestions.map((loc, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                padding: '12px 15px',
                                                                cursor: 'pointer',
                                                                borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                            onClick={() => handleSelectLocation(loc)}
                                                        >
                                                            <MapPin size={16} color="var(--primary-color)" />
                                                            {loc}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ padding: '12px 15px', color: 'var(--text-light)' }}>
                                                        No locations found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="form-section">
                                    <h3 className="section-title-sm">
                                        <Home size={18} /> Property Type
                                    </h3>
                                    <div className="pills-grid">
                                        {propertyTypes.map(type => (
                                            <div
                                                key={type}
                                                className={`option-pill ${formData.propertyType === type ? 'selected' : ''}`}
                                                onClick={() => handleSelectOption('propertyType', type)}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Hidden input to make sure it's valid if required later */}
                                    <input type="hidden" name="propertyType" value={formData.propertyType} required />
                                </div>

                                {/* Budget */}
                                <div className="form-section">
                                    <h3 className="section-title-sm">
                                        <IndianRupee size={18} /> Estimated Budget
                                    </h3>
                                    <div className="pills-grid budget-grid">
                                        {budgetOptions.map(option => (
                                            <div
                                                key={option}
                                                className={`option-pill ${formData.budget === option ? 'selected' : ''}`}
                                                onClick={() => handleSelectOption('budget', option)}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                    <input type="hidden" name="budget" value={formData.budget} required />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary submit-btn"
                                    disabled={!formData.propertyType || !formData.budget}
                                >
                                    <Send size={18} /> Send Enquiry
                                </button>

                                {(!formData.propertyType || !formData.budget) && (
                                    <p className="form-hint">Please select Property Type and Budget to proceed.</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InteriorEnquiry;
