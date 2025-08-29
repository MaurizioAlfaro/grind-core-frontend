import React from 'react';
import Hand from './Hand';
import { Card } from '../types';
import { calculateBaccaratValue } from '../utils/hand';

interface TableUIProps {
    playerHand: Card[];
    bankerHand: Card[];
    isDealing: boolean;
    playerRevealed: boolean[];
    bankerRevealed: boolean[];
}

const HandDisplay: React.FC<{ title: string; hand: Card[]; winner?: boolean; revealed: boolean[]; isBanker: boolean; }> = ({ title, hand, winner = false, revealed, isBanker }) => {
    const showScore = revealed.slice(0, hand.length).every(Boolean) && hand.length > 0;
    return (
        <div className={`transition-all duration-500 rounded-2xl p-2 sm:p-4 ${winner ? 'bg-yellow-400/30 shadow-2xl scale-105' : 'bg-black/20'}`}>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 text-center drop-shadow-lg">
              {title} - Score: {showScore ? calculateBaccaratValue(hand) : '?'}
            </h2>
            <Hand hand={hand} revealedStates={revealed} isBanker={isBanker} />
        </div>
    );
};


export const TableUI: React.FC<TableUIProps & { winner: 'Player' | 'Banker' | 'Tie' | null }> = ({ playerHand, bankerHand, winner, playerRevealed, bankerRevealed }) => {
  return (
    <div className="min-h-[260px] sm:min-h-[360px] flex flex-col justify-around items-center gap-y-4">
        <HandDisplay title="Banker" hand={bankerHand} winner={winner === 'Banker'} revealed={bankerRevealed} isBanker={true} />
        <HandDisplay title="Player" hand={playerHand} winner={winner === 'Player'} revealed={playerRevealed} isBanker={false} />
    </div>
  );
};