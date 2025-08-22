
import { ItemRarity } from '../types';
import type { EnchantableAttribute } from '../types';

export const ENCHANTABLE_ATTRIBUTES: { [id: string]: EnchantableAttribute } = {
    // === OFFENSE ===
    'vitality': {
        id: 'vitality', name: 'Vitality', icon: '❤️', type: 'ADD_POWER', category: 'Offense',
        baseDescription: 'Increases your base Power.',
        tierValues: [10, 25, 50, 100, 250],
        effectDescription: (tier) => `+${[10, 25, 50, 100, 250][tier - 1]} Power`,
    },
    'executioners_might': {
        id: 'executioners_might', name: "Executioner's Might", icon: '☠️', type: 'POWER_VS_BOSS', category: 'Offense',
        baseDescription: 'Increases Power when fighting bosses.',
        tierValues: [1.01, 1.02, 1.03, 1.05, 1.07],
        effectDescription: (tier) => `+${([1, 2, 3, 5, 7])[tier - 1]}% Power vs Bosses`,
    },
    'nemesis_protocol': {
        id: 'nemesis_protocol', name: 'Nemesis Protocol', icon: '🎯', type: 'NEMESIS_PROTOCOL', category: 'Offense',
        baseDescription: 'Grants a stacking Power bonus against a boss for each time you have defeated it.',
        tierValues: [0.001, 0.002, 0.003, 0.004, 0.005],
        effectDescription: (tier) => `+${([0.1, 0.2, 0.3, 0.4, 0.5])[tier - 1]}% Power per boss defeat`,
    },
    'colossus_strength': {
        id: 'colossus_strength', name: 'Colossus Strength', icon: '🦾', type: 'MULTIPLY_EQUIPMENT_POWER', category: 'Offense',
        baseDescription: 'Multiplies the Power you gain from equipped items.',
        tierValues: [1.01, 1.02, 1.03, 1.04, 1.05],
        effectDescription: (tier) => `+${([1, 2, 3, 4, 5])[tier - 1]}% Power from Equipment`,
    },
    'level_advantage': {
        id: 'level_advantage', name: 'Level Advantage', icon: '🔺', type: 'ADD_POWER_PER_LEVEL', category: 'Offense',
        baseDescription: 'Grants a small amount of flat Power for each player level you have.',
        tierValues: [0.1, 0.2, 0.3, 0.4, 0.5],
        effectDescription: (tier) => `+${[0.1, 0.2, 0.3, 0.4, 0.5][tier - 1]} Power per Level`,
    },

    // === RESOURCE ===
    'prosperity': {
        id: 'prosperity', name: 'Prosperity', icon: '💰', type: 'MULTIPLY_GOLD', category: 'Resource',
        baseDescription: 'Increases Gold earned from all sources.',
        tierValues: [1.01, 1.02, 1.03, 1.05, 1.07],
        effectDescription: (tier) => `+${([1, 2, 3, 5, 7])[tier - 1]}% Gold`,
    },
    'golden_touch': {
        id: 'golden_touch', name: 'Golden Touch', icon: '✨', type: 'GOLDEN_TOUCH_CHANCE', category: 'Resource',
        baseDescription: 'Provides a small chance for missions and boss fights to award a massive gold bonus.',
        tierValues: [0.005, 0.01, 0.015, 0.02, 0.025],
        effectDescription: (tier) => `${([0.5, 1, 1.5, 2, 2.5])[tier - 1]}% chance for a 100x Gold bonus`,
    },
    'wisdom': {
        id: 'wisdom', name: 'Wisdom', icon: '🧠', type: 'MULTIPLY_XP', category: 'Resource',
        baseDescription: 'Increases XP earned from all sources.',
        tierValues: [1.01, 1.02, 1.03, 1.05, 1.07],
        effectDescription: (tier) => `+${([1, 2, 3, 5, 7])[tier - 1]}% XP`,
    },
    'fortune': {
        id: 'fortune', name: 'Fortune', icon: '🍀', type: 'MULTIPLY_LOOT_CHANCE', category: 'Resource',
        baseDescription: 'Increases the chance to find items.',
        tierValues: [1.01, 1.02, 1.03, 1.04, 1.05],
        effectDescription: (tier) => `+${([1, 2, 3, 4, 5])[tier - 1]}% Loot Chance`,
    },
    'scavengers_eye': {
        id: 'scavengers_eye', name: "Scavenger's Eye", icon: '👁️', type: 'MULTIPLY_REPTILIAN_PART_CHANCE', category: 'Resource',
        baseDescription: 'Increases the chance of finding rare Reptilian Parts for the Lab.',
        tierValues: [1.05, 1.10, 1.15, 1.20, 1.25],
        effectDescription: (tier) => `+${([5, 10, 15, 20, 25])[tier - 1]}% Reptilian Part Drop Chance`,
    },
    'payday': {
        id: 'payday', name: 'Payday', icon: '💵', type: 'MULTIPLY_USD_EARNINGS', category: 'Resource',
        baseDescription: 'Increases USD ($) earned from Homunculus jobs.',
        tierValues: [1.02, 1.04, 1.06, 1.08, 1.10],
        effectDescription: (tier) => `+${([2, 4, 6, 8, 10])[tier - 1]}% USD Earnings`,
    },

    // === UTILITY ===
    'safeguard': {
        id: 'safeguard', name: 'Safeguard', icon: '🛡️', type: 'FORGE_SAFEGUARD_CHANCE', category: 'Utility',
        baseDescription: 'Provides a chance to prevent an item from downgrading on a failed forge attempt. Does not stack with Safe Upgrade.',
        tierValues: [0.10, 0.20, 0.30, 0.40, 0.50],
        effectDescription: (tier) => `${([10, 20, 30, 40, 50])[tier - 1]}% chance to prevent downgrade`,
    },
    'insurance_policy': {
        id: 'insurance_policy', name: 'Insurance Policy', icon: '📄', type: 'FORGE_GOLD_SAVE_CHANCE', category: 'Utility',
        baseDescription: 'Provides a chance to refund a portion of the Gold cost on any failed forge attempt.',
        tierValues: [0.10, 0.15, 0.20, 0.25, 0.30],
        effectDescription: (tier) => `${([10, 15, 20, 25, 30])[tier - 1]}% chance to refund 50% of Gold on failure`,
    },
    'haste': {
        id: 'haste', name: 'Haste', icon: '⏩', type: 'MULTIPLY_MISSION_SPEED', category: 'Utility',
        baseDescription: 'Reduces the duration of all missions.',
        tierValues: [0.99, 0.98, 0.97, 0.96, 0.95],
        effectDescription: (tier) => `${([1, 2, 3, 4, 5])[tier - 1]}% faster missions`,
    },

    // === LAB ===
    'lab_assistant': {
        id: 'lab_assistant', name: 'Lab Assistant', icon: '🔬', type: 'MULTIPLY_LAB_XP', category: 'Lab',
        baseDescription: 'Increases the amount of Lab XP gained when investing.',
        tierValues: [1.02, 1.04, 1.06, 1.08, 1.10],
        effectDescription: (tier) => `+${([2, 4, 6, 8, 10])[tier - 1]}% Lab XP invested`,
    },
    'master_feeder': {
        id: 'master_feeder', name: 'Master Feeder', icon: '🍎', type: 'MULTIPLY_FEEDING_EFFECTIVENESS', category: 'Lab',
        baseDescription: 'Increases the effectiveness of Food items used on hibernating Homunculi.',
        tierValues: [1.1, 1.2, 1.3, 1.4, 1.5],
        effectDescription: (tier) => `+${([10, 20, 30, 40, 50])[tier - 1]}% effectiveness from Food`,
    },
};

export const ENCHANTMENT_CONFIG = {
    SLOTS_BY_RARITY: {
        [ItemRarity.Common]: 1,
        [ItemRarity.Rare]: 2,
        [ItemRarity.Epic]: 3,
        [ItemRarity.Legendary]: 4,
    },
    BASE_XP_COST: 1000,
    XP_COST_PER_LEVEL_MULTIPLIER: 1.5,
    // Odds for T1, T2, T3, T4, T5
    ODDS_BY_MULTIPLIER: {
        1:  [0.70, 0.20, 0.07, 0.02, 0.01],
        2:  [0.55, 0.25, 0.12, 0.06, 0.02],
        3:  [0.40, 0.30, 0.17, 0.09, 0.04],
        4:  [0.25, 0.35, 0.22, 0.12, 0.06],
        5:  [0.15, 0.35, 0.27, 0.15, 0.08],
        6:  [0.10, 0.30, 0.30, 0.20, 0.10],
        7:  [0.05, 0.25, 0.33, 0.25, 0.12],
        8:  [0.05, 0.20, 0.30, 0.30, 0.15],
        9:  [0.05, 0.15, 0.25, 0.35, 0.20],
        10: [0.05, 0.10, 0.20, 0.40, 0.25],
    } as Record<number, number[]>,
};