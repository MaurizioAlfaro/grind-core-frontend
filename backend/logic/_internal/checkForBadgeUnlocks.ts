import type { PlayerState, Badge } from "../../../types";
import { BADGE_UNLOCK_CONDITIONS, BADGES } from "../../../constants/index";

export const checkForBadgeUnlocks = (
  playerState: PlayerState
): { newPlayerState: PlayerState; newlyUnlockedBadges: Badge[] } => {
  console.log(
    "🔍 [checkForBadgeUnlocks] Input playerState.activeBoosts:",
    JSON.stringify(playerState.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [checkForBadgeUnlocks] Input playerState.activeBoosts type:",
    typeof playerState.activeBoosts
  );
  console.log(
    "🔍 [checkForBadgeUnlocks] Input playerState.activeBoosts isArray:",
    Array.isArray(playerState.activeBoosts)
  );

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
    const newPlayerState = {
      ...playerState,
      unlockedBadgeIds: newUnlockedBadgeIds,
    };
    console.log(
      "🔍 [checkForBadgeUnlocks] Badges unlocked, newPlayerState.activeBoosts:",
      JSON.stringify(newPlayerState.activeBoosts, null, 2)
    );
    console.log(
      "🔍 [checkForBadgeUnlocks] Badges unlocked, newPlayerState.activeBoosts type:",
      typeof newPlayerState.activeBoosts
    );
    console.log(
      "🔍 [checkForBadgeUnlocks] Badges unlocked, newPlayerState.activeBoosts isArray:",
      Array.isArray(newPlayerState.activeBoosts)
    );

    // Check if activeBoosts got corrupted
    if (typeof newPlayerState.activeBoosts === "string") {
      console.log(
        "🔍 [checkForBadgeUnlocks] ERROR: activeBoosts became a string when badges were unlocked!"
      );
      console.log(
        "🔍 [checkForBadgeUnlocks] String content:",
        newPlayerState.activeBoosts
      );
    }

    return { newPlayerState, newlyUnlockedBadges };
  }

  console.log(
    "🔍 [checkForBadgeUnlocks] No badges unlocked, returning original playerState.activeBoosts:",
    JSON.stringify(playerState.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [checkForBadgeUnlocks] No badges unlocked, returning original playerState.activeBoosts type:",
    typeof playerState.activeBoosts
  );
  console.log(
    "🔍 [checkForBadgeUnlocks] No badges unlocked, returning original playerState.activeBoosts isArray:",
    Array.isArray(playerState.activeBoosts)
  );

  // Check if activeBoosts got corrupted
  if (typeof playerState.activeBoosts === "string") {
    console.log(
      "🔍 [checkForBadgeUnlocks] ERROR: activeBoosts is already a string in the input!"
    );
    console.log(
      "🔍 [checkForBadgeUnlocks] String content:",
      playerState.activeBoosts
    );
  }

  return { newPlayerState: playerState, newlyUnlockedBadges: [] };
};
