import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Home, Award } from 'lucide-react';
import './InteriorDesign.css';

// Using high-quality Unsplash images for the hero carousel
const heroImages = [
    {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        title: "Modern Minimalist Living"
    },
    {
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        title: "Elegant Dining Spaces"
    },
    {
        url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        title: "Cozy & Premium Bedrooms"
    }
];

const trendingIdeas = [
    { id: 1, title: 'Living Room', image: 'https://images.unsplash.com/photo-1583847268964-b28ce8f30321?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Bed Room', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Study Room', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Dining Room', image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 5, title: 'Rest Room', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
];

const InteriorDesign = () => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto swipe every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePrevClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    };

    return (
        <div className="page-wrapper interior-design-page">
            <Header />
            <main>
                {/* Hero Carousel Section */}
                <section className="interior-hero">
                    <div className="carousel-container">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${image.url})` }}
                            >
                                <div className="carousel-overlay">
                                    <div className="hero-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
                                        {/* Branding added to title area */}
                                        <div className="hero-branding" style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', marginBottom: '10px' }}>
                                            <img
                                                src="/logo.png"
                                                alt="StyleUpSpaces Logo"
                                                style={{ height: '60px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                                StyleUpSpaces
                                            </span>
                                        </div>

                                        <h1 className="carousel-title" style={{ marginTop: 0 }}>{image.title}</h1>
                                        <button
                                            className="btn btn-primary"
                                            style={{ width: 'fit-content', padding: '15px 30px', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', marginTop: '20px' }}
                                            onClick={() => navigate('/interior-enquiry')}
                                        >
                                            Get Free Enquiry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="carousel-control prev" onClick={handlePrevClick}>
                            <ChevronLeft size={30} />
                        </button>
                        <button className="carousel-control next" onClick={handleNextClick}>
                            <ChevronRight size={30} />
                        </button>

                        <div className="carousel-indicators">
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trending Ideas Section */}
                <section className="trending-ideas-section">
                    <div className="container">
                        <h2 className="section-title" style={{ color: 'var(--primary-color)' }}>Trending Ideas</h2>
                        <div className="ideas-grid">
                            {trendingIdeas.map(idea => (
                                <div key={idea.id} className="idea-card">
                                    <div className="idea-image" style={{ backgroundImage: `url(${idea.image})` }}></div>
                                    <div className="idea-content">
                                        <h3>{idea.title}</h3>
                                        <button
                                            className="btn btn-outline"
                                            style={{ marginTop: '10px', fontSize: '0.9rem' }}
                                            onClick={() => navigate(`/interior-gallery?tab=${encodeURIComponent(idea.title)}`)}
                                        >
                                            Explore
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="how-it-works-section">
                    <div className="container">
                        <h2 className="section-title" style={{ color: 'var(--primary-color)' }}>How It Works</h2>
                        <div className="steps-container">
                            <div className="step-card">
                                <div className="step-icon">
                                    <Clock size={32} />
                                </div>
                                <h3>1. Book a Consultation</h3>
                                <p>Schedule a free meeting with our expert interior designers to discuss your vision and requirements.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-icon">
                                    <Home size={32} />
                                </div>
                                <h3>2. Get a 3D Design</h3>
                                <p>We create personalized 3D models and detailed floor plans so you can visualize your dream home.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-icon">
                                    <CheckCircle size={32} />
                                </div>
                                <h3>3. Execution & Delivery</h3>
                                <p>Our professionals handle everything from material sourcing to final installation with timely delivery.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-icon">
                                    <Award size={32} />
                                </div>
                                <h3>4. Move In</h3>
                                <p>Enjoy your beautifully transformed, fully furnished space backed by our quality warranty.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default InteriorDesign;
