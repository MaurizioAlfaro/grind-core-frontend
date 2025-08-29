
import React from 'react';
import { BaccaratResult } from '../types';

interface ResultDisplayProps {
    result: {
        winner: BaccaratResult;
        playerScore: number;
        bankerScore: number;
    };
    netWinnings: number;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, netWinnings }) => {
    let message, subMessage, className;

    switch (result.winner) {
        case 'Player':
            message = 'Player Wins!';
            className = 'text-blue-400';
            break;
        case 'Banker':
            message = 'Banker Wins!';
            className = 'text-red-400';
            break;
        case 'Tie':
            message = 'Tie!';
            className = 'text-green-400';
            break;
        default:
            return null;
    }
    
    subMessage = `Player: ${result.playerScore} - Banker: ${result.bankerScore}`;

    let winLossMessage, winLossClass;
    if (netWinnings > 0) {
        winLossMessage = `You Won $${netWinnings}!`;
        winLossClass = 'text-green-400';
    } else if (netWinnings < 0) {
        winLossMessage = `You Lost $${Math.abs(netWinnings)}`;
        winLossClass = 'text-red-400';
    } else {
        winLossMessage = 'Push';
        winLossClass = 'text-gray-300';
    }

    return (
        <div className="text-center">
            <h2 className={`text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse drop-shadow-lg`}>
                {message}
            </h2>
            <p className={`text-3xl font-bold my-2 ${className}`}>{subMessage}</p>
            <p className={`text-2xl font-bold ${winLossClass}`}>{winLossMessage}</p>
        </div>
    );
};
