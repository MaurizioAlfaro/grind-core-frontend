import React from 'react';
import { CHIP_DENOMINATIONS } from '../constants';
import Chip from './Chip';
import { GameSettings } from '../types';

interface BettingControlsProps {
  onBet: (amount: number) => void;
  onClear: () => void;
  onDeal: () => void;
  onRepeat: () => void;
  onMax: () => void;
  mainBet: number;
  lastBet: number;
  playerChips: number;
  settings: GameSettings;
  isLoading: boolean;
}

const BettingControls: React.FC<BettingControlsProps> = ({ onBet, onClear, onDeal, onRepeat, onMax, mainBet, lastBet, playerChips, settings, isLoading }) => {
  return (
    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
      <div className="text-center">
        <h3 className="text-base sm:text-xl font-bold text-white">Place Your Bet</h3>
        <p className="text-xs sm:text-sm text-gray-300">Min: ${settings.minBet} / Max: ${settings.maxBet}</p>
      </div>
      <div className="flex space-x-1 sm:space-x-2">
        {CHIP_DENOMINATIONS.map(value => (
          <Chip key={value} value={value} onClick={onBet} disabled={isLoading || playerChips < value || mainBet + value > settings.maxBet} />
        ))}
      </div>
       <div className="flex space-x-2 sm:space-x-4">
        <button onClick={onDeal} disabled={isLoading || mainBet < settings.minBet} className="px-5 py-2 sm:px-8 sm:py-3 text-base sm:text-lg bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">Deal</button>
        <button onClick={onClear} disabled={isLoading || mainBet === 0} className="px-5 py-2 sm:px-8 sm:py-3 text-base sm:text-lg bg-red-600 text-white font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">Clear</button>
       </div>
       <div className="flex space-x-2 sm:space-x-4">
            <button onClick={onRepeat} disabled={isLoading || lastBet === 0 || playerChips < lastBet} className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm bg-blue-600 text-white rounded-lg shadow-md hover:scale-105 disabled:bg-gray-500">Repeat (${lastBet})</button>
            <button onClick={onMax} disabled={isLoading || playerChips === 0} className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm bg-purple-600 text-white rounded-lg shadow-md hover:scale-105 disabled:bg-gray-500">Max Bet</button>
       </div>
    </div>
  );
};

export default BettingControls;