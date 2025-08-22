import React from 'react';
import { ZONES, ITEMS, BOSSES } from '../../constants/index';
import { GoldIcon } from '../../features/player/icons/GoldIcon';
import { XpIcon } from '../../features/player/icons/XpIcon';
import { StyledButton } from '../../components/common/StyledButton';
import type { Item } from '../../types';
import { InfoIcon } from '../../components/common/icons/InfoIcon';

interface BossRewardsInfoModalProps {
  bossId: string;
  onClose: () => void;
  onShowItemInfo: (itemId: string) => void;
}

const RarityColorMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};


const RewardItemDisplay: React.FC<{item: Item; chance: number; onShowItemInfo: (itemId: string) => void}> = ({ item, chance, onShowItemInfo }) => (
    <div className="relative flex flex-col items-center justify-center text-center p-1 bg-gray-900/50 rounded-md h-24">
        <button onClick={() => onShowItemInfo(item.id)} className="absolute top-0 right-0 p-1 text-gray-500 hover:text-cyan-300 z-10" aria-label={`Info for ${item.name}`}>
            <InfoIcon className="w-4 h-4" />
        </button>
        <span className="text-3xl">{item.icon}</span>
        <p className={`text-xs leading-tight mt-1 font-semibold ${RarityColorMap[item.rarity]}`}>{item.name}</p>
        <span className="absolute bottom-1 text-xs font-bold text-cyan-400">{(chance * 100).toFixed(0)}%</span>
    </div>
);

export const BossRewardsInfoModal: React.FC<BossRewardsInfoModalProps> = ({ bossId, onClose, onShowItemInfo }) => {
  const boss = Object.values(BOSSES).find(b => b.id === bossId);
  if (!boss) return null;
  
  const zone = ZONES.find(z => z.id === boss.zoneId);
  const baseRewards = zone?.missionDurations['LONG'] || { baseXp: 0, baseGold: 0 };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6">
          <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2 text-center">Rewards: {boss.name}</h2>
          
           <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                     <div className="flex items-center justify-center gap-2 bg-gray-900/50 p-2 rounded-lg">
                        <XpIcon className="w-6 h-6 text-green-400" />
                        <span className="text-lg font-bold text-green-400">~{(baseRewards.baseXp * boss.rewardMultiplier.xp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-gray-900/50 p-2 rounded-lg">
                        <GoldIcon className="w-6 h-6 text-yellow-400" />
                        <span className="text-lg font-bold text-yellow-400">~{(baseRewards.baseGold * boss.rewardMultiplier.gold).toLocaleString()}</span>
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-orbitron text-gray-300 my-2">Potential Drops</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {boss.lootTable.map(loot => {
                            const itemData = ITEMS[loot.itemId];
                            if (!itemData) return null;
                            return <RewardItemDisplay 
                                       key={loot.itemId} 
                                       item={itemData} 
                                       chance={loot.chance}
                                       onShowItemInfo={onShowItemInfo}
                                   />
                        })}
                    </div>
                </div>
            </div>

          <StyledButton onClick={onClose} className="mt-6 w-full">
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};