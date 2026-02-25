import React from 'react';
import Header from '../components/Header';
import Services from '../components/Services';
import AdsAndMotto from '../components/AdsAndMotto';
import './HomeService.css';

const HomeService = () => {
    return (
        <div className="page-wrapper home-service-page">
            <Header />
            <main>
                {/* A clean, modern banner for Home Service page using primary colors */}
                <section className="home-service-banner">
                    <div className="container text-center">
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: '800' }}>
                            Premium Home Services
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                            Book trusted professionals for cleaning, painting, interior design, and moving.
                        </p>
                    </div>
                </section>

                {/* Reusing existing sections for the service hub */}
                <Services />
                <AdsAndMotto />
            </main>
        </div>
    );
};

export default HomeService;
