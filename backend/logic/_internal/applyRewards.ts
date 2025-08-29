import type {
  PlayerState,
  Rewards,
  InventoryItem,
  StackableItem,
} from "../../../types";
import { ItemType } from "../../../types";
import { ITEMS, LEVEL_XP_REQUIREMENTS } from "../../../constants/index";
import { calculatePlayerPower } from "./calculatePlayerPower";

type ApplyRewardsOptions = {
  itemOverrides?: { [itemId: string]: { powerBonus?: number } };
};

export const applyRewards = (
  playerState: PlayerState,
  rewards: Rewards,
  options: ApplyRewardsOptions = {}
): PlayerState => {
  let newState = { ...playerState };

  // 🎭 REPTILIANZ NFT BONUSES are already applied in backend preroll
  // No need to apply bonus again here - rewards already include the bonus
  newState.xp += rewards.xp;
  newState.gold += rewards.gold;
  newState.dollars = (newState.dollars || 0) + (rewards.dollars || 0);

  const newInventory = [...newState.inventory];
  const newDiscoveredItems = [...newState.discoveredItemIds];

  rewards.items.forEach((rewardItem) => {
    const itemData = ITEMS[rewardItem.itemId];

    if (!itemData) {
      return;
    }
    if (!newDiscoveredItems.includes(rewardItem.itemId)) {
      newDiscoveredItems.push(rewardItem.itemId);
    }

    const existingItem = newInventory.find(
      (invItem) => invItem.itemId === rewardItem.itemId
    );
    if (existingItem) {
      existingItem.quantity += rewardItem.quantity;
    } else {
      newInventory.push({ ...rewardItem });
    }
  });
  newState.inventory = newInventory;
  newState.discoveredItemIds = newDiscoveredItems;

  // Handle stackable & consumable items immediately
  newState.inventory = newState.inventory.filter((invItem) => {
    const baseItem = ITEMS[invItem.itemId];

    if (!baseItem) {
      return true; // Keep items that don't exist in ITEMS constant
    }

    const override = options.itemOverrides?.[invItem.itemId];
    const item = override ? { ...baseItem, ...override } : baseItem;

    if (item.type === ItemType.Stackable) {
      const stackableItem = item as StackableItem;
      // Consume stackables that provide a power bonus
      if (stackableItem.powerBonus > 0) {
        newState.permanentPowerBonus +=
          stackableItem.powerBonus * invItem.quantity;
        return false; // Remove from inventory after consuming
      }
      // Consume stackables that provide a power multiplier
      if (stackableItem.powerMultiplier && stackableItem.powerMultiplier > 1) {
        newState.powerMultiplier =
          (newState.powerMultiplier || 1.0) *
          Math.pow(stackableItem.powerMultiplier, invItem.quantity);
        return false; // Remove from inventory after consuming
      }
    }
    if (item.type === ItemType.Consumable) {
      // MVP: Hardcoded effects
      if (item.id === "small_xp_potion") newState.xp += 100 * invItem.quantity;
      if (item.id === "small_gold_pouch")
        newState.gold += 100 * invItem.quantity;
      return false; // Remove from inventory
    }
    return true;
  });

  // Check for level ups
  while (newState.xp >= (LEVEL_XP_REQUIREMENTS[newState.level] || Infinity)) {
    newState.xp -= LEVEL_XP_REQUIREMENTS[newState.level];
    newState.level++;
  }

  newState.power = calculatePlayerPower(newState);

  return newState;
};
