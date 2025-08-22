

import type { PlayerState, Badge, Rewards, EquipableItem, ForgeAttribute, UpgradeStoreItem } from '../../types';
import { ZONES, BOSSES, ITEMS, BADGES, STORE, FORGE_ATTRIBUTES } from '../../constants/index';
import { EquipmentSlot, ItemRarity } from '../../types';
import { clockService } from '../../services/clockService';
import { applyRewards } from './_internal/applyRewards';
import { calculatePlayerPower } from './_internal/calculatePlayerPower';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';

const BOSS_COOLDOWN_HOURS = 8;

export const calculateBossWinChance = (playerPower: number, bossPower: number): number => {
    if (bossPower <= 0) return 1.0; // Avoid division by zero
    const powerRatio = playerPower / bossPower;
    
    let successChance: number;

    if (powerRatio < 1) {
        // Steeply punishing curve for being underpowered.
        // At 98% power (e.g. 49 vs 50), chance is ~25%.
        successChance = 0.5 * Math.pow(powerRatio, 35);
    } else {
        // Linear scale from 50% at 1x power up to a cap of 90% at 2x power.
        const effectiveRatio = Math.min(powerRatio, 2);
        successChance = 0.5 + 0.4 * (effectiveRatio - 1);
    }

    return Math.min(successChance, 0.90);
};

export const fightBoss = (playerState: PlayerState, bossId: string, isDevMode: boolean = false): EngineResult<{ rewards?: Rewards, outcome: 'win' | 'loss' }> => {
    const boss = Object.values(BOSSES).find(b => b.id === bossId);
    if (!boss) {
        return { success: false, message: 'Boss not found.', outcome: 'loss' };
    }

    let newPlayerState = { ...playerState };
    const newlyUnlockedBadges: Badge[] = [];

    const now = clockService.getCurrentTime();
    const cooldownEndTime = playerState.globalBossCooldownEndTime || 0;

    if (now < cooldownEndTime && !isDevMode) {
        return { success: false, message: 'Boss fights are on a global cooldown.', outcome: 'loss' };
    }

    // --- Calculate success chance with contextual power ---
    const contextualPower = calculatePlayerPower(playerState, { bossId: boss.id, zoneId: boss.zoneId });
    const successChance = calculateBossWinChance(contextualPower, boss.power);
    const didWin = Math.random() < successChance;

    if (!isDevMode) {
        newPlayerState.globalBossCooldownEndTime = now + BOSS_COOLDOWN_HOURS * 60 * 60 * 1000;
    }
    
    // Badge logic for "Not a Bitch"
    if (successChance < 0.05 && !newPlayerState.unlockedBadgeIds.includes('misc_not_a_bitch')) {
        newlyUnlockedBadges.push(BADGES['misc_not_a_bitch']);
        const newBadgeIds = [...newPlayerState.unlockedBadgeIds];
        newBadgeIds.push('misc_not_a_bitch');
        newPlayerState.unlockedBadgeIds = newBadgeIds;
    }
    
    if (!didWin) {
        const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
        badgeCheckResult.newlyUnlockedBadges.push(...newlyUnlockedBadges);
        return { success: true, message: `You were defeated by ${boss.name}!`, newPlayerState: badgeCheckResult.newPlayerState, newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges, outcome: 'loss' };
    }

    // --- VICTORY ---
    // Badge logic for "Frugal Fighter"
    if (!newPlayerState.unlockedBadgeIds.includes('misc_frugal_fighter')) {
        const slots = Object.values(EquipmentSlot);
        const equippedItems = slots.map(slot => playerState.equipment[slot]).filter(Boolean);
        if (equippedItems.length > 0 && equippedItems.every(itemId => ITEMS[itemId!]?.rarity === ItemRarity.Common)) {
            newlyUnlockedBadges.push(BADGES['misc_frugal_fighter']);
            const newBadgeIds = [...newPlayerState.unlockedBadgeIds];
            newBadgeIds.push('misc_frugal_fighter');
            newPlayerState.unlockedBadgeIds = newBadgeIds;
        }
    }


    const zone = ZONES.find(z => z.id === boss.zoneId);
    const baseRewardsData = zone?.missionDurations['LONG'] || { baseXp: 1000, baseGold: 500 };

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
    playerState.unlockedPermanentPerks.forEach(perkId => {
        if (FORGE_ATTRIBUTES[perkId]) activeAttributes.push(FORGE_ATTRIBUTES[perkId]);
    });
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
                        if (attrId && FORGE_ATTRIBUTES[attrId]) activeAttributes.push(FORGE_ATTRIBUTES[attrId]);
                    }
                });
            }
        }
    }
    activeAttributes.forEach(attr => {
        if (attr.effect.type === 'MULTIPLY_XP') xpMultiplier *= attr.effect.value;
        if (attr.effect.type === 'MULTIPLY_GOLD') goldMultiplier *= attr.effect.value;
    });

    // Permanent Upgrades from store
    playerState.purchasedStoreUpgradeIds.forEach(id => {
        const upgrade = (STORE.upgrades.find(u => u.id === id) as UpgradeStoreItem);
        if (!upgrade) return;
        if (upgrade.effect.type === 'xp') xpMultiplier += upgrade.effect.value;
        if (upgrade.effect.type === 'gold') goldMultiplier += upgrade.effect.value;
    });

    // Active Buffs
    playerState.activeBoosts.forEach(buff => {
        if (buff.type === 'xp') xpMultiplier *= buff.value;
        if (buff.type === 'gold') goldMultiplier *= buff.value;
    });

    // Badges
    playerState.unlockedBadgeIds.forEach(badgeId => {
        const badge = BADGES[badgeId];
        if (badge?.bonus) {
            if (badge.bonus.type === 'MULTIPLY_XP') xpMultiplier *= badge.bonus.value;
            if (badge.bonus.type === 'MULTIPLY_GOLD') goldMultiplier *= badge.bonus.value;
        }
    });

    const bossRewards: Rewards = {
        xp: Math.round(baseRewardsData.baseXp * boss.rewardMultiplier.xp * xpMultiplier),
        gold: Math.round(baseRewardsData.baseGold * boss.rewardMultiplier.gold * goldMultiplier),
        dollars: 0,
        items: [],
    };

    boss.lootTable.forEach(loot => {
        if (Math.random() < Math.min(1, loot.chance * lootMultiplier)) {
            bossRewards.items.push({ itemId: loot.itemId, quantity: 1 });
        }
    });

    newPlayerState = applyRewards(newPlayerState, bossRewards);

    // Track boss defeat counts for Nemesis Protocol
    const newBossDefeatCounts = { ...(newPlayerState.bossDefeatCounts || {}) };
    newBossDefeatCounts[boss.id] = (newBossDefeatCounts[boss.id] || 0) + 1;
    newPlayerState.bossDefeatCounts = newBossDefeatCounts;

    // First victory badge
    if (!newPlayerState.defeatedBossIds.includes(boss.id)) {
        const newDefeatedBossIds = [...newPlayerState.defeatedBossIds];
        newDefeatedBossIds.push(boss.id);
        newPlayerState.defeatedBossIds = newDefeatedBossIds;
    }

    newPlayerState.power = calculatePlayerPower(newPlayerState);
    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
    badgeCheckResult.newlyUnlockedBadges.push(...newlyUnlockedBadges);

    return {
        success: true,
        message: `You have triumphed over ${boss.name}!`,
        newPlayerState: badgeCheckResult.newPlayerState,
        rewards: bossRewards,
        newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
        outcome: 'win',
    };
};
