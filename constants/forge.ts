import { EquipmentSlot, ItemRarity } from '../types';

export const MAX_UPGRADE_LEVEL = 15;

export const RARITY_COST_MULTIPLIER: { [key in ItemRarity]: number } = {
    [ItemRarity.Common]: 1,
    [ItemRarity.Rare]: 5,
    [ItemRarity.Epic]: 15,
    [ItemRarity.Legendary]: 40,
};

export const FORGE_CONFIG = {
    powerBonusPerLevel: 0.05, // +5% base power per level
    safeUpgradeCostMultiplier: 3,
    levels: [
        // Level 0 -> 1
        { gold: 10,  success: 1.0, stay: 0.0, downgrade: 0.0 },
        // Level 1 -> 2
        { gold: 20, success: 1.0, stay: 0.0, downgrade: 0.0 },
        // Level 2 -> 3
        { gold: 35, success: 1.0, stay: 0.0, downgrade: 0.0 },
        // Level 3 -> 4
        { gold: 50, success: 0.95, stay: 0.05, downgrade: 0.0 },
        // Level 4 -> 5
        { gold: 75, success: 0.90, stay: 0.10, downgrade: 0.0 },
        // Level 5 -> 6
        { gold: 100, success: 0.85, stay: 0.15, downgrade: 0.0 },
        // Level 6 -> 7
        { gold: 150, success: 0.8, stay: 0.15, downgrade: 0.05 },
        // Level 7 -> 8
        { gold: 200, success: 0.7, stay: 0.20, downgrade: 0.1 },
        // Level 8 -> 9
        { gold: 300, success: 0.6, stay: 0.30, downgrade: 0.1 },
        // Level 9 -> 10
        { gold: 400, success: 0.5, stay: 0.4, downgrade: 0.1 },
        // Level 10 -> 11
        { gold: 600, success: 0.4, stay: 0.45, downgrade: 0.15 },
        // Level 11 -> 12
        { gold: 800, success: 0.3, stay: 0.5, downgrade: 0.2 },
        // Level 12 -> 13
        { gold: 1200, success: 0.25, stay: 0.55, downgrade: 0.2 },
        // Level 13 -> 14
        { gold: 1600, success: 0.2, stay: 0.6, downgrade: 0.2 },
        // Level 14 -> 15
        { gold: 2000, success: 0.2, stay: 0.6, downgrade: 0.2 },
    ]
};
