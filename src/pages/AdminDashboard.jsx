import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicesContext, mapIconComponent } from '../context/ServicesContext';
import { Settings, Users, Calendar, LayoutDashboard, Edit3, Save, X, Plus, MessageSquare, CheckCircle, XCircle, Home, Trash2, MapPin, Loader } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { services, updateServiceCategory, interiorGallery, updateInteriorGallery } = useContext(ServicesContext);

    const [adminUser, setAdminUser] = useState({ company: 'Admin Portal', username: 'Superuser' });

    // Navigation and Data State
    const [activeNav, setActiveNav] = useState('services');
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);

    // Booking Action State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isAddingProperty, setIsAddingProperty] = useState(false);
    const [editingPropertyId, setEditingPropertyId] = useState(null);
    const [newPropertyForm, setNewPropertyForm] = useState({
        location: '', title: '', price: '', area: '', bhk: '1', type: 'Rent',
        furnishing: 'Unfurnished', propertyType: 'Apartment', availableFrom: 'Immediately', image: ''
    });

    const [isAddingGallery, setIsAddingGallery] = useState(false);
    const [editingGalleryId, setEditingGalleryId] = useState(null);
    const [newGalleryForm, setNewGalleryForm] = useState({
        image: '', title: '', category: 'Living Room'
    });

    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);
    const suggestionRef = useRef(null);

    // P&M Pricing State
    const defaultPMPricing = {
        '1 BHK': 4000,
        '2 BHK': 7500,
        '3+ BHK': 12000,
        'Few Items': 2500,
        'Vehicle Transport': 3500,
        'PremiumMultiplier': 1.3
    };
    const [pmPricing, setPmPricing] = useState(defaultPMPricing);

    // Auth Check: Force redirect if no valid admin session is found
    useEffect(() => {
        const adminSession = JSON.parse(localStorage.getItem('styleUpAdminSession'));
        if (!adminSession || adminSession.role !== 'admin') {
            navigate('/admin-login');
        } else {
            setAdminUser({ company: adminSession.company || 'Admin Portal', username: adminSession.username || 'Superuser' });

            // Load bookings
            const storedBookings = JSON.parse(localStorage.getItem('styleUpBookings')) || [];
            // Sort by newest first
            storedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(storedBookings);

            // Load properties
            try {
                const storedProps = JSON.parse(localStorage.getItem('styleUpProperties'));
                setProperties(Array.isArray(storedProps) ? storedProps : []);
            } catch (e) {
                console.error("Error parsing properties", e);
                setProperties([]);
            }

            // Load P&M Pricing
            try {
                const storedPricing = JSON.parse(localStorage.getItem('styleUpPMPricing'));
                if (storedPricing) {
                    setPmPricing(storedPricing);
                }
            } catch (e) {
                console.error("Error parsing PM Pricing", e);
            }
        }
    }, [navigate]);

    // Autocomplete for location
    useEffect(() => {
        if (newPropertyForm.location && newPropertyForm.location.length > 2 && showLocationSuggestions) {
            const fetchLocations = async () => {
                setIsLoadingLocations(true);
                try {
                    const query = `${newPropertyForm.location}, India`;
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&countrycodes=in&limit=5&accept-language=en`);
                    if (!response.ok) throw new Error("API failed");
                    const data = await response.json();

                    if (data && data.length > 0) {
                        const formatted = data.map(item => {
                            const addr = item.address;
                            if (addr) {
                                const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.village;
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
                            return item.display_name.split(', ').slice(0, 3).join(', ');
                        });
                        const uniqueLocs = [...new Set(formatted)].filter(loc => loc && loc.toLowerCase() !== newPropertyForm.location.toLowerCase());
                        setLocationSuggestions(uniqueLocs);
                    }
                } catch (error) {
                    console.error("Error fetching locations:", error);
                } finally {
                    setIsLoadingLocations(false);
                }
            };

            const timer = setTimeout(() => {
                fetchLocations();
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setLocationSuggestions([]);
        }
    }, [newPropertyForm.location, showLocationSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowLocationSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [activeTab, setActiveTab] = useState('electrician');
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', price: '', iconName: '' });

    // Ensure we have an array to render even if empty
    const currentCategoryItems = services[activeTab] || [];

    const handleEditClick = (item) => {
        setEditingItem(item.id);
        setEditForm({ name: item.name, price: item.price, iconName: item.iconName });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditForm({ name: '', price: '', iconName: '' });
    };

    const handleSaveEdit = (id) => {
        const updatedCategory = currentCategoryItems.map(item =>
            item.id === id ? { ...item, ...editForm, price: parseFloat(editForm.price) } : item
        );
        updateServiceCategory(activeTab, updatedCategory);
        setEditingItem(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            const updatedCategory = currentCategoryItems.filter(item => item.id !== id);
            updateServiceCategory(activeTab, updatedCategory);
        }
    };

    const handleAddNew = () => {
        const newId = currentCategoryItems.length > 0 ? Math.max(...currentCategoryItems.map(i => i.id)) + 1 : 1;
        const newItem = { id: newId, name: 'New Service', price: 0, iconName: 'Zap' };

        const updatedCategory = [...currentCategoryItems, newItem];
        updateServiceCategory(activeTab, updatedCategory);

        // Immediately open for editing
        setEditingItem(newId);
        setEditForm({ name: 'New Service', price: 0, iconName: 'Zap' });
    };

    const handleUpdateBookingStatus = (bookingId, newStatus) => {
        const updatedBookings = bookings.map(b => {
            if (b.id === bookingId) {
                return { ...b, status: newStatus, adminReply: replyMessage, updatedAt: new Date().toISOString() };
            }
            return b;
        });

        setBookings(updatedBookings);
        localStorage.setItem('styleUpBookings', JSON.stringify(updatedBookings));
        setSelectedBooking(null);
        setReplyMessage('');
    };

    const handleDeleteBooking = (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking entirely?')) {
            const updatedBookings = bookings.filter(b => b.id !== bookingId);
            setBookings(updatedBookings);
            localStorage.setItem('styleUpBookings', JSON.stringify(updatedBookings));
        }
    };

    const handlePropertyFormChange = (e) => {
        const { name, value } = e.target;
        setNewPropertyForm(prev => ({ ...prev, [name]: value }));
        if (name === 'location') {
            setShowLocationSuggestions(true);
        }
    };

    const handlePropertyImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPropertyForm(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectLocation = (loc) => {
        setNewPropertyForm(prev => ({ ...prev, location: loc }));
        setShowLocationSuggestions(false);
    };

    const handleEditProperty = (prop) => {
        setEditingPropertyId(prop.id);
        setNewPropertyForm({ ...prop });
        setIsAddingProperty(true);
    };

    const handleAddPropertySubmit = (e) => {
        e.preventDefault();
        let updatedProperties;

        if (editingPropertyId) {
            updatedProperties = properties.map(p =>
                p.id === editingPropertyId ? {
                    ...p,
                    ...newPropertyForm,
                    title: newPropertyForm.title || `${newPropertyForm.bhk} BHK For ${newPropertyForm.type} In ${newPropertyForm.location}`,
                    bhk: parseInt(newPropertyForm.bhk),
                    area: parseInt(newPropertyForm.area) || 0,
                    price: parseInt(newPropertyForm.price) || 0,
                    deposit: newPropertyForm.type === 'Rent' ? (parseInt(newPropertyForm.price) * 5) : 0,
                } : p
            );
            alert("Property updated successfully!");
        } else {
            const newProperty = {
                id: `PROP-${Math.floor(Math.random() * 100000)}`,
                title: newPropertyForm.title || `${newPropertyForm.bhk} BHK For ${newPropertyForm.type} In ${newPropertyForm.location}`,
                location: newPropertyForm.location,
                type: newPropertyForm.type,
                bhk: parseInt(newPropertyForm.bhk),
                area: parseInt(newPropertyForm.area) || 0,
                price: parseInt(newPropertyForm.price) || 0,
                deposit: newPropertyForm.type === 'Rent' ? (parseInt(newPropertyForm.price) * 5) : 0,
                furnishing: newPropertyForm.furnishing,
                propertyType: newPropertyForm.propertyType,
                availableFrom: newPropertyForm.availableFrom,
                owner: adminUser.company,
                image: newPropertyForm.image || 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                tags: ['Premium', 'Verified'],
                createdAt: new Date().toISOString()
            };
            updatedProperties = [...properties, newProperty];
            alert("Property added successfully!");
        }

        setProperties(updatedProperties);
        localStorage.setItem('styleUpProperties', JSON.stringify(updatedProperties));

        setIsAddingProperty(false);
        setEditingPropertyId(null);
        setNewPropertyForm({
            location: '', title: '', price: '', area: '', bhk: '1', type: 'Rent',
            furnishing: 'Unfurnished', propertyType: 'Apartment', availableFrom: 'Immediately', image: ''
        });
    };

    const handleDeleteProperty = (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            const updatedProps = properties.filter(p => p.id !== id);
            setProperties(updatedProps);
            localStorage.setItem('styleUpProperties', JSON.stringify(updatedProps));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewGalleryForm({ ...newGalleryForm, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditGallery = (img) => {
        setEditingGalleryId(img.id);
        setNewGalleryForm({
            image: img.image,
            title: img.title,
            category: img.category
        });
        setIsAddingGallery(true);
    };

    const handleSaveGallery = () => {
        if (!newGalleryForm.title || !newGalleryForm.image) {
            alert("Please provide the Image URL and Title");
            return;
        }

        let updated;

        if (editingGalleryId) {
            updated = interiorGallery.map(ig =>
                ig.id === editingGalleryId ? { ...ig, ...newGalleryForm } : ig
            );
            alert("Image updated in Interior Gallery!");
        } else {
            const newItem = {
                id: `ig_${Date.now()}`,
                image: newGalleryForm.image,
                title: newGalleryForm.title,
                category: newGalleryForm.category
            };
            updated = [newItem, ...interiorGallery];
            alert("Image uploaded to Interior Gallery!");
        }

        updateInteriorGallery(updated);
        setIsAddingGallery(false);
        setEditingGalleryId(null);
        setNewGalleryForm({ image: '', title: '', category: 'Living Room' });
    };

    const handleDeleteGallery = (id) => {
        if (window.confirm('Are you sure you want to delete this interior image?')) {
            const updated = interiorGallery.filter(ig => ig.id !== id);
            updateInteriorGallery(updated);
        }
    };

    const handleSavePMPricing = () => {
        try {
            localStorage.setItem('styleUpPMPricing', JSON.stringify(pmPricing));
            alert('Packers & Movers pricing updated successfully!');
        } catch (e) {
            console.error("Failed to save PM pricing", e);
            alert('Error saving pricing.');
        }
    };

    return (
        <div className="admin-layout">

            <div className="admin-container">
                {/* Admin Sidebar */}
                <aside className="admin-sidebar">
                    <div className="admin-profile">
                        <div className="admin-avatar">{adminUser.username.charAt(0).toUpperCase()}</div>
                        <div className="admin-info">
                            <h4>{adminUser.company}</h4>
                            <span>@{adminUser.username}</span>
                        </div>
                    </div>

                    <nav className="admin-nav">
                        <a href="#dashboard" className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('dashboard'); }}><LayoutDashboard size={18} /> Dashboard</a>
                        <a href="#services" className={`nav-item ${activeNav === 'services' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('services'); }}><Settings size={18} /> Service Catalogue</a>
                        <a href="#bookings" className={`nav-item ${activeNav === 'bookings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('bookings'); }}>
                            <Calendar size={18} /> Bookings
                            {bookings.filter(b => b.status === 'Pending').length > 0 && (
                                <span className="nav-badge">{bookings.filter(b => b.status === 'Pending').length}</span>
                            )}
                        </a>
                        <a href="#properties" className={`nav-item ${activeNav === 'properties' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('properties'); }}><Home size={18} /> Properties</a>
                        <a href="#interior" className={`nav-item ${activeNav === 'interior' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('interior'); }}><LayoutDashboard size={18} /> Interior Gallery</a>
                        <a href="#pm-settings" className={`nav-item ${activeNav === 'pm_settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('pm_settings'); }}><Settings size={18} /> P&M Settings</a>
                        <a href="#users" className={`nav-item ${activeNav === 'users' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveNav('users'); }}><Users size={18} /> Users</a>
                    </nav>
                </aside>

                {/* Main Admin Content */}
                <main className="admin-main">
                    <header className="admin-header">
                        <h2>{activeNav === 'services' ? 'Manage Services Data' : activeNav === 'dashboard' ? 'Overview' : activeNav === 'properties' ? 'Manage Properties' : activeNav === 'users' ? 'Manage Users' : activeNav === 'pm_settings' ? 'P&M Pricing Settings' : 'Incoming Bookings'}</h2>
                        {activeNav === 'services' && (
                            <button className="btn btn-primary" onClick={handleAddNew}>
                                <Plus size={16} /> Add New Service
                            </button>
                        )}
                        {activeNav === 'properties' && (
                            <button className="btn btn-primary" onClick={() => {
                                setEditingPropertyId(null);
                                setNewPropertyForm({
                                    location: '', title: '', price: '', area: '', bhk: '1', type: 'Rent',
                                    furnishing: 'Unfurnished', propertyType: 'Apartment', availableFrom: 'Immediately', image: ''
                                });
                                setIsAddingProperty(true);
                            }}>
                                <Plus size={16} /> Add New Property
                            </button>
                        )}
                    </header>

                    {activeNav === 'services' && (
                        <div className="admin-tabs">
                            {Object.keys(services).map(category => (
                                <button
                                    key={category}
                                    className={`tab-btn ${activeTab === category ? 'active' : ''}`}
                                    onClick={() => setActiveTab(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="admin-content-card">
                        {activeNav === 'services' && (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Icon</th>
                                        <th>Service Name</th>
                                        <th>Base Price (₹)</th>
                                        <th>Icon Name (Lucide)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCategoryItems.map(item => {
                                        const IconComponent = mapIconComponent(item.iconName);
                                        const isEditing = editingItem === item.id;

                                        return (
                                            <tr key={item.id} className={isEditing ? 'editing-row' : ''}>
                                                <td>#{item.id}</td>

                                                <td className="icon-cell">
                                                    <div className="icon-preview">
                                                        <IconComponent size={20} />
                                                    </div>
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            className="admin-input"
                                                            value={editForm.name}
                                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                        />
                                                    ) : (
                                                        <span className="fw-600">{item.name}</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            className="admin-input"
                                                            value={editForm.price}
                                                            onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                        />
                                                    ) : (
                                                        <span className="price-tag">₹{item.price}</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            className="admin-input"
                                                            value={editForm.iconName}
                                                            onChange={e => setEditForm({ ...editForm, iconName: e.target.value })}
                                                            placeholder="e.g. Home, Zap"
                                                        />
                                                    ) : (
                                                        <span className="code-tag">{item.iconName}</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        {isEditing ? (
                                                            <>
                                                                <button className="action-btn save" onClick={() => handleSaveEdit(item.id)} title="Save"><Save size={16} /></button>
                                                                <button className="action-btn cancel" onClick={handleCancelEdit} title="Cancel"><X size={16} /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button className="action-btn edit" onClick={() => handleEditClick(item)} title="Edit"><Edit3 size={16} /></button>
                                                                <button className="action-btn delete" onClick={() => handleDelete(item.id)} title="Delete"><X size={16} /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {currentCategoryItems.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-light">No services found in this category.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeNav === 'bookings' && (
                            <table className="admin-table bookings-table">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Service Type</th>
                                        <th>Customer</th>
                                        <th>Service Addr.</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td className="fw-600">{booking.id}</td>
                                            <td>
                                                <span className="code-tag" style={{ background: booking.serviceType === 'Interior Design Enquiry' ? '#e0e7ff' : '#f1f3f5', color: booking.serviceType === 'Interior Design Enquiry' ? '#4338ca' : '#495057' }}>{booking.serviceType || 'Home Service'}</span>
                                            </td>
                                            <td>
                                                <div className="b-customer-name">{booking.customerName}</div>
                                                <div className="b-customer-email text-light-muted" style={{ fontSize: '0.85rem' }}>{booking.customerEmail}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>{booking.city}</div>
                                                <div className="text-light-muted" style={{ fontSize: '0.85rem' }}>{booking.address.substring(0, 25)}...</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>{booking.date}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: '500' }}>{booking.timeSlot}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                                            </td>
                                            <td>
                                                <div className="action-buttons" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <button
                                                        className="btn btn-outline compact-btn"
                                                        onClick={() => setSelectedBooking(booking)}
                                                    >
                                                        Review &amp; Reply
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleDeleteBooking(booking.id)} title="Delete Booking"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-light">No bookings received yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeNav === 'properties' && (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title & Location</th>
                                        <th>Type & Price</th>
                                        <th>Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(properties) ? properties : []).map(prop => {
                                        if (!prop) return null;
                                        return (
                                            <tr key={prop.id || Math.random()}>
                                                <td>
                                                    <div style={{ width: '60px', height: '40px', background: `url(${prop.image || ''}) center/cover`, borderRadius: '4px' }}></div>
                                                </td>
                                                <td>
                                                    <div className="fw-600">{prop.title || 'Untitled'}</div>
                                                    <div className="text-light-muted" style={{ fontSize: '0.85rem' }}>{prop.location || 'Unknown'}</div>
                                                </td>
                                                <td>
                                                    <div><span className="code-tag">{prop.type || 'N/A'}</span></div>
                                                    <div className="fw-600 mt-1">₹{(prop.price || 0).toLocaleString('en-IN')}{prop.type === 'Rent' ? '/M' : ''}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.85rem' }}>{prop.bhk || 0} BHK • {prop.area || 0} Sq.Ft</div>
                                                    <div className="text-light-muted" style={{ fontSize: '0.85rem' }}>{prop.propertyType || 'N/A'} • {prop.furnishing || 'N/A'}</div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="action-btn edit" onClick={() => handleEditProperty(prop)} title="Edit Property"><Edit3 size={16} /></button>
                                                        <button className="action-btn delete" onClick={() => handleDeleteProperty(prop.id)} title="Delete Property"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {(!Array.isArray(properties) || properties.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-light">No properties uploaded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeNav === 'pm_settings' && (
                            <div className="pm-settings-container">
                                <h3>Packers and Movers Pricing Configuration</h3>
                                <p className="text-light-muted mb-4">Set the base pricing for different property sizes. These values will be calculated dynamically on the frontend when users request an estimate.</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px' }}>
                                    <div className="form-group">
                                        <label>1 BHK / RK Base Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={pmPricing['1 BHK']}
                                            onChange={(e) => setPmPricing({ ...pmPricing, '1 BHK': parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>2 BHK Base Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={pmPricing['2 BHK']}
                                            onChange={(e) => setPmPricing({ ...pmPricing, '2 BHK': parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>3+ BHK Base Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={pmPricing['3+ BHK']}
                                            onChange={(e) => setPmPricing({ ...pmPricing, '3+ BHK': parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Few Items Base Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={pmPricing['Few Items']}
                                            onChange={(e) => setPmPricing({ ...pmPricing, 'Few Items': parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Vehicle Transport Price (₹)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={pmPricing['Vehicle Transport']}
                                            onChange={(e) => setPmPricing({ ...pmPricing, 'Vehicle Transport': parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Premium Service Multiplier (e.g. 1.3 for +30%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="form-input"
                                            value={pmPricing['PremiumMultiplier']}
                                            onChange={(e) => setPmPricing({ ...pmPricing, 'PremiumMultiplier': parseFloat(e.target.value) || 1 })}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                    <button className="btn btn-primary" onClick={handleSavePMPricing}>
                                        <Save size={16} /> Save P&M Pricing
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interior Gallery View */}
                    {activeNav === 'interior' && (
                        <div className="admin-content-card animation-fade-in" style={{ marginTop: '20px' }}>
                            <div className="box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>Interior Design Gallery</h2>
                                <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => {
                                    setEditingGalleryId(null);
                                    setNewGalleryForm({ image: '', title: '', category: 'Living Room' });
                                    setIsAddingGallery(true);
                                }}>
                                    <Plus size={16} /> Add New Image
                                </button>
                            </div>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interiorGallery.map((img) => (
                                        <tr key={img.id}>
                                            <td>
                                                <div style={{ width: '80px', height: '50px', borderRadius: '6px', overflow: 'hidden' }}>
                                                    <img src={img.image} alt="interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </td>
                                            <td><strong>{img.title}</strong></td>
                                            <td><span className="code-tag">{img.category}</span></td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn edit" onClick={() => handleEditGallery(img)} title="Edit Image">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleDeleteGallery(img.id)} title="Delete Image">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!interiorGallery || interiorGallery.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-light">No interior design ideas available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>

                {/* Admin Booking Reply Modal */}
                {selectedBooking && (
                    <div className="admin-modal-overlay">
                        <div className="admin-modal-content animation-fade-in" style={{ maxWidth: '500px' }}>
                            <div className="modal-header">
                                <h3>Manage Booking {selectedBooking.id}</h3>
                                <button className="close-btn" onClick={() => setSelectedBooking(null)}><X size={20} /></button>
                            </div>

                            <div className="modal-body">
                                <div className="detail-row">
                                    <span className="text-light-muted">Service Type:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBooking.serviceType || 'Home Service'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="text-light-muted">Customer:</span>
                                    <span>{selectedBooking.customerName} ({selectedBooking.customerEmail})</span>
                                </div>
                                <div className="detail-row">
                                    <span className="text-light-muted">Service Location:</span>
                                    <span>{selectedBooking.address}, {selectedBooking.landmark}, {selectedBooking.city}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="text-light-muted">Requested Time:</span>
                                    <span>{selectedBooking.date} / {selectedBooking.timeSlot}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="text-light-muted">Current Status:</span>
                                    <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>{selectedBooking.status}</span>
                                </div>

                                <div className="form-group mt-4">
                                    <label>Message to Customer (Optional)</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        placeholder="Add notes, arrival times, or questions for the customer..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        style={{ width: '100%' }}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-actions mt-4" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'Rejected')}
                                >
                                    <XCircle size={16} /> Reject Booking
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'Confirmed')}
                                >
                                    <CheckCircle size={16} /> Confirm &amp; Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Property Modal */}
                {isAddingProperty && (
                    <div className="admin-modal-overlay" style={{ zIndex: 99999 }}>
                        <div className="admin-modal-content animation-fade-in" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div className="modal-header">
                                <h3>{editingPropertyId ? 'Edit Property' : 'Add New Property'}</h3>
                                <button className="close-btn" onClick={() => {
                                    setIsAddingProperty(false);
                                    setEditingPropertyId(null);
                                }}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleAddPropertySubmit} className="modal-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Custom Title (Optional)</label>
                                        <input type="text" className="form-input" name="title" value={newPropertyForm.title} onChange={handlePropertyFormChange} placeholder="e.g. Stunning 2BHK in South Bombay" />
                                    </div>

                                    <div className="form-group" style={{ position: 'relative' }} ref={suggestionRef}>
                                        <label>Location (City/Area) *</label>
                                        <input type="text" className="form-input" name="location" value={newPropertyForm.location} onChange={handlePropertyFormChange} required placeholder="e.g. Koramangala, Bangalore" autoComplete="off" />

                                        {/* Autocomplete Dropdown */}
                                        {showLocationSuggestions && (locationSuggestions.length > 0 || isLoadingLocations) && (
                                            <div className="location-suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                                {isLoadingLocations ? (
                                                    <div className="suggestion-item" style={{ padding: '12px 15px', color: 'var(--text-light-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Loader size={16} className="spinner" /> <span>Searching...</span>
                                                    </div>
                                                ) : (
                                                    locationSuggestions.map((loc, index) => (
                                                        <div
                                                            key={index}
                                                            className="suggestion-item"
                                                            style={{ padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: index < locationSuggestions.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                                                            onClick={() => handleSelectLocation(loc)}
                                                        >
                                                            <MapPin size={16} className="text-light-muted" />
                                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{loc}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Transaction Type *</label>
                                        <select className="form-input" name="type" value={newPropertyForm.type} onChange={handlePropertyFormChange}>
                                            <option value="Rent">For Rent</option>
                                            <option value="Buy">For Sale</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Price / Rent (₹) *</label>
                                        <input type="number" className="form-input" name="price" value={newPropertyForm.price} onChange={handlePropertyFormChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label>Builtup Area (Sq.Ft) *</label>
                                        <input type="number" className="form-input" name="area" value={newPropertyForm.area} onChange={handlePropertyFormChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label>BHK Type *</label>
                                        <select className="form-input" name="bhk" value={newPropertyForm.bhk} onChange={handlePropertyFormChange}>
                                            <option value="1">1 BHK / RK</option>
                                            <option value="2">2 BHK</option>
                                            <option value="3">3 BHK</option>
                                            <option value="4">4+ BHK</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Property Type</label>
                                        <select className="form-input" name="propertyType" value={newPropertyForm.propertyType} onChange={handlePropertyFormChange}>
                                            <option value="Apartment">Apartment</option>
                                            <option value="Independent House">Independent House</option>
                                            <option value="Villa">Villa</option>
                                            <option value="Gated Community">Gated Community</option>
                                            <option value="Office Space">Office Space</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Furnishing Status</label>
                                        <select className="form-input" name="furnishing" value={newPropertyForm.furnishing} onChange={handlePropertyFormChange}>
                                            <option value="Unfurnished">Unfurnished</option>
                                            <option value="Semi Furnished">Semi Furnished</option>
                                            <option value="Fully Furnished">Fully Furnished</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Available From</label>
                                        <select className="form-input" name="availableFrom" value={newPropertyForm.availableFrom} onChange={handlePropertyFormChange}>
                                            <option value="Immediately">Immediately</option>
                                            <option value="Within 15 Days">Within 15 Days</option>
                                            <option value="Next Month">Next Month</option>
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Upload Property Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-input"
                                            onChange={handlePropertyImageUpload}
                                            style={{ padding: '8px' }}
                                        />
                                        {newPropertyForm.image && <small className="text-success mt-1 block">Image loaded successfully.</small>}
                                        {!newPropertyForm.image && <small className="text-light-muted">Leave blank to use a default house image.</small>}
                                    </div>

                                </div>

                                <div className="modal-actions mt-4" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsAddingProperty(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Save Property</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add/Edit New Gallery Image Modal */}
                {isAddingGallery && (
                    <div className="admin-modal-overlay" style={{ zIndex: 99999 }}>
                        <div className="admin-modal-content animation-fade-in" style={{ maxWidth: '600px' }}>
                            <div className="modal-header">
                                <h3>{editingGalleryId ? 'Edit Interior Image' : 'Add to Interior Gallery'}</h3>
                                <button className="close-btn" onClick={() => {
                                    setIsAddingGallery(false);
                                    setEditingGalleryId(null);
                                }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group" style={{ width: '100%' }}>
                                    <label>Upload Image file *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-input"
                                        onChange={handleImageUpload}
                                        style={{ padding: '8px' }}
                                    />
                                    {newGalleryForm.image && <div className="mt-2 text-success text-sm truncate">Image queued for upload</div>}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                                    <div className="form-group">
                                        <label>Brief Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. Modern Accent Wall"
                                            value={newGalleryForm.title}
                                            onChange={(e) => setNewGalleryForm({ ...newGalleryForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Room Category</label>
                                        <select
                                            className="form-input"
                                            value={newGalleryForm.category}
                                            onChange={(e) => setNewGalleryForm({ ...newGalleryForm, category: e.target.value })}
                                        >
                                            <option value="Living Room">Living Room</option>
                                            <option value="Bedroom">Bedroom</option>
                                            <option value="Kitchen">Kitchen</option>
                                            <option value="Bathroom">Bathroom</option>
                                            <option value="Study Room">Study Room</option>
                                            <option value="Dining Room">Dining Room</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions mt-4" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                                <button type="button" className="btn btn-outline" onClick={() => {
                                    setIsAddingGallery(false);
                                    setEditingGalleryId(null);
                                }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveGallery}>
                                    <Save size={16} /> {editingGalleryId ? 'Update Image' : 'Save Image'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
