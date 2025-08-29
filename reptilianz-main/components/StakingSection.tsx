import React from 'react';
import GlitchText from './GlitchText';

const StakingSection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-lime-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-16">
                <GlitchText className="text-lime-400 text-shadow-neon-lime">
                    Scavenging Missions
                </GlitchText>
            </h2>
            <div className="h-64 bg-black/50 border-2 border-lime-800 p-4 font-mono text-lime-400 overflow-y-scroll flex flex-col justify-center max-w-4xl mx-auto">
                <p>&gt; STAKING_PROTOCOL.EXE ACCESSED.</p>
                <p className='mt-2'>&gt; DEPLOYMENT MISSIONS ARE NOW HANDLED VIA THE WASTELAND EXPLORER MINIGAME.</p>
                <p className="text-yellow-400 mt-4">&gt; ACCESS THE MINIGAME ON OUR PORTAL TO EXPLORE MISSIONS AND EARN $WASTE.</p>
                <p className="mt-4">&gt; GOOD LUCK, SURVIVOR.<span className="animate-ping">_</span></p>
            </div>
        </section>
    );
};

export default StakingSection;