
import React from 'react';
import { RouletteNumber } from '../types';

interface ResultDisplayProps {
    winningNumber: RouletteNumber;
    netWinnings: number;
    onNextRound: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ winningNumber, netWinnings, onNextRound }) => {
    let winLossMessage, winLossClass;
    if (netWinnings > 0) {
        winLossMessage = `You Won $${netWinnings}!`;
        winLossClass = 'text-green-400';
    } else if (netWinnings < 0) {
        winLossMessage = `You Lost $${Math.abs(netWinnings)}`;
        winLossClass = 'text-red-400';
    } else {
        winLossMessage = 'You Broke Even';
        winLossClass = 'text-gray-300';
    }

    return (
        <div className="text-center space-y-4">
            <div>
                 <h2 className={`text-4xl font-black`}>
                    Number: <span className={`text-roulette-${winningNumber.color}`}>{winningNumber.value}</span>
                 </h2>
                <p className={`text-2xl font-bold ${winLossClass}`}>{winLossMessage}</p>
            </div>
            <button onClick={onNextRound} className="px-10 py-4 bg-yellow-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg hover:scale-105">Next Round</button>
        </div>
    );
};

export default ResultDisplay;
