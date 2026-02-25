import React, { useState, useEffect, useRef } from 'react';
import { Truck, MapPin, Package, Calendar, ArrowRight, Loader } from 'lucide-react';
import Header from '../components/Header';
import './PackersAndMovers.css';

const VEHICLE_IMAGES = [
    { id: 1, url: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop', title: 'Large Moving Truck' },
    { id: 2, url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=800&auto=format&fit=crop', title: 'Professional Packing' },
    { id: 3, url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop', title: 'Mini Truck / Van' },
    { id: 4, url: 'https://images.unsplash.com/photo-1506869640319-ce1a18b85b8b?q=80&w=800&auto=format&fit=crop', title: 'Safe Transit' }
];

// Simple Location Input with OSM Autocomplete
const LocationInput = ({ label, placeholder, value, onChange }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (value.trim().length >= 2 && showSuggestions) {
            const fetchLocations = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=in&addressdetails=1&limit=5&accept-language=en`);
                    if (response.ok) {
                        const data = await response.json();
                        const formatted = data.map(item => {
                            if (item.address) {
                                const addr = item.address;
                                const locality = addr.suburb || addr.neighbourhood || addr.city_district || item.name;
                                const city = addr.city || addr.town || addr.state_district;
                                if (locality && city && locality !== city) return `${locality}, ${city}`;
                                if (city) return city;
                            }
                            return item.display_name.split(', ').slice(0, 2).join(', ');
                        }).filter(Boolean);
                        setSuggestions([...new Set(formatted)]);
                    }
                } catch (error) {
                    console.error("Error fetching locations");
                } finally {
                    setIsLoading(false);
                }
            };
            const timer = setTimeout(fetchLocations, 400);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [value, showSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="pm-input-wrapper" ref={wrapperRef}>
            <label className="pm-input-label">{label}</label>
            <div className="pm-input-container">
                <MapPin size={18} className="pm-input-icon" />
                <input
                    type="text"
                    className="pm-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
            </div>
            {showSuggestions && value.length >= 2 && (
                <div className="pm-suggestions">
                    {isLoading ? (
                        <div className="pm-suggestion-loading"><Loader className="spin" size={16} /> Searching...</div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((loc, idx) => (
                            <div
                                key={idx}
                                className="pm-suggestion-item"
                                onClick={() => {
                                    onChange(loc);
                                    setShowSuggestions(false);
                                }}
                            >
                                <MapPin size={14} /> {loc}
                            </div>
                        ))
                    ) : (
                        <div className="pm-suggestion-loading">No locations found</div>
                    )}
                </div>
            )}
        </div>
    );
};

const PackersAndMovers = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [transportType, setTransportType] = useState('1 BHK');

    return (
        <div className="pm-page">
            <div className="pm-hero">
                <div className="container pm-hero-container">
                    <div className="pm-hero-content">
                        <h1 className="pm-title">Premium Packers & Movers</h1>
                        <p className="pm-subtitle">Safe, reliable, and hassle-free relocation services tailored for you.</p>

                        <div className="pm-booking-card">
                            <h2 className="pm-card-title">Get a Free Estimate</h2>

                            <div className="pm-form-grid">
                                <LocationInput
                                    label="Pickup Location"
                                    placeholder="Enter pickup area..."
                                    value={pickup}
                                    onChange={setPickup}
                                />
                                <LocationInput
                                    label="Drop Location"
                                    placeholder="Enter drop area..."
                                    value={dropoff}
                                    onChange={setDropoff}
                                />
                            </div>

                            <div className="pm-input-wrapper" style={{ marginTop: '20px' }}>
                                <label className="pm-input-label">Select Transport / Property Size</label>
                                <div className="pm-transport-options">
                                    {['1 BHK', '2 BHK', '3+ BHK', 'Few Items', 'Vehicle Transport'].map(type => (
                                        <button
                                            key={type}
                                            className={`pm-transport-btn ${transportType === type ? 'active' : ''}`}
                                            onClick={() => setTransportType(type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="btn btn-primary pm-check-btn">
                                Check Price <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container pm-section">
                <h2 className="pm-section-title">Our Moving Fleet</h2>
                <p className="pm-section-subtitle">We have the right vehicle for every kind of move.</p>

                <div className="pm-carousel-container">
                    <div className="pm-image-carousel">
                        {VEHICLE_IMAGES.map(img => (
                            <div key={img.id} className="pm-carousel-card">
                                <img src={img.url} alt={img.title} className="pm-carousel-img" />
                                <div className="pm-carousel-caption">{img.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container pm-section pb-large">
                <h2 className="pm-section-title">Why choose our Packers & Movers?</h2>
                <div className="pm-features-grid">
                    <div className="pm-feature-card">
                        <div className="pm-feature-icon-wrapper"><Package size={28} /></div>
                        <h3>Professional Packing</h3>
                        <p>Multi-layer protective packaging for your valuable electronics and furniture.</p>
                    </div>
                    <div className="pm-feature-card">
                        <div className="pm-feature-icon-wrapper"><Truck size={28} /></div>
                        <h3>Safe Transport</h3>
                        <p>GPS enabled closed trucks ensure your belongings reach safely and on time.</p>
                    </div>
                    <div className="pm-feature-card">
                        <div className="pm-feature-icon-wrapper"><Calendar size={28} /></div>
                        <h3>On-Time Delivery</h3>
                        <p>Strict adherence to moving schedules so you can settle in without delay.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackersAndMovers;
