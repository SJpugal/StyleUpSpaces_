import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, FileText, Truck, ShieldCheck, PenTool, ChevronRight } from 'lucide-react';
import './RentalAgreement.css';

const pricingOptions = [
    {
        title: 'E-Stamped Agreement',
        price: '₹399',
        features: [
            'Drafting of Agreement',
            'Legally valid E-Stamp paper',
            'Soft copy delivered via Email',
            'Free Template customization'
        ]
    },
    {
        title: 'Aadhaar E-Sign Agreement',
        price: '₹599',
        features: [
            'Everything in E-Stamped',
            'Remote Aadhaar E-Signature',
            '100% Paperless Process',
            'Instant Court-Valid Document'
        ],
        isPopular: true
    },
    {
        title: 'Premium Doorstep + Notary',
        price: '₹999',
        features: [
            'Everything in Aadhaar E-Sign',
            'Physical Home Delivery',
            'Notary Public Verification',
            'Priority Legal Support'
        ]
    }
];

const features = [
    {
        icon: Clock,
        title: 'Convenience & Time-Saving',
        desc: 'Create a legally valid rental agreement completely online from your home. Save hours typically spent at government offices.'
    },
    {
        icon: PenTool,
        title: 'Paperless Aadhaar E-Sign',
        desc: 'Quick and secure digital signing using Aadhaar. Valid in a court of law and perfect for remote landlords and tenants.'
    },
    {
        icon: FileText,
        title: 'E-Stamped Agreements',
        desc: 'We facilitate the creation of legally valid, digitally stamped rental agreements without any manual hassle.'
    },
    {
        icon: Truck,
        title: 'Doorstep Delivery',
        desc: 'Get your physically printed and stamped agreement delivered directly to your doorstep with tracking available.'
    },
    {
        icon: ShieldCheck,
        title: 'Trusted & Verified Vendors',
        desc: 'We partner with reliable legal vendors to ensure your agreement complies with all applicable laws and regulations.'
    },
    {
        icon: CheckCircle,
        title: 'Zero Brokerage Fees',
        desc: 'Connect directly and create your agreement without the need for expensive intermediaries. Transparent, affordable pricing.'
    }
];

const RentalAgreement = () => {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper rental-page">
            
            <main>
                {/* Hero Section */}
                <section className="rental-hero">
                    <div className="container rental-hero-content">
                        <div className="rental-hero-text">
                            <span className="rental-badge">Smart. Secure. Legal.</span>
                            <h1>Legally Valid Rental Agreements, Delivered to You.</h1>
                            <p>Skip the government office queues. Get your E-Stamped, Aadhaar E-Signed rental agreement entirely from the comfort of your home.</p>
                            <div className="rental-hero-cta">
                                <button className="btn btn-primary cta-btn" onClick={() => navigate('/create-agreement')}>
                                    Create Agreement <ChevronRight size={18} />
                                </button>
                                <button className="btn btn-outline cta-btn-alt" onClick={() => navigate('/create-agreement')}>
                                    Upload Own Draft
                                </button>
                            </div>
                            <div className="rental-trust-metrics">
                                <span><ShieldCheck size={16} /> Bank Grade Security</span>
                                <span><CheckCircle size={16} /> Govt. Approved</span>
                            </div>
                        </div>
                        <div className="rental-hero-image">
                            {/* Decorative modern illustration or document graphic */}
                            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Rental Agreement Process" className="hero-doc-img" />
                        </div>
                    </div>
                </section>

                {/* Benefits / Features Section */}
                <section className="rental-features bg-light">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2 className="section-title">Why Choose StyleUpSpaces?</h2>
                            <p className="section-subtitle">The easiest, fastest, and most secure way to generate your rental agreement.</p>
                        </div>
                        <div className="features-grid">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className="feature-item">
                                        <div className="feature-icon-box">
                                            <Icon size={28} />
                                        </div>
                                        <h3>{feature.title}</h3>
                                        <p>{feature.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Pricing / Services Options */}
                <section className="rental-pricing">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2 className="section-title">Transparent Pricing</h2>
                            <p className="section-subtitle">No hidden charges. Pay only for the services you need.</p>
                        </div>
                        <div className="pricing-cards">
                            {pricingOptions.map((plan, idx) => (
                                <div key={idx} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
                                    {plan.isPopular && <div className="popular-badge">Most Popular</div>}
                                    <h3 className="plan-title">{plan.title}</h3>
                                    <div className="plan-price">
                                        <span className="amount">{plan.price}</span>
                                    </div>
                                    <ul className="plan-features">
                                        {plan.features.map((feat, i) => (
                                            <li key={i}><CheckCircle size={16} className="text-primary" /> {feat}</li>
                                        ))}
                                    </ul>
                                    <button
                                        className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} plan-btn`}
                                        onClick={() => navigate('/create-agreement')}
                                    >
                                        Select Plan
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="rental-how-it-works bg-light">
                    <div className="container">
                        <h2 className="section-title text-center">How It Works</h2>
                        <div className="steps-timeline">
                            <div className="timeline-step">
                                <div className="step-number">1</div>
                                <h4>Fill Details Online</h4>
                                <p>Provide owner, tenant, and property details in our simple online form.</p>
                            </div>
                            <div className="step-line"></div>
                            <div className="timeline-step">
                                <div className="step-number">2</div>
                                <h4>Draft & Sign</h4>
                                <p>Review the automated draft and digitally sign it using Aadhaar E-Sign.</p>
                            </div>
                            <div className="step-line"></div>
                            <div className="timeline-step">
                                <div className="step-number">3</div>
                                <h4>E-Stamp & Delivery</h4>
                                <p>We get it legally e-stamped and instantly email it or deliver the hard copy.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RentalAgreement;
