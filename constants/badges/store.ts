
import type { Badge } from '../../types';

export const storeBadges: { [key: string]: Badge } = {
    store_buff: { id: 'store_buff', name: 'Chemical Assistance', description: 'Use a Buff from the store.', icon: '🧪', category: 'Store', bonus: { type: 'MULTIPLY_GOLD', value: 1.002 }, bonusDescription: '+0.2% Global Gold' },
    store_cache: { id: 'store_cache', name: 'Mystery Box', description: 'Purchase a Cache from the store.', icon: '🎁', category: 'Store', bonus: { type: 'MULTIPLY_LOOT_CHANCE', value: 1.002 }, bonusDescription: '+0.2% Global Loot Chance' },
    store_upgrade: { id: 'store_upgrade', name: 'Permanent Fixture', description: 'Purchase a permanent Upgrade from the store.', icon: '📜', category: 'Store', bonus: { type: 'MULTIPLY_GOLD', value: 1.005 }, bonusDescription: '+0.5% Global Gold' },
    store_upgrade_all: { id: 'store_upgrade_all', name: 'Investor', description: 'Purchase all permanent Upgrades.', icon: '🤝', category: 'Store', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    marketplace_purchase: { id: 'marketplace_purchase', name: 'Fashionista', description: 'Purchase an item from the Marketplace.', icon: '🛍️', category: 'Store', bonus: { type: 'MULTIPLY_POWER', value: 1.002 }, bonusDescription: '+0.2% Global Power' },
};
