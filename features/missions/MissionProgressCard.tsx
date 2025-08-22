
import React, { useState } from 'react';
import { StyledButton } from '../../components/common/StyledButton';
import type { Zone } from '../../types';

interface MissionProgressCardProps {
  timeLeft: number;
  zone: Zone;
  onCancel: () => void;
  onClaim: () => void;
}

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const MissionProgressCard: React.FC<MissionProgressCardProps> = ({ timeLeft, zone, onCancel, onClaim }) => {
  const [imageError, setImageError] = useState(false);
  const isComplete = timeLeft <= 0;

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = zone.image && !imageError;

  return (
    <div className="relative p-4 text-center rounded-xl border border-cyan-500 shadow-lg shadow-cyan-500/20 overflow-hidden bg-gray-900 h-[250px]">
        {showImage && (
            <>
                <img
                    src={zone.image}
                    alt={zone.name}
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    onError={handleImageError}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-0"></div>
            </>
        )}
        <div className="relative z-10 flex flex-col justify-center h-full">
          <h3 className="text-lg font-orbitron text-gray-400 mb-2">{isComplete ? "Mission Complete!" : "Mission in Progress"}</h3>
          <p className="text-xl font-bold text-white mb-2">{zone.name}</p>
          <div className="text-4xl font-orbitron font-bold text-cyan-400 tracking-wider mb-4">
            {formatTime(timeLeft)}
          </div>
          {isComplete ? (
            <StyledButton variant="success" onClick={onClaim} className="w-full animate-pulse">
              Claim Rewards
            </StyledButton>
          ) : (
            <StyledButton variant="danger" onClick={onCancel} className="w-full">
              Cancel Mission
            </StyledButton>
          )}
        </div>
    </div>
  );
};