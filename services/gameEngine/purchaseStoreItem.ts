

import type { PlayerState, StoreItem, CacheStoreItem, ActiveBoost, Rewards, UpgradeStoreItem, MarketplaceStoreItem, InventoryItem, ConsumableStoreItem } from '../../types';
import { STORE } from '../../constants/index';
import { clockService } from '../clockService';
import { openCache } from './_internal/openCache';
import { checkForBadgeUnlocks } from './_internal/checkForBadgeUnlocks';
import type { EngineResult } from './_internal/types';
import { recalculatePower } from './recalculatePower';

export const purchaseStoreItem = (playerState: PlayerState, itemId: string): EngineResult<{ rewards?: Rewards }> => {
    const storeItem: StoreItem | undefined = 
        STORE.consumables.find(i => i.id === itemId) ||
        STORE.upgrades.find(i => i.id === itemId) ||
        STORE.caches.find(i => i.id === itemId) ||
        STORE.marketplace.find(i => i.id === itemId);

    if (!storeItem) {
        return { success: false, message: 'Item not found in store.' };
    }

    let newPlayerState = { ...playerState };

    if (storeItem.cost.gold && newPlayerState.gold < storeItem.cost.gold) {
        return { success: false, message: 'Not enough Gold.' };
    }
    if (storeItem.cost.dollars && newPlayerState.dollars < storeItem.cost.dollars) {
        return { success: false, message: 'Not enough Dollars.' };
    }

    if (storeItem.cost.gold) {
        newPlayerState.gold -= storeItem.cost.gold;
    }
    if (storeItem.cost.dollars) {
        newPlayerState.dollars -= storeItem.cost.dollars;
    }

    switch (storeItem.type) {
        case 'consumable': {
            const consumableStoreItem = storeItem as ConsumableStoreItem;
            const newInventory = [...newPlayerState.inventory];
            const existingItem = newInventory.find(i => i.itemId === consumableStoreItem.consumableItemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                newInventory.push({ itemId: consumableStoreItem.consumableItemId, quantity: 1 });
            }
            newPlayerState.inventory = newInventory;
            return { success: true, message: `${storeItem.name} purchased!`, newPlayerState };
        }
        case 'upgrade': {
            const upgradeItem = storeItem as UpgradeStoreItem;
            if (newPlayerState.purchasedStoreUpgradeIds.includes(upgradeItem.id)) {
                return { success: false, message: 'Upgrade already purchased.' };
            }
            const newPurchasedIds = [...newPlayerState.purchasedStoreUpgradeIds];
            newPurchasedIds.push(upgradeItem.id);
            newPlayerState.purchasedStoreUpgradeIds = newPurchasedIds;

            const badgeCheck = checkForBadgeUnlocks(newPlayerState);

            return { success: true, message: `${upgradeItem.name} purchased!`, newPlayerState: badgeCheck.newPlayerState, newlyUnlockedBadges: badgeCheck.newlyUnlockedBadges };
        }
        case 'cache': {
            const cacheItem = storeItem as CacheStoreItem;
            const result = openCache(newPlayerState, cacheItem.cacheId);
            return { ...result, message: result.success ? `${cacheItem.name} opened!` : result.message };
        }
        case 'marketplace': {
            const marketplaceItem = storeItem as MarketplaceStoreItem;
            const newInventory = [...newPlayerState.inventory];
            const existingItem = newInventory.find(i => i.itemId === marketplaceItem.clothingItemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                newInventory.push({ itemId: marketplaceItem.clothingItemId, quantity: 1 });
            }
            newPlayerState.inventory = newInventory;
            return { success: true, message: `${marketplaceItem.name} purchased!`, newPlayerState };
        }
    }
};
