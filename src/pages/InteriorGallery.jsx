import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { ServicesContext } from '../context/ServicesContext';
import { Search, ChevronRight, Home, Layout, Filter } from 'lucide-react';
import './InteriorGallery.css';

const InteriorGallery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { interiorGallery } = useContext(ServicesContext);

    // Parse URL params for default tab (e.g. ?tab=Bedroom)
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'All';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique categories from data
    const categories = ['All', ...new Set(interiorGallery.map(img => img.category))];

    // Category visual mapping for NoBroker-style tab cards
    const categoryGraphics = {
        'All': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200',
        'Living Room': 'https://images.unsplash.com/photo-1583847268964-b28ce8f30321?auto=format&fit=crop&q=80&w=200',
        'Bed Room': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=200',
        'Bedroom': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=200',
        'Kitchen': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200',
        'Bathroom': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=200',
        'Study Room': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=200',
        'Dining Room': 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=200',
        'Rest Room': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200'
    };

    const getCategoryImg = (cat) => {
        return categoryGraphics[cat] || 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&q=80&w=200';
    };

    useEffect(() => {
        // If the URL changes (e.g., clicking back), update the active tab
        const urlTab = new URLSearchParams(location.search).get('tab');
        if (urlTab) {
            setActiveTab(urlTab);
        }
    }, [location.search]);

    const handleTabChange = (category) => {
        setActiveTab(category);
        setSearchQuery('');

        // Update URL silenty so users can share links to specific tabs
        const newUrl = category === 'All'
            ? '/interior-gallery'
            : `/interior-gallery?tab=${encodeURIComponent(category)}`;
        window.history.replaceState(null, '', newUrl);
    };

    // Filter Logic
    const filteredImages = interiorGallery.filter(item => {
        const matchesCategory = activeTab === 'All' || item.category === activeTab;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="page-wrapper gallery-page">
            <Header />
            <main>
                {/* Minimal Header */}
                <div className="gallery-header">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Interior Design Inspiration</h1>
                        <p className="text-light-muted max-w-2xl mx-auto">Explore our curated gallery of modern, aesthetic spaces tailored to elevate your lifestyle. Discover ideas for your next renovation project.</p>

                        <div className="gallery-search-bar mx-auto mt-8">
                            <Search size={20} className="search-icon text-light-muted" />
                            <input
                                type="text"
                                placeholder="Search 'modern', 'kitchen', 'minimalist'..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="container px-4 mt-8 pb-20">

                    {/* Navigation Filter Tabs - NoBroker Style */}
                    <div className="gallery-filter-tabs hide-scroll">
                        <div className="flex gap-4 pb-2">
                            {categories.map(cat => (
                                <div
                                    key={cat}
                                    className={`category-card ${activeTab === cat ? 'active' : ''}`}
                                    onClick={() => handleTabChange(cat)}
                                >
                                    <div className="category-img-container">
                                        <img src={getCategoryImg(cat)} alt={cat} />
                                    </div>
                                    <span className="category-name">{cat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Results Count Summary */}
                    <div className="flex justify-between items-center mb-6 mt-4">
                        <h2 className="text-xl font-semibold text-dark">
                            {activeTab === 'All' ? 'All Layouts' : `${activeTab} Ideas`}
                        </h2>
                        <span className="text-light-muted bg-light px-3 py-1 rounded-full text-sm font-medium">
                            {filteredImages.length} Designs
                        </span>
                    </div>

                    {/* Masonry / Grid Display */}
                    {filteredImages.length > 0 ? (
                        <div className="gallery-masonry-grid">
                            {filteredImages.map((item, index) => (
                                <div key={item.id} className="gallery-item animation-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="gallery-img-wrapper">
                                        <img src={item.image} alt={item.title} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <div className="overlay-content">
                                                <span className="gallery-tag">{item.category}</span>
                                                <h3 className="gallery-title">{item.title}</h3>
                                                <button className="btn btn-primary btn-sm mt-3 flex items-center gap-2">
                                                    Consult Designer <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mt-8">
                            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-dark mb-2">No Designs Found</h3>
                            <p className="text-light-muted max-w-md mx-auto">We couldn't find any interior ideas matching "{searchQuery}" in the {activeTab} category.</p>
                            <button
                                className="btn btn-outline mt-6"
                                onClick={() => { setSearchQuery(''); setActiveTab('All'); }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InteriorGallery;
