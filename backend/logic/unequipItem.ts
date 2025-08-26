import type { PlayerState } from "../../types";
import { EquipmentSlot } from "../../types";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";

export const unequipItem = (
  playerState: PlayerState,
  slot: EquipmentSlot
): PlayerState => {
  const itemId = playerState.equipment[slot];
  if (!itemId) return playerState;

  const newEquipment = { ...playerState.equipment };
  delete newEquipment[slot];

  // Note: We don't delete upgrades anymore since they're item-based
  // Upgrades stay with the item even when unequipped

  // Ensure equipmentUpgrades is a plain object, not a Map
  const newEquipmentUpgrades =
    playerState.equipmentUpgrades instanceof Map
      ? Object.fromEntries(playerState.equipmentUpgrades)
      : { ...playerState.equipmentUpgrades };

  const newState = {
    ...playerState,
    equipment: newEquipment,
    equipmentUpgrades: newEquipmentUpgrades,
  };
  newState.power = calculatePlayerPower(newState);
  return newState;
};
