
import React from 'react';
import { GameResult } from '../types';

export const GameResultDisplay: React.FC<{ netWinnings: number }> = ({ netWinnings }) => {
    let message, className;
    if (netWinnings > 0) {
        message = `You Won $${netWinnings}!`;
        className = 'text-green-400 animate-pulse';
    } else if (netWinnings < 0) {
        message = `You Lost $${Math.abs(netWinnings)}`;
        className = 'text-red-400';
    } else {
        message = 'Push';
        className = 'text-gray-300';
    }

    return <h2 className={`text-4xl font-bold my-4 text-center drop-shadow-md ${className}`}>{message}</h2>;
};

export const BlackjackResultDisplay: React.FC<{isPlayer: boolean; netWinnings: number}> = ({ isPlayer, netWinnings }) => {
    const text = isPlayer ? 'Blackjack!' : 'Dealer Blackjack';
    const amountText = isPlayer ? `You Won $${netWinnings}!` : `You Lost ${Math.abs(netWinnings)}`;
    const color = isPlayer ? 'from-yellow-300 to-yellow-500' : 'from-red-500 to-red-700';

    return (
        <div className="text-center my-4">
            <h2 className={`text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r ${color} animate-pulse drop-shadow-lg`}>{text}</h2>
            <p className={`text-2xl font-bold mt-2 drop-shadow-md ${isPlayer ? 'text-green-300' : 'text-red-300'}`}>{amountText}</p>
        </div>
    );
};

export const HandResult: React.FC<{ result: GameResult }> = ({ result }) => {
  const messages: { [key in GameResult]?: { text: string; color: string } } = {
    [GameResult.PLAYER_WINS]: { text: 'Win!', color: 'text-green-400' },
    [GameResult.PLAYER_BLACKJACK]: { text: `Blackjack!`, color: 'text-yellow-300' },
    [GameResult.DEALER_WINS]: { text: 'Dealer Wins', color: 'text-red-400' },
    [GameResult.PUSH]: { text: 'Push', color: 'text-gray-300' },
    [GameResult.PLAYER_BUST]: { text: 'Bust!', color: 'text-red-400' },
    [GameResult.DEALER_BUST]: { text: 'Dealer Busts!', color: 'text-green-400' },
  };

  const message = messages[result];
  if (!message) return null;

  return <h3 className={`text-xl font-bold text-center mt-1 ${message.color}`}>{message.text}</h3>
};
