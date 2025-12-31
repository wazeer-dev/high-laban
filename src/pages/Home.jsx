import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/Sections/About';
import VideoSection from '../components/Sections/VideoSection';
import FAQ from '../components/Sections/FAQ';
import Products from '../components/Sections/Products';
import Marquee from '../components/Sections/Marquee';
import { useLocation } from 'react-router-dom';

import FranchiseSection from '../components/Sections/FranchiseSection';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                // Small delay to ensure render
                setTimeout(() => {
                    const y = element.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);


    return (
        <>
            <Hero />
            <main style={{ position: 'relative', zIndex: 10, background: 'var(--color-bg-dark)' }}>
                <Marquee />
                <About />
                <Products />
                <VideoSection />
                <FAQ />
                <FranchiseSection />
            </main>
        </>
    );
};

export default Home;
