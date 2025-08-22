
import type { Badge } from '../../types';

export const progressionBadges: { [key: string]: Badge } = {
    level_10: { id: 'level_10', name: 'Junior Analyst', description: 'Reach Level 10.', icon: '🕵️', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.005 }, bonusDescription: '+0.5% Global XP' },
    level_20: { id: 'level_20', name: 'Field Agent', description: 'Reach Level 20.', icon: '🕴️', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.005 }, bonusDescription: '+0.5% Global XP' },
    level_30: { id: 'level_30', name: 'Senior Agent', description: 'Reach Level 30.', icon: '🤵', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.005 }, bonusDescription: '+0.5% Global XP' },
    level_40: { id: 'level_40', name: 'Handler', description: 'Reach Level 40.', icon: '🕶️', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.005 }, bonusDescription: '+0.5% Global XP' },
    level_50: { id: 'level_50', name: 'Infiltrator', description: 'Reach Level 50.', icon: '👺', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.01 }, bonusDescription: '+1% Global XP' },
    level_60: { id: 'level_60', name: 'Spymaster', description: 'Reach Level 60.', icon: '👑', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.01 }, bonusDescription: '+1% Global XP' },
    level_70: { id: 'level_70', name: 'Illuminatus', description: 'Reach Level 70.', icon: '👁️', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.01 }, bonusDescription: '+1% Global XP' },
    level_80: { id: 'level_80', name: 'Grandmaster', description: 'Reach Level 80.', icon: '⚜️', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.01 }, bonusDescription: '+1% Global XP' },
    level_90: { id: 'level_90', name: 'Shadow Broker', description: 'Reach Level 90.', icon: '🎭', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.02 }, bonusDescription: '+2% Global XP' },
    level_100: { id: 'level_100', name: 'Architect', description: 'Reach Level 100.', icon: '🏛️', category: 'Progression', bonus: { type: 'MULTIPLY_XP', value: 1.03 }, bonusDescription: '+3% Global XP' },

    power_1k: { id: 'power_1k', name: 'Global Contender', description: 'Reach 1,000 Power.', icon: '🌍', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    power_5k: { id: 'power_5k', name: 'World Shaker', description: 'Reach 5,000 Power.', icon: '☄️', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    power_10k: { id: 'power_10k', name: 'Continental Force', description: 'Reach 10,000 Power.', icon: '🌎', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    power_25k: { id: 'power_25k', name: 'Reality Bender', description: 'Reach 25,000 Power.', icon: '🌀', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.005 }, bonusDescription: '+0.5% Global Power' },
    power_50k: { id: 'power_50k', name: 'System Anomaly', description: 'Reach 50,000 Power.', icon: '👾', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    power_75k: { id: 'power_75k', name: 'Singularity', description: 'Reach 75,000 Power.', icon: '🌌', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    power_100k: { id: 'power_100k', name: 'Architect Level Threat', description: 'Reach 100,000 Power.', icon: '💥', category: 'Progression', bonus: { type: 'MULTIPLY_POWER', value: 1.02 }, bonusDescription: '+2% Global Power' },

    perm_power_100: { id: 'perm_power_100', name: 'Innate Strength', description: 'Gain 100 Permanent Power.', icon: '💪', category: 'Progression', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    perm_power_500: { id: 'perm_power_500', name: 'Unbreakable Core', description: 'Gain 500 Permanent Power.', icon: '🦾', category: 'Progression', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    perm_power_1000: { id: 'perm_power_1000', name: 'Foundation of Power', description: 'Gain 1,000 Permanent Power.', icon: '🗿', category: 'Progression', bonus: { type: 'MULTIPLY_GOLD', value: 1.02 }, bonusDescription: '+2% Global Gold' },
};
