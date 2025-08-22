

import React from 'react';
import type { PlayerState } from '../types';
import { ZONES, ITEMS } from '../constants/index';
import type { Item } from '../types';

interface CollectionProps {
  player: PlayerState;
}

const RarityColorMap: { [key: string]: string } = {
    Common: 'border-gray-500',
    Rare: 'border-blue-500',
    Epic: 'border-purple-500',
    Legendary: 'border-orange-500',
};

const CollectionItem: React.FC<{item: Item; discovered: boolean}> = ({ item, discovered }) => {
    return (
        <div className={`flex flex-col items-center justify-center p-2 h-24 w-20 bg-gray-800 rounded-lg border-2 ${discovered ? RarityColorMap[item.rarity] : 'border-gray-700'}`}>
            {discovered ? (
                <>
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs text-center">{item.name}</span>
                </>
            ) : (
                 <>
                    <span className="text-3xl filter brightness-0 invert opacity-50">{item.icon}</span>
                    <span className="text-xs text-center text-gray-500">???</span>
                </>
            )}
        </div>
    );
};

export const Collection: React.FC<CollectionProps> = ({ player }) => {
    const visibleZones = ZONES.filter(zone => player.unlockedZoneIds.includes(zone.id));

    return (
        <div className="space-y-6">
            {visibleZones.map(zone => {
                const zoneItems = new Set<string>();
                zone.lootTable.forEach(l => zoneItems.add(l.itemId));
                if(zone.exclusiveLoot) {
                    zone.exclusiveLoot.forEach(l => zoneItems.add(l.itemId));
                }
                const items = Array.from(zoneItems).map(id => ITEMS[id]);
                const discoveredCount = items.filter(item => player.discoveredItemIds.includes(item.id)).length;

                return (
                    <div key={zone.id}>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-orbitron text-cyan-400">{zone.name}</h3>
                            <span className="text-sm text-gray-400">{discoveredCount} / {items.length} Found</span>
                        </div>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-900/50 rounded-lg">
                           {items.map(item => (
                               <CollectionItem key={item.id} item={item} discovered={player.discoveredItemIds.includes(item.id)} />
                           ))}
                        </div>
                        {player.completedZoneIds.includes(zone.id) && (
                            <div className="mt-2 text-sm text-green-400 font-semibold">
                                ★ Completion Bonus: {zone.completionBonus.description}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};
