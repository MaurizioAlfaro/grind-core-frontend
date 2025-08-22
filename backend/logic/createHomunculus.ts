import type {
  PlayerState,
  SlottedParts,
  Homunculus,
  HomunculusTraits,
} from "../../types";
import {
  ITEMS,
  LAB_LEVEL_PERKS,
  LAB_EQUIPMENT,
  CORE_COMPONENT_ID,
} from "../../constants/index";
import { ItemRarity, HomunculusTrait } from "../../types";
import { checkForBadgeUnlocks } from "./_internal/checkForBadgeUnlocks";
import type { EngineResult } from "./_internal/types";
import { clockService } from "../../services/clockService";
import { calculatePlayerPower } from "./_internal/calculatePlayerPower";

const RarityValue: { [key in ItemRarity]: number } = {
  [ItemRarity.Common]: 1,
  [ItemRarity.Rare]: 2,
  [ItemRarity.Epic]: 3,
  [ItemRarity.Legendary]: 4,
};
const ValueToRarity: { [key: number]: ItemRarity } = {
  1: ItemRarity.Common,
  2: ItemRarity.Rare,
  3: ItemRarity.Epic,
  4: ItemRarity.Legendary,
};

export const createHomunculus = (
  playerState: PlayerState,
  slottedParts: SlottedParts
): EngineResult<{}> => {
  // Validate the recipe
  if (slottedParts.core !== CORE_COMPONENT_ID) {
    return {
      success: false,
      message: "A Shapeshifter's Gene must be the core component.",
    };
  }
  if (!slottedParts.material1 || !slottedParts.material2) {
    return { success: false, message: "Two material components are required." };
  }
  if (slottedParts.material1 === slottedParts.material2) {
    return { success: false, message: "Material components must be unique." };
  }

  const requiredParts = [
    slottedParts.core,
    slottedParts.material1,
    slottedParts.material2,
  ];

  // Check if player has all required parts
  const inventoryMap = new Map(
    playerState.inventory.map((i) => [i.itemId, i.quantity])
  );
  for (const partId of requiredParts) {
    if (!inventoryMap.has(partId) || inventoryMap.get(partId)! < 1) {
      const partName = ITEMS[partId]?.name || "a required part";
      return { success: false, message: `Missing component: ${partName}.` };
    }
  }

  let newPlayerState = { ...playerState };
  const newInventory = [...newPlayerState.inventory];

  // Determine save chance
  const levelPerks = LAB_LEVEL_PERKS[newPlayerState.labLevel];
  let baseSaveChance = levelPerks.saveChance;

  if (newPlayerState.purchasedLabEquipmentIds.includes("catalytic_converter")) {
    baseSaveChance += 0.05;
  }

  const legendarySaveBonus = newPlayerState.purchasedLabEquipmentIds.includes(
    "probability_stabilizer"
  )
    ? 0.05
    : 0;

  // Consume parts
  requiredParts.forEach((partId) => {
    const itemData = ITEMS[partId];
    let finalSaveChance = baseSaveChance;
    if (itemData.rarity === ItemRarity.Legendary) {
      finalSaveChance += legendarySaveBonus;
    }

    if (Math.random() >= finalSaveChance) {
      const invItem = newInventory.find((i) => i.itemId === partId)!;
      invItem.quantity -= 1;
    }
  });

  newPlayerState.inventory = newInventory.filter((i) => i.quantity > 0);
  newPlayerState.homunculusCreatedCount =
    (newPlayerState.homunculusCreatedCount || 0) + 1;

  // Calculate rarity
  const mat1Rarity = RarityValue[ITEMS[slottedParts.material1].rarity];
  const mat2Rarity = RarityValue[ITEMS[slottedParts.material2].rarity];
  const avgRarityValue = Math.round((mat1Rarity + mat2Rarity) / 2);
  const newRarity = ValueToRarity[avgRarityValue] || ItemRarity.Common;

  const initialTraits = Object.values(HomunculusTrait).reduce((acc, trait) => {
    acc[trait] = 0;
    return acc;
  }, {} as HomunculusTraits);

  // Create new homunculus
  const newHomunculus: Homunculus = {
    id: clockService.getCurrentTime(),
    rarity: newRarity,
    isAdult: false,
    hibernationEndTime: null,
    traits: initialTraits,
    work: null,
    equipment: {},
  };

  newPlayerState.homunculi = [...newPlayerState.homunculi, newHomunculus];

  newPlayerState.power = calculatePlayerPower(newPlayerState);
  const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

  return {
    success: true,
    message: `Synthesis complete! A ${newRarity} Homunculus was born!`,
    newPlayerState: badgeCheckResult.newPlayerState,
    newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
  };
};
