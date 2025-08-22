import type { PlayerState } from '../../types';
import { EquipmentSlot, ItemRarity } from '../../types';
import { ITEMS, ENCHANTMENT_CONFIG, ENCHANTABLE_ATTRIBUTES } from '../../constants/index';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';

const rollForEnchantment = (multiplier: number): { attributeId: string; tier: number } => {
    const odds = ENCHANTMENT_CONFIG.ODDS_BY_MULTIPLIER[multiplier];
    const tierRoll = Math.random();
    let cumulativeChance = 0;
    let tier = 1;
    for (let i = 0; i < odds.length; i++) {
        cumulativeChance += odds[i];
        if (tierRoll < cumulativeChance) {
            tier = i + 1;
            break;
        }
    }

    const possibleAttributes = Object.keys(ENCHANTABLE_ATTRIBUTES);
    const attributeId = possibleAttributes[Math.floor(Math.random() * possibleAttributes.length)];
    
    return { attributeId, tier };
};

const baseEnchantLogic = (playerState: PlayerState, slot: EquipmentSlot, costMultiplier: number): { error?: string; cost?: number; newPlayerState?: PlayerState, itemRarity?: ItemRarity } => {
    const itemId = playerState.equipment[slot];
    if (!itemId) return { error: "No item equipped in that slot." };

    const item = ITEMS[itemId];
    if (item.type !== 'Equipable') return { error: "This item cannot be enchanted." };

    const upgradeLevel = playerState.equipmentUpgrades[slot] || 0;
    const cost = Math.floor(ENCHANTMENT_CONFIG.BASE_XP_COST * Math.pow(ENCHANTMENT_CONFIG.XP_COST_PER_LEVEL_MULTIPLIER, upgradeLevel) * costMultiplier);

    if (playerState.xp < cost) return { error: "Not enough XP." };
    
    const newPlayerState = { ...playerState, xp: playerState.xp - cost };
    return { cost, newPlayerState, itemRarity: item.rarity };
};


export const enchantItem = (playerState: PlayerState, slot: EquipmentSlot, costMultiplier: number): EngineResult<{}> => {
    const logicResult = baseEnchantLogic(playerState, slot, costMultiplier);
    if (logicResult.error || !logicResult.newPlayerState) {
        return { success: false, message: logicResult.error || "An unknown error occurred." };
    }
    let newPlayerState = logicResult.newPlayerState;

    const maxSlots = ENCHANTMENT_CONFIG.SLOTS_BY_RARITY[logicResult.itemRarity!];
    const currentEnchantments = newPlayerState.equipmentEnchantments?.[slot] || [];

    if (currentEnchantments.length >= maxSlots) {
        return { success: false, message: "No empty enchantment slots on this item." };
    }

    const newEnchantment = rollForEnchantment(costMultiplier);
    
    const newEquipmentEnchantments = { ...(newPlayerState.equipmentEnchantments || {}) };
    newEquipmentEnchantments[slot] = [...currentEnchantments, newEnchantment];
    newPlayerState.equipmentEnchantments = newEquipmentEnchantments;

    newPlayerState.power = calculatePlayerPower(newPlayerState);
    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

    const attr = ENCHANTABLE_ATTRIBUTES[newEnchantment.attributeId];
    return {
        success: true,
        message: `Enchanted with ${attr.name} (Tier ${newEnchantment.tier})!`,
        newPlayerState: badgeCheckResult.newPlayerState,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
    };
};

export const rerollEnchantment = (playerState: PlayerState, slot: EquipmentSlot, enchantmentIndex: number, costMultiplier: number): EngineResult<{}> => {
     const logicResult = baseEnchantLogic(playerState, slot, costMultiplier);
    if (logicResult.error || !logicResult.newPlayerState) {
        return { success: false, message: logicResult.error || "An unknown error occurred." };
    }
    let newPlayerState = logicResult.newPlayerState;

    const currentEnchantments = newPlayerState.equipmentEnchantments?.[slot] || [];
    if (enchantmentIndex < 0 || enchantmentIndex >= currentEnchantments.length) {
        return { success: false, message: "Invalid enchantment slot to reroll." };
    }

    const newEnchantment = rollForEnchantment(costMultiplier);
    const newEquipmentEnchantments = { ...(newPlayerState.equipmentEnchantments || {}) };
    const updatedEnchantments = [...currentEnchantments];
    updatedEnchantments[enchantmentIndex] = newEnchantment;
    newEquipmentEnchantments[slot] = updatedEnchantments;
    newPlayerState.equipmentEnchantments = newEquipmentEnchantments;

    newPlayerState.power = calculatePlayerPower(newPlayerState);
    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
    
    const attr = ENCHANTABLE_ATTRIBUTES[newEnchantment.attributeId];
    return {
        success: true,
        message: `Rerolled to ${attr.name} (Tier ${newEnchantment.tier})!`,
        newPlayerState: badgeCheckResult.newPlayerState,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
    };
};
