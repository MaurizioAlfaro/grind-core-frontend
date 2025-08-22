

import React from 'react';
import { ZONES, ITEMS } from '../../constants/index';
import { GoldIcon } from '../../features/player/icons/GoldIcon';
import { XpIcon } from '../../features/player/icons/XpIcon';
import { StyledButton } from './StyledButton';
import { Tabs } from '../Tabs';
import type { MissionDurationKey, Item, Zone } from '../../types';
import { InfoIcon } from './icons/InfoIcon';
import { ItemIcon } from './ItemIcon';

interface RewardsInfoModalProps {
  zoneId: string;
  onClose: () => void;
  discoveredItemIds: string[];
  onShowItemInfo: (itemId: string) => void;
}

const RarityColorMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};

const CheckmarkIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const RewardItemDisplay: React.FC<{item: Item; chance: number; discovered: boolean; onShowItemInfo: (itemId: string) => void}> = ({ item, chance, discovered, onShowItemInfo }) => (
    <div className="relative flex flex-col items-center justify-center text-center p-1 bg-gray-900/50 rounded-md h-24">
        {discovered && (
            <div className="absolute top-1 left-1 bg-green-500/80 rounded-full p-0.5" title="Discovered">
                <CheckmarkIcon className="w-2 h-2 text-white" />
            </div>
        )}
        <button id={`info-btn-${item.id}`} onClick={() => onShowItemInfo(item.id)} className="absolute top-0 right-0 p-1 text-gray-500 hover:text-cyan-300 z-10" aria-label={`Info for ${item.name}`}>
            <InfoIcon className="w-4 h-4" />
        </button>
        <ItemIcon item={item} className="text-3xl" imgClassName="w-10 h-10 object-contain" />
        <p className={`text-xs leading-tight mt-1 font-semibold ${RarityColorMap[item.rarity]}`}>{item.name}</p>
        <span className="absolute bottom-1 text-xs font-bold text-cyan-400">{(chance * 100).toFixed(0)}%</span>
    </div>
);

const DurationRewards: React.FC<{zone: Zone; durationKey: MissionDurationKey; discoveredItemIds: string[]; onShowItemInfo: (itemId: string) => void;}> = ({ zone, durationKey, discoveredItemIds, onShowItemInfo }) => {
    const durationInfo = zone.missionDurations[durationKey];

    const exclusiveLoot = zone.exclusiveLoot?.find(loot => loot.duration === durationKey);
    const exclusiveItem = exclusiveLoot ? ITEMS[exclusiveLoot.itemId] : null;

    let chanceMultiplier = 1;
    if (durationKey === 'MEDIUM') {
        chanceMultiplier = 3;
    } else if (durationKey === 'LONG') {
        chanceMultiplier = 10;
    }

    return (
        <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="flex items-center justify-center gap-2 bg-gray-900/50 p-2 rounded-lg">
                    <XpIcon className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-bold text-green-400">{durationInfo.baseXp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-gray-900/50 p-2 rounded-lg">
                    <GoldIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg font-bold text-yellow-400">{durationInfo.baseGold.toLocaleString()} Gold</span>
                </div>
            </div>

            <div>
                <h4 className="text-md font-orbitron text-gray-300 mb-2">Item Drops</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {zone.lootTable.map(loot => {
                        const itemData = ITEMS[loot.itemId];
                        if (!itemData) return null;
                        const finalChance = Math.min(loot.chance * chanceMultiplier, 1);
                        return <RewardItemDisplay 
                                   key={loot.itemId} 
                                   item={itemData} 
                                   chance={finalChance} 
                                   discovered={discoveredItemIds.includes(itemData.id)} 
                                   onShowItemInfo={onShowItemInfo}
                               />
                    })}
                </div>
            </div>

            {exclusiveItem && (
                 <div>
                    <h4 className="text-md font-orbitron text-yellow-400 mb-2 mt-4">Exclusive Drop</h4>
                     <div className="flex justify-center">
                       <div className="w-1/3 sm:w-1/4">
                            {/* 10% chance is hardcoded in game engine */}
                            <RewardItemDisplay 
                                item={exclusiveItem} 
                                chance={0.1} 
                                discovered={discoveredItemIds.includes(exclusiveItem.id)} 
                                onShowItemInfo={onShowItemInfo}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const RewardsInfoModal: React.FC<RewardsInfoModalProps> = ({ zoneId, onClose, discoveredItemIds, onShowItemInfo }) => {
  const zone = ZONES.find(z => z.id === zoneId);

  if (!zone) return null;
  
  const tabs = [
      { label: 'Short', content: <DurationRewards zone={zone} durationKey="SHORT" discoveredItemIds={discoveredItemIds} onShowItemInfo={onShowItemInfo} /> },
      { label: 'Medium', content: <DurationRewards zone={zone} durationKey="MEDIUM" discoveredItemIds={discoveredItemIds} onShowItemInfo={onShowItemInfo} /> },
      { label: 'Long', content: <DurationRewards zone={zone} durationKey="LONG" discoveredItemIds={discoveredItemIds} onShowItemInfo={onShowItemInfo} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6">
          <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2 text-center">Rewards: {zone.name}</h2>
          
          <Tabs tabs={tabs} />

          <StyledButton id="rewards-info-modal-close-btn" onClick={onClose} className="mt-6 w-full">
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};