
import React from 'react';
import { ZONES } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';

interface LoreModalProps {
  zoneId: string;
  onClose: () => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({ zoneId, onClose }) => {
  const zone = ZONES.find(z => z.id === zoneId);

  if (!zone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-4">{zone.name}</h2>
          <p className="text-gray-300 mb-8 italic">"{zone.lore}"</p>
          <StyledButton id="lore-modal-close-btn" onClick={onClose} className="w-full">
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};
