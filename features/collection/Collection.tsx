

import React from 'react';
import type { PlayerState, Item } from '../../types';
import { ZONES, ITEMS } from '../../constants/index';
import { EquipmentSlot, ItemType, ItemCategory } from '../../types';
import { InfoIcon } from '../../components/common/icons/InfoIcon';
import { Tabs } from '../../components/Tabs';
import { ItemIcon } from '../../components/common/ItemIcon';

interface CollectionProps {
  player: PlayerState;
  onEquip: (itemId: string) => void;
  onUnequip: (slot: EquipmentSlot) => void;
  onShowItemInfo: (itemId: string) => void;
}

const RarityTextMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};
const RarityBorderMap: { [key: string]: string } = {
    Common: 'border-gray-600',
    Rare: 'border-blue-500',
    Epic: 'border-purple-600',
    Legendary: 'border-orange-600',
};

const EquipmentSlotDisplay: React.FC<{
    slot: EquipmentSlot;
    itemId?: string;
    upgradeLevel?: number;
    onUnequip: (slot: EquipmentSlot) => void;
}> = ({ slot, itemId, upgradeLevel = 0, onUnequip }) => {
    const item = itemId ? ITEMS[itemId] : null;

    return (
        <div className={`relative flex flex-col items-center justify-center w-20 h-24 p-2 bg-gray-800 rounded-lg border-2 ${item ? RarityBorderMap[item.rarity] : 'border-gray-700'}`}>
            <span className="absolute top-1 left-1 text-xs text-gray-500">{slot}</span>
            {item ? (
                <>
                    <ItemIcon item={item} className="text-4xl" imgClassName="w-12 h-12 object-contain" />
                    <p className={`text-xs font-bold ${RarityTextMap[item.rarity]}`}>{item.name}</p>
                    {upgradeLevel > 0 && <p className="text-xs font-bold text-yellow-400">+{upgradeLevel}</p>}
                    <button onClick={() => onUnequip(slot)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center" aria-label={`Unequip ${item.name}`}>&times;</button>
                </>
            ) : (
                 <span className="text-gray-600 text-sm">Empty</span>
            )}
        </div>
    )
}

const CollectionItem: React.FC<{
    item: Item;
    discovered: boolean;
    isEquipped: boolean;
    onEquip: (itemId: string) => void;
    onShowInfo: (itemId: string) => void;
}> = ({ item, discovered, isEquipped, onEquip, onShowInfo }) => {
    const isEquipable = item.type === ItemType.Equipable;
    const canInteract = discovered && isEquipable;

    const baseClasses = 'relative flex flex-col items-center justify-center p-2 h-24 w-20 bg-gray-800 rounded-lg border-2 transition-all';
    const borderClass = discovered 
        ? isEquipped ? 'border-yellow-400' : RarityBorderMap[item.rarity]
        : 'border-gray-700';
    const buttonClasses = canInteract ? 'hover:bg-gray-700 hover:border-cyan-400' : 'cursor-default';

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent equip when clicking info
        onShowInfo(item.id);
    };

    return (
        <div className="relative">
            <button
                id={`collection-item-${item.id}`} 
                onClick={() => canInteract && onEquip(item.id)}
                disabled={!canInteract}
                className={`${baseClasses} ${borderClass} ${buttonClasses}`}
                aria-label={discovered ? `Equip ${item.name}` : 'Undiscovered item'}
            >
                {discovered ? (
                    <>
                        <ItemIcon item={item} className="text-3xl" imgClassName="w-10 h-10 object-contain" />
                        <span className="text-xs text-center">{item.name}</span>
                    </>
                ) : (
                     <>
                        <ItemIcon item={item} className="text-3xl filter brightness-0 invert opacity-50" imgClassName="w-10 h-10 object-contain filter brightness-0 invert opacity-50" />
                        <span className="text-xs text-center text-gray-500">???</span>
                    </>
                )}
            </button>
            <button onClick={handleInfoClick} className="absolute top-0 right-0 p-1 text-gray-500 hover:text-cyan-300 z-10" aria-label={`Info for ${item.name}`}>
                <InfoIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const ZoneCollection: React.FC<Pick<CollectionProps, 'player' | 'onEquip' | 'onShowItemInfo'>> = ({ player, onEquip, onShowItemInfo }) => {
    const visibleZones = ZONES.filter(zone => player.unlockedZoneIds.includes(zone.id));
    const equippedItemIds = new Set(Object.values(player.equipment));

    return (
        <div className="space-y-6">
            {visibleZones.map(zone => {
                const zoneItems = new Set<string>();
                zone.lootTable.forEach(l => zoneItems.add(l.itemId));
                if(zone.exclusiveLoot) {
                    zone.exclusiveLoot.forEach(l => zoneItems.add(l.itemId));
                }
                const items = Array.from(zoneItems).map(id => ITEMS[id]).filter(Boolean);
                const discoveredCount = items.filter(item => player.discoveredItemIds.includes(item.id)).length;
                const isCompleted = player.completedZoneIds.includes(zone.id);

                return (
                    <div key={zone.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-orbitron text-cyan-400">{zone.name}</h3>
                            <span className="text-sm text-gray-400">{discoveredCount} / {items.length} Found</span>
                        </div>
                        <div className="flex flex-wrap gap-2 p-2 bg-gray-900/50 rounded-lg">
                           {items.map(item => (
                               <CollectionItem 
                                   key={item.id} 
                                   item={item} 
                                   discovered={player.discoveredItemIds.includes(item.id)}
                                   isEquipped={equippedItemIds.has(item.id)}
                                   onEquip={onEquip}
                                   onShowInfo={onShowItemInfo}
                                />
                           ))}
                        </div>
                         <div className={`mt-2 text-sm font-semibold ${isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                            {isCompleted ? '★' : '☆'} Completion Bonus: {zone.completionBonus.description}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

const CategoryCollection: React.FC<Pick<CollectionProps, 'player' | 'onEquip' | 'onShowItemInfo'> & { category: ItemCategory, title: string }> = ({ player, onEquip, onShowItemInfo, category, title }) => {
    const equippedItemIds = new Set(Object.values(player.equipment));
    const itemsInCategory = Object.values(ITEMS).filter(item => item.category === category);
    const discoveredCount = itemsInCategory.filter(item => player.discoveredItemIds.includes(item.id)).length;

    return (
         <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-orbitron text-cyan-400">{title}</h3>
                <span className="text-sm text-gray-400">{discoveredCount} / {itemsInCategory.length} Found</span>
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-900/50 rounded-lg">
                {itemsInCategory.map(item => (
                   <CollectionItem 
                       key={item.id} 
                       item={item} 
                       discovered={player.discoveredItemIds.includes(item.id)}
                       isEquipped={equippedItemIds.has(item.id)}
                       onEquip={onEquip}
                       onShowInfo={onShowItemInfo}
                    />
               ))}
            </div>
        </div>
    );
};


export const Collection: React.FC<CollectionProps> = ({ player, onEquip, onUnequip, onShowItemInfo }) => {
    
    const tabs = [
        { label: 'Zone Drops', content: <ZoneCollection player={player} onEquip={onEquip} onShowItemInfo={onShowItemInfo} /> },
        { label: 'Boss Drops', content: <CategoryCollection player={player} onEquip={onEquip} onShowItemInfo={onShowItemInfo} category={ItemCategory.Boss} title="Boss Items" /> },
        { label: 'Reptilianz Parts', content: <CategoryCollection player={player} onEquip={onEquip} onShowItemInfo={onShowItemInfo} category={ItemCategory.Reptilian} title="Reptilianz Parts" /> },
    ];

    return (
        <div className="space-y-6">
             <div>
                <h3 className="text-lg font-orbitron mb-4 text-cyan-400">Equipment</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 justify-center">
                    {Object.values(EquipmentSlot).map(slot => (
                        <EquipmentSlotDisplay 
                           key={slot} 
                           slot={slot} 
                           itemId={player.equipment[slot]} 
                           upgradeLevel={player.equipmentUpgrades[slot]}
                           onUnequip={onUnequip} />
                    ))}
                </div>
            </div>
            <Tabs tabs={tabs} />
        </div>
    );
};
