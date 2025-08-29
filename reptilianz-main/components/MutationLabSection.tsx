import React from 'react';
import GlitchText from './GlitchText';
import { MutationIcon } from './Icons';
import { NFT } from '../types';

const randomId = Math.floor(Math.random() * 10000) + 1;
const mockResultNft: NFT = { id: randomId, name: `MUTANT #${randomId}`, rarity: 9999, imageUrl: `https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/${randomId}.jpeg` };


const NftSlot: React.FC<{ nft?: NFT; isResult?: boolean }> = ({ nft, isResult = false }) => (
    <div className={`relative aspect-square w-full border-4 p-1 ${isResult ? 'border-fuchsia-400' : 'border-cyan-700 border-dashed'} bg-black/30 flex items-center justify-center`}>
        {nft ? (
            <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover"/>
        ) : (
             <p className="font-display text-3xl text-gray-700">SLOT</p>
        )}
        {nft && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                 <p className="font-display text-sm text-white">{nft.name}</p>
            </div>
        )}
    </div>
);

const MutationLabSection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-fuchsia-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-16">
                <GlitchText className="text-fuchsia-400 text-shadow-neon-fuchsia">
                    Mutation Lab
                </GlitchText>
            </h2>
            <div className="text-center">
                 <div className="relative w-72 h-72 mx-auto">
                    <MutationIcon className="w-full h-full text-fuchsia-500/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 animate-pulse">
                           <NftSlot nft={mockResultNft} isResult/>
                        </div>
                    </div>
                 </div>
                 <p className="font-display text-xl text-fuchsia-400 mt-4">INCUBATION COMPLETE...</p>
                 <p className="text-gray-500 mt-8 max-w-2xl mx-auto text-center">
                    Disclaimer: The Mutation Lab is a conceptual feature. Its implementation depends on community feedback and roadmap progression.
                </p>
            </div>
        </section>
    );
};

export default MutationLabSection;