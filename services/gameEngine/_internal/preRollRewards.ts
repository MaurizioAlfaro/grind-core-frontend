

import type { PlayerState, MissionDurationKey, Rewards, UpgradeStoreItem, EquipableItem, ForgeAttribute } from '../../../types';
import { ZONES, STORE, ITEMS, FOOD_ITEMS, FORGE_ATTRIBUTES, BADGES, ENCHANTABLE_ATTRIBUTES } from '../../../constants/index';
import { EquipmentSlot, ItemCategory } from '../../../types';
import { calculatePlayerPower } from './calculatePlayerPower';

export const preRollRewards = (playerState: PlayerState, zoneId: string, durationKey: MissionDurationKey): Rewards => {
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return { xp: 0, gold: 0, dollars: 0, items: [] };

    const durationInfo = zone.missionDurations[durationKey];

    const rewards: Rewards = {
        xp: durationInfo.baseXp,
        gold: durationInfo.baseGold,
        dollars: 0,
        items: [],
    };

    // --- Calculate Multipliers ---
    let xpMultiplier = 1;
    let goldMultiplier = 1;
    let lootMultiplier = 1;
    
    // NFT Holder Bonus
    if (playerState.ownsReptilianzNFT) {
        xpMultiplier *= 2;
        goldMultiplier *= 2;
        lootMultiplier *= 1.5;
    }

    // Get attributes from gear and permanent perks
    const activeAttributes: ForgeAttribute[] = [];
    // From permanent perks
    playerState.unlockedPermanentPerks.forEach(perkId => {
        if (FORGE_ATTRIBUTES[perkId]) {
            activeAttributes.push(FORGE_ATTRIBUTES[perkId]);
        }
    });
    // From equipped gear
    for (const slot in playerState.equipment) {
        const key = slot as EquipmentSlot;
        const itemId = playerState.equipment[key];
        if (itemId) {
            const item = ITEMS[itemId] as EquipableItem;
            const upgradeLevel = playerState.equipmentUpgrades[key] || 0;
            if (item.forgeAttributes) {
                (['5', '10', '15'] as const).forEach(milestone => {
                    if (upgradeLevel >= parseInt(milestone, 10)) {
                        const attrId = item.forgeAttributes![milestone];
                        if (attrId && FORGE_ATTRIBUTES[attrId]) {
                            activeAttributes.push(FORGE_ATTRIBUTES[attrId]);
                        }
                    }
                });
            }
        }
    }

    // Apply attribute effects to multipliers
    activeAttributes.forEach(attr => {
        // NOTE: The value for multipliers is the final multiplier (e.g., 1.05 for +5%)
        if (attr.effect.type === 'MULTIPLY_XP') xpMultiplier *= attr.effect.value;
        if (attr.effect.type === 'MULTIPLY_GOLD') goldMultiplier *= attr.effect.value;
        if (attr.effect.type === 'MULTIPLY_LOOT_CHANCE') lootMultiplier *= attr.effect.value;
    });

    // Permanent Upgrades from store
    playerState.purchasedStoreUpgradeIds.forEach(id => {
        const upgrade = (STORE.upgrades.find(u => u.id === id) as UpgradeStoreItem);
        if (!upgrade) return;
        // NOTE: The value for store upgrades is the bonus amount (e.g., 0.02 for +2%)
        if (upgrade.effect.type === 'xp') xpMultiplier += upgrade.effect.value;
        if (upgrade.effect.type === 'gold') goldMultiplier += upgrade.effect.value;
        if (upgrade.effect.type === 'loot') lootMultiplier += upgrade.effect.value;
    });

    // Active Buffs
    playerState.activeBoosts.forEach(buff => {
        // NOTE: The value for buffs is the final multiplier (e.g., 1.25 for +25%)
        if (buff.type === 'xp') xpMultiplier *= buff.value;
        if (buff.type === 'gold') goldMultiplier *= buff.value;
        if (buff.type === 'loot') lootMultiplier *= buff.value;
    });
    
    // Badges
    playerState.unlockedBadgeIds.forEach(badgeId => {
        const badge = BADGES[badgeId];
        if (badge?.bonus) {
            switch (badge.bonus.type) {
                case 'MULTIPLY_XP':
                    xpMultiplier *= badge.bonus.value;
                    break;
                case 'MULTIPLY_GOLD':
                    goldMultiplier *= badge.bonus.value;
                    break;
                case 'MULTIPLY_LOOT_CHANCE':
                    lootMultiplier *= badge.bonus.value;
                    break;
            }
        }
    });

    // Enchantments
    let goldenTouchChance = 0;
    let reptilianPartMultiplier = 1.0;
    if (playerState.equipmentEnchantments) {
        for (const slot in playerState.equipmentEnchantments) {
            const enchantments = playerState.equipmentEnchantments[slot as EquipmentSlot];
            if (enchantments) {
                enchantments.forEach(enchant => {
                    const attr = ENCHANTABLE_ATTRIBUTES[enchant.attributeId];
                    if (attr) {
                        const value = attr.tierValues[enchant.tier - 1];
                        if (attr.type === 'MULTIPLY_XP') xpMultiplier *= value;
                        if (attr.type === 'MULTIPLY_GOLD') goldMultiplier *= value;
                        if (attr.type === 'MULTIPLY_LOOT_CHANCE') lootMultiplier *= value;
                        if (attr.type === 'GOLDEN_TOUCH_CHANCE') goldenTouchChance += value;
                        if (attr.type === 'MULTIPLY_REPTILIAN_PART_CHANCE') reptilianPartMultiplier *= value;
                    }
                });
            }
        }
    }

    rewards.xp *= xpMultiplier;
    rewards.gold *= goldMultiplier;

    // Apply Golden Touch
    if (Math.random() < goldenTouchChance) {
        rewards.gold *= 100;
    }

    rewards.xp = Math.round(rewards.xp);
    rewards.gold = Math.round(rewards.gold);

    let missionLengthMultiplier = 1;
    if (durationKey === 'MEDIUM') {
        missionLengthMultiplier = 3;
    } else if (durationKey === 'LONG') {
        missionLengthMultiplier = 10;
    }

    const foundItemIds = new Set<string>();

    // Roll for standard loot
    zone.lootTable.forEach(loot => {
        let currentChance = loot.chance;
        const itemData = ITEMS[loot.itemId];
        
        // Apply reptilian multiplier first if applicable
        if (itemData && itemData.category === ItemCategory.Reptilian) {
            currentChance *= reptilianPartMultiplier;
        }
    
        const finalChance = Math.min(currentChance * missionLengthMultiplier * lootMultiplier, 1);
        if (Math.random() < finalChance) {
            foundItemIds.add(loot.itemId);
        }
    });

    // Roll for food items (general pool)
    Object.values(FOOD_ITEMS).forEach(food => {
      const foodChance = 0.005; // 0.5% base chance per food item
      const finalChance = Math.min(foodChance * missionLengthMultiplier * lootMultiplier, 1);
      if (Math.random() < finalChance) {
        foundItemIds.add(food.id);
      }
    });
    
    // Roll for exclusive loot (multipliers do not apply)
    if (zone.exclusiveLoot) {
        zone.exclusiveLoot.forEach(loot => {
            if (loot.duration === durationKey && Math.random() < 0.1) { // 10% chance for exclusive
                foundItemIds.add(loot.itemId);
            }
        });
    }

    const finalItemIds = Array.from(foundItemIds);

    rewards.items = finalItemIds.map(itemId => ({
        itemId,
        quantity: 1,
    }));

    return rewards;
};