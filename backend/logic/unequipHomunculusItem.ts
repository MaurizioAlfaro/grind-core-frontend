import type { PlayerState } from "../../types";
import type { HomunculusEquipmentSlot } from "../../types";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";
import type { EngineResult } from "./_internal/types";

export const unequipHomunculusItem = (
  playerState: PlayerState,
  homunculusId: number,
  slot: HomunculusEquipmentSlot
): EngineResult<{}> => {
  let newPlayerState = { ...playerState };
  const homunculusIndex = newPlayerState.homunculi.findIndex(
    (h) => h.id === homunculusId
  );
  if (homunculusIndex === -1) {
    return { success: false, message: "Homunculus not found." };
  }

  const homunculus = { ...newPlayerState.homunculi[homunculusIndex] };
  homunculus.equipment = { ...(homunculus.equipment || {}) };

  const itemIdToUnequip = homunculus.equipment[slot];
  if (!itemIdToUnequip) {
    return { success: false, message: "No item in that slot." };
  }

  // Remove from homunculus
  delete homunculus.equipment[slot];

  // Add back to inventory
  let newInventory = [...newPlayerState.inventory];
  const existingInvItem = newInventory.find(
    (i) => i.itemId === itemIdToUnequip
  );
  if (existingInvItem) {
    existingInvItem.quantity += 1;
  } else {
    newInventory.push({ itemId: itemIdToUnequip, quantity: 1 });
  }

  // Update state
  const updatedHomunculi = [...newPlayerState.homunculi];
  updatedHomunculi[homunculusIndex] = homunculus;
  newPlayerState.homunculi = updatedHomunculi;
  newPlayerState.inventory = newInventory;

  newPlayerState = {
    ...newPlayerState,
    power: calculatePlayerPower(newPlayerState),
  };

  return { success: true, message: "Item unequipped.", newPlayerState };
};
