

import type { Lootbox, StoreItem } from '../types';
import { HOMUNCULUS_CLOTHING } from './marketplace';

export const CACHES: { [key: string]: Lootbox } = {
    'foragers_cache': {
        id: 'foragers_cache',
        label: "Forager's Cache",
        description: 'Common gear and consumables.',
        cost: { type: 'gold', amount: 250 },
        pool: [
            { itemId: 'cafeteria_spork', weight: 20 },
            { itemId: 'cafeteria_apron', weight: 20 },
            { itemId: 'supermarket_price_gun', weight: 15 },
            { itemId: 'supermarket_vest', weight: 15 },
            { itemId: 'small_gold_pouch', weight: 15 },
            { itemId: 'small_xp_potion', weight: 15 },
        ]
    },
    'warriors_strongbox': {
        id: 'warriors_strongbox',
        label: "Warrior's Strongbox",
        description: 'Contains at least one Rare weapon or armor piece.',
        cost: { type: 'gold', amount: 1250 },
        pool: [
            { itemId: 'park_duck_feather', weight: 25 },
            { itemId: 'gym_sweatband', weight: 25 },
            { itemId: 'post_office_signet_ring', weight: 20 },
            { itemId: 'cafeteria_onion_ring', weight: 20 },
            { itemId: 'power_shard', weight: 10 },
        ]
    },
    'shard_hoard': {
        id: 'shard_hoard',
        label: "Shard Hoard",
        description: 'A cache brimming with Power Shards.',
        cost: { type: 'gold', amount: 5000 },
        pool: [
            { itemId: 'power_shard', weight: 100 }, // Special case handled in engine to grant multiple
        ]
    }
};

const marketplaceItems: StoreItem[] = Object.values(HOMUNCULUS_CLOTHING).map(item => ({
    id: `store_${item.id}`,
    type: 'marketplace',
    name: item.name,
    description: item.description,
    icon: item.icon,
    cost: { dollars: item.cost },
    clothingItemId: item.id,
}));

export const STORE: {
    consumables: StoreItem[];
    upgrades: StoreItem[];
    caches: StoreItem[];
    marketplace: StoreItem[];
} = {
    consumables: [
        { id: 'buy_buff_gold_1', type: 'consumable', name: 'Gold Rush Potion', description: '+25% Gold from missions for 10 minutes.', icon: '💰', cost: { gold: 500 }, consumableItemId: 'consumable_buff_gold_1' },
        { id: 'buy_buff_xp_1', type: 'consumable', name: 'XP Surge Potion', description: '+25% XP from missions for 10 minutes.', icon: '📈', cost: { gold: 500 }, consumableItemId: 'consumable_buff_xp_1' },
        { id: 'buy_buff_loot_1', type: 'consumable', name: 'Loot Luck Potion', description: '+10% Item Drop chance for 10 minutes.', icon: '🍀', cost: { gold: 1000 }, consumableItemId: 'consumable_buff_loot_1' },
        { id: 'buy_buff_speed_1', type: 'consumable', name: 'Haste Elixir', description: 'Missions are 10% faster for 10 minutes.', icon: '⏩', cost: { gold: 750 }, consumableItemId: 'consumable_buff_speed_1' },
        { id: 'buy_buff_power_1', type: 'consumable', name: 'Giant\'s Strength Potion', description: '+20 temporary Power for 10 minutes.', icon: '💪', cost: { gold: 2000 }, consumableItemId: 'consumable_buff_power_1' },
    ],
    upgrades: [
        { id: 'upgrade_xp_1', type: 'upgrade', name: 'Apprentice\'s Wisdom', description: 'Permanently gain +2% more XP from all sources.', icon: '📚', cost: { gold: 10000 }, effect: { type: 'xp', value: 0.02 } },
        { id: 'upgrade_gold_1', type: 'upgrade', name: 'Merchant\'s Pact', description: 'Permanently gain +2% more Gold from all sources.', icon: '🤝', cost: { gold: 10000 }, effect: { type: 'gold', value: 0.02 } },
        { id: 'upgrade_loot_1', type: 'upgrade', name: 'Prospector\'s Eye', description: 'Permanently gain +1% item drop chance.', icon: '👁️', cost: { gold: 25000 }, effect: { type: 'loot', value: 0.01 } },
    ],
    caches: [
        { id: 'store_foragers_cache', type: 'cache', name: "Forager's Cache", description: 'Contains common gear and consumables.', icon: '📦', cost: { gold: CACHES['foragers_cache'].cost.amount }, cacheId: 'foragers_cache' },
        { id: 'store_warriors_strongbox', type: 'cache', name: "Warrior's Strongbox", description: 'A chance at rare weapons and armor.', icon: '🧰', cost: { gold: CACHES['warriors_strongbox'].cost.amount }, cacheId: 'warriors_strongbox' },
        { id: 'store_shard_hoard', type: 'cache', name: "Shard Hoard", description: 'Guaranteed to contain Power Shards.', icon: '💎', cost: { gold: CACHES['shard_hoard'].cost.amount }, cacheId: 'shard_hoard' },
    ],
    marketplace: marketplaceItems,
};