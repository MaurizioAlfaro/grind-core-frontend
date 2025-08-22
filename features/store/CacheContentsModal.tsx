



import React from 'react';
import { CACHES, ITEMS } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';
import type { Item } from '../../types';
import { ItemIcon } from '../../components/common/ItemIcon';
import { InfoIcon } from '../../components/common/icons/InfoIcon';

interface CacheContentsModalProps {
  cacheId: string;
  onClose: () => void;
  onShowItemInfo: (itemId: string) => void;
}

const RarityColorMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};

const LootItemDisplay: React.FC<{item: Item, onShowItemInfo: (itemId: string) => void;}> = ({ item, onShowItemInfo }) => (
    <div className="relative flex items-center gap-3 p-2 bg-gray-900/50 rounded-md">
        <ItemIcon item={item} className="text-3xl w-8 text-center" imgClassName="w-8 h-8 object-contain" />
        <div className="flex-1">
            <p className={`font-semibold ${RarityColorMap[item.rarity]}`}>{item.name}</p>
            <p className="text-sm text-gray-500">{item.rarity}</p>
        </div>
        <button onClick={() => onShowItemInfo(item.id)} className="p-1 text-gray-500 hover:text-cyan-300 z-10" aria-label={`Info for ${item.name}`}>
            <InfoIcon className="w-5 h-5" />
        </button>
    </div>
);

export const CacheContentsModal: React.FC<CacheContentsModalProps> = ({ cacheId, onClose, onShowItemInfo }) => {
    const cache = CACHES[cacheId];
    if (!cache) return null;

    const possibleItems = cache.pool.map(p => ITEMS[p.itemId]).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
                <div className="p-6">
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2 text-center">Possible Contents</h2>
                    <p className="text-center text-gray-400 mb-4">{cache.label}</p>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-gray-900 rounded-lg">
                        {possibleItems.map(item => <LootItemDisplay key={item.id} item={item} onShowItemInfo={onShowItemInfo}/>)}
                    </div>
                    
                    <StyledButton onClick={onClose} className="mt-6 w-full">
                        Close
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};
