

import type { PlayerState } from '../../types';
import { ZONES } from '../../constants/index';
import type { EngineResult } from './_internal/types';
import { clockService } from '../clockService';

export const assignToWork = (playerState: PlayerState, homunculusId: number, zoneId: string): EngineResult<{}> => {
    let newPlayerState = { ...playerState };
    const homunculusIndex = newPlayerState.homunculi.findIndex(h => h.id === homunculusId);

    if (homunculusIndex === -1) {
        return { success: false, message: "Homunculus not found." };
    }
    
    const homunculus = newPlayerState.homunculi[homunculusIndex];
    if (!homunculus.isAdult) {
        return { success: false, message: "Only adult Reptilianz can work." };
    }

    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) {
        return { success: false, message: "Workplace not found." };
    }

    // Worker limit check
    const currentWorkers = playerState.homunculi.filter(h => h.work?.zoneId === zoneId).length;
    if (currentWorkers >= zone.workerLimit) {
        return { success: false, message: `${zone.name} is fully staffed.` };
    }
    
    // Check requirements
    for (const trait in zone.workRequirements) {
        const key = trait as keyof typeof zone.workRequirements;
        const requiredLevel = zone.workRequirements[key]!;
        const homunculusLevel = homunculus.traits[key] || 0;
        if (homunculusLevel < requiredLevel) {
            return { success: false, message: `Not qualified. Requires ${trait} level ${requiredLevel}.` };
        }
    }

    const updatedHomunculus = { ...homunculus, work: { zoneId, startTime: clockService.getCurrentTime() } };
    const updatedHomunculi = [...newPlayerState.homunculi];
    updatedHomunculi[homunculusIndex] = updatedHomunculus;
    newPlayerState.homunculi = updatedHomunculi;

    return {
        success: true,
        message: `Assigned to ${zone.name}.`,
        newPlayerState,
    };
};