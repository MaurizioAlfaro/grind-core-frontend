
import React from 'react';
import type { ActiveBoost } from '../../types';
import { ITEMS } from '../../constants/index';
import { clockService } from '../../services/clockService';
import { StyledButton } from './StyledButton';

interface BuffInfoModalProps {
  buff: ActiveBoost;
  onClose: () => void;
}

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
};

const getBuffDetails = (buff: ActiveBoost) => {
    if (buff.sourceId === 'initial_boost') {
        return {
            name: 'Initial Insight',
            icon: '🚀',
            description: 'A surge of insight from your first successful operations has unlocked new efficiencies.',
            effectDescription: 'All mission speeds are increased by 15x.'
        };
    }
    
    const item = ITEMS[buff.sourceId];
    if (item && item.type === 'Consumable') {
        let effectDescription = '';
        switch(buff.type) {
            case 'xp': effectDescription = `+${(buff.value - 1) * 100}% XP from missions.`; break;
            case 'gold': effectDescription = `+${(buff.value - 1) * 100}% Gold from missions.`; break;
            case 'loot': effectDescription = `+${(buff.value - 1) * 100}% Item Drop Chance.`; break;
            case 'speed': effectDescription = `${((1 - buff.value) * 100).toFixed(0)}% faster missions.`; break;
            case 'power': effectDescription = `+${buff.value} temporary Power.`; break;
        }
        return {
            name: item.name,
            icon: item.icon,
            description: item.description,
            effectDescription: effectDescription
        };
    }

    return { 
        name: 'Unknown Buff', 
        icon: '❓', 
        description: 'An unknown effect has been applied.',
        effectDescription: ''
    };
};

export const BuffInfoModal: React.FC<BuffInfoModalProps> = ({ buff, onClose }) => {
    const details = getBuffDetails(buff);
    const timeLeftSeconds = Math.max(0, Math.ceil((buff.endTime - clockService.getCurrentTime()) / 1000));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-sm animate-fade-in-up">
                <div className="p-6 text-center">
                    <div className="text-6xl mb-4 inline-block p-4 rounded-lg bg-gray-900/50">
                        <span>{details.icon}</span>
                    </div>
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-300">
                        {details.name}
                    </h2>
                    <p className="text-gray-400 my-2 text-sm italic">"{details.description}"</p>
                    
                    <div className="my-4 p-3 bg-cyan-900/50 rounded-md">
                        <p className="font-bold text-md text-cyan-200">{details.effectDescription}</p>
                    </div>

                    <p className="font-semibold text-lg text-yellow-400">
                        Time Remaining: {formatTime(timeLeftSeconds)}
                    </p>
                    <StyledButton onClick={onClose} className="mt-6 w-full">
                        Close
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};
