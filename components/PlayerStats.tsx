

import React from 'react';
import type { PlayerState } from '../types';
import { LEVEL_XP_REQUIREMENTS } from '../constants/index';
import { PowerIcon } from './icons/PowerIcon';
import { XpIcon } from './icons/XpIcon';
import { GoldIcon } from './icons/GoldIcon';

interface PlayerStatsProps {
  player: PlayerState;
}

const StatDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg bg-gray-800 border border-gray-700 ${color}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex flex-col">
        <span className="text-sm font-bold">{value}</span>
        <span className="text-xs text-gray-400">{label}</span>
    </div>
  </div>
);


export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const xpForNextLevel = LEVEL_XP_REQUIREMENTS[player.level] || Infinity;
  const xpProgress = xpForNextLevel === Infinity ? 100 : (player.xp / xpForNextLevel) * 100;

  return (
    <div className="p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-orbitron font-bold text-cyan-400">LVL {player.level}</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatDisplay icon={<PowerIcon className="w-6 h-6 text-red-400"/>} label="Power" value={player.power} color="text-red-400" />
        <StatDisplay icon={<XpIcon className="w-6 h-6 text-green-400"/>} label="XP" value={player.xp.toLocaleString()} color="text-green-400" />
        <StatDisplay icon={<GoldIcon className="w-6 h-6 text-yellow-400"/>} label="Gold" value={player.gold.toLocaleString()} color="text-yellow-400" />
      </div>
      
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>XP Progress</span>
            <span>{player.xp.toLocaleString()} / {xpForNextLevel === Infinity ? 'MAX' : xpForNextLevel.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>
    </div>
  );
};