import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, Home, Key, CheckCircle, ChevronRight, X } from 'lucide-react';
import Header from '../components/Header';
import './SearchResults.css';

// Removing Mock Generator logic


const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL Params
    const queryType = searchParams.get('type') || 'Rent';
    const queryLocations = searchParams.get('locations') || '';

    // State
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Initial Load
    useEffect(() => {
        setIsLoading(true);
        // Simulate network delay for UI UX
        setTimeout(() => {
            const storedProps = JSON.parse(localStorage.getItem('styleUpProperties')) || [];

            // Filter by Rent/Buy Type
            let filtered = storedProps.filter(p => p.type?.toLowerCase() === queryType.toLowerCase());

            // Filter by Location if Search Query exists
            if (queryLocations && queryLocations.trim() !== '') {
                const searchLocs = queryLocations.toLowerCase().split('|');
                filtered = filtered.filter(p => {
                    const propLoc = (p.location || '').toLowerCase();
                    return searchLocs.some(loc => propLoc.includes(loc.trim()));
                });
            }

            setProperties(filtered);
            setIsLoading(false);
            window.scrollTo(0, 0);
        }, 600);
    }, [queryType, queryLocations]);

    const handleSearchModify = () => {
        navigate('/'); // Usually this opens a modal or drops down the search bar, returning to home for simplicity
    };

    return (
        <div className="page-wrapper search-results-page">
            <Header />

            {/* Sticky Search Summary Bar */}
            <div className="search-summary-bar">
                <div className="container summary-inner">
                    <div className="summary-details">
                        <MapPin size={18} className="text-light-muted" />
                        <span className="summary-locs">{queryLocations.split('|').join(' • ') || 'All Locations'}</span>
                        <span className="summary-type badge">{queryType}</span>
                    </div>
                    <button className="btn btn-outline compact" onClick={handleSearchModify}>
                        Modify Search
                    </button>
                </div>
            </div>

            <main className="search-main container">

                {/* Mobile Filter Toggle */}
                <button className="mobile-filter-btn btn btn-outline" onClick={() => setShowFilters(!showFilters)}>
                    <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                <div className="search-content-grid">

                    {/* Left Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filter-header">
                            <h3>Filters</h3>
                            {showFilters && <button className="close-filters" onClick={() => setShowFilters(false)}><X size={20} /></button>}
                        </div>

                        <div className="filter-section">
                            <h4>BHK Type</h4>
                            <div className="checkbox-group">
                                <label><input type="checkbox" /> 1 RK</label>
                                <label><input type="checkbox" /> 1 BHK</label>
                                <label><input type="checkbox" /> 2 BHK</label>
                                <label><input type="checkbox" /> 3 BHK</label>
                                <label><input type="checkbox" /> 4+ BHK</label>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4>Property Status</h4>
                            <div className="checkbox-group">
                                <label><input type="checkbox" /> Fully Furnished</label>
                                <label><input type="checkbox" /> Semi Furnished</label>
                                <label><input type="checkbox" /> Unfurnished</label>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4>Property Type</h4>
                            <div className="checkbox-group">
                                <label><input type="checkbox" /> Apartment</label>
                                <label><input type="checkbox" /> Independent House/Villa</label>
                                <label><input type="checkbox" /> Gated Community</label>
                            </div>
                        </div>
                    </aside>

                    {/* Right Property Listings */}
                    <div className="listings-area">
                        <div className="listings-header">
                            <h2>{properties.length} Properties found</h2>
                            <div className="sort-by">
                                <span>Sort By: </span>
                                <select className="sort-select">
                                    <option>Relevance</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="listings-loader">
                                <div className="spinner"></div>
                                <p>Finding the perfect properties...</p>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="no-results">
                                <Home size={40} className="text-light-muted mb-3" />
                                <h3>No properties found here.</h3>
                                <p>Try adjusting your filters or searching a different area.</p>
                            </div>
                        ) : (
                            <div className="properties-list">
                                {properties.map(property => (
                                    <div key={property.id} className="property-card">

                                        <div className="property-image-container">
                                            <div className="property-image" style={{ backgroundImage: `url(${property.image})` }}>
                                                <div className="property-badges">
                                                    {property.tags.map(tag => (
                                                        <span key={tag} className="prop-tag">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="property-details-container">
                                            <div className="prop-header-row">
                                                <h3 className="prop-title">{property.title}</h3>
                                            </div>

                                            <p className="prop-address text-light-muted">
                                                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                {property.location}
                                            </p>

                                            <div className="prop-key-stats">
                                                <div className="stat-box">
                                                    <span className="stat-value">₹{(property.price || 0).toLocaleString('en-IN')}{queryType.toLowerCase() === 'rent' ? '/M' : ''}</span>
                                                    <span className="stat-label">{queryType.toLowerCase() === 'rent' ? 'Rent' : 'Price'}</span>
                                                </div>
                                                <div className="stat-box">
                                                    <span className="stat-value">{property.area} Sq.Ft</span>
                                                    <span className="stat-label">Builtup Area</span>
                                                </div>
                                                {queryType.toLowerCase() === 'rent' && (
                                                    <div className="stat-box">
                                                        <span className="stat-value">₹{(property.deposit || 0).toLocaleString('en-IN')}</span>
                                                        <span className="stat-label">Deposit</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="prop-features">
                                                <div className="feature"><Home size={14} /> {property.propertyType}</div>
                                                <div className="feature"><Key size={14} /> {property.furnishing}</div>
                                                <div className="feature"><CheckCircle size={14} /> {property.availableFrom}</div>
                                            </div>

                                            <div className="prop-actions-row">
                                                <div className="owner-info">
                                                    <div className="owner-avatar">{property.owner.charAt(0)}</div>
                                                    <span>{property.owner}</span>
                                                </div>
                                                <div className="action-btns">
                                                    <button className="btn btn-outline compact">Shortlist</button>
                                                    <button className="btn btn-primary compact">Get Owner Details</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SearchResults;
