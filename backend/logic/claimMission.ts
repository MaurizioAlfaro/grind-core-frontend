import type {
  PlayerState,
  ActiveMission,
  Rewards,
  ActiveBoost,
} from "../../types";
import { ZONES } from "../../constants/index";
import { clockService } from "../../services/clockService";
import { applyRewards } from "./_internal/applyRewards";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";
import { checkForBadgeUnlocks } from "./_internal/checkForBadgeUnlocks";
import type { EngineResult } from "./_internal/types";

export const claimMission = (
  playerState: PlayerState,
  activeMission: ActiveMission
): EngineResult<{ rewards?: Rewards; isInitialBoost?: boolean }> => {
  console.log(
    "🔍 [claimMission] Starting with playerState.activeBoosts:",
    JSON.stringify(playerState.activeBoosts, null, 2)
  );

  const now = clockService.getCurrentTime();
  if (now < activeMission.endTime) {
    return { success: false, message: "Mission not yet complete." };
  }

  const rewards = activeMission.preRolledRewards;
  let newPlayerState = applyRewards(playerState, rewards);

  console.log(
    "🔍 [claimMission] After applyRewards, activeBoosts:",
    JSON.stringify(newPlayerState.activeBoosts, null, 2)
  );

  // Reset consecutive cancels for "Leeroy Jenkins" badge
  newPlayerState.consecutiveCancels = 0;

  // Track total missions completed
  newPlayerState.missionsCompleted =
    (newPlayerState.missionsCompleted || 0) + 1;

  let isInitialBoost = false;
  // Grant initial speed boost after 3rd mission
  if (
    newPlayerState.missionsCompleted === 3 &&
    !newPlayerState.hasReceivedInitialBoost
  ) {
    console.log("🔍 [claimMission] Granting initial speed boost!");
    newPlayerState.hasReceivedInitialBoost = true;
    const speedBoost: ActiveBoost = {
      type: "speed",
      value: 1 / 15, // 15x speed
      endTime: now + 10 * 60 * 1000, // 10 minutes
      sourceId: "initial_boost",
    };
    console.log(
      "🔍 [claimMission] Created speedBoost:",
      JSON.stringify(speedBoost, null, 2)
    );
    newPlayerState.activeBoosts = [...newPlayerState.activeBoosts, speedBoost];
    console.log(
      "🔍 [claimMission] After adding speedBoost, activeBoosts:",
      JSON.stringify(newPlayerState.activeBoosts, null, 2)
    );
    isInitialBoost = true;
  }

  if (
    activeMission.durationKey === "LONG" &&
    !newPlayerState.completedLongMissionZoneIds.includes(activeMission.zoneId)
  ) {
    const updatedCompletedLongMissions = [
      ...newPlayerState.completedLongMissionZoneIds,
    ];
    updatedCompletedLongMissions.push(activeMission.zoneId);
    newPlayerState.completedLongMissionZoneIds = updatedCompletedLongMissions;
  }

  const zone = ZONES.find((z) => z.id === activeMission.zoneId);
  if (zone && !newPlayerState.completedZoneIds.includes(zone.id)) {
    const zoneItems = new Set(zone.lootTable.map((l) => l.itemId));
    if (zone.exclusiveLoot) {
      zone.exclusiveLoot.forEach((l) => zoneItems.add(l.itemId));
    }

    const allFound = [...zoneItems].every((itemId) =>
      newPlayerState.discoveredItemIds.includes(itemId)
    );
    if (allFound) {
      const updatedCompletedZones = [...newPlayerState.completedZoneIds];
      updatedCompletedZones.push(zone.id);
      newPlayerState.completedZoneIds = updatedCompletedZones;
      newPlayerState = zone.completionBonus.apply(newPlayerState);
    }
  }

  newPlayerState.power = calculatePlayerPower(newPlayerState);

  console.log(
    "🔍 [claimMission] Before checkForBadgeUnlocks, activeBoosts:",
    JSON.stringify(newPlayerState.activeBoosts, null, 2)
  );
  const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
  console.log(
    "🔍 [claimMission] After checkForBadgeUnlocks, activeBoosts:",
    JSON.stringify(badgeCheckResult.newPlayerState.activeBoosts, null, 2)
  );

  console.log(
    "🔍 [claimMission] Final result.newPlayerState.activeBoosts:",
    JSON.stringify(badgeCheckResult.newPlayerState.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [claimMission] Final result.newPlayerState.activeBoosts type:",
    typeof badgeCheckResult.newPlayerState.activeBoosts
  );
  console.log(
    "🔍 [claimMission] Final result.newPlayerState.activeBoosts isArray:",
    Array.isArray(badgeCheckResult.newPlayerState.activeBoosts)
  );

  // Check if activeBoosts got corrupted somewhere in the logic
  if (typeof badgeCheckResult.newPlayerState.activeBoosts === "string") {
    console.log(
      "🔍 [claimMission] ERROR: activeBoosts is a string in the final result!"
    );
    console.log(
      "🔍 [claimMission] String content:",
      badgeCheckResult.newPlayerState.activeBoosts
    );
  }

  return {
    success: true,
    message: "Mission complete!",
    newPlayerState: badgeCheckResult.newPlayerState,
    rewards,
    newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
    isInitialBoost,
  };
};
