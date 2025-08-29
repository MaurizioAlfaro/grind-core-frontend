
import React from 'react';
import Chip from './Chip';
import { getChipsForBet } from '../utils/betting';

interface BetDisplayProps {
  totalBet: number;
  isDealing: boolean;
}

const BetDisplay: React.FC<BetDisplayProps> = ({ totalBet, isDealing }) => {
  const betChips = getChipsForBet(totalBet);

  return (
    <div className="relative w-48 h-24 flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 border-4 border-dashed border-white/20 rounded-full"></div>
      {betChips.map((chipValue, index) => (
        <div 
          key={index} 
          className="bet-chip"
          style={{ transform: `translateY(-${index * 8}px)` }}
        >
          <Chip value={chipValue} onClick={() => {}} disabled={true} size="small"/>
        </div>
      ))}
      {totalBet > 0 && !isDealing && (
        <div className="absolute -bottom-6 bg-black/50 text-yellow-300 font-bold px-3 py-1 rounded-full text-lg">
          ${totalBet}
        </div>
      )}
    </div>
  );
};

export default BetDisplay;
