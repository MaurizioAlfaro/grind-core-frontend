

import React from 'react';
import { StyledButton } from '../../components/common/StyledButton';
import type { LeaderboardEntry } from '../../constants/index';
import { BADGES, ITEMS } from '../../constants/index';
import { EquipmentSlot } from '../../types';
import { PowerIcon } from '../player/icons/PowerIcon';
import { XpIcon } from '../player/icons/XpIcon';
import { ItemIcon } from '../../components/common/ItemIcon';

interface ProfileModalProps {
  profile: LeaderboardEntry;
  onClose: () => void;
}

const RarityBorderMap: { [key: string]: string } = {
    Common: 'border-gray-600',
    Rare: 'border-blue-500',
    Epic: 'border-purple-600',
    Legendary: 'border-orange-600',
};

const EquipmentSlotDisplay: React.FC<{ slot: EquipmentSlot; itemId?: string; }> = ({ slot, itemId }) => {
    const item = itemId ? ITEMS[itemId] : null;

    return (
        <div className={`flex flex-col items-center justify-center w-16 h-20 p-1 bg-gray-800 rounded-lg border-2 ${item ? RarityBorderMap[item.rarity] : 'border-gray-700'}`}>
            <ItemIcon item={item} className="text-2xl" imgClassName="w-8 h-8 object-contain" />
            <p className="text-[10px] text-center font-bold text-gray-300">{item?.name || 'Empty'}</p>
        </div>
    )
}


export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-orbitron font-bold ${profile.isPlayer ? 'text-cyan-300' : 'text-white'}`}>{profile.name}</h2>
            <div className="flex justify-center items-center gap-6 mt-2 text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                    <XpIcon className="w-4 h-4 text-green-400" />
                    <span>Level {profile.level}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                    <PowerIcon className="w-4 h-4 text-red-400" />
                    <span>Power {profile.power.toLocaleString()}</span>
                </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-orbitron text-cyan-400 mb-2 text-center">Equipment</h3>
            <div className="grid grid-cols-5 gap-2 justify-center p-2 bg-gray-900/50 rounded-lg">
                {Object.values(EquipmentSlot).map(slot => (
                    <EquipmentSlotDisplay key={slot} slot={slot} itemId={profile.equipment[slot]} />
                ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-orbitron text-cyan-400 mb-2 text-center">Badges ({profile.unlockedBadgeIds.length})</h3>
            <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto p-2 bg-gray-900/50 rounded-lg">
                {profile.unlockedBadgeIds.length > 0 ? profile.unlockedBadgeIds.map(badgeId => {
                    const badge = BADGES[badgeId];
                    if (!badge) return null;
                    return (
                        <div key={badgeId} className="p-1.5 bg-gray-800 rounded-md" title={`${badge.name}: ${badge.description}`}>
                            <span className="text-2xl">{badge.icon}</span>
                        </div>
                    );
                }) : (
                    <p className="text-gray-500 text-sm">No badges unlocked.</p>
                )}
            </div>
          </div>


          <StyledButton onClick={onClose} className="w-full">
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};
