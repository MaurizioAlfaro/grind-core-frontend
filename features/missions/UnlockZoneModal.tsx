import React from 'react';
import { ZONES } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';

interface UnlockZoneModalProps {
  zoneId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnlockZoneModal: React.FC<UnlockZoneModalProps> = ({ zoneId, onConfirm, onCancel }) => {
  const zone = ZONES.find(z => z.id === zoneId);

  if (!zone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-green-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-4">New Zone Detected</h2>
          <p className="text-xl font-bold text-white mb-4">{zone.name}</p>
          <p className="text-gray-300 mb-8 italic bg-gray-900/50 p-4 rounded-lg">"{zone.lore}"</p>
          <div className="flex justify-center gap-4">
            <StyledButton onClick={onCancel} variant="secondary" className="flex-1">
              Later
            </StyledButton>
            <StyledButton id="unlock-zone-confirm-btn" onClick={onConfirm} variant="success" className="flex-1">
              Unlock Zone
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};