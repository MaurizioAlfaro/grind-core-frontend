import React, { useState, useEffect } from 'react';
import { NFT, NftDetails } from '../types';
import GlitchText from './GlitchText';

interface NftModalProps {
  nft: NFT;
  onClose: () => void;
}

const NftModal: React.FC<NftModalProps> = ({ nft, onClose }) => {
  const [details, setDetails] = useState<NftDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://gateway.lighthouse.storage/ipfs/bafybeibysbw3o6gghiqberyrtnmum2tmlhyrhrsuokp4iqiuckf4rn6pli/${nft.id}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch NFT details');
        }
        const data: NftDetails = await response.json();
        setDetails(data);
      } catch (error) {
        console.error(error);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [nft.id]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[101] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-4xl bg-[#0d0a1a] border-4 border-double border-cyan-500/80 box-shadow-neon-cyan p-4 md:p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 font-display text-2xl text-gray-500 hover:text-cyan-400 transition-colors z-10"
          aria-label="Close modal"
        >
          [X]
        </button>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="font-display text-2xl text-lime-400 animate-pulse">ACCESSING DATA...<span className="animate-ping">_</span></p>
          </div>
        ) : !details ? (
          <div className="flex flex-col items-center justify-center h-96">
             <p className="font-display text-2xl text-red-500">ERROR: DATA CORRUPTED</p>
             <p className="text-gray-400 mt-2">Could not load details for {nft.name}.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square border-2 border-cyan-800">
                <img src={details.image} alt={details.name} className="w-full h-full object-cover"/>
            </div>
            <div className="flex flex-col">
              <h2 className="font-display text-3xl md:text-4xl mb-4">
                  <GlitchText className="text-cyan-400 text-shadow-neon-cyan">{details.name}</GlitchText>
              </h2>
              <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-6 leading-relaxed">{details.description}</p>
              
              <h3 className="font-display text-xl text-fuchsia-400 mb-3">ATTRIBUTES:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-base md:text-lg lg:text-xl">
                  {details.attributes.map(attr => (
                      <div key={attr.trait_type} className="bg-black/40 p-2 border-l-2 border-fuchsia-500">
                          <p className="text-gray-400 uppercase text-sm tracking-widest">{attr.trait_type}</p>
                          <p className="text-white font-bold">{attr.value}</p>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NftModal;