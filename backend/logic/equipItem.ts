import type { PlayerState } from "../../types";
import { ItemType, EquipmentSlot } from "../../types";
import { ITEMS, BADGES } from "../../constants/index";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";
import type { EngineResult } from "./_internal/types";

export const equipItem = (
  playerState: PlayerState,
  itemId: string
): EngineResult<{}> => {
  const item = ITEMS[itemId];
  if (!item || item.type !== ItemType.Equipable)
    return {
      success: false,
      message: "Invalid item.",
      newPlayerState: playerState,
    };

  let newPlayerState = { ...playerState };
  const newlyUnlockedBadges = [];

  const newEquipment = { ...newPlayerState.equipment };
  // Ensure equipmentUpgrades is a plain object, not a Map
  const newEquipmentUpgrades =
    newPlayerState.equipmentUpgrades instanceof Map
      ? Object.fromEntries(newPlayerState.equipmentUpgrades)
      : { ...newPlayerState.equipmentUpgrades };

  // If the item is already equipped in another slot, unequip the old one first
  for (const [slot, equippedId] of Object.entries(newEquipment)) {
    if (equippedId === itemId) {
      delete newEquipment[slot as EquipmentSlot];
      // Note: We don't delete upgrades anymore since they're item-based
    }
  }

  newEquipment[item.slot] = itemId;

  // Note: Upgrade levels are now stored per item, not per slot
  // So we don't need to reset anything here

  // Badge logic for "Pacifist"
  if (item.slot === EquipmentSlot.Weapon) {
    newPlayerState.hasEquippedWeapon = true;
  }

  // Badge logic for "What Does This Button Do?"
  if (
    itemId === "the_big_red_button" &&
    !newPlayerState.unlockedBadgeIds.includes("misc_what_does_this_do")
  ) {
    newlyUnlockedBadges.push(BADGES["misc_what_does_this_do"]);
    const newBadgeIds = [...newPlayerState.unlockedBadgeIds];
    newBadgeIds.push("misc_what_does_this_do");
    newPlayerState.unlockedBadgeIds = newBadgeIds;
  }

  newPlayerState.equipment = newEquipment;
  newPlayerState.equipmentUpgrades = newEquipmentUpgrades;
  newPlayerState.power = calculatePlayerPower(newPlayerState);

  return {
    success: true,
    message: "Item equipped.",
    newPlayerState,
    newlyUnlockedBadges,
  };
};
