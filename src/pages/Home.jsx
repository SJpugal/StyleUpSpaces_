import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import AdsAndMotto from '../components/AdsAndMotto';
import './Home.css';

const Home = () => {
    return (
        <div className="page-wrapper home-page">
            <img src="/logo.png" alt="" className="home-background-logo" />
            <Header />
            <main>
                <Hero />
                <Services />
                <AdsAndMotto />
            </main>
        </div>
    );
};

export default Home;
