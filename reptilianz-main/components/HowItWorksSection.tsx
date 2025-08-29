import React from 'react';
import { MutationIcon, DaoIcon, SolanaIcon, OracleIcon, AlgorithmIcon, AirdropIcon, TokenIcon } from './Icons';
import GlitchText from './GlitchText';
import { ProtocolStep } from '../types';

const steps: ProtocolStep[] = [
    {
        Icon: MutationIcon,
        title: "Phase 1: The Genesis Forge",
        description: "In the digital embers of the old world, each asset was hand-forged, pixel by pixel. This was not automation; this was digital craftsmanship, creating the very soul of the collection."
    },
    {
        Icon: DaoIcon,
        title: "Phase 2: The Singularity Engine",
        description: "From this master code, our Singularity Engine procedurally birthed ten thousand unique digital beings. Each Reptilianz carries a distinct, unrepeatable signature of the Cataclysm."
    },
    {
        Icon: SolanaIcon,
        title: "Phase 3: The Solana Incursion",
        description: "To ensure their survival and efficiency, the entire brood was compressed (cNFTs) and injected directly onto the Solana ghost-chain—a swift, low-cost deployment for a permanent digital existence."
    },
    {
        Icon: OracleIcon,
        title: "Phase 4: The Oracle's Gaze",
        description: "We didn't seek just anyone. The Oracle scanned the wasteland, identifying survivor enclaves—hardened communities of NFT holders on Solana who had proven their resilience and diamond-hand credentials."
    },
    {
        Icon: AlgorithmIcon,
        title: "Phase 5: The Chaos Algorithm",
        description: "We didn't choose the worthy. We invoked a Verifiable Random Function (VRF), letting fate's algorithm anoint the chosen from the gathered enclaves. A provably fair apocalypse."
    },
    {
        Icon: AirdropIcon,
        title: "Phase 6: The Great Dispersal",
        description: "Then, it was done. All 10,000 Reptilianz were unleashed—not sold, but dispersed for free. No presale, no whitelist, no team wallets. A true cataclysm of code and art."
    },
    {
        Icon: TokenIcon,
        title: "Phase 7: The Wasteland Advantage",
        description: "This was not a gift, but a key. Each Reptilianz is a beacon, granting its holder unique advantages and untold bonuses within our upcoming minigame. The story has just begun."
    }
];

const HowItWorksSection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-fuchsia-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-16">
                <GlitchText className="text-lime-400 text-shadow-neon-lime">
                    The Dispersal Protocol
                </GlitchText>
            </h2>
            <div className="relative border-l-4 border-dashed border-lime-800 pl-12 flex flex-col gap-12 max-w-3xl mx-auto">
                 {steps.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-8">
                       <div className="absolute -left-[66px] top-0 p-2 bg-[#0d0a1a] border-4 border-double border-lime-500 rounded-full">
                            <step.Icon className="w-12 h-12" />
                       </div>
                       <div>
                         <h3 className="font-display text-2xl text-lime-400 mb-2">{step.title}</h3>
                         <p className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed">{step.description}</p>
                       </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorksSection;