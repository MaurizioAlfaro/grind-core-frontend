

import React from 'react';
import { ZONES } from '../../constants/index';
import type { GameState, MissionDurationKey, ActiveMission } from '../../types';
import { ZoneCard } from './ZoneCard';
import { MissionProgressCard } from './MissionProgressCard';

interface MissionsViewProps {
    gameState: GameState;
    actions: {
        startMission: (zoneId: string, durationKey: MissionDurationKey) => void;
        claimMission: () => void;
        openRewardsInfoModal: (zoneId: string) => void;
        openLoreModal: (zoneId: string) => void;
        requestCancelMission: () => void;
        requestUnlockZone: (zoneId: string) => void;
    };
    isMissionActive: boolean;
    activeMission: ActiveMission | null;
    timeLeft: number;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ gameState, actions, isMissionActive, activeMission, timeLeft }) => {
    const unlockedZones = ZONES.filter(zone => gameState.player.unlockedZoneIds.includes(zone.id));
    const nextLockedZone = ZONES.find(zone => !gameState.player.unlockedZoneIds.includes(zone.id));
    const visibleZones = [...unlockedZones];
    if (nextLockedZone) {
        visibleZones.push(nextLockedZone);
    }


    return (
        <div className="space-y-4">
            {visibleZones.map(zone => {
                const isUnlocked = gameState.player.unlockedZoneIds.includes(zone.id);

                if (isMissionActive && activeMission?.zoneId === zone.id) {
                    const zoneData = ZONES.find(z => z.id === activeMission.zoneId);
                    if (!zoneData) return null;
                    return (
                        <div id={`zone-card-${zone.id}`} key={zone.id}>
                            <MissionProgressCard 
                                timeLeft={timeLeft}
                                zone={zoneData}
                                onCancel={actions.requestCancelMission}
                                onClaim={actions.claimMission} 
                            />
                        </div>
                    );
                }
                return (
                   <div id={`zone-card-${zone.id}`} key={zone.id}>
                       <ZoneCard 
                         zoneId={zone.id}
                         playerPower={gameState.player.power}
                         onStartMission={actions.startMission}
                         onShowRewards={actions.openRewardsInfoModal}
                         onShowLore={actions.openLoreModal}
                         onRequestUnlock={actions.requestUnlockZone}
                         isMissionActive={isMissionActive}
                         isUnlocked={isUnlocked}
                       />
                   </div>
                );
            })}
        </div>
    )
}