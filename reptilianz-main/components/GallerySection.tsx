import React, { useState } from 'react';
import { NFT } from '../types';
import PixelCard from './PixelCard';
import GlitchText from './GlitchText';
import NftModal from './NftModal';

const generateRandomId = () => Math.floor(Math.random() * 10000) + 1;

const mockNfts: NFT[] = Array.from({ length: 8 }, () => {
    const randomId = generateRandomId();
    return {
        id: randomId,
        name: `REPTILIANZ #${randomId}`,
        rarity: Math.floor(Math.random() * 9000) + 1000,
        imageUrl: `https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/${randomId}.jpeg`,
    };
});

const GallerySection: React.FC<{ id: string }> = ({ id }) => {
    const [selectedNft, setSelectedNft] = useState<NFT | null>(null);

    const handleOpenModal = (nft: NFT) => {
        setSelectedNft(nft);
    };

    const handleCloseModal = () => {
        setSelectedNft(null);
    };

    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-cyan-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-12">
                <GlitchText className="text-cyan-400 text-shadow-neon-cyan">
                    NFT SPECIMENS
                </GlitchText>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {mockNfts.map((nft) => (
                    <PixelCard key={nft.id} nft={nft} onClick={() => handleOpenModal(nft)} />
                ))}
            </div>

            <p className="text-center mt-12 text-xl text-gray-400">
                ...and thousands more waiting to be discovered.
            </p>

            {selectedNft && <NftModal nft={selectedNft} onClose={handleCloseModal} />}
        </section>
    );
};

export default GallerySection;