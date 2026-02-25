import React from 'react';
import { Link } from 'react-router-dom';
import {
    Paintbrush,
    Home,
    Truck,
    Droplet,
    FileText,
    ShieldCheck,
    Zap
} from 'lucide-react';
import './Services.css';

const services = [
    { id: 1, title: 'Interior Design', icon: Home, path: '/interior-design', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Painting', icon: Paintbrush, path: '/painting-services', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Rental Services', icon: FileText, path: '/rental-agreement', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Packers & Movers', icon: Truck, path: '/packers-and-movers', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { id: 5, title: 'Cleaning Services', icon: Droplet, path: '/cleaning-services', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80' },
    { id: 6, title: 'Electrician Services', icon: Zap, path: '/electrician-services', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80' },
    { id: 7, title: 'Plumbing', icon: Droplet, path: '/plumbing-services', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80' },
];

const Services = () => {
    return (
        <section className="services-section">
            <div className="container">
                <h2 className="section-title">Professional Services</h2>
                <div className="services-grid">
                    {services.map(service => {
                        const Icon = service.icon;
                        return (
                            <Link to={service.path} key={service.id} className="service-card">
                                <div className="service-image-container">
                                    <img src={service.img} alt={service.title} className="service-card-img" />
                                </div>
                                <div className="service-content">
                                    <div className="service-icon-wrapper">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="service-title">{service.title}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
