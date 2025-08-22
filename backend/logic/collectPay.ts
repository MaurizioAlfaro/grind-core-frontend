import type { PlayerState, HomunculusClothingItem } from "../../types";
import {
  ZONES,
  ITEMS,
  BADGES,
  ENCHANTABLE_ATTRIBUTES,
} from "../../constants/index";
import type { EngineResult } from "./_internal/types";
import { clockService } from "../../services/clockService";
import { ItemType, EquipmentSlot } from "../../types";
import { checkForBadgeUnlocks } from "./_internal/checkForBadgeUnlocks";

export const collectPay = (
  playerState: PlayerState,
  homunculusId: number
): EngineResult<{}> => {
  let newPlayerState = { ...playerState };
  const newlyUnlockedBadges = [];
  const homunculusIndex = newPlayerState.homunculi.findIndex(
    (h) => h.id === homunculusId
  );

  if (homunculusIndex === -1) {
    return { success: false, message: "Homunculus not found." };
  }

  const homunculus = newPlayerState.homunculi[homunculusIndex];
  if (!homunculus.work) {
    return { success: false, message: "This Reptilianz is not working." };
  }

  const zone = ZONES.find((z) => z.id === homunculus.work!.zoneId);
  if (!zone) {
    // Should not happen, but good to handle
    return { success: false, message: "Workplace data not found." };
  }

  const elapsedMs = clockService.getCurrentTime() - homunculus.work.startTime;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const baseEarnings = elapsedHours * zone.hourlyRate;

  if (baseEarnings <= 0) {
    return {
      success: false,
      message: "Not enough time has passed to collect pay.",
    };
  }

  let wageMultiplier = 1.0;
  if (homunculus.equipment) {
    for (const slot in homunculus.equipment) {
      const itemId =
        homunculus.equipment[slot as keyof typeof homunculus.equipment];
      if (itemId) {
        const item = ITEMS[itemId] as HomunculusClothingItem;
        if (item?.type === ItemType.HomunculusClothing) {
          wageMultiplier += item.wageBonus;
        }
      }
    }
  }

  let enchantmentUsdMultiplier = 1.0;
  if (playerState.equipmentEnchantments) {
    for (const slot in playerState.equipmentEnchantments) {
      const enchantments =
        playerState.equipmentEnchantments[slot as EquipmentSlot];
      if (enchantments) {
        enchantments.forEach((enchant) => {
          const attr = ENCHANTABLE_ATTRIBUTES[enchant.attributeId];
          if (attr && attr.type === "MULTIPLY_USD_EARNINGS") {
            enchantmentUsdMultiplier *= attr.tierValues[enchant.tier - 1];
          }
        });
      }
    }
  }

  const finalEarnings = Math.floor(
    baseEarnings * wageMultiplier * enchantmentUsdMultiplier
  );

  if (finalEarnings <= 0) {
    return {
      success: false,
      message: "Not enough time has passed to collect pay.",
    };
  }

  // Badge logic for "Stonks"
  if (
    finalEarnings > 10000 &&
    !newPlayerState.unlockedBadgeIds.includes("misc_stonks")
  ) {
    newlyUnlockedBadges.push(BADGES["misc_stonks"]);
    const newBadgeIds = [...newPlayerState.unlockedBadgeIds];
    newBadgeIds.push("misc_stonks");
    newPlayerState.unlockedBadgeIds = newBadgeIds;
  }

  newPlayerState.dollars = (newPlayerState.dollars || 0) + finalEarnings;

  const updatedHomunculus = { ...homunculus, work: null };
  const updatedHomunculi = [...newPlayerState.homunculi];
  updatedHomunculi[homunculusIndex] = updatedHomunculus;
  newPlayerState.homunculi = updatedHomunculi;

  const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
  badgeCheckResult.newlyUnlockedBadges.push(...newlyUnlockedBadges);

  const bonusFromGear = wageMultiplier > 1 ? wageMultiplier - 1 : 0;
  const bonusFromEnchants =
    enchantmentUsdMultiplier > 1 ? enchantmentUsdMultiplier - 1 : 0;
  const totalBonus = bonusFromGear + bonusFromEnchants;
  const bonusText =
    totalBonus > 0
      ? ` (incl. ${totalBonus.toLocaleString(undefined, {
          style: "percent",
        })} bonus)`
      : "";

  return {
    success: true,
    message: `Collected $${finalEarnings.toLocaleString()}${bonusText} from your Reptilianz.`,
    newPlayerState: badgeCheckResult.newPlayerState,
    newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
  };
};
