import type { PlayerState } from '../../types';
import type { EngineResult } from './_internal/types';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';

export const cancelMission = (playerState: PlayerState): EngineResult<{}> => {
    let newPlayerState = { ...playerState };
    newPlayerState.consecutiveCancels = (newPlayerState.consecutiveCancels || 0) + 1;

    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

    return {
        success: true,
        message: "Mission cancelled.",
        newPlayerState: badgeCheckResult.newPlayerState,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
    };
};
