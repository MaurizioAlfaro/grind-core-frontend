import React from 'react';
import GlitchText from './GlitchText';
import { AirdropIcon } from './Icons';

const PieChart = () => (
    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center bg-lime-500" style={{
        backgroundImage: `conic-gradient(#84cc16 0% 100%)`
    }}>
        <div className="absolute w-[60%] h-[60%] bg-[#0d0a1a] rounded-full flex items-center justify-center">
            <AirdropIcon className="w-16 h-16 text-lime-400" />
        </div>
    </div>
);

const TokenomicsSection: React.FC<{ id: string }> = ({ id }) => {
    const minigameInfo = (
        <div className="text-lg md:text-xl lg:text-2xl text-gray-300">
            <h3 className="font-display text-xl sm:text-2xl text-cyan-400 mb-2 break-words">SEEKER_MINIGAME.APP</h3>
            <ul className="list-disc list-inside space-y-2">
                <li><span className="text-cyan-400">&gt;</span> An exclusive minigame for the Solana Seeker phone app is in development.</li>
                <li><span className="text-cyan-400">&gt;</span> Explore the wasteland, complete missions, and uncover hidden lore.</li>
                <li><span className="text-cyan-400">&gt;</span> <span className="text-yellow-400 font-bold">Reptilianz holders</span> will receive special in-game bonuses and access to exclusive content.</li>
            </ul>
        </div>
    );
    
    const distributionInfo = (
        <div>
            <h3 className="font-display text-xl sm:text-2xl text-lime-400 mb-2 break-words">DISTRIBUTION.LOG</h3>
             <ul className="space-y-2 text-lg md:text-xl lg:text-2xl">
                <li className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-lime-500 border-2 border-black"></div>
                    <span className="text-gray-400">Free Airdrop:</span>
                    <span className="font-bold text-white">100%</span>
                </li>
            </ul>
            <p className="text-gray-400 mt-4 text-base md:text-lg lg:text-2xl">
                The entire genesis collection was airdropped for free to wallets via a provably random process. No presale, no whitelist, no team allocation. A truly fair launch.
            </p>
        </div>
    );

    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-lime-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-16">
                <GlitchText className="text-lime-400 text-shadow-neon-lime">
                    Wasteland Intel
                </GlitchText>
            </h2>
            <div className="border-4 border-double border-lime-500/50 p-4 md:p-8 bg-black/30">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-8 order-2 md:order-1">{distributionInfo}{minigameInfo}</div>
                    <div className="flex justify-center items-center order-1 md:order-2"><PieChart /></div>
                </div>
            </div>
        </section>
    );
};

export default TokenomicsSection;