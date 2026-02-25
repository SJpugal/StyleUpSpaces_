import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ServicesContext } from '../context/ServicesContext';
import { Paintbrush, Droplet, ShieldCheck, Home, Maximize, Clock, CheckCircle, ChevronRight, Plus, Minus, Info } from 'lucide-react';
import './PaintingServices.css';

const PAINTING_TYPES = [
    { id: 'interior', title: 'Interior Painting', icon: Home, baseRate: 12 },
    { id: 'exterior', title: 'Exterior Painting', icon: Paintbrush, baseRate: 15 },
    { id: 'waterproofing', title: 'Waterproofing', icon: Droplet, baseRate: 25 },
    { id: 'texture', title: 'Texture Painting', icon: Paintbrush, baseRate: 45 }
];

const BHK_SIZES = [
    { id: '1bhk', label: '1 BHK', sqft: 500 },
    { id: '2bhk', label: '2 BHK', sqft: 800 },
    { id: '3bhk', label: '3 BHK', sqft: 1200 },
    { id: '4bhk', label: '4 BHK', sqft: 1600 },
    { id: 'custom', label: 'Custom Sq.Ft', sqft: 0 }
];

const PaintingServices = () => {
    const navigate = useNavigate();
    const { services } = useContext(ServicesContext);

    // Estimation State
    const [selectedType, setSelectedType] = useState('interior');
    const [selectedBhk, setSelectedBhk] = useState('2bhk');
    const [customSqft, setCustomSqft] = useState(800);
    const [isPristine, setIsPristine] = useState(false); // Premium smooth finish add-on

    // Calculate Estimate
    const calculateEstimate = () => {
        const typeInfo = PAINTING_TYPES.find(t => t.id === selectedType);
        const rate = typeInfo ? typeInfo.baseRate : 12;

        let area = 800;
        if (selectedBhk === 'custom') {
            area = parseInt(customSqft) || 0;
        } else {
            const bhkInfo = BHK_SIZES.find(b => b.id === selectedBhk);
            area = bhkInfo ? bhkInfo.sqft : 800;
        }

        let total = area * rate;

        // Add premium finish premium (20%)
        if (isPristine) {
            total = total * 1.2;
        }

        return Math.floor(total);
    };

    const handleBookNow = () => {
        // Build the booking object to pass to the global checkout
        const typeInfo = PAINTING_TYPES.find(t => t.id === selectedType);
        const area = selectedBhk === 'custom' ? customSqft : BHK_SIZES.find(b => b.id === selectedBhk).sqft;

        const bookingItem = {
            id: `PAINT-${Math.floor(Math.random() * 10000)}`,
            name: `${typeInfo.title} (${selectedBhk === 'custom' ? area + ' Sq.Ft' : selectedBhk.toUpperCase()})`,
            price: calculateEstimate(),
            quantity: 1,
            details: isPristine ? 'Includes Premium Pristine Finish' : 'Standard Finish'
        };

        // For simplicity in this mock, we'll store it in a temporary local storage key 
        // that the schedule service can pick up, similar to a cart.
        const currentCart = JSON.parse(localStorage.getItem('styleUpPendingService')) || [];
        localStorage.setItem('styleUpPendingService', JSON.stringify([...currentCart, bookingItem]));

        navigate('/schedule-service');
    };

    return (
        <div className="page-wrapper painting-page">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="painting-hero">
                    <div className="container painting-hero-container">
                        <div className="painting-hero-text animation-fade-in">
                            <h1>Transform Your Space with Expert Painting</h1>
                            <p>Get a precise estimation in seconds. Professional painters, laser measurements, and a 1-year warranty on all jobs.</p>
                            <div className="trust-badges">
                                <span className="badge-item"><ShieldCheck size={18} /> 1-Year Warranty</span>
                                <span className="badge-item"><Clock size={18} /> Time-Bound Delivery</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Estimator Section */}
                <section className="estimator-section">
                    <div className="container">
                        <div className="estimator-card animation-slide-up">

                            <div className="estimator-left">
                                <h2>Get an Instant Estimate</h2>
                                <p className="text-light-muted mb-4">Select your requirements below to see pricing.</p>

                                {/* 1. Painting Type */}
                                <div className="estimator-group">
                                    <label>1. What do you need painted?</label>
                                    <div className="type-grid">
                                        {PAINTING_TYPES.map(type => {
                                            const Icon = type.icon;
                                            return (
                                                <div
                                                    key={type.id}
                                                    className={`type-card ${selectedType === type.id ? 'active' : ''}`}
                                                    onClick={() => setSelectedType(type.id)}
                                                >
                                                    <Icon size={24} className="type-icon" />
                                                    <span>{type.title}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. House Size / Area */}
                                <div className="estimator-group mt-4">
                                    <label>2. Select House Size</label>
                                    <div className="size-ribbon">
                                        {BHK_SIZES.map(size => (
                                            <button
                                                key={size.id}
                                                className={`size-btn ${selectedBhk === size.id ? 'active' : ''}`}
                                                onClick={() => setSelectedBhk(size.id)}
                                            >
                                                {size.label}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedBhk === 'custom' && (
                                        <div className="custom-sqft-input mt-3">
                                            <label>Enter exact Carpet Area (Sq.Ft)</label>
                                            <input
                                                type="number"
                                                value={customSqft}
                                                onChange={(e) => setCustomSqft(e.target.value)}
                                                className="form-input"
                                                min="100"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 3. Add-ons */}
                                <div className="estimator-group mt-4">
                                    <label>3. Add-ons & Finishes</label>
                                    <label className="checkbox-wrap">
                                        <input
                                            type="checkbox"
                                            checked={isPristine}
                                            onChange={(e) => setIsPristine(e.target.checked)}
                                        />
                                        <span className="checkmark"></span>
                                        <div className="checkbox-text">
                                            <strong>Premium 'Pristine' Finish</strong>
                                            <span className="text-light-muted">Two coats of putty + smooth sanding for a mirror-like wall finish. (+20% cost)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Sticky Right Side - The Estimate Receipt */}
                            <div className="estimator-right">
                                <div className="estimate-receipt">
                                    <h3>Your Estimate</h3>
                                    <div className="receipt-breakdown">
                                        <div className="receipt-row">
                                            <span>{PAINTING_TYPES.find(t => t.id === selectedType)?.title}</span>
                                            <span>₹{PAINTING_TYPES.find(t => t.id === selectedType)?.baseRate} / sqft</span>
                                        </div>
                                        <div className="receipt-row">
                                            <span>Base Area</span>
                                            <span>
                                                {selectedBhk === 'custom' ? customSqft : BHK_SIZES.find(b => b.id === selectedBhk)?.sqft} Sq.Ft
                                            </span>
                                        </div>
                                        {isPristine && (
                                            <div className="receipt-row addon">
                                                <span>Pristine Finish</span>
                                                <span>+ 20%</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="receipt-total">
                                        <span>Total Estimated Cost</span>
                                        <h2>₹{calculateEstimate().toLocaleString('en-IN')}</h2>
                                        <p className="disclaimer">*Final price may vary after free laser-measurement site visit.</p>
                                    </div>

                                    <button className="btn btn-primary w-full book-btn" onClick={handleBookNow}>
                                        Book Free Consultation <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Guarantees */}
                <section className="painting-guarantees bg-light">
                    <div className="container">
                        <h2 className="section-title text-center">The StyleUp Promise</h2>
                        <div className="guarantees-grid">
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-primary">
                                    <Maximize size={32} />
                                </div>
                                <h3>Laser Measurements</h3>
                                <p>We don't guess. Our experts use laser tools for 100% accurate quotes—you only pay for what is painted.</p>
                            </div>
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-success">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3>Verified Professionals</h3>
                                <p>Background-checked, highly trained painters who mask your furniture and clean up before leaving.</p>
                            </div>
                            <div className="guarantee-card">
                                <div className="g-icon-wrapper text-warning">
                                    <CheckCircle size={32} />
                                </div>
                                <h3>1-Year Warranty</h3>
                                <p>Complete peace of mind against chipping, bubbling, or peeling for 365 days post-completion.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default PaintingServices;
