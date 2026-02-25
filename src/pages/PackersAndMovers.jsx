import React, { useState, useEffect, useRef } from 'react';
import { Truck, MapPin, Package, Calendar, ArrowRight, Loader, ArrowLeft, ShieldCheck, Box } from 'lucide-react';
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
    const [showQuote, setShowQuote] = useState(false);
    const [moveDate, setMoveDate] = useState('');
    const [packingTier, setPackingTier] = useState('Standard');

    const [basePrice, setBasePrice] = useState(0);

    const [pmPricingConfig, setPmPricingConfig] = useState({
        '1 BHK': 4000,
        '2 BHK': 7500,
        '3+ BHK': 12000,
        'Few Items': 2500,
        'Vehicle Transport': 3500,
        'PremiumMultiplier': 1.3
    });

    useEffect(() => {
        try {
            const storedPricing = JSON.parse(localStorage.getItem('styleUpPMPricing'));
            if (storedPricing) {
                setPmPricingConfig(storedPricing);
            }
        } catch (e) {
            console.error("Failed to load PM pricing", e);
        }
    }, []);

    const handleCheckPrice = () => {
        if (!pickup || !dropoff) {
            alert('Please enter both pickup and drop locations to get an estimate.');
            return;
        }

        const estimate = pmPricingConfig[transportType] || 4000;

        setBasePrice(estimate);
        setShowQuote(true);
    };

    const finalPrice = packingTier === 'Premium' ? Math.floor(basePrice * (pmPricingConfig.PremiumMultiplier || 1.3)) : basePrice;

    const handleBooking = () => {
        if (!moveDate) {
            alert('Please select a preferred moving date to get confirmed.');
            return;
        }

        const newBooking = {
            id: 'PM' + Math.floor(Math.random() * 90000 + 10000),
            serviceType: 'Packers & Movers Quotes',
            customerName: 'Active User',
            customerEmail: 'Not provided yet',
            city: 'Relocation Service',
            address: `From: ${pickup} To: ${dropoff}`,
            date: moveDate,
            timeSlot: `${transportType} - ${packingTier} (₹${finalPrice.toLocaleString('en-IN')})`,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        const existingBookings = JSON.parse(localStorage.getItem('styleUpBookings')) || [];
        existingBookings.push(newBooking);
        localStorage.setItem('styleUpBookings', JSON.stringify(existingBookings));

        alert("Booking confirmed! Your estimate has been submitted to the admin.");
        setShowQuote(false);
        setPickup('');
        setDropoff('');
        setMoveDate('');
        setPackingTier('Standard');
    };

    return (
        <div className="pm-page">
            {!showQuote && (
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

                                <button className="btn btn-primary pm-check-btn" onClick={handleCheckPrice}>
                                    Check Price <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showQuote && (
                <div className="pm-quote-container container animation-fade-in">
                    <button className="btn btn-outline mb-4 flex items-center gap-2" onClick={() => setShowQuote(false)}>
                        <ArrowLeft size={16} /> Edit Search
                    </button>

                    <div className="pm-quote-grid">
                        <div className="pm-quote-main">
                            <h2 className="pm-quote-title">Your Move Details</h2>

                            <div className="pm-quote-card pm-locations-summary">
                                <div className="pm-loc-item">
                                    <div className="pm-loc-icon"><MapPin size={20} /></div>
                                    <div>
                                        <div className="pm-loc-label">Pickup From</div>
                                        <div className="pm-loc-value">{pickup}</div>
                                    </div>
                                </div>
                                <div className="pm-loc-divider"></div>
                                <div className="pm-loc-item">
                                    <div className="pm-loc-icon"><MapPin size={20} /></div>
                                    <div>
                                        <div className="pm-loc-label">Drop To</div>
                                        <div className="pm-loc-value">{dropoff}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pm-quote-card mt-4">
                                <h3>Move Configuration</h3>
                                <div className="pm-config-grid">
                                    <div className="form-group">
                                        <label>Property Size / Transport Type</label>
                                        <div className="pm-config-value">{transportType}</div>
                                    </div>
                                    <div className="form-group">
                                        <label>Preferred Moving Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={moveDate}
                                            onChange={(e) => setMoveDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pm-quote-card mt-4">
                                <h3>Select Packing Service</h3>
                                <div className="pm-tier-options">
                                    <div
                                        className={`pm-tier-card ${packingTier === 'Standard' ? 'active' : ''}`}
                                        onClick={() => setPackingTier('Standard')}
                                    >
                                        <div className="pm-tier-header">
                                            <Package size={24} />
                                            <h4>Standard Service</h4>
                                        </div>
                                        <ul className="pm-tier-features">
                                            <li><ShieldCheck size={16} /> Basic protective wrapping</li>
                                            <li><ShieldCheck size={16} /> Loading & Unloading</li>
                                            <li><ShieldCheck size={16} /> Standard transport vehicle</li>
                                        </ul>
                                    </div>

                                    <div
                                        className={`pm-tier-card premium ${packingTier === 'Premium' ? 'active' : ''}`}
                                        onClick={() => setPackingTier('Premium')}
                                    >
                                        <div className="pm-tier-badge">Recommended</div>
                                        <div className="pm-tier-header">
                                            <Box size={24} />
                                            <h4>Premium Service</h4>
                                        </div>
                                        <ul className="pm-tier-features">
                                            <li><ShieldCheck size={16} /> Multi-layer bubble wrap & cartons</li>
                                            <li><ShieldCheck size={16} /> Loading, Unloading & Setup</li>
                                            <li><ShieldCheck size={16} /> Dedicated premium vehicle</li>
                                            <li><ShieldCheck size={16} /> Free Transit Insurance up to ₹50k</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pm-quote-sidebar">
                            <div className="pm-price-card">
                                <h3>Price Estimate</h3>

                                <div className="pm-price-breakdown">
                                    <div className="pm-price-row">
                                        <span>Base Price ({transportType})</span>
                                        <span>₹{basePrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    {packingTier === 'Premium' && (
                                        <div className="pm-price-row">
                                            <span>Premium Service Add-on</span>
                                            <span>+₹{(finalPrice - basePrice).toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="pm-price-row pm-price-total">
                                        <span>Estimated Total</span>
                                        <span>₹{finalPrice.toLocaleString('en-IN')}*</span>
                                    </div>
                                </div>

                                <p className="pm-price-note">*Final price may vary slightly based on actual inventory and elevator availability.</p>

                                <button className="btn btn-primary pm-book-btn" onClick={handleBooking}>
                                    Confirm & Book Now
                                </button>
                                <div className="mt-3 text-center text-sm text-light">No advance payment required</div>
                            </div>

                            <div className="pm-trust-card mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck size={20} className="text-success" />
                                    <strong>100% Price Guarantee</strong>
                                </div>
                                <p className="text-sm text-light">The estimate provided is highly accurate based on NoBroker's pricing algorithm.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!showQuote && (
                <>
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
                </>
            )}
        </div>
    );
};

export default PackersAndMovers;
