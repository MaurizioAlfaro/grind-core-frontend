

import React from 'react';
import type { Badge } from '../../types';
import { StyledButton } from '../../components/common/StyledButton';

interface BadgeInfoModalProps {
  badge: Badge;
  isUnlocked: boolean;
  onClose: () => void;
}

export const BadgeInfoModal: React.FC<BadgeInfoModalProps> = ({ badge, isUnlocked, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-800 rounded-xl border-2 ${isUnlocked ? 'border-cyan-500/50' : 'border-gray-700'} shadow-2xl w-full max-w-sm animate-fade-in-up`}>
        <div className="p-6 text-center">
          <div className={`text-6xl mb-4 inline-block p-4 rounded-lg ${isUnlocked ? 'bg-cyan-900/50' : 'bg-gray-900/50'}`}>
            <span className={!isUnlocked ? 'filter grayscale opacity-60' : ''}>{badge.icon}</span>
          </div>
          <h2 className={`text-2xl font-orbitron font-bold ${isUnlocked ? 'text-cyan-300' : 'text-gray-400'}`}>
            {badge.name}
          </h2>
          <p className="text-gray-400 my-2">{badge.description}</p>

           <div className="my-3 p-2 bg-gray-900/50 rounded-md">
                <p className={`font-bold text-sm ${isUnlocked ? 'text-green-300' : 'text-gray-500'}`}>
                    Bonus: {badge.bonusDescription}
                </p>
            </div>

          <p className={`font-bold text-sm ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
            {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </p>
          <StyledButton onClick={onClose} className="mt-6 w-full">
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};