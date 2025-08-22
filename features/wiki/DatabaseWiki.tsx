import React from 'react';
import { ZONES, BOSSES, ITEMS } from '../../constants/index';
import type { Zone, Boss, Item } from '../../types';
import { WikiSection } from './components/WikiSection';
import { ItemIcon } from '../../components/common/ItemIcon';

const RarityColorMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};

const ItemEntry: React.FC<{ item: Item, subtext?: string }> = ({ item, subtext }) => (
    <div className="flex items-center gap-3 p-2 bg-gray-900 rounded-md">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-md">
            <ItemIcon item={item} className="text-3xl" imgClassName="w-8 h-8 object-contain" />
        </div>
        <div className="flex-1">
            <p className={`font-semibold ${RarityColorMap[item.rarity]}`}>{item.name}</p>
            <p className="text-xs text-gray-500 italic">"{item.description}"</p>
        </div>
        {subtext && <p className="text-sm font-bold text-cyan-400">{subtext}</p>}
    </div>
);

const ZoneCard: React.FC<{ zone: Zone }> = ({ zone }) => (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-lg font-orbitron text-yellow-300">{zone.name}</h4>
        <p className="text-xs text-gray-500 mb-2">Power Required: {zone.requiredPower}</p>
        <p className="text-sm text-gray-400 italic mb-4">"{zone.lore}"</p>
        <div className="space-y-2">
            <h5 className="text-md font-bold text-gray-300">Loot Table:</h5>
            {zone.lootTable.map(loot => {
                const item = ITEMS[loot.itemId];
                if (!item) return null;
                return <ItemEntry key={item.id} item={item} subtext={`${(loot.chance * 100).toFixed(1)}% (Short)`} />;
            })}
            {zone.exclusiveLoot?.map(loot => {
                const item = ITEMS[loot.itemId];
                if (!item) return null;
                // Exclusive loot has a hardcoded 10% chance in the game engine.
                return <ItemEntry key={item.id} item={item} subtext={`Exclusive (${loot.duration}, 10.0%)`} />;
            })}
        </div>
    </div>
);

const BossCard: React.FC<{ boss: Boss }> = ({ boss }) => (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-lg font-orbitron text-red-400">{boss.name}</h4>
        <p className="text-xs text-gray-500 mb-2">Base Power: {boss.power}</p>
        <p className="text-sm text-gray-400 italic mb-4">"{boss.description}"</p>
        <div className="space-y-2">
            <h5 className="text-md font-bold text-gray-300">Loot Table:</h5>
            {boss.lootTable.map(loot => {
                const item = ITEMS[loot.itemId];
                if (!item) return null;
                return <ItemEntry key={item.id} item={item} subtext={`${(loot.chance * 100).toFixed(1)}%`} />;
            })}
        </div>
    </div>
);

export const DatabaseWiki: React.FC = () => {
    return (
        <div className="space-y-4">
            <WikiSection title="Zones">
                <div className="space-y-4">
                    {ZONES.map(zone => <ZoneCard key={zone.id} zone={zone} />)}
                </div>
            </WikiSection>

            <WikiSection title="Bosses">
                <div className="space-y-4">
                    {Object.values(BOSSES).map(boss => <BossCard key={boss.id} boss={boss} />)}
                </div>
            </WikiSection>
            
             <WikiSection title="Items">
                 <div className="space-y-2">
                    {Object.values(ITEMS).sort((a,b) => a.name.localeCompare(b.name)).map(item => <ItemEntry key={item.id} item={item} />)}
                </div>
            </WikiSection>
        </div>
    );
};