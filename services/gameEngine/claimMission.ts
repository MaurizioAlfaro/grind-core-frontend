

import type { PlayerState, ActiveMission, Rewards, ActiveBoost } from '../../types';
import { ZONES } from '../../constants/index';
import { clockService } from '../clockService';
import { applyRewards } from './_internal/applyRewards';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';

export const claimMission = (playerState: PlayerState, activeMission: ActiveMission): EngineResult<{ rewards?: Rewards, isInitialBoost?: boolean }> => {
    const now = clockService.getCurrentTime();
    if (now < activeMission.endTime) {
        return { success: false, message: 'Mission not yet complete.' };
    }

    const rewards = activeMission.preRolledRewards;
    let newPlayerState = applyRewards(playerState, rewards);
    
    // Reset consecutive cancels for "Leeroy Jenkins" badge
    newPlayerState.consecutiveCancels = 0;

    // Track total missions completed
    newPlayerState.missionsCompleted = (newPlayerState.missionsCompleted || 0) + 1;

    let isInitialBoost = false;
    // Grant initial speed boost after 3rd mission
    if (newPlayerState.missionsCompleted === 3 && !newPlayerState.hasReceivedInitialBoost) {
        newPlayerState.hasReceivedInitialBoost = true;
        const speedBoost: ActiveBoost = {
            type: 'speed',
            value: 1 / 15, // 15x speed
            endTime: now + 10 * 60 * 1000, // 10 minutes
            sourceId: 'initial_boost'
        };
        newPlayerState.activeBoosts = [...newPlayerState.activeBoosts, speedBoost];
        isInitialBoost = true;
    }


    if (activeMission.durationKey === 'LONG' && !newPlayerState.completedLongMissionZoneIds.includes(activeMission.zoneId)) {
        const updatedCompletedLongMissions = [...newPlayerState.completedLongMissionZoneIds];
        updatedCompletedLongMissions.push(activeMission.zoneId);
        newPlayerState.completedLongMissionZoneIds = updatedCompletedLongMissions;
    }
    
    const zone = ZONES.find(z => z.id === activeMission.zoneId);
    if (zone && !newPlayerState.completedZoneIds.includes(zone.id)) {
        const zoneItems = new Set(zone.lootTable.map(l => l.itemId));
        if (zone.exclusiveLoot) {
            zone.exclusiveLoot.forEach(l => zoneItems.add(l.itemId));
        }
        
        const allFound = [...zoneItems].every(itemId => newPlayerState.discoveredItemIds.includes(itemId));
        if (allFound) {
            const updatedCompletedZones = [...newPlayerState.completedZoneIds];
            updatedCompletedZones.push(zone.id);
            newPlayerState.completedZoneIds = updatedCompletedZones;
            newPlayerState = zone.completionBonus.apply(newPlayerState);
        }
    }
    
    newPlayerState.power = calculatePlayerPower(newPlayerState);

    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

    return { 
        success: true, 
        message: 'Mission complete!', 
        newPlayerState: badgeCheckResult.newPlayerState, 
        rewards,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
        isInitialBoost,
    };
};