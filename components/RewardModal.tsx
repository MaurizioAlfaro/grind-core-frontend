

import React from 'react';
import type { Rewards } from '../types';
import { ITEMS } from '../constants/index';
import { GoldIcon } from './icons/GoldIcon';
import { XpIcon } from './icons/XpIcon';
import { StyledButton } from './StyledButton';

interface RewardModalProps {
  title: string;
  rewards: Rewards;
  onClose: () => void;
}

const RarityColorMap: { [key: string]: string } = {
    Common: 'border-gray-400',
    Rare: 'border-blue-400',
    Epic: 'border-purple-500',
    Legendary: 'border-orange-500',
};

export const RewardModal: React.FC<RewardModalProps> = ({ title, rewards, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <h2 className="text-3xl font-orbitron font-bold text-cyan-400 mb-4">{title}</h2>
          <p className="text-gray-400 mb-6">You have received the following rewards:</p>

          <div className="space-y-4 mb-8">
            {rewards.xp > 0 && (
                <div className="flex items-center justify-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                <XpIcon className="w-8 h-8 text-green-400" />
                <span className="text-xl font-bold text-green-400">+{rewards.xp.toLocaleString()} XP</span>
                </div>
            )}
            {rewards.gold > 0 && (
                <div className="flex items-center justify-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                <GoldIcon className="w-8 h-8 text-yellow-400" />
                <span className="text-xl font-bold text-yellow-400">+{rewards.gold.toLocaleString()} Gold</span>
                </div>
            )}
          </div>
          
          {rewards.items.length > 0 && (
             <div>
                <h3 className="text-xl font-orbitron text-gray-300 mb-4">Items Found</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-48 overflow-y-auto p-2 bg-gray-900/50 rounded-lg">
                    {rewards.items.map((item, index) => {
                        const itemData = ITEMS[item.itemId];
                        if (!itemData) return null;
                        return (
                            <div key={`${item.itemId}-${index}`} className={`flex flex-col items-center justify-center p-2 bg-gray-800 rounded-lg border-2 ${RarityColorMap[itemData.rarity]}`}>
                                <span className="text-3xl">{itemData.icon}</span>
                                <span className="text-xs text-center">{itemData.name}</span>
                                {item.quantity > 1 && <span className="text-xs text-cyan-400">x{item.quantity}</span>}
                            </div>
                        )
                    })}
                </div>
            </div>
          )}

          <StyledButton onClick={onClose} className="mt-8 w-full">
            Awesome!
          </StyledButton>
        </div>
      </div>
    </div>
  );
};