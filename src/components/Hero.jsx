import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader, X } from 'lucide-react';
import './Hero.css';

const TABS = ['Buy', 'Rent', 'Commercial'];
const MAX_LOCATIONS = 3;

const Hero = () => {
    const [activeTab, setActiveTab] = useState('Buy');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const suggestionRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Fetch real locations from OpenStreetMap (India only)
    useEffect(() => {
        if (searchQuery.trim().length >= 1) {
            const fetchLocations = async () => {
                setIsLoading(true);
                try {
                    // Added accept-language=en to strictly enforce English responses
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&countrycodes=in&addressdetails=1&limit=8&accept-language=en`);
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
                            const parts = item.display_name.split(', ');
                            return parts.slice(0, 3).join(', ');
                        });

                        // Remove duplicates and already selected locations
                        const uniqueLocs = [...new Set(formatted)].filter(loc => loc && !selectedLocations.includes(loc));
                        setSuggestions(uniqueLocs);
                    }
                } catch (error) {
                    console.error("Error fetching locations:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            // Debounce the API call
            const timer = setTimeout(() => {
                fetchLocations();
            }, 400);

            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, selectedLocations]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectLocation = (location) => {
        if (selectedLocations.length < MAX_LOCATIONS && !selectedLocations.includes(location)) {
            setSelectedLocations([...selectedLocations, location]);
            setSearchQuery('');
            setShowSuggestions(false);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleRemoveLocation = (locationToRemove) => {
        setSelectedLocations(selectedLocations.filter(loc => loc !== locationToRemove));
    };

    const handleContainerClick = () => {
        if (inputRef.current && selectedLocations.length < MAX_LOCATIONS) {
            inputRef.current.focus();
        }
    };

    return (
        <section className="hero">
            <div className="container hero-content">
                <h1 className="hero-title">
                    Elevate Your Living, Every Step of the Way.
                </h1>

                <div className="search-widget">
                    <div className="widget-tabs">
                        {TABS.map(tab => (
                            <div
                                key={tab}
                                className={`tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>

                    <div className="widget-search-bar" ref={suggestionRef}>
                        <div
                            className={`search-input-container ${showSuggestions ? 'focused' : ''}`}
                            onClick={handleContainerClick}
                        >
                            {/* Selected Location Tags */}
                            {selectedLocations.map((loc, index) => (
                                <div key={index} className="location-tag">
                                    <span className="location-tag-text" title={loc}>
                                        {loc.split(',')[0]} {/* Show only first part for brevity */}
                                    </span>
                                    <button
                                        className="location-tag-remove"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveLocation(loc);
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Input Field */}
                            {selectedLocations.length < MAX_LOCATIONS && (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="location-input"
                                    placeholder={selectedLocations.length === 0 ? `Search up to 3 localities for ${activeTab}...` : 'Add more...'}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                            )}

                            {/* Suggestions Dropdown */}
                            {showSuggestions && searchQuery.trim().length >= 1 && selectedLocations.length < MAX_LOCATIONS && (
                                <div className="search-suggestions">
                                    {isLoading ? (
                                        <div className="suggestion-empty">
                                            <Loader className="animate-spin" size={20} style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
                                            <span style={{ display: 'block', marginTop: '10px' }}>Searching locations...</span>
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map((loc, index) => (
                                            <div
                                                key={index}
                                                className="suggestion-item"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectLocation(loc);
                                                }}
                                            >
                                                <MapPin size={16} className="suggestion-icon" />
                                                <span className="suggestion-text">{loc}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="suggestion-empty">
                                            No locations found for "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button className="btn btn-primary btn-search" onClick={() => {
                            if (selectedLocations.length > 0 || searchQuery.trim()) {
                                const locString = selectedLocations.length > 0 ? selectedLocations.join('|') : searchQuery.trim();
                                navigate(`/search?type=${activeTab}&locations=${encodeURIComponent(locString)}`);
                            } else {
                                alert("Please enter a location to search.");
                            }
                        }}>
                            <Search size={20} style={{ marginRight: '8px' }} />
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
