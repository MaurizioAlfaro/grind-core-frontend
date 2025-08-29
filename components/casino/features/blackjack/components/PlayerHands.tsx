
import React from 'react';
import { Card, GameResult, GameState } from '../types';
import Hand from './Hand';
import { calculateHandValue } from '../utils/hand';
import { HandResult } from './ResultDisplays';

interface PlayerHandsProps {
  hands: Card[][];
  bets: number[];
  results: GameResult[];
  gameState: GameState;
  activeHandIndex: number;
}

const PlayerHands: React.FC<PlayerHandsProps> = ({ hands, bets, results, gameState, activeHandIndex }) => {
  return (
    <div className="flex justify-center items-start gap-x-4">
      {hands.map((hand, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`transition-all duration-300 p-2 rounded-xl ${gameState === GameState.PLAYER_TURN && index === activeHandIndex ? 'bg-yellow-400/20 shadow-lg' : ''}`}>
            <h2 className="text-xl font-bold text-white mb-2 text-center drop-shadow-lg">
              {`Player ${hands.length > 1 ? index + 1 : ''}`} - Score: {calculateHandValue(hand).value}
            </h2>
            <Hand hand={hand} />
          </div>
          {bets[index] > 0 && <div className="text-white text-lg font-bold mt-2 bg-black/30 px-3 py-1 rounded-full">${bets[index]}</div>}
          {results[index] > GameResult.NONE && <HandResult result={results[index]} />}
        </div>
      ))}
    </div>
  );
};

export default PlayerHands;
