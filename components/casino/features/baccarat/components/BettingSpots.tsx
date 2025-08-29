import React from 'react';
import Chip from './Chip';
import { BaccaratBetType } from '../types';
import { getChipsForBet } from '../utils/betting';

interface BettingSpotProps {
    label: string;
    betAmount: number;
    onClick: () => void;
    className?: string;
}

const BettingSpot: React.FC<BettingSpotProps> = ({ label, betAmount, onClick, className }) => {
    const betChips = getChipsForBet(betAmount);
    return (
        <div 
            className={`relative flex flex-col items-center justify-center p-2 sm:p-4 border-4 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${className} border-white/20 hover:border-white/50 hover:bg-white/10`}
            onClick={onClick}
        >
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white uppercase tracking-widest">{label}</h3>
            {betAmount > 0 && <p className="text-yellow-300 font-bold text-sm sm:text-lg">${betAmount}</p>}
            <div className="absolute w-full h-full flex items-center justify-center top-0 left-0">
                {betChips.map((chipValue, index) => (
                    <div
                        key={index}
                        className="bet-chip"
                        style={{ transform: `translate(${(index - betChips.length/2) * 5}px, -${index * 4}px)` }}
                    >
                         <Chip value={chipValue} onClick={() => {}} disabled={true} size="small"/>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface BettingSpotsProps {
    bets: Record<BaccaratBetType, number>;
    onBet: (type: BaccaratBetType) => void;
}

const BettingSpots: React.FC<BettingSpotsProps> = ({ bets, onBet }) => {

    return (
        <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-4 h-full text-center w-full">
            <div className="col-span-1 row-span-1">
                <BettingSpot
                    label="P Pair"
                    betAmount={bets.playerPair}
                    onClick={() => onBet('playerPair')}
                />
            </div>
            <div className="col-span-1 row-span-2">
                 <BettingSpot
                    label="Player"
                    betAmount={bets.player}
                    onClick={() => onBet('player')}
                    className="h-full"
                />
            </div>
            <div className="col-span-1 row-span-1">
                <BettingSpot
                    label="B Pair"
                    betAmount={bets.bankerPair}
                    onClick={() => onBet('bankerPair')}
                />
            </div>
            <div className="col-span-3 row-span-1">
                 <BettingSpot
                    label="Tie"
                    betAmount={bets.tie}
                    onClick={() => onBet('tie')}
                />
            </div>
             <div className="col-start-3 row-start-1 row-span-2">
                 <BettingSpot
                    label="Banker"
                    betAmount={bets.banker}
                    onClick={() => onBet('banker')}
                    className="h-full"
                />
            </div>
        </div>
    );
};

export default BettingSpots;