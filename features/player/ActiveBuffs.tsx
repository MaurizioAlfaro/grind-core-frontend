
import React from 'react';
import type { ActiveBoost } from '../../types';
import { ITEMS } from '../../constants/index';
import { clockService } from '../../services/clockService';

interface ActiveBuffsProps {
  activeBoosts: ActiveBoost[];
  onViewBuff: (buff: ActiveBoost) => void;
}

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
};

export const ActiveBuffs: React.FC<ActiveBuffsProps> = ({ activeBoosts, onViewBuff }) => {
  if (activeBoosts.length === 0) {
    return null;
  }

  const now = clockService.getCurrentTime();

  return (
    <div>
        <h3 className="text-xs text-gray-400 uppercase font-bold mb-2 text-center">Active Buffs</h3>
        <div className="flex flex-wrap gap-2 justify-center">
            {activeBoosts.map(buff => {
                let displayInfo: { name: string, icon: string } | undefined;

                if (buff.sourceId === 'initial_boost') {
                    displayInfo = { name: 'Initial Insight (15x Speed)', icon: '🚀' };
                } else {
                    const itemData = ITEMS[buff.sourceId];
                    if (itemData) {
                         displayInfo = { name: itemData.name, icon: itemData.icon };
                    }
                }
                
                if (!displayInfo) return null;

                const timeLeftSeconds = Math.max(0, Math.ceil((buff.endTime - now) / 1000));
                
                return (
                    <button 
                        key={buff.sourceId + buff.endTime} 
                        className="flex items-center gap-2 p-1.5 bg-gray-900/50 rounded-lg border border-cyan-500/30 hover:bg-cyan-900/50 hover:border-cyan-400 transition-colors" 
                        title={displayInfo.name}
                        onClick={() => onViewBuff(buff)}
                    >
                        <span className="text-lg">{displayInfo.icon}</span>
                        <span className="text-xs font-mono text-cyan-300">{formatTime(timeLeftSeconds)}</span>
                    </button>
                );
            })}
        </div>
    </div>
  );
};