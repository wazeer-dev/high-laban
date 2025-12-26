import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/Sections/About';
import VideoSection from '../components/Sections/VideoSection';
import FAQ from '../components/Sections/FAQ';
import Products from '../components/Sections/Products';
import Marquee from '../components/Sections/Marquee';

const Home = () => {


    return (
        <>
            <Hero />
            <main style={{ position: 'relative', zIndex: 10, background: 'var(--color-bg-dark)' }}>
                <Marquee />
                <About />
                <Products />
                <VideoSection />
                <FAQ />
            </main>
        </>
    );
};

export default Home;
