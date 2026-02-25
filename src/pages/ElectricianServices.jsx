import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicesContext, mapIconComponent } from '../context/ServicesContext';
import { ShieldCheck, Clock, CheckCircle, Zap, Fan, Monitor, Power, Server, Lightbulb, BellRing, Plus, Minus, ChevronRight } from 'lucide-react';
import './ElectricianServices.css';

const ElectricianServices = () => {
    const navigate = useNavigate();
    const { services } = useContext(ServicesContext);
    const applianceServices = services.electrician || [];

    // State to hold cart items (service id -> quantity)
    const [cart, setCart] = useState({});

    // Handle adding to cart
    const handleAdd = (id, e) => {
        // Prevent the click from bubbling up to the card if there's an outer onClick
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
        const service = applianceServices.find(s => s.id === parseInt(id));
        if (service) {
            totalPrice += service.price * quantity;
            totalItems += quantity;
        }
    });

    return (
        <div className="page-wrapper electrician-page">
            
            <main>
                {/* Hero Section */}
                <section className="electrician-hero">
                    <div className="container electrician-hero-container">
                        <div className="electrician-hero-text">
                            <h1>Expert Electricians & Appliance Repair at your Doorstep</h1>
                            <p>Transparent pricing, verified professionals, and a 180-day service warranty for complete peace of mind.</p>
                            <div className="trust-badges">
                                <span className="badge-item"><ShieldCheck size={18} /> Verified Pros</span>
                                <span className="badge-item"><CheckCircle size={18} /> 180-Day Warranty</span>
                            </div>
                        </div>
                        <div className="electrician-hero-image">
                            {/* Decorative image showing electrical work or a professional */}
                            <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Electrician Service" className="hero-electric-img" />
                        </div>
                    </div>
                </section>

                {/* Appliances Grid Section - "Small Small Boxes" */}
                <section className="appliances-section">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2>What are you looking for?</h2>
                            <p>Select an appliance or service to see detailed rates.</p>
                        </div>

                        <div className="appliances-grid">
                            {applianceServices.map((service) => {
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
                <section className="electrician-guarantees bg-light">
                    <div className="container">
                        <h2 className="section-title text-center">StyleUpSpaces Promise</h2>
                        <div className="guarantees-grid">
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-primary">
                                    <Clock size={32} />
                                </div>
                                <h3>Same-Day Service</h3>
                                <p>Book a slot that works for you. Our professionals arrive on time, every time.</p>
                            </div>
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-success">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3>180-Day Warranty</h3>
                                <p>We stand by our work. Get a 6-month warranty on any repair or installation service.</p>
                            </div>
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-warning">
                                    <CheckCircle size={32} />
                                </div>
                                <h3>Transparent Pricing</h3>
                                <p>No hidden costs. You pay exactly what is shown on our standard rate card.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Floating Cart (Only shows if there are items) */}
                {totalItems > 0 && (
                    <div className="floating-cart-banner animation-slide-up" onClick={() => navigate('/schedule-service')}>
                        <div className="cart-banner-info">
                            <span className="cart-total">₹{totalPrice}</span>
                            <span className="cart-items">{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
                        </div>
                        <button className="btn btn-primary compact-btn">Proceed <ChevronRight size={16} /></button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ElectricianServices;
