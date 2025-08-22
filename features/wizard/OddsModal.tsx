import React from 'react';
import { ENCHANTMENT_CONFIG } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';

interface OddsModalProps {
  multiplier: number;
  onClose: () => void;
}

export const OddsModal: React.FC<OddsModalProps> = ({ multiplier, onClose }) => {
    const odds = ENCHANTMENT_CONFIG.ODDS_BY_MULTIPLIER[multiplier];
    
    const tierColors = [
        'text-gray-400', // T1
        'text-green-400', // T2
        'text-blue-400', // T3
        'text-purple-400', // T4
        'text-orange-400' // T5
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-sm animate-fade-in-up">
                <div className="p-6">
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2 text-center">Enchantment Odds</h2>
                    <p className="text-center text-gray-400 mb-4">At <span className="font-bold text-white">{multiplier}x Cost Multiplier</span></p>
                    
                    <div className="space-y-2">
                        {odds.map((chance, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md">
                                <span className={`font-bold ${tierColors[index]}`}>Tier {index + 1}</span>
                                <div className="w-1/2 bg-gray-700 rounded-full h-4">
                                    <div className={`bg-cyan-500 h-4 rounded-full`} style={{ width: `${chance * 100}%`}}></div>
                                </div>
                                <span className="font-mono text-white w-16 text-right">{(chance * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                    
                    <StyledButton onClick={onClose} className="mt-6 w-full">
                        Close
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};
