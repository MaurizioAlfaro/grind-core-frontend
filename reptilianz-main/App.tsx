import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import HowItWorksSection from './components/HowItWorksSection';
import RoadmapSection from './components/RoadmapSection';
import TokenomicsSection from './components/TokenomicsSection';
import StakingSection from './components/StakingSection';
import CommunitySection from './components/CommunitySection';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
         <div className="relative min-h-screen overflow-x-hidden">
            {/* CRT Scanline Overlay */}
            <div className="fixed top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)] pointer-events-none z-[100]"></div>

            {/* Vignette Overlay */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99]" style={{ boxShadow: 'inset 0 0 150px 20px rgba(0,0,0,0.85)' }}></div>
            
            <Header />
            <HeroSection />
            <main className="px-4 md:px-8 max-w-7xl mx-auto">
                <AboutSection id="about" />
                <GallerySection id="gallery" />
                <TokenomicsSection id="tokenomics" />
                <HowItWorksSection id="how-it-works" />
                <RoadmapSection id="roadmap" />
                <StakingSection id="staking" />
                <CommunitySection id="community" />
            </main>
            <Footer />
        </div>
    );
};

export default App;