import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Plus, Minus, Search, ShieldCheck, Clock, CheckCircle, Navigation, Info, ShoppingCart, ChevronRight } from 'lucide-react';
import './PlumbingServices.css';

// Plumbing Categories & Sub-Services (Mock Data mimicking NoBroker Style)
const PLUMBING_CATEGORIES = [
    { id: 'tap', name: 'Tap & Mixer' },
    { id: 'sink', name: 'Washbasin & Sink' },
    { id: 'toilet', name: 'Toilet Works' },
    { id: 'motor', name: 'Water Tank & Motor' },
    { id: 'pipe', name: 'Pipe Fitting & Blockage' }
];

const PLUMBING_SERVICES_DATA = {
    'tap': [
        { id: 'p1', name: 'Tap Repair / Checkup', price: 99, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300', desc: 'Fix leaking taps or complete checkup of faucet mechanism.' },
        { id: 'p2', name: 'Tap Replacement', price: 149, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300', desc: 'Removal of old tap and installation of new faucet.' },
        { id: 'p3', name: 'Wall Mixer Installation', price: 349, image: 'https://images.unsplash.com/photo-154ce1ed64-9b16ea91fb99?auto=format&fit=crop&q=80&w=300', desc: 'Professional installation of hot & cold wall mixers.' }
    ],
    'sink': [
        { id: 'p4', name: 'Washbasin Blockage Removal', price: 199, image: 'https://images.unsplash.com/photo-1585058177579-22a466fc4dc8?auto=format&fit=crop&q=80&w=300', desc: 'Clearing choked pipes in bathroom or kitchen sinks.' },
        { id: 'p5', name: 'Washbasin Installation', price: 499, image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300', desc: 'Complete installation of new ceramic washbasins.' }
    ],
    'toilet': [
        { id: 'p6', name: 'Western Toilet Installation', price: 899, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300', desc: 'Mounting and sealing of Western commode.' },
        { id: 'p7', name: 'Flush Tank Repair', price: 249, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300', desc: 'Fixing continuous water leak from flush tanks.' },
        { id: 'p8', name: 'Jet Spray Installation', price: 149, image: 'https://images.unsplash.com/photo-154ce1ed64-9b16ea91fb99?auto=format&fit=crop&q=80&w=300', desc: 'Fixing health faucets / jet sprays to the wall.' }
    ],
    'motor': [
        { id: 'p9', name: 'Water Tank Cleaning (Up to 1000L)', price: 499, image: 'https://images.unsplash.com/photo-1585058177579-22a466fc4dc8?auto=format&fit=crop&q=80&w=300', desc: 'Mechanized scrubbing and anti-bacterial cleaning.' },
        { id: 'p10', name: 'Motor Replacement', price: 599, image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=300', desc: 'Disconnecting old water pump and connecting a new one.' }
    ],
    'pipe': [
        { id: 'p11', name: 'General Plumbing Inspection', price: 99, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300', desc: 'Leak detection and general pipe consultancy.' },
        { id: 'p12', name: 'Minor PVC Pipe Repair', price: 299, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300', desc: 'Cutting and joining leaking PVC pipes.' }
    ]
};

const PlumbingServices = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tap');
    const [cart, setCart] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    // Pre-calculate cart totals
    const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, q]) => {
        let price = 0;
        // Find price of this ID across all categories
        Object.values(PLUMBING_SERVICES_DATA).forEach(cat => {
            const item = cat.find(s => s.id === id);
            if (item) price = item.price;
        });
        return sum + (price * q);
    }, 0);

    const handleAdd = (id) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleRemove = (id) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[id] > 1) {
                newCart[id]--;
            } else {
                delete newCart[id];
            }
            return newCart;
        });
    };

    const handleCheckout = () => {
        if (totalItems === 0) return;

        // Compile cart items into an array matching ScheduleService payload
        const payload = [];
        Object.entries(cart).forEach(([id, q]) => {
            let serviceInfo = null;
            Object.values(PLUMBING_SERVICES_DATA).forEach(cat => {
                const found = cat.find(s => s.id === id);
                if (found) serviceInfo = found;
            });

            if (serviceInfo) {
                payload.push({
                    id: serviceInfo.id,
                    name: `${serviceInfo.name} (x${q})`, // Show quantity in name
                    price: serviceInfo.price * q,        // Total price for this line item
                    quantity: q
                });
            }
        });

        // Save entire array into styleUpPendingService
        const currentCart = JSON.parse(localStorage.getItem('styleUpPendingService')) || [];
        localStorage.setItem('styleUpPendingService', JSON.stringify([...currentCart, ...payload]));

        navigate('/schedule-service');
    };

    // Flatten logic for search
    const allServicesFlattened = Object.values(PLUMBING_SERVICES_DATA).flat();
    const isSearching = searchQuery.length > 0;

    const displayedServices = isSearching
        ? allServicesFlattened.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : PLUMBING_SERVICES_DATA[activeTab];

    return (
        <div className="page-wrapper plumbing-page">
            <Header />
            <main>
                {/* Minimal Header */}
                <div className="plumbing-header">
                    <div className="container px-4">
                        <div className="breadcrumbs mb-3">
                            <span onClick={() => navigate('/')} className="cursor-pointer hover:underline text-light-muted">Home</span>
                            <span className="mx-2 text-light-muted">/</span>
                            <span style={{ color: '#f59e0b' }}>Plumbing Services</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: '#f59e0b' }}>Expert Plumbing Services</h1>
                        <div className="trust-pills mt-4 flex gap-3">
                            <span className="trust-pill"><ShieldCheck size={16} /> Verified Pros</span>
                            <span className="trust-pill"><Clock size={16} /> 30-Min Arrival</span>
                        </div>
                    </div>
                </div>

                <div className="container px-4 mt-8 pb-20">
                    <div className="catalog-layout">

                        {/* Left Main Content */}
                        <div className="catalog-main">

                            {/* Search */}
                            <div className="catalog-search mb-6">
                                <Search size={20} className="search-icon text-light-muted" />
                                <input
                                    type="text"
                                    placeholder="Search for tap, leak, motor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            {!isSearching && (
                                <div className="category-scroll-nav mb-6">
                                    {PLUMBING_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`cat-btn ${activeTab === cat.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isSearching && (
                                <h3 className="mb-4 text-xl text-dark">Search Results ({displayedServices.length})</h3>
                            )}

                            {/* Service Items Grid */}
                            <div className="service-list">
                                {displayedServices.map(service => (
                                    <div key={service.id} className="service-card animation-slide-up">
                                        <div className="service-desc-area">
                                            <h4 className="service-title">{service.name}</h4>
                                            <span className="service-price">₹{service.price}</span>
                                            <p className="service-desc">{service.desc}</p>
                                        </div>
                                        <div className="service-action-area">
                                            <div className="service-image-box">
                                                <img src={service.image} alt={service.name} loading="lazy" />
                                            </div>

                                            {cart[service.id] ? (
                                                <div className="qty-control active">
                                                    <button onClick={() => handleRemove(service.id)}><Minus size={16} /></button>
                                                    <span>{cart[service.id]}</span>
                                                    <button onClick={() => handleAdd(service.id)}><Plus size={16} /></button>
                                                </div>
                                            ) : (
                                                <div className="qty-control add" onClick={() => handleAdd(service.id)}>
                                                    <span className="add-text">Add</span>
                                                    <Plus size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {displayedServices.length === 0 && (
                                    <div className="no-results text-center py-10">
                                        <p className="text-light-muted">No plumbing services found for "{searchQuery}".</p>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Right Sidebar Cart (Desktop only visually, mobile uses Bottom Bar) */}
                        <div className="catalog-cart-sidebar">
                            <div className="cart-card sticky top-24">
                                <h3>Cart Summary</h3>

                                {totalItems === 0 ? (
                                    <div className="empty-cart flex flex-col items-center justify-center py-8">
                                        <ShoppingCart size={48} className="text-gray-300 mb-4" />
                                        <p className="text-light-muted">No services added</p>
                                    </div>
                                ) : (
                                    <div className="cart-content">
                                        <div className="cart-items">
                                            {Object.entries(cart).map(([id, q]) => {
                                                let item = allServicesFlattened.find(s => s.id === id);
                                                return (
                                                    <div key={id} className="cart-item">
                                                        <div className="cart-item-name">{item.name}</div>
                                                        <div className="cart-item-calc">
                                                            <div className="qty-control mini">
                                                                <button onClick={() => handleRemove(id)}><Minus size={12} /></button>
                                                                <span>{q}</span>
                                                                <button onClick={() => handleAdd(id)}><Plus size={12} /></button>
                                                            </div>
                                                            <div className="cart-item-price">₹{item.price * q}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="cart-totals">
                                            <div className="total-row flex justify-between my-4 text-dark font-bold">
                                                <span>Total</span>
                                                <span>₹{totalPrice}</span>
                                            </div>

                                            <button className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={handleCheckout}>
                                                Proceed to Checkout <ChevronRight size={18} />
                                            </button>
                                        </div>

                                        <div className="cart-guarantee mt-4 p-3 bg-light rounded text-sm text-light-muted flex gap-2 items-start">
                                            <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                                            <span>Final price may vary after inspection. Visiting charge ₹149 applied if service is canceled.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Mobile Floating Checkout Bar */}
                {totalItems > 0 && (
                    <div className="mobile-checkout-bar">
                        <div className="m-cart-info">
                            <span className="m-cart-qty">{totalItems} Item{totalItems > 1 ? 's' : ''}</span>
                            <span className="m-cart-price">₹{totalPrice}</span>
                        </div>
                        <button className="btn btn-primary m-cart-btn" onClick={handleCheckout}>
                            Checkout <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PlumbingServices;
