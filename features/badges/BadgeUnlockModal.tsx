

import React from 'react';
import type { Badge } from '../../types';
import { StyledButton } from '../../components/common/StyledButton';
import { ItemIcon } from '../../components/common/ItemIcon';

interface BadgeUnlockModalProps {
  badges: Badge[];
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badges, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-yellow-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <h2 className="text-3xl font-orbitron font-bold text-yellow-400 mb-4">Badge Unlocked!</h2>
          
          <div className="space-y-4 max-h-60 overflow-y-auto p-2">
            {badges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center gap-2 p-4 bg-gray-900/50 rounded-lg">
                    <ItemIcon item={badge as any} className="text-5xl" imgClassName="w-14 h-14 object-contain" />
                    <h3 className="text-lg font-bold text-yellow-300">{badge.name}</h3>
                    <p className="text-sm text-gray-400 italic">"{badge.description}"</p>
                    <div className="mt-2 p-2 bg-yellow-900/50 rounded-md w-full">
                        <p className="font-bold text-sm text-yellow-200">Bonus: {badge.bonusDescription}</p>
                    </div>
                </div>
            ))}
          </div>

          <StyledButton id="badge-unlock-modal-close-btn" onClick={onClose} className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600">
            Excellent!
          </StyledButton>
        </div>
      </div>
    </div>
  );
};