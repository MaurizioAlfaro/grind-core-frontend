

import React from 'react';
import type { PlayerState, StoreItem } from '../../types';
import { STORE } from '../../constants/index';
import { Tabs } from '../../components/Tabs';
import { StoreItemCard } from './StoreItemCard';

interface StoreViewProps {
  player: PlayerState;
  onPurchase: (itemId: string) => void;
  onUse: (itemId: string) => void;
  onShowCacheContents: (cacheId: string) => void;
}

const StoreCategory: React.FC<{ 
    items: StoreItem[];
    player: PlayerState;
    onPurchase: (itemId: string) => void;
    onUse: (itemId: string) => void;
    onShowCacheContents: (cacheId: string) => void;
}> = ({ items, player, onPurchase, onUse, onShowCacheContents }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
            <StoreItemCard 
                key={item.id}
                item={item}
                player={player}
                onPurchase={onPurchase}
                onUse={onUse}
                onShowCacheContents={onShowCacheContents}
            />
        ))}
    </div>
);

export const StoreView: React.FC<StoreViewProps> = ({ player, onPurchase, onUse, onShowCacheContents }) => {

    const tabs = [
        { label: 'Consumables', content: <StoreCategory items={STORE.consumables} player={player} onPurchase={onPurchase} onUse={onUse} onShowCacheContents={onShowCacheContents} /> },
        { label: 'Marketplace', content: <StoreCategory items={STORE.marketplace} player={player} onPurchase={onPurchase} onUse={onUse} onShowCacheContents={onShowCacheContents} /> },
        { label: 'Caches', content: <StoreCategory items={STORE.caches} player={player} onPurchase={onPurchase} onUse={onUse} onShowCacheContents={onShowCacheContents} /> },
        { label: 'Upgrades', content: <StoreCategory items={STORE.upgrades} player={player} onPurchase={onPurchase} onUse={onUse} onShowCacheContents={onShowCacheContents} /> },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-orbitron text-center text-cyan-400">Store</h2>
            <Tabs tabs={tabs} />
        </div>
    );
};