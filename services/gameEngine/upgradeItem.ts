
import type { PlayerState, EquipableItem } from '../../types';
import { EquipmentSlot, ItemRarity } from '../../types';
import { ITEMS, FORGE_CONFIG, MAX_UPGRADE_LEVEL, RARITY_COST_MULTIPLIER, FORGE_ATTRIBUTES, BADGES, ENCHANTABLE_ATTRIBUTES } from '../../constants/index';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';
import { clockService } from '../clockService';

export const upgradeItem = (playerState: PlayerState, slot: EquipmentSlot, isSafe: boolean): EngineResult<{ outcome?: 'success' | 'stay' | 'downgrade' }> => {
    const itemId = playerState.equipment[slot];
    if (!itemId) {
        return { success: false, message: "No item equipped in that slot." };
    }
    
    const currentLevel = playerState.equipmentUpgrades[slot] || 0;
    if (currentLevel >= MAX_UPGRADE_LEVEL) {
        return { success: false, message: "Item is already at max level." };
    }

    const upgradeInfo = FORGE_CONFIG.levels[currentLevel];
    const item = ITEMS[itemId];
    const rarityMultiplier = RARITY_COST_MULTIPLIER[item.rarity as ItemRarity] || 1;
    const baseCost = upgradeInfo.gold * rarityMultiplier;

    const cost = isSafe ? baseCost * FORGE_CONFIG.safeUpgradeCostMultiplier : baseCost;
    
    if (playerState.gold < cost) {
        return { success: false, message: "Not enough gold." };
    }

    let newPlayerState = { ...playerState, gold: playerState.gold - cost };
    const newUpgrades = { ...newPlayerState.equipmentUpgrades };
    const newlyUnlockedBadges = [];
    let outcome: 'success' | 'stay' | 'downgrade' = 'stay';
    let message = '';

    const roll = Math.random();

    if (roll < upgradeInfo.success) {
        outcome = 'success';
        newPlayerState.highChanceForgeFails = 0; // Reset counter on success
        const newLevel = currentLevel + 1;
        newUpgrades[slot] = newLevel;
        message = `Upgrade success! (+${newLevel})`;

        // Check for attribute unlock
        const milestone = String(newLevel) as '5' | '10' | '15';
        if ((item as EquipableItem).forgeAttributes?.[milestone]) {
            const attributeId = (item as EquipableItem).forgeAttributes![milestone]!;
            const attribute = FORGE_ATTRIBUTES[attributeId];
            if (attribute) {
                 message += ` Perk Unlocked: ${attribute.name}!`;

                 if (newLevel === 15) {
                     const newPerks = [...newPlayerState.unlockedPermanentPerks];
                     if (!newPerks.includes(attribute.id)) {
                        newPerks.push(attribute.id);
                     }
                     newPlayerState.unlockedPermanentPerks = newPerks;
                 }
            }
        }
    } else {
        if (upgradeInfo.success >= 0.9) {
            newPlayerState.highChanceForgeFails = (newPlayerState.highChanceForgeFails || 0) + 1;
        }

        let savedBySafeguard = false;
        if (!isSafe) {
            let safeguardChance = 0;
            if (newPlayerState.equipmentEnchantments) {
                for (const s in newPlayerState.equipmentEnchantments) {
                    const enchantments = newPlayerState.equipmentEnchantments[s as EquipmentSlot];
                    if (enchantments) {
                        enchantments.forEach(e => {
                            const attr = ENCHANTABLE_ATTRIBUTES[e.attributeId];
                            if (attr && attr.type === 'FORGE_SAFEGUARD_CHANCE') {
                                safeguardChance += attr.tierValues[e.tier - 1];
                            }
                        });
                    }
                }
            }
            if (Math.random() < safeguardChance) {
                savedBySafeguard = true;
            }
        }
        
        if (isSafe || savedBySafeguard || roll < upgradeInfo.success + upgradeInfo.stay) {
            outcome = 'stay';
            message = savedBySafeguard ? `Upgrade failed, but your Safeguard prevented a downgrade!` : `Upgrade failed! (Level unchanged)`;
        } else {
            outcome = 'downgrade';
            newUpgrades[slot] = Math.max(0, currentLevel - 1);
            message = `Upgrade failed! Item downgraded. (+${Math.max(0, currentLevel - 1)})`;
        }

        // Insurance Policy check on ANY failure
        let insuranceChance = 0;
        if (newPlayerState.equipmentEnchantments) {
            for (const s in newPlayerState.equipmentEnchantments) {
                const enchantments = newPlayerState.equipmentEnchantments[s as EquipmentSlot];
                if (enchantments) {
                    enchantments.forEach(e => {
                        const attr = ENCHANTABLE_ATTRIBUTES[e.attributeId];
                        if (attr && attr.type === 'FORGE_GOLD_SAVE_CHANCE') {
                            insuranceChance += attr.tierValues[e.tier - 1];
                        }
                    });
                }
            }
        }
        if (Math.random() < insuranceChance) {
            const refund = Math.floor(cost * 0.5);
            newPlayerState.gold += refund;
            message += ` Your Insurance Policy refunded ${refund.toLocaleString()} Gold!`;
        }
    }
    
    newPlayerState.equipmentUpgrades = newUpgrades;
    newPlayerState.power = calculatePlayerPower(newPlayerState);

    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
    badgeCheckResult.newlyUnlockedBadges.push(...newlyUnlockedBadges);


    return { 
        success: true, 
        message, 
        newPlayerState: badgeCheckResult.newPlayerState, 
        outcome,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges
    };
};