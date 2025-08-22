
import React from 'react';
import type { PlayerState } from '../../types';
import { BOSSES, ZONES } from '../../constants/index';
import { BossCard } from './BossCard';

interface BossesViewProps {
    player: PlayerState;
    globalBossTimer: number;
    onFightBoss: (bossId: string) => void;
    onShowLore: (bossId: string) => void;
    onShowRewards: (bossId: string) => void;
    isDevMode: boolean;
}

export const BossesView: React.FC<BossesViewProps> = ({ player, globalBossTimer, onFightBoss, onShowLore, onShowRewards, isDevMode }) => {
    
    const unlockedAndVisibleBosses = Object.values(BOSSES).filter(boss => player.unlockedZoneIds.includes(boss.zoneId));

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-orbitron text-cyan-400">Boss Encounters</h2>
                <p className="text-gray-400">Face the shadowy figures behind the conspiracy.</p>
            </div>
            
            <div className="space-y-4">
                {unlockedAndVisibleBosses.length > 0 ? (
                    unlockedAndVisibleBosses.map(boss => {
                        const isFightUnlocked = isDevMode || player.completedLongMissionZoneIds.includes(boss.zoneId);
                        const zone = ZONES.find(z => z.id === boss.zoneId);

                        if (!isFightUnlocked) {
                             return (
                                <div key={boss.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center text-gray-500">
                                    <h3 className="font-bold text-lg text-gray-400">{boss.name}</h3>
                                    <p className="text-sm">Location: {zone?.name || boss.zoneId}</p>
                                    <p className="mt-2 text-xs">Complete the 8-hour mission in this zone to unlock this encounter.</p>
                                </div>
                            );
                        }

                        return (
                            <BossCard 
                                key={boss.id}
                                boss={boss}
                                playerPower={player.power}
                                globalCooldown={globalBossTimer}
                                isDefeated={player.defeatedBossIds.includes(boss.id)}
                                onFight={() => onFightBoss(boss.id)}
                                onShowLore={() => onShowLore(boss.id)}
                                onShowRewards={() => onShowRewards(boss.id)}
                            />
                        );
                    })
                ) : (
                    <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                        <p className="text-gray-500">No boss encounters available. Unlock more zones to find them.</p>
                    </div>
                )}
            </div>
        </div>
    );
};