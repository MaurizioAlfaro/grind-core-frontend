import React, { useState } from 'react';
import type { Boss } from '../../types';
import { StyledButton } from '../../components/common/StyledButton';
import { PowerIcon } from '../player/icons/PowerIcon';
import { InfoIcon } from '../../components/common/icons/InfoIcon';
import { BookIcon } from '../../components/common/icons/BookIcon';
import { calculateBossWinChance } from '../../services/gameEngine/fightBoss';

interface BossCardProps {
    boss: Boss;
    playerPower: number;
    globalCooldown: number;
    isDefeated: boolean;
    onFight: () => void;
    onShowLore: () => void;
    onShowRewards: () => void;
}

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const BossCard: React.FC<BossCardProps> = ({ boss, playerPower, globalCooldown, isDefeated, onFight, onShowLore, onShowRewards }) => {
    const [imageError, setImageError] = useState(false);
    
    const successChance = calculateBossWinChance(playerPower, boss.power);
    const isChanceCapped = successChance >= 0.90;

    const isOnCooldown = globalCooldown > 0;

    const handleImageError = () => {
        setImageError(true);
    };

    const showImage = boss.image && !imageError;

    return (
        <div className={`relative rounded-xl border border-gray-700 transition-all overflow-hidden bg-gray-900 shadow-lg flex flex-col sm:flex-row`}>
            {showImage && (
                <div className="sm:w-1/3 h-40 sm:h-auto relative">
                    <img
                        src={boss.image}
                        alt={boss.name}
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                        onError={handleImageError}
                    />
                     {isDefeated && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                            DEFEATED
                        </div>
                    )}
                </div>
            )}
            <div className="relative z-10 p-4 flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-orbitron font-bold text-white">{boss.name}</h3>
                            <button onClick={onShowLore} className="text-gray-400 hover:text-cyan-400 transition-colors">
                                <BookIcon className="w-5 h-5" />
                            </button>
                        </div>
                         <div className={`flex items-center gap-2 text-sm text-red-400 font-bold`}>
                            <PowerIcon className="w-5 h-5" />
                            <span>Power: {boss.power.toLocaleString()}</span>
                        </div>
                    </div>
                    <button onClick={onShowRewards} className="text-gray-400 hover:text-cyan-400 transition-colors p-1 bg-black/30 rounded-full">
                        <InfoIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-sm text-gray-400 flex-grow mb-4">{boss.description}</p>
                
                <div className="bg-gray-900/50 p-3 rounded-lg mt-auto">
                    {isOnCooldown ? (
                        <div className="text-center">
                            <p className="text-sm text-gray-400">Global Cooldown Active</p>
                            <p className="text-2xl font-orbitron font-bold text-yellow-400">{formatTime(globalCooldown)}</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex-1 text-center">
                                <p className="text-sm text-gray-400">Win Chance</p>
                                <p className={`text-2xl font-orbitron font-bold ${isChanceCapped ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                    {(successChance * 100).toFixed(1)}%
                                </p>
                            </div>
                            <StyledButton onClick={onFight} variant="danger" className="flex-1">
                                Fight
                            </StyledButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};