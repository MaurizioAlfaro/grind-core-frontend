import React from 'react';

export const InsurancePrompt: React.FC<{ onInsurance: (accepted: boolean) => void; insuranceCost: number; canAfford: boolean, isLoading: boolean }> = 
({ onInsurance, insuranceCost, canAfford, isLoading }) => (
    <div className="flex flex-col items-center space-y-3 p-4 bg-black/30 rounded-lg">
        <h3 className="text-xl font-bold text-white">Insurance?</h3>
        <p className="text-sm text-gray-200">Cost: ${insuranceCost}</p>
        <div className="flex space-x-4">
            <button onClick={() => onInsurance(true)} disabled={isLoading || !canAfford} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-500">Yes</button>
            <button onClick={() => onInsurance(false)} disabled={isLoading} className="px-6 py-2 bg-red-700 text-white font-bold rounded-lg shadow-lg hover:bg-red-800 disabled:bg-gray-500">No</button>
        </div>
        {!canAfford && <p className="text-xs text-red-400">Not enough chips.</p>}
    </div>
);

export const EvenMoneyPrompt: React.FC<{ onEvenMoney: (accepted: boolean) => void; payout: number, isLoading: boolean }> = 
({ onEvenMoney, payout, isLoading }) => (
    <div className="flex flex-col items-center space-y-3 p-4 bg-black/30 rounded-lg text-center">
        <h3 className="text-xl font-bold text-white">Even Money?</h3>
        <p className="text-sm text-gray-200">Take a guaranteed 1:1 payout?</p>
        <div className="flex space-x-4 mt-2">
            <button onClick={() => onEvenMoney(true)} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-500">Yes (Win ${payout})</button>
            <button onClick={() => onEvenMoney(false)} disabled={isLoading} className="px-6 py-2 bg-red-700 text-white font-bold rounded-lg shadow-lg hover:bg-red-800 disabled:bg-gray-500">No (Risk a Push)</button>
        </div>
    </div>
);