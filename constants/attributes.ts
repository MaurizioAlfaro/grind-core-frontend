import type { ForgeAttribute } from '../types';

export const FORGE_ATTRIBUTES: { [id: string]: ForgeAttribute } = {
    // --- Scaled Power Attributes ---
    power_t1: { id: 'power_t1', name: 'Minor Might', icon: '⚡', description: '+10 Power', effect: { type: 'ADD_POWER', value: 10 }},
    power_t2: { id: 'power_t2', name: 'Might', icon: '⚡', description: '+25 Power', effect: { type: 'ADD_POWER', value: 25 }},
    power_t3: { id: 'power_t3', name: 'Major Might', icon: '⚡', description: '+50 Power', effect: { type: 'ADD_POWER', value: 50 }},
    power_t4: { id: 'power_t4', name: 'Greater Might', icon: '⚡⚡', description: '+100 Power', effect: { type: 'ADD_POWER', value: 100 }},
    power_t5: { id: 'power_t5', name: 'Superior Might', icon: '⚡⚡', description: '+250 Power', effect: { type: 'ADD_POWER', value: 250 }},
    power_t6: { id: 'power_t6', name: 'Immense Might', icon: '⚡⚡', description: '+500 Power', effect: { type: 'ADD_POWER', value: 500 }},
    power_t7: { id: 'power_t7', name: 'Cosmic Might', icon: '✨', description: '+1000 Power', effect: { type: 'ADD_POWER', value: 1000 }},
    power_t8: { id: 'power_t8', name: 'Reality-Warping Might', icon: '✨', description: '+2500 Power', effect: { type: 'ADD_POWER', value: 2500 }},
    power_t9: { id: 'power_t9', name: 'Singularity Might', icon: '💥', description: '+5000 Power', effect: { type: 'ADD_POWER', value: 5000 }},

    // --- Scaled Gold Attributes ---
    gold_t1: { id: 'gold_t1', name: 'Thrifty', icon: '💰', description: '+5% Gold from missions', effect: { type: 'MULTIPLY_GOLD', value: 1.05 }},
    gold_t2: { id: 'gold_t2', name: 'Wealthy', icon: '💰', description: '+10% Gold from missions', effect: { type: 'MULTIPLY_GOLD', value: 1.10 }},
    gold_t3: { id: 'gold_t3', name: 'Midas Touch', icon: '💰💰', description: '+15% Gold from missions', effect: { type: 'MULTIPLY_GOLD', value: 1.15 }},

    // --- Scaled XP Attributes ---
    xp_t1: { id: 'xp_t1', name: 'Insight', icon: '🧠', description: '+3% XP from missions', effect: { type: 'MULTIPLY_XP', value: 1.03 }},
    xp_t2: { id: 'xp_t2', name: 'Wisdom', icon: '🧠', description: '+6% XP from missions', effect: { type: 'MULTIPLY_XP', value: 1.06 }},
    xp_t3: { id: 'xp_t3', name: 'Enlightenment', icon: '🧠🧠', description: '+9% XP from missions', effect: { type: 'MULTIPLY_XP', value: 1.09 }},

    // --- Scaled Loot Attributes ---
    loot_t1: { id: 'loot_t1', name: 'Lucky', icon: '🍀', description: '+2% Item Drop Chance', effect: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.02 }},
    loot_t2: { id: 'loot_t2', name: 'Fortunate', icon: '🍀', description: '+4% Item Drop Chance', effect: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.04 }},
    loot_t3: { id: 'loot_t3', name: 'Destined', icon: '🍀🍀', description: '+6% Item Drop Chance', effect: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.06 }},

    // --- Permanent +15 Perks ---
    perm_perk_weapon: { id: 'perm_perk_weapon', name: 'Weapon Master', icon: '⚔️', description: 'Permanently gain +5% XP from all sources.', effect: { type: 'MULTIPLY_XP', value: 1.05 }},
    perm_perk_armor: { id: 'perm_perk_armor', name: 'Gold Hoarder', icon: '🏆', description: 'Permanently gain +5% Gold from all sources.', effect: { type: 'MULTIPLY_GOLD', value: 1.05 }},
    perm_perk_ring: { id: 'perm_perk_ring', name: 'Power Core', icon: '💍', description: 'Permanently gain +25 Power.', effect: { type: 'ADD_PERMANENT_POWER', value: 25 }},
    perm_perk_amulet: { id: 'perm_perk_amulet', name: 'Fortune Finder', icon: '📿', description: 'Permanently gain +2% Item Drop Chance.', effect: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.02 }},
    perm_perk_misc: { id: 'perm_perk_misc', name: 'Unwavering Will', icon: '⚜️', description: 'Permanently gain +50 Power.', effect: { type: 'ADD_PERMANENT_POWER', value: 50 }},
};
