
import type { Badge } from '../../types';

export const forgeBadges: { [key: string]: Badge } = {
    forge_1: { id: 'forge_1', name: 'First Steps', description: 'Upgrade an item for the first time.', icon: '🔨', category: 'Forge', bonus: { type: 'ADD_PERMANENT_POWER', value: 1 }, bonusDescription: '+1 Permanent Power' },
    forge_5: { id: 'forge_5', name: 'Tinkerer', description: 'Upgrade an item to +5.', icon: '🔧', category: 'Forge', bonus: { type: 'MULTIPLY_GOLD', value: 1.005 }, bonusDescription: '+0.5% Global Gold' },
    forge_10: { id: 'forge_10', name: 'Master Smith', description: 'Upgrade an item to +10.', icon: '🔨', category: 'Forge', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    forge_15: { id: 'forge_15', name: 'Anvil God', description: 'Upgrade an item to +15 (Max Level).', icon: '🔥', category: 'Forge', bonus: { type: 'MULTIPLY_GOLD', value: 1.015 }, bonusDescription: '+1.5% Global Gold' },

    full_set_5: { id: 'full_set_5', name: 'Well-Forged', description: 'Equip a full set of gear at +5 or higher.', icon: '🛡️', category: 'Forge', bonus: { type: 'MULTIPLY_POWER', value: 1.01 }, bonusDescription: '+1% Global Power' },
    full_set_10: { id: 'full_set_10', name: 'Masterwork', description: 'Equip a full set of gear at +10 or higher.', icon: '🌟', category: 'Forge', bonus: { type: 'MULTIPLY_POWER', value: 1.02 }, bonusDescription: '+2% Global Power' },
    full_set_15: { id: 'full_set_15', name: 'Artifact Armor', description: 'Equip a full set of gear at +15.', icon: '✨', category: 'Forge', bonus: { type: 'MULTIPLY_POWER', value: 1.03 }, bonusDescription: '+3% Global Power' },
};