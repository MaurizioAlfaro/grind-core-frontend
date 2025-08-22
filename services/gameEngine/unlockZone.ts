
import type { PlayerState } from '../../types';

export const unlockZone = (playerState: PlayerState, zoneId: string): PlayerState => {
    const newUnlockedZoneIds = [...playerState.unlockedZoneIds];
    if (!newUnlockedZoneIds.includes(zoneId)) {
        newUnlockedZoneIds.push(zoneId);
    }
    return { ...playerState, unlockedZoneIds: newUnlockedZoneIds };
};