
import type { PlayerState, Rewards, InventoryItem, Badge } from '../../../types';
import { CACHES, ITEMS } from '../../../constants/index';
import { ItemRarity } from '../../../types';
import { rollFromPool } from './rollFromPool';
import { applyRewards } from './applyRewards';
import { checkForBadgeUnlocks } from './checkForBadgeUnlocks';

export const openCache = (playerState: PlayerState, cacheId: string): { success: boolean, message: string, newPlayerState?: PlayerState, rewards?: Rewards, newlyUnlockedBadges?: Badge[] } => {
    const cache = CACHES[cacheId];
    if (!cache) return { success: false, message: "Cache not found." };
    
    let items: InventoryItem[] = [];

    // Special logic for shard hoard
    if (cache.id === 'shard_hoard') {
        const quantity = Math.floor(Math.random() * 5) + 3; // 3 to 7 shards
        items = [{ itemId: 'power_shard', quantity }];
    } else {
        items = rollFromPool(cache.pool);
    }
    
    const rewards: Rewards = { xp: 0, gold: 0, dollars: 0, items };
    let newPlayerState = applyRewards(playerState, rewards);

    // Badge logic for "The Gambler"
    if (items.length > 0 && items.every(i => ITEMS[i.itemId]?.rarity === ItemRarity.Common)) {
        newPlayerState.consecutiveCommonCacheOpens = (newPlayerState.consecutiveCommonCacheOpens || 0) + 1;
    } else if (items.length > 0) {
        // Any non-common item resets the counter.
        newPlayerState.consecutiveCommonCacheOpens = 0;
    }

    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);
    newPlayerState = badgeCheckResult.newPlayerState;

    return { success: true, message: "Cache opened!", newPlayerState, rewards, newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges };
};