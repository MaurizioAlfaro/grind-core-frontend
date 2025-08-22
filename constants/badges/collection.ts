
import type { Badge } from '../../types';

export const collectionBadges: { [key: string]: Badge } = {
    collector_10: { id: 'collector_10', name: 'Evidence Locker', description: 'Discover 10 unique items.', icon: '📦', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.005 }, bonusDescription: '+0.5% Global Loot Chance' },
    collector_50: { id: 'collector_50', name: 'Secret Archives', description: 'Discover 50 unique items.', icon: '📚', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.005 }, bonusDescription: '+0.5% Global Loot Chance' },
    collector_100: { id: 'collector_100', name: 'Curator', description: 'Discover 100 unique items.', icon: '🏛️', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.01 }, bonusDescription: '+1% Global Loot Chance' },
    collector_all: { id: 'collector_all', name: 'Grand Archivist', description: 'Discover all unique items.', icon: '📖', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.02 }, bonusDescription: '+2% Global Loot Chance' },

    collector_common: { id: 'collector_common', name: 'Commonplace', description: 'Discover all Common items.', icon: '⚪', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.005 }, bonusDescription: '+0.5% Global Loot Chance' },
    collector_rare: { id: 'collector_rare', name: 'Rare Find', description: 'Discover all Rare items.', icon: '🔵', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.01 }, bonusDescription: '+1% Global Loot Chance' },
    collector_epic: { id: 'collector_epic', name: 'Epic Tale', description: 'Discover all Epic items.', icon: '🟣', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.015 }, bonusDescription: '+1.5% Global Loot Chance' },
    collector_legendary: { id: 'collector_legendary', name: 'Living Legend', description: 'Discover all Legendary items.', icon: '🟠', category: 'Collection', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.02 }, bonusDescription: '+2% Global Loot Chance' },
};
