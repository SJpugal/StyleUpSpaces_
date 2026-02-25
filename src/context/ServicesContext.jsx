import React, { createContext, useState, useEffect } from 'react';
import { Home, Paintbrush, Truck, Droplet, Zap, ShieldCheck, Bath, Bug, Car, Droplets, Fan, Lightbulb, Monitor, Power, Server, Sofa, Sparkles, SprayCan } from 'lucide-react';

// Create the Context
export const ServicesContext = createContext();

// Default Seed Data
const DEFAULT_SERVICES_DATA = {
    cleaning: [
        { id: 1, name: 'Full Home Cleaning', price: 2499, iconName: 'Home' },
        { id: 2, name: 'Bathroom Cleaning', price: 499, iconName: 'Bath' },
        { id: 3, name: 'Kitchen Cleaning', price: 999, iconName: 'Sparkles' },
        { id: 4, name: 'Sofa Cleaning', price: 599, iconName: 'Sofa' },
        { id: 5, name: 'Carpet Cleaning', price: 399, iconName: 'SprayCan' },
        { id: 6, name: 'Water Tank Cleaning', price: 799, iconName: 'Droplets' },
        { id: 7, name: 'Car Cleaning', price: 699, iconName: 'Car' },
        { id: 8, name: 'Pest Control', price: 899, iconName: 'Bug' },
    ],
    electrician: [
        { id: 1, name: 'Switchboard / MCB', price: 98, iconName: 'Power' },
        { id: 2, name: 'Fan Repair / Install', price: 90, iconName: 'Fan' },
        { id: 3, name: 'Lights & Fittings', price: 80, iconName: 'Lightbulb' },
        { id: 4, name: 'Wiring Services', price: 64, iconName: 'Zap' },
        { id: 5, name: 'TV Wall Mounting', price: 484, iconName: 'Monitor' },
        { id: 6, name: 'Home Appliances', price: 109, iconName: 'Server' },
        { id: 7, name: 'Doorbell Install', price: 191, iconName: 'BellRing' },
        { id: 8, name: 'Inverter Setup', price: 350, iconName: 'Zap' },
    ],
    interior: [
        { id: 1, name: 'Modular Kitchen', price: 150000, iconName: 'Home' },
        { id: 2, name: 'Wardrobe Design', price: 80000, iconName: 'Home' },
        { id: 3, name: 'Living Room Setup', price: 120000, iconName: 'Home' },
    ],
    painting: [
        { id: 1, name: 'Full Home Painting', price: 12000, iconName: 'Paintbrush' },
        { id: 2, name: 'Texture Painting', price: 5000, iconName: 'Paintbrush' },
        { id: 3, name: 'Waterproofing', price: 8000, iconName: 'Droplet' },
    ],
    packers: [
        { id: 1, name: 'Local Shifting', price: 4500, iconName: 'Truck' },
        { id: 2, name: 'Intercity Shifting', price: 12000, iconName: 'Truck' },
    ]
};

// Helper to map string icon names back to actual Lucide React components
export const mapIconComponent = (iconName) => {
    const icons = {
        Home, Paintbrush, Truck, Droplet, Zap, ShieldCheck, Bath, Bug, Car,
        Droplets, Fan, Lightbulb, Monitor, Power, Server, Sofa, Sparkles, SprayCan,
        BellRing: BellRingIcon // Mocking BellRing if it's missing from exports easily
    };
    return icons[iconName] || Home; // Fallback to Home icon
};

const BellRingIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);


const DEFAULT_GALLERY_DATA = [
    { id: 'ig1', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80', title: 'Modern Living', category: 'Living Room' },
    { id: 'ig2', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80', title: 'Cozy Bedroom Design', category: 'Bedroom' },
    { id: 'ig3', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80', title: 'Minimalist Modular Kitchen', category: 'Kitchen' }
];

export const ServicesProvider = ({ children }) => {
    const [services, setServices] = useState(DEFAULT_SERVICES_DATA);
    const [interiorGallery, setInteriorGallery] = useState([]);

    // Auth State
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Initialize from LocalStorage on mount
    useEffect(() => {
        const storedServices = localStorage.getItem('styleUpServicesData');
        if (storedServices) {
            try {
                setServices(JSON.parse(storedServices));
            } catch (error) {
                console.error("Failed to parse services from localStorage");
                localStorage.setItem('styleUpServicesData', JSON.stringify(DEFAULT_SERVICES_DATA));
            }
        } else {
            // Seed DB
            localStorage.setItem('styleUpServicesData', JSON.stringify(DEFAULT_SERVICES_DATA));
        }

        // Load Interior Gallery Storage
        const savedGallery = localStorage.getItem('styleUpInteriorGallery');
        if (savedGallery) {
            setInteriorGallery(JSON.parse(savedGallery));
        } else {
            localStorage.setItem('styleUpInteriorGallery', JSON.stringify(DEFAULT_GALLERY_DATA));
            setInteriorGallery(DEFAULT_GALLERY_DATA);
        }

        // Load Session User
        const savedUser = localStorage.getItem('styleUpUser');
        if (savedUser) {
            try {
                setCurrentUser(JSON.parse(savedUser));
            } catch (e) { console.error('Error parsing user data', e); }
        }
    }, []);

    // Function to update a specific service category (Admin use)
    const updateServiceCategory = (categoryKey, newCategoryData) => {
        const updatedServices = {
            ...services,
            [categoryKey]: newCategoryData
        };
        setServices(updatedServices);
        localStorage.setItem('styleUpServicesData', JSON.stringify(updatedServices));
    };

    // Interior Gallery Update Function (Admin use)
    const updateInteriorGallery = (newGalleryData) => {
        setInteriorGallery(newGalleryData);
        localStorage.setItem('styleUpInteriorGallery', JSON.stringify(newGalleryData));
    };

    return (
        <ServicesContext.Provider value={{
            services,
            updateServiceCategory,
            interiorGallery,
            updateInteriorGallery,
            currentUser,
            setCurrentUser,
            isAuthModalOpen,
            setIsAuthModalOpen
        }}>
            {children}
        </ServicesContext.Provider>
    );
};
