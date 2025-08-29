import React from 'react';
import { NFT } from '../types';
import GlitchText from './GlitchText';

interface PixelCardProps {
    nft: NFT;
    onClick: () => void;
}

const PixelCard: React.FC<PixelCardProps> = ({ nft, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group relative border-4 border-double border-purple-500/50 bg-black/30 p-2 transition-all duration-300 hover:border-purple-400 hover:box-shadow-neon-fuchsia w-full text-left"
        >
            <div className="aspect-square overflow-hidden mb-2 border-2 border-purple-900">
                <img 
                    src={nft.imageUrl} 
                    alt={nft.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            <div className="text-center">
                <h3 className="font-display text-lg text-cyan-300">
                    <GlitchText>{nft.name}</GlitchText>
                </h3>
                <p className="font-display text-lime-400 text-xl">
                    POWER: <span className="text-white">{nft.rarity}</span>
                </p>
            </div>
            <div className="absolute inset-0 border-2 border-fuchsia-400 opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none"></div>
        </button>
    );
};

export default PixelCard;