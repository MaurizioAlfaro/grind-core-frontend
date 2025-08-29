import React from 'react';
import { ReptileSpriteIcon } from './Icons';
import GlitchText from './GlitchText';

const aboutContent = {
    p1: "In the year 2077, the Great Cataclysm scorched the Earth, leaving behind a digital wasteland. From the smoldering ruins and abandoned servers, a new lifeform emerged: The Reptilianz.",
    p2: "These are not mere reptiles. They are sentient, pixel-forged beings, survivors of the digital apocalypse, each with a unique signature coded into their very essence. Roaming the ghost-chains of a forgotten internet, they await new masters.",
    p3: "Now, they are being airdropped to the brave accounts who dare to explore the Solana frontier. Will you answer the call?"
};

const ContentBlock = () => (
    <div className="bg-black/30 border-2 border-fuchsia-900/50 p-6">
        <p className="mb-4 text-gray-300 text-justify">
            {aboutContent.p1.replace('Reptilianz', '')} <span className="text-lime-400 font-bold">Reptilianz</span>.
        </p>
        <p className="mb-4 text-gray-300 text-justify">
            {aboutContent.p2}
        </p>
        <p className="text-cyan-400 font-bold text-justify">
            {aboutContent.p3}
        </p>
    </div>
);

const AboutSection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-fuchsia-500/30 relative">
             <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-1 flex justify-center">
                    <div className="animate-bounce">
                        <ReptileSpriteIcon className="w-48 h-48 md:w-64 md:h-64" />
                    </div>
                </div>
                <div className="md:col-span-2 text-lg md:text-xl lg:text-2xl leading-relaxed">
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-6 break-words">
                        <GlitchText className="text-fuchsia-400 text-shadow-neon-fuchsia">
                            TRANSMISSION.log
                        </GlitchText>
                    </h2>
                    <ContentBlock />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;