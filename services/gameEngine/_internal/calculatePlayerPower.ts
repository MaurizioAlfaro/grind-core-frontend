
import type { PlayerState, EquipableItem, HomunculusClothingItem, ForgeAttribute, MissionDurationKey } from '../../../types';
import { EquipmentSlot, ItemType } from '../../../types';
import { ITEMS, POWER_PER_LEVEL, FORGE_CONFIG, FORGE_ATTRIBUTES, POWER_PER_TRAIT_POINT, HOMUNCULUS_RARITY_POWER_MULTIPLIER, BADGES, ENCHANTABLE_ATTRIBUTES } from '../../../constants/index';

export const calculatePlayerPower = (playerState: PlayerState, context: { zoneId?: string; durationKey?: MissionDurationKey; bossId?: string; } = {}): number => {
    let basePowerFromEquipment = 0;
    const activeEquipAttributes: ForgeAttribute[] = [];
    
    // 1. Calculate base equipment power
    for (const slot in playerState.equipment) {
        const key = slot as EquipmentSlot;
        const itemId = playerState.equipment[key];
        if (itemId) {
            const item = ITEMS[itemId] as EquipableItem;
            if (item?.type === ItemType.Equipable) {
                const upgradeLevel = playerState.equipmentUpgrades[key] || 0;
                const baseItemPower = item.power;
                const bonusFromUpgrades = baseItemPower * upgradeLevel * FORGE_CONFIG.powerBonusPerLevel;
                basePowerFromEquipment += (baseItemPower + bonusFromUpgrades);

                if (item.forgeAttributes) {
                    (['5', '10', '15'] as const).forEach(milestone => {
                        if (upgradeLevel >= parseInt(milestone, 10)) {
                            const attrId = item.forgeAttributes![milestone];
                            if (attrId && FORGE_ATTRIBUTES[attrId]) {
                                activeEquipAttributes.push(FORGE_ATTRIBUTES[attrId]);
                            }
                        }
                    });
                }
            }
        }
    }

    // 2. Collect enchantment effects
    let flatPowerFromEnchants = 0;
    let equipmentPowerMultiplier = 1.0;
    let powerPerLevelBonus = 0;
    let bossPowerMultiplier = 1.0;
    let nemesisPowerMultiplier = 1.0;

    if (playerState.equipmentEnchantments) {
        for (const slot in playerState.equipmentEnchantments) {
            const enchantments = playerState.equipmentEnchantments[slot as EquipmentSlot];
            if (!enchantments) continue;

            for (const enchant of enchantments) {
                const attr = ENCHANTABLE_ATTRIBUTES[enchant.attributeId];
                if (!attr) continue;
                const value = attr.tierValues[enchant.tier - 1];

                switch (attr.type) {
                    case 'ADD_POWER': flatPowerFromEnchants += value; break;
                    case 'MULTIPLY_EQUIPMENT_POWER': equipmentPowerMultiplier *= value; break;
                    case 'ADD_POWER_PER_LEVEL': powerPerLevelBonus += value; break;
                    case 'POWER_VS_BOSS': if (context.bossId) bossPowerMultiplier *= value; break;
                    case 'NEMESIS_PROTOCOL':
                        if (context.bossId) {
                            const defeatCount = playerState.bossDefeatCounts?.[context.bossId] || 0;
                            nemesisPowerMultiplier *= (1 + (defeatCount * value));
                        }
                        break;
                }
            }
        }
    }

    // 3. Apply specific multipliers
    basePowerFromEquipment *= equipmentPowerMultiplier;
    const powerFromLevel = playerState.level * (POWER_PER_LEVEL + powerPerLevelBonus);

    // 4. Calculate other flat power sources
    const temporaryPower = playerState.activeBoosts.filter(b => b.type === 'power').reduce((sum, b) => sum + b.value, 0);
    
    let powerFromHomunculi = 0;
    if (playerState.homunculi) {
        playerState.homunculi.forEach(h => {
            if (h.isAdult) {
                const totalTraits = Object.values(h.traits).reduce((sum, val) => sum + val, 0);
                const rarityMultiplier = HOMUNCULUS_RARITY_POWER_MULTIPLIER[h.rarity];
                powerFromHomunculi += totalTraits * POWER_PER_TRAIT_POINT * rarityMultiplier;
            }
            if (h.equipment) {
                 for (const slot in h.equipment) {
                    const itemId = h.equipment[slot as keyof typeof h.equipment];
                    if (itemId) {
                        const item = ITEMS[itemId] as HomunculusClothingItem;
                        if (item?.type === ItemType.HomunculusClothing) {
                            powerFromHomunculi += item.powerBonus;
                        }
                    }
                }
            }
        });
    }
    
    // 5. Get permanent perks & badge bonuses
    const permanentPerks = Array.from(playerState.unlockedPermanentPerks).map(id => FORGE_ATTRIBUTES[id]).filter(Boolean);
    const permanentPowerFromPerks = permanentPerks.reduce((sum, perk) => perk.effect.type === 'ADD_PERMANENT_POWER' ? sum + perk.effect.value : sum, 0);
    
    let permanentPowerFromBadges = 0;
    let powerMultiplierFromBadges = 1.0;
    playerState.unlockedBadgeIds.forEach(badgeId => {
        const badge = BADGES[badgeId];
        if (badge?.bonus) {
            if (badge.bonus.type === 'ADD_PERMANENT_POWER') permanentPowerFromBadges += badge.bonus.value;
            else if (badge.bonus.type === 'MULTIPLY_POWER') powerMultiplierFromBadges *= badge.bonus.value;
        }
    });

    // 6. Sum up all base power sources
    let totalPower = basePowerFromEquipment 
        + powerFromLevel 
        + playerState.permanentPowerBonus
        + temporaryPower 
        + powerFromHomunculi
        + permanentPowerFromPerks
        + permanentPowerFromBadges
        + flatPowerFromEnchants;

    // 7. Apply power bonuses from equipped (non-permanent) attributes
    activeEquipAttributes.forEach(attr => {
        if (attr.effect.type === 'ADD_POWER') {
            totalPower += attr.effect.value;
        }
    });
    
    // 8. Apply global and contextual power multipliers
    totalPower *= powerMultiplierFromBadges;
    totalPower *= (playerState.powerMultiplier || 1.0);
    if (context.bossId) {
        totalPower *= bossPowerMultiplier;
        totalPower *= nemesisPowerMultiplier;
    }

    return Math.round(totalPower);
};