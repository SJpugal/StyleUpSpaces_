import React from 'react';
import './AdsAndMotto.css';

const AdsAndMotto = () => {
    return (
        <section className="ads-motto-section">
            <div className="container">

                {/* Motto Section */}
                <div className="motto-container">
                    <blockquote className="motto-text">
                        "Transforming houses into dream homes. Professional services, zero hassle, maximum satisfaction."
                    </blockquote>
                    <div className="motto-author">— StyleUpSpaces Promise</div>
                </div>

                {/* Advertisements Section */}
                <h2 className="section-title">Special Offers</h2>
                <div className="ads-grid">

                    <div className="ad-card ad-interior">
                        <div className="ad-overlay"></div>
                        <div className="ad-content">
                            <h3 className="ad-title">Premium Interior Design</h3>
                            <p className="ad-subtitle">Get 20% off on complete home interior setup.</p>
                        </div>
                    </div>

                    <div className="ad-card ad-painting">
                        <div className="ad-overlay"></div>
                        <div className="ad-content">
                            <h3 className="ad-title">Expert Home Painting</h3>
                            <p className="ad-subtitle">Free consultation & color matching.</p>
                        </div>
                    </div>

                    <div className="ad-card ad-moving">
                        <div className="ad-overlay"></div>
                        <div className="ad-content">
                            <h3 className="ad-title">Safe Packers & Movers</h3>
                            <p className="ad-subtitle">100% damage protection guarantee.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AdsAndMotto;
