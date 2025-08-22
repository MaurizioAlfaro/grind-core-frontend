
import React from 'react';
import type { PlayerState, StoreItem, CacheStoreItem, HomunculusClothingItem, ConsumableStoreItem, MarketplaceStoreItem } from '../../types';
import { GoldIcon } from '../player/icons/GoldIcon';
import { StyledButton } from '../../components/common/StyledButton';
import { InfoIcon } from '../../components/common/icons/InfoIcon';
import { DollarIcon } from '../../components/icons/DollarIcon';
import { ITEMS } from '../../constants/index';
import { PowerIcon } from '../player/icons/PowerIcon';
import { ItemType } from '../../types';
import { ItemIcon } from '../../components/common/ItemIcon';

interface StoreItemCardProps {
    item: StoreItem;
    player: PlayerState;
    onPurchase: (itemId: string) => void;
    onUse: (itemId: string) => void;
    onShowCacheContents: (cacheId: string) => void;
}

const renderCost = (item: StoreItem) => {
    if (item.cost.gold) {
        return (
            <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <GoldIcon className="w-5 h-5" />
                <span>{item.cost.gold.toLocaleString()}</span>
            </div>
        )
    }
     if (item.cost.dollars) {
        return (
            <div className="flex items-center gap-1 text-green-400 font-bold">
                <DollarIcon className="w-5 h-5" />
                <span>{item.cost.dollars.toLocaleString()}</span>
            </div>
        )
    }
    return null;
}

const renderMarketplaceStats = (item: StoreItem) => {
    if (item.type !== 'marketplace') return null;
    
    const clothingItem = ITEMS[item.clothingItemId] as HomunculusClothingItem;
    if (!clothingItem) return null;

    return (
        <div className="flex gap-4 text-xs mt-1">
            {clothingItem.powerBonus > 0 && (
                <div className="flex items-center gap-1 text-red-400">
                    <PowerIcon className="w-4 h-4" />
                    <strong>+{clothingItem.powerBonus} Power</strong>
                </div>
            )}
             {clothingItem.wageBonus > 0 && (
                <div className="flex items-center gap-1 text-green-400">
                    <DollarIcon className="w-4 h-4" />
                    <strong>+{(clothingItem.wageBonus * 100).toFixed(0)}% Wage</strong>
                </div>
            )}
        </div>
    );
}

export const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, player, onPurchase, onUse, onShowCacheContents }) => {
    const canAffordGold = !item.cost.gold || player.gold >= item.cost.gold;
    const canAffordDollars = !item.cost.dollars || player.dollars >= item.cost.dollars;
    const canAfford = canAffordGold && canAffordDollars;

    const isPurchased = item.type === 'upgrade' && player.purchasedStoreUpgradeIds.includes(item.id);
    const isDisabled = isPurchased || !canAfford;
    
    const inventoryCount = item.type === 'consumable' 
        ? player.inventory.find(i => i.itemId === (item as ConsumableStoreItem).consumableItemId)?.quantity || 0
        : 0;

    const getButtonText = () => {
        if (isPurchased) return 'Purchased';
        return 'Buy';
    }
    
    const handleUse = () => {
        if (item.type === 'consumable') {
            onUse((item as ConsumableStoreItem).consumableItemId);
        }
    };

    const itemData = (item.type === 'consumable' && ITEMS[(item as ConsumableStoreItem).consumableItemId]) ||
                     (item.type === 'marketplace' && ITEMS[(item as MarketplaceStoreItem).clothingItemId]) || 
                     item;

    return (
        <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 flex flex-col justify-between gap-4">
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gray-900/50 rounded-lg">
                    <ItemIcon item={itemData as any} className="text-4xl" imgClassName="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                    {renderMarketplaceStats(item)}
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                {renderCost(item)}
                <div className="flex items-center gap-2">
                    {item.type === 'cache' && (
                        <StyledButton 
                            variant="secondary"
                            className="!p-2"
                            onClick={() => onShowCacheContents((item as CacheStoreItem).cacheId)}
                            aria-label={`Show contents of ${item.name}`}
                        >
                            <InfoIcon className="w-5 h-5"/>
                        </StyledButton>
                    )}
                    {item.type === 'consumable' && inventoryCount > 0 && (
                        <StyledButton 
                            variant="success"
                            className="!py-2 !px-3"
                            onClick={handleUse}
                            aria-label={`Use ${item.name}`}
                        >
                            Use ({inventoryCount})
                        </StyledButton>
                    )}
                    <StyledButton onClick={() => onPurchase(item.id)} disabled={isDisabled}>
                        {getButtonText()}
                    </StyledButton>
                </div>
            </div>
        </div>
    )
}