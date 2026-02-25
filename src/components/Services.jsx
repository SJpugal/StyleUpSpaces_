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
    { id: 1, title: 'Interior Design', icon: Home, path: '/interior-design' },
    { id: 2, title: 'Painting', icon: Paintbrush, path: '/painting-services' },
    { id: 3, title: 'Rental Services', icon: Home, path: '/rental-agreement' },
    { id: 4, title: 'Packers & Movers', icon: Truck, path: '/packers-and-movers' },
    { id: 5, title: 'Cleaning Services', icon: Droplet, path: '/cleaning-services' },
    { id: 6, title: 'Electrician Services', icon: Zap, path: '/electrician-services' },
    { id: 7, title: 'Plumbing', icon: Droplet, path: '/plumbing-services' },
];

const Services = () => {
    return (
        <section className="services-section">
            <div className="container">
                <h2 className="section-title">Services</h2>
                <div className="services-grid">
                    {services.map(service => {
                        const Icon = service.icon;
                        return (
                            <Link to={service.path} key={service.id} className="service-card" style={{ textDecoration: 'none' }}>
                                <div className="service-icon-wrapper">
                                    <Icon size={30} />
                                </div>
                                <h3 className="service-title">{service.title}</h3>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
