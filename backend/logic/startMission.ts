import type {
  PlayerState,
  MissionDurationKey,
  ActiveMission,
  Rewards,
} from "../../types";
import { EquipmentSlot } from "../../types";
import { ZONES, ENCHANTABLE_ATTRIBUTES } from "../../constants/index";
import { clockService } from "../../services/clockService";
import { preRollRewards } from "./_internal/preRollRewards";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";

export const startMission = (
  playerState: PlayerState,
  zoneId: string,
  durationKey: MissionDurationKey,
  isDevMode: boolean
): { success: boolean; message: string; activeMission?: ActiveMission } => {
  console.log(
    "🔍 [startMission] Input playerState.activeBoosts:",
    JSON.stringify(playerState.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [startMission] Input playerState.activeBoosts type:",
    typeof playerState.activeBoosts
  );
  console.log(
    "🔍 [startMission] Input playerState.activeBoosts isArray:",
    Array.isArray(playerState.activeBoosts)
  );

  const zone = ZONES.find((z) => z.id === zoneId);
  if (!zone) {
    return { success: false, message: "Zone not found." };
  }

  // Use a simplified power calculation for the initial check, as contextual power might be confusing for the first time.
  const contextualPower = calculatePlayerPower(playerState, {
    zoneId,
    durationKey,
  });
  if (contextualPower < zone.requiredPower) {
    return {
      success: false,
      message: `Not enough power. Required: ${
        zone.requiredPower
      }. You have ${Math.round(playerState.power)}.`,
    };
  }

  const now = clockService.getCurrentTime();
  let durationSeconds = zone.missionDurations[durationKey].seconds;

  // Apply speed buffs
  let speedMultiplier = 1;
  playerState.activeBoosts.forEach((b) => {
    if (b.boostType === "speed") speedMultiplier *= b.value;
  });

  console.log(
    "🔍 [startMission] Calculated speedMultiplier from activeBoosts:",
    speedMultiplier
  );

  // Apply mission speed from enchantments
  if (playerState.equipmentEnchantments) {
    for (const slot in playerState.equipmentEnchantments) {
      const enchantments =
        playerState.equipmentEnchantments[slot as EquipmentSlot];
      if (enchantments) {
        enchantments.forEach((enchant) => {
          const attr = ENCHANTABLE_ATTRIBUTES[enchant.attributeId];
          if (attr && attr.type === "MULTIPLY_MISSION_SPEED") {
            speedMultiplier *= attr.tierValues[enchant.tier - 1];
          }
        });
      }
    }
  }

  // Speed buffs in this game are a multiplier on time, e.g., 0.9 for 10% faster
  durationSeconds *= speedMultiplier;

  if (isDevMode) {
    durationSeconds = 1;
  }

  const endTime = now + durationSeconds * 1000;

  let rewards: Rewards;

  // --- TUTORIAL OVERRIDE ---
  if (!playerState.tutorialCompleted) {
    if ((playerState.missionsCompleted || 0) === 0) {
      rewards = {
        xp: zone.missionDurations[durationKey].baseXp,
        gold: zone.missionDurations[durationKey].baseGold,
        dollars: 0,
        items: [{ itemId: "cafeteria_spork", quantity: 1 }],
      };
    } else if ((playerState.missionsCompleted || 0) === 1) {
      rewards = {
        xp: zone.missionDurations[durationKey].baseXp,
        gold: zone.missionDurations[durationKey].baseGold,
        dollars: 0,
        items: [], // NO ITEMS
      };
    } else {
      rewards = preRollRewards(playerState, zoneId, durationKey);
    }
  } else {
    rewards = preRollRewards(playerState, zoneId, durationKey);
  }
  // --- END TUTORIAL OVERRIDE ---

  const activeMission: ActiveMission = {
    zoneId,
    startTime: now,
    endTime,
    durationKey,
    preRolledRewards: rewards,
  };

  return { success: true, message: "Mission started!", activeMission };
};
