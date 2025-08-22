

import type { PlayerState, FoodItem } from '../../types';
import { ItemType, HomunculusTrait, EquipmentSlot } from '../../types';
import type { EngineResult } from './_internal/types';
import { ITEMS, MAX_TRAIT_LEVEL, BADGES, FOOD_ITEMS, ENCHANTABLE_ATTRIBUTES } from '../../constants/index';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';

export const feedHomunculus = (playerState: PlayerState, homunculusId: number, foodItemId: string): EngineResult<{}> => {
    let newPlayerState = { ...playerState };
    const newlyUnlockedBadges = [];
    const homunculusIndex = newPlayerState.homunculi.findIndex(h => h.id === homunculusId);

    if (homunculusIndex === -1) {
        return { success: false, message: "Homunculus not found." };
    }
    
    const foodItemData = ITEMS[foodItemId] as FoodItem;
    if (!foodItemData || foodItemData.type !== ItemType.Food) {
        return { success: false, message: "Invalid food item." };
    }

    const inventoryItemIndex = newPlayerState.inventory.findIndex(i => i.itemId === foodItemId);
    if (inventoryItemIndex === -1 || newPlayerState.inventory[inventoryItemIndex].quantity < 1) {
        return { success: false, message: "You don't have that food." };
    }
    
    const homunculus = newPlayerState.homunculi[homunculusIndex];
    if (homunculus.isAdult || homunculus.hibernationEndTime === null) {
        return { success: false, message: "This creature can only be fed while hibernating." };
    }

    const currentTraitValue = homunculus.traits[foodItemData.trait] || 0;
    if (currentTraitValue >= MAX_TRAIT_LEVEL) {
        return { success: false, message: "This trait is already maxed out." };
    }
    
    // Consume food
    const newInventory = [...newPlayerState.inventory];
    newInventory[inventoryItemIndex] = { ...newInventory[inventoryItemIndex], quantity: newInventory[inventoryItemIndex].quantity - 1 };
    newPlayerState.inventory = newInventory.filter(i => i.quantity > 0);
    
    // Apply trait
    let feedingMultiplier = 1.0;
    if (playerState.equipmentEnchantments) {
        for (const slot in playerState.equipmentEnchantments) {
            const enchantments = playerState.equipmentEnchantments[slot as EquipmentSlot];
            if (enchantments) {
                enchantments.forEach(enchant => {
                    const attr = ENCHANTABLE_ATTRIBUTES[enchant.attributeId];
                    if (attr && attr.type === 'MULTIPLY_FEEDING_EFFECTIVENESS') {
                        feedingMultiplier *= attr.tierValues[enchant.tier - 1];
                    }
                });
            }
        }
    }

    const updatedHomunculus = { ...homunculus };
    updatedHomunculus.traits = { ...updatedHomunculus.traits }; // Ensure deep copy
    const effectiveValue = foodItemData.value * feedingMultiplier;
    const potentialNewValue = currentTraitValue + effectiveValue;
    updatedHomunculus.traits[foodItemData.trait] = Math.min(potentialNewValue, MAX_TRAIT_LEVEL);
    
    // Badge logic for "Dietician"
    const fedFoodIds = [...(updatedHomunculus.fedFoodIds || [])];
    if (!fedFoodIds.includes(foodItemId)) {
        fedFoodIds.push(foodItemId);
    }
    updatedHomunculus.fedFoodIds = fedFoodIds;

    // Badge logic for "One Trick Pony"
    if (updatedHomunculus.traits[foodItemData.trait] >= MAX_TRAIT_LEVEL && !newPlayerState.unlockedBadgeIds.includes('misc_one_trick_pony')) {
        const otherTraits = Object.entries(updatedHomunculus.traits).filter(([t]) => t !== foodItemData.trait);
        if (otherTraits.every(([, v]) => v <= 1)) {
            newlyUnlockedBadges.push(BADGES['misc_one_trick_pony']);
            const newBadgeIds = [...newPlayerState.unlockedBadgeIds];
            newBadgeIds.push('misc_one_trick_pony');
            newPlayerState.unlockedBadgeIds = newBadgeIds;
        }
    }
    
    const updatedHomunculi = [...newPlayerState.homunculi];
    updatedHomunculi[homunculusIndex] = updatedHomunculus;
    newPlayerState.homunculi = updatedHomunculi;
    
    newPlayerState.power = calculatePlayerPower(newPlayerState);

    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
    badgeCheckResult.newlyUnlockedBadges.push(...newlyUnlockedBadges);
    
    return {
        success: true,
        message: `Fed ${foodItemData.name}.`,
        newPlayerState: badgeCheckResult.newPlayerState,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
    };
};
