
import React from 'react';
import Chip from '../../blackjack/components/Chip';
import { CHIP_DENOMINATIONS } from '../constants';
import { BaccaratBetType } from '../types';

interface BettingControlsProps {
    onBet: (amount: number, type: BaccaratBetType) => void;
    onClear: () => void;
    onDeal: () => void;
    onRepeat: () => void;
    playerChips: number;
    canRepeat: boolean;
    totalBet: number;
}

const BettingControls: React.FC<BettingControlsProps> = ({ onBet, onClear, onDeal, onRepeat, playerChips, canRepeat, totalBet }) => {

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <div className="text-center mb-2">
                <h3 className="text-xl font-bold text-white">Place Your Bets</h3>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
                {CHIP_DENOMINATIONS.map(value => (
                    <Chip key={value} value={value} onClick={() => {}} disabled={playerChips < value} />
                ))}
            </div>
            <p className="text-xs text-gray-400">Click a spot on the table, then a chip to place a bet.</p>
            <div className="flex space-x-4 mt-2">
                <button onClick={onDeal} disabled={totalBet === 0} className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">Deal</button>
                <button onClick={onClear} disabled={totalBet === 0} className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">Clear Bets</button>
                <button onClick={onRepeat} disabled={!canRepeat} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">Repeat Bet</button>
            </div>
        </div>
    );
};

export default BettingControls;
