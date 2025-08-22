import type { PlayerState, ConsumableItem, ActiveBoost } from "../../types";
import { ItemType } from "../../types";
import { ITEMS } from "../../constants/index";
import { clockService } from "../../services/clockService";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";
import { checkForBadgeUnlocks } from "./_internal/checkForBadgeUnlocks";
import type { EngineResult } from "./_internal/types";

export const useConsumableItem = (
  playerState: PlayerState,
  itemId: string
): EngineResult<{}> => {
  let newPlayerState = { ...playerState };

  const itemData = ITEMS[itemId] as ConsumableItem;
  if (!itemData || itemData.type !== ItemType.Consumable) {
    return { success: false, message: "Invalid item." };
  }

  const inventoryItemIndex = newPlayerState.inventory.findIndex(
    (i) => i.itemId === itemId
  );
  if (
    inventoryItemIndex === -1 ||
    newPlayerState.inventory[inventoryItemIndex].quantity < 1
  ) {
    return { success: false, message: "You don't have that item." };
  }

  // Check for buff effects
  if (itemData.buffEffect) {
    if (newPlayerState.activeBoosts.length >= 5) {
      return {
        success: false,
        message: "Maximum number of active buffs reached (5).",
      };
    }

    const newBoost: ActiveBoost = {
      type: itemData.buffEffect.type,
      value: itemData.buffEffect.value,
      endTime:
        clockService.getCurrentTime() +
        itemData.buffEffect.durationSeconds * 1000,
      sourceId: itemId, // Use item ID as the source
    };
    newPlayerState.activeBoosts = [...newPlayerState.activeBoosts, newBoost];
  }

  // Consume item
  const newInventory = [...newPlayerState.inventory];
  newInventory[inventoryItemIndex] = {
    ...newInventory[inventoryItemIndex],
    quantity: newInventory[inventoryItemIndex].quantity - 1,
  };
  newPlayerState.inventory = newInventory.filter((i) => i.quantity > 0);

  // Recalculate power if it was a power buff
  if (itemData.buffEffect?.type === "power") {
    newPlayerState = {
      ...newPlayerState,
      power: calculatePlayerPower(newPlayerState),
    };
  }

  const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

  return {
    success: true,
    message: `${itemData.name} used!`,
    newPlayerState: badgeCheckResult.newPlayerState,
    newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
  };
};
