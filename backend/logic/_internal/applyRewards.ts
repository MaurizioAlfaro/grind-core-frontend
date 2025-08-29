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
  console.log("🔍 [applyRewards] ITEMS constant loaded:", !!ITEMS);
  console.log("🔍 [applyRewards] ITEMS constant type:", typeof ITEMS);
  console.log(
    "🔍 [applyRewards] ITEMS constant keys count:",
    Object.keys(ITEMS).length
  );
  console.log(
    "🔍 [applyRewards] ITEMS constant first few keys:",
    Object.keys(ITEMS).slice(0, 10)
  );

  console.log(
    "🔍 [applyRewards] Input rewards object:",
    JSON.stringify(rewards, null, 2)
  );
  console.log(
    "🔍 [applyRewards] Input rewards.items:",
    JSON.stringify(rewards.items, null, 2)
  );
  console.log(
    "🔍 [applyRewards] Input rewards.items type:",
    typeof rewards.items
  );
  console.log(
    "🔍 [applyRewards] Input rewards.items isArray:",
    Array.isArray(rewards.items)
  );

  console.log(
    "🔍 [applyRewards] Input playerState.activeBoosts:",
    JSON.stringify(playerState.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [applyRewards] Input playerState.activeBoosts type:",
    typeof playerState.activeBoosts
  );
  console.log(
    "🔍 [applyRewards] Input playerState.activeBoosts isArray:",
    Array.isArray(playerState.activeBoosts)
  );

  let newState = { ...playerState };

  // 🎭 REPTILIANZ NFT BONUSES are already applied in backend preroll
  // No need to apply bonus again here - rewards already include the bonus
  newState.xp += rewards.xp;
  newState.gold += rewards.gold;
  newState.dollars = (newState.dollars || 0) + (rewards.dollars || 0);

  const newInventory = [...newState.inventory];
  const newDiscoveredItems = [...newState.discoveredItemIds];

  rewards.items.forEach((rewardItem) => {
    console.log("🔍 [applyRewards] Processing rewardItem:", rewardItem);
    console.log("🔍 [applyRewards] rewardItem.itemId:", rewardItem.itemId);
    console.log(
      "🔍 [applyRewards] rewardItem.itemId type:",
      typeof rewardItem.itemId
    );
    console.log("🔍 [applyRewards] ITEMS constant loaded:", !!ITEMS);
    console.log("🔍 [applyRewards] ITEMS constant type:", typeof ITEMS);
    console.log(
      "🔍 [applyRewards] ITEMS constant keys count:",
      Object.keys(ITEMS).length
    );
    console.log(
      "🔍 [applyRewards] ITEMS constant first few keys:",
      Object.keys(ITEMS).slice(0, 10)
    );
    console.log(
      "🔍 [applyRewards] ITEMS has cafeteria_spork:",
      "cafeteria_spork" in ITEMS
    );
    console.log(
      "🔍 [applyRewards] ITEMS['cafeteria_spork']:",
      ITEMS["cafeteria_spork"]
    );

    const itemData = ITEMS[rewardItem.itemId];
    console.log(
      "🔍 [applyRewards] itemData for",
      rewardItem.itemId,
      ":",
      itemData
    );
    if (!itemData) {
      console.log(
        "🔍 [applyRewards] WARNING: itemData is undefined for itemId:",
        rewardItem.itemId
      );
      console.log(
        "🔍 [applyRewards] This itemId is not found in ITEMS constant"
      );
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
    console.log("🔍 [applyRewards] Filtering inventory item:", invItem);
    const baseItem = ITEMS[invItem.itemId];
    console.log(
      "🔍 [applyRewards] baseItem for",
      invItem.itemId,
      ":",
      baseItem
    );

    if (!baseItem) {
      console.log(
        "🔍 [applyRewards] WARNING: baseItem is undefined for inventory item:",
        invItem.itemId
      );
      console.log(
        "🔍 [applyRewards] This inventory item is not found in ITEMS constant, keeping it in inventory"
      );
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

  console.log(
    "🔍 [applyRewards] Output newState.activeBoosts:",
    JSON.stringify(newState.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [applyRewards] Output newState.activeBoosts type:",
    typeof newState.activeBoosts
  );
  console.log(
    "🔍 [applyRewards] Output newState.activeBoosts isArray:",
    Array.isArray(newState.activeBoosts)
  );

  return newState;
};
