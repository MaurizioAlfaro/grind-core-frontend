
import type { PlayerState } from '../../types';
import { ZONES } from '../zones';
import { ITEMS, FOOD_ITEMS } from '../items';
import { BOSSES } from '../bosses';
import { LAB_EQUIPMENT } from '../lab';
import { MAX_TRAIT_LEVEL, ALL_REPTILIAN_PARTS } from '../homunculus';
import { EquipmentSlot, ItemRarity, ItemCategory } from '../../types';
import { BADGES } from '../badges';

const itemCache = {
    byRarity: new Map<ItemRarity, string[]>(),
    byCategory: new Map<ItemCategory, string[]>(),
};
Object.values(ITEMS).forEach(item => {
    if (!itemCache.byRarity.has(item.rarity)) itemCache.byRarity.set(item.rarity, []);
    itemCache.byRarity.get(item.rarity)!.push(item.id);

    if (!itemCache.byCategory.has(item.category)) itemCache.byCategory.set(item.category, []);
    itemCache.byCategory.get(item.category)!.push(item.id);
});

const allVisibleBosses = Object.values(BOSSES);

const bossBadgeUnlocks = Object.values(BOSSES).reduce((acc, boss) => {
    acc[boss.firstVictoryBadgeId] = (p: PlayerState) => p.defeatedBossIds.includes(boss.id);
    return acc;
}, {} as { [key: string]: (p: PlayerState) => boolean });

const createSetChecker = (itemIds: string[]) => (p: PlayerState) => {
    if (!itemIds || itemIds.length === 0) return false;
    return itemIds.every(id => p.discoveredItemIds.includes(id));
};

export const BADGE_UNLOCK_CONDITIONS: { [key: string]: (p: PlayerState) => boolean } = {
    // Progression
    level_10: p => p.level >= 10,
    level_20: p => p.level >= 20,
    level_30: p => p.level >= 30,
    level_40: p => p.level >= 40,
    level_50: p => p.level >= 50,
    level_60: p => p.level >= 60,
    level_70: p => p.level >= 70,
    level_80: p => p.level >= 80,
    level_90: p => p.level >= 90,
    level_100: p => p.level >= 100,
    power_1k: p => p.power >= 1000,
    power_5k: p => p.power >= 5000,
    power_10k: p => p.power >= 10000,
    power_25k: p => p.power >= 25000,
    power_50k: p => p.power >= 50000,
    power_75k: p => p.power >= 75000,
    power_100k: p => p.power >= 100000,
    perm_power_100: p => p.permanentPowerBonus >= 100,
    perm_power_500: p => p.permanentPowerBonus >= 500,
    perm_power_1000: p => p.permanentPowerBonus >= 1000,
    
    // Wealth
    gold_100k: p => p.gold >= 100000,
    gold_500k: p => p.gold >= 500000,
    gold_1m: p => p.gold >= 1000000,
    gold_10m: p => p.gold >= 10000000,
    gold_100m: p => p.gold >= 100000000,
    dollars_1k: p => p.dollars >= 1000,
    dollars_10k: p => p.dollars >= 10000,
    dollars_100k: p => p.dollars >= 100000,
    dollars_1m: p => p.dollars >= 1000000,
    
    // Missions
    completionist_1: p => p.completedZoneIds.length >= 1,
    completionist_5: p => p.completedZoneIds.length >= 5,
    completionist_10: p => p.completedZoneIds.length >= 10,
    completionist_20: p => p.completedZoneIds.length >= 20,
    completionist_all: p => p.completedZoneIds.length >= ZONES.length,
    long_mission_1: p => p.completedLongMissionZoneIds.length >= 1,
    long_mission_5: p => p.completedLongMissionZoneIds.length >= 5,
    long_mission_10: p => p.completedLongMissionZoneIds.length >= 10,
    long_mission_all: p => p.completedLongMissionZoneIds.length >= ZONES.length,
    workaholic: p => p.homunculi.filter(h => h.work !== null).length >= 5,

    // Bosses
    ...bossBadgeUnlocks,
    boss_slayer_1: p => p.defeatedBossIds.length >= 1,
    boss_slayer_5: p => p.defeatedBossIds.length >= 5,
    boss_slayer_10: p => p.defeatedBossIds.length >= 10,
    boss_slayer_20: p => p.defeatedBossIds.length >= 20,
    boss_slayer_all: p => p.defeatedBossIds.length >= allVisibleBosses.length,

    // Collection
    collector_10: p => p.discoveredItemIds.length >= 10,
    collector_50: p => p.discoveredItemIds.length >= 50,
    collector_100: p => p.discoveredItemIds.length >= 100,
    collector_all: p => p.discoveredItemIds.length >= Object.keys(ITEMS).length,
    collector_common: createSetChecker(itemCache.byRarity.get(ItemRarity.Common) || []),
    collector_rare: createSetChecker(itemCache.byRarity.get(ItemRarity.Rare) || []),
    collector_epic: createSetChecker(itemCache.byRarity.get(ItemRarity.Epic) || []),
    collector_legendary: createSetChecker(itemCache.byRarity.get(ItemRarity.Legendary) || []),

    // Forge
    forge_1: p => Object.values(p.equipmentUpgrades).some(level => level >= 1),
    forge_5: p => Object.values(p.equipmentUpgrades).some(level => level >= 5),
    forge_10: p => Object.values(p.equipmentUpgrades).some(level => level >= 10),
    forge_15: p => Object.values(p.equipmentUpgrades).some(level => level >= 15),
    full_set_5: p => Object.values(EquipmentSlot).every(slot => (p.equipmentUpgrades[slot as EquipmentSlot] || 0) >= 5),
    full_set_10: p => Object.values(EquipmentSlot).every(slot => (p.equipmentUpgrades[slot as EquipmentSlot] || 0) >= 10),
    full_set_15: p => Object.values(EquipmentSlot).every(slot => (p.equipmentUpgrades[slot as EquipmentSlot] || 0) >= 15),

    // Lab
    lab_creation_1: p => p.homunculusCreatedCount >= 1,
    lab_creation_5: p => p.homunculusCreatedCount >= 5,
    lab_creation_10: p => p.homunculusCreatedCount >= 10,
    squad_3: p => p.homunculi.length >= 3,
    squad_5: p => p.homunculi.length >= 5,
    squad_10: p => p.homunculi.length >= 10,
    lab_level_5: p => p.labLevel >= 5,
    lab_level_10: p => p.labLevel >= 10,
    lab_equipment_all: p => p.purchasedLabEquipmentIds.length >= Object.keys(LAB_EQUIPMENT).length,
    breeder_legendary: p => p.homunculi.some(h => h.rarity === ItemRarity.Legendary),
    trait_max: p => p.homunculi.some(h => Object.values(h.traits).some(t => t >= MAX_TRAIT_LEVEL)),

    // Store (Note: some store badges are event-based and cannot be tracked here)
    store_buff: p => p.activeBoosts.some(b => b.sourceId.startsWith('consumable_buff_')),
    store_cache: p => false, // Needs event
    store_upgrade: p => p.purchasedStoreUpgradeIds.length > 0,
    store_upgrade_all: p => p.purchasedStoreUpgradeIds.length >= 3, // Hardcoded based on current store
    marketplace_purchase: p => p.inventory.some(i => ITEMS[i.itemId]?.category === ItemCategory.HomunculusGear),

    // Miscellaneous (State-based)
    misc_leeroy_jenkins: p => (p.consecutiveCancels || 0) >= 10,
    misc_hoarder: p => p.inventory.some(i => i.quantity >= 1000),
    misc_pacifist: p => p.level >= 10 && !p.hasEquippedWeapon,
    misc_the_collector: p => ALL_REPTILIAN_PARTS.every(partId => p.inventory.some(i => i.itemId === partId)),
    misc_bad_luck_brian: p => (p.highChanceForgeFails || 0) >= 5,
    misc_dietician: p => p.homunculi.some(h => (h.fedFoodIds?.length || 0) >= Object.keys(FOOD_ITEMS).length),
    misc_nudist_colony: p => p.homunculi.filter(h => h.isAdult && Object.keys(h.equipment || {}).length === 0).length >= 5,
    misc_the_gambler: p => (p.consecutiveCommonCacheOpens || 0) >= 10,
    misc_forgot_to_clock_out: p => p.homunculi.some(h => h.work && (Date.now() - h.work.startTime) > 7 * 24 * 60 * 60 * 1000),
    
    // Secret
    secret_commoner: p => {
        const slots = Object.values(EquipmentSlot) as EquipmentSlot[];
        if (Object.keys(p.equipment).length < slots.length) return false;
        return slots.every(slot => { const itemId = p.equipment[slot]; return itemId && ITEMS[itemId]?.rarity === ItemRarity.Common; });
    },
    secret_rare: p => {
        const slots = Object.values(EquipmentSlot) as EquipmentSlot[];
        if (Object.keys(p.equipment).length < slots.length) return false;
        return slots.every(slot => { const itemId = p.equipment[slot]; return itemId && ITEMS[itemId]?.rarity === ItemRarity.Rare; });
    },
    secret_epic: p => {
        const slots = Object.values(EquipmentSlot) as EquipmentSlot[];
        if (Object.keys(p.equipment).length < slots.length) return false;
        return slots.every(slot => { const itemId = p.equipment[slot]; return itemId && ITEMS[itemId]?.rarity === ItemRarity.Epic; });
    },
    secret_legend: p => {
        const slots = Object.values(EquipmentSlot) as EquipmentSlot[];
        if (Object.keys(p.equipment).length < slots.length) return false;
        return slots.every(slot => { const itemId = p.equipment[slot]; return itemId && ITEMS[itemId]?.rarity === ItemRarity.Legendary; });
    },
    secret_perfectionist: p => p.homunculi.some(h => Object.values(h.traits).every(t => t >= MAX_TRAIT_LEVEL)),
};
