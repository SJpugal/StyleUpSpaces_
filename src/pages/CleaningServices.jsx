import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ShieldCheck, Clock, CheckCircle, Home, Bath, Droplets, SprayCan, Sofa, Bug, Car, Sparkles, Plus, Minus, ChevronRight } from 'lucide-react';
import { ServicesContext, mapIconComponent } from '../context/ServicesContext';
import './CleaningServices.css';

const CleaningServices = () => {
    const navigate = useNavigate();

    // Pull global dynamic data
    const { services } = useContext(ServicesContext);
    const CLEANING_SERVICES = services.cleaning || [];

    // State to hold cart items (service id -> quantity)
    const [cart, setCart] = useState({});

    // Handle adding to cart
    const handleAdd = (id, e) => {
        if (e) e.stopPropagation();
        setCart(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    // Handle removing from cart
    const handleRemove = (id, e) => {
        if (e) e.stopPropagation();
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[id] > 1) {
                newCart[id] -= 1;
            } else {
                delete newCart[id];
            }
            return newCart;
        });
    };

    // Calculate total price and total items
    let totalPrice = 0;
    let totalItems = 0;

    Object.entries(cart).forEach(([id, quantity]) => {
        const service = CLEANING_SERVICES.find(s => s.id === parseInt(id));
        if (service) {
            totalPrice += parseFloat(service.price) * quantity;
            totalItems += quantity;
        }
    });

    return (
        <div className="page-wrapper cleaning-page">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="cleaning-hero">
                    <div className="container cleaning-hero-container">
                        <div className="cleaning-hero-text">
                            <h1>Premium Home Cleaning Services</h1>
                            <p>Deep cleaning solutions with eco-friendly products, professional equipment, and a 100% satisfaction guarantee.</p>
                            <div className="trust-badges">
                                <span className="badge-item"><Sparkles size={18} /> Deep Clean</span>
                                <span className="badge-item"><ShieldCheck size={18} /> Verified Pros</span>
                            </div>
                        </div>
                        <div className="cleaning-hero-image">
                            {/* Decorative image showing cleaning work */}
                            <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Home Cleaning Service" className="hero-cleaning-img" />
                        </div>
                    </div>
                </section>

                {/* Appliances Grid Section - "Small Small Boxes" */}
                <section className="appliances-section">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2>What are you looking for?</h2>
                            <p>Select a cleaning service to see detailed pricing.</p>
                        </div>

                        <div className="appliances-grid">
                            {CLEANING_SERVICES.map((service) => {
                                const Icon = mapIconComponent(service.iconName);
                                const quantity = cart[service.id] || 0;

                                return (
                                    <div key={service.id} className={`appliance-box ${quantity > 0 ? 'selected' : ''}`} onClick={() => quantity === 0 && handleAdd(service.id)}>
                                        <div className="appliance-icon">
                                            <Icon size={32} strokeWidth={1.5} />
                                        </div>
                                        <h4 className="appliance-name">{service.name}</h4>
                                        <div className="appliance-price">
                                            <span>Starts at </span>
                                            <strong>₹{service.price}</strong>
                                        </div>

                                        <div className="appliance-add">
                                            {quantity === 0 ? (
                                                <button className="add-btn" onClick={(e) => handleAdd(service.id, e)}>
                                                    Add +
                                                </button>
                                            ) : (
                                                <div className="quantity-controls">
                                                    <button className="qty-btn" onClick={(e) => handleRemove(service.id, e)}>
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="qty-number">{quantity}</span>
                                                    <button className="qty-btn" onClick={(e) => handleAdd(service.id, e)}>
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us / Guarantees */}
                <section className="cleaning-guarantees bg-light">
                    <div className="container">
                        <h2 className="section-title text-center">StyleUpSpaces Promise</h2>
                        <div className="guarantees-grid">
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-primary">
                                    <SprayCan size={32} />
                                </div>
                                <h3>Eco-Friendly Products</h3>
                                <p>We use safe, non-toxic cleaning chemicals that are tough on stains but safe for your family and pets.</p>
                            </div>
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-success">
                                    <Clock size={32} />
                                </div>
                                <h3>On-Time Arrival</h3>
                                <p>Schedule a convenient time, and our professionals will be there right on the dot, fully equipped.</p>
                            </div>
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-warning">
                                    <CheckCircle size={32} />
                                </div>
                                <h3>100% Satisfaction</h3>
                                <p>Not happy with the clean? Let us know within 24 hours and we'll re-clean the missed spots for free.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Floating Cart (Only shows if there are items) */}
                {totalItems > 0 && (
                    <div className="floating-cart-banner animation-slide-up" onClick={() => navigate('/schedule-service')}>
                        <div className="cart-banner-info">
                            <span className="cart-total">₹{totalPrice}</span>
                            <span className="cart-items">{totalItems} service{totalItems > 1 ? 's' : ''} added</span>
                        </div>
                        <button className="btn btn-primary compact-btn">Proceed <ChevronRight size={16} /></button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CleaningServices;
