

import type { PlayerState, Badge } from '../../../types';
import { BADGE_UNLOCK_CONDITIONS, BADGES } from '../../../constants/index';

export const checkForBadgeUnlocks = (playerState: PlayerState): { newPlayerState: PlayerState; newlyUnlockedBadges: Badge[] } => {
    const newlyUnlockedBadges: Badge[] = [];
    const newUnlockedBadgeIds = [...playerState.unlockedBadgeIds];

    for (const badgeId in BADGE_UNLOCK_CONDITIONS) {
        if (!newUnlockedBadgeIds.includes(badgeId)) {
            const condition = BADGE_UNLOCK_CONDITIONS[badgeId];
            if (condition(playerState)) {
                newUnlockedBadgeIds.push(badgeId);
                newlyUnlockedBadges.push(BADGES[badgeId]);
            }
        }
    }

    if (newlyUnlockedBadges.length > 0) {
        const newPlayerState = { ...playerState, unlockedBadgeIds: newUnlockedBadgeIds };
        return { newPlayerState, newlyUnlockedBadges };
    }

    return { newPlayerState: playerState, newlyUnlockedBadges: [] };
};