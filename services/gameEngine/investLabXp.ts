
import type { PlayerState } from '../../types';
import { EquipmentSlot } from '../../types';
import { LAB_XP_REQUIREMENTS, MAX_LAB_LEVEL, ENCHANTABLE_ATTRIBUTES } from '../../constants/index';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';

export const investLabXp = (playerState: PlayerState, amount: number): EngineResult<{}> => {
    if (amount <= 0) {
        return { success: false, message: "Invalid amount." };
    }
    if (playerState.xp < amount) {
        return { success: false, message: "Not enough XP." };
    }
    if (playerState.labLevel >= MAX_LAB_LEVEL) {
        return { success: false, message: "Lab is already at max level." };
    }

    let newPlayerState = { ...playerState };

    let labXpMultiplier = 1.0;
    if (playerState.equipmentEnchantments) {
        for (const slot in playerState.equipmentEnchantments) {
            const enchantments = playerState.equipmentEnchantments[slot as EquipmentSlot];
            if (enchantments) {
                enchantments.forEach(enchant => {
                    const attr = ENCHANTABLE_ATTRIBUTES[enchant.attributeId];
                    if (attr && attr.type === 'MULTIPLY_LAB_XP') {
                        labXpMultiplier *= attr.tierValues[enchant.tier - 1];
                    }
                });
            }
        }
    }

    const effectiveAmount = Math.floor(amount * labXpMultiplier);
    newPlayerState.xp -= amount;
    newPlayerState.labXp += effectiveAmount;

    let leveledUp = false;
    while (newPlayerState.labLevel < MAX_LAB_LEVEL && newPlayerState.labXp >= LAB_XP_REQUIREMENTS[newPlayerState.labLevel]) {
        newPlayerState.labXp -= LAB_XP_REQUIREMENTS[newPlayerState.labLevel];
        newPlayerState.labLevel++;
        leveledUp = true;
    }
    
    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

    const bonus = effectiveAmount - amount;
    const message = leveledUp 
        ? `Lab leveled up to ${newPlayerState.labLevel}!` 
        : `${amount.toLocaleString()} XP invested${bonus > 0 ? ` (+${bonus.toLocaleString()} bonus)` : ''} in the lab.`;

    return {
        success: true,
        message,
        newPlayerState: badgeCheckResult.newPlayerState,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges
    };
};
