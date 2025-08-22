

import React from 'react';
import { ITEMS, ZONES, BOSSES } from '../../constants/index';
import { StyledButton } from './StyledButton';
import type { EquipableItem } from '../../types';
import { ItemIcon } from './ItemIcon';

interface ItemInfoModalProps {
  itemId: string;
  onClose: () => void;
}

const RarityTextMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};

const itemDropLocations = new Map<string, string[]>();

// Pre-calculate drop locations for efficiency
ZONES.forEach(zone => {
    const allZoneItems = new Set<string>();
    zone.lootTable.forEach(loot => allZoneItems.add(loot.itemId));
    zone.exclusiveLoot?.forEach(loot => allZoneItems.add(loot.itemId));

    allZoneItems.forEach(itemId => {
        if (!itemDropLocations.has(itemId)) {
            itemDropLocations.set(itemId, []);
        }
        itemDropLocations.get(itemId)?.push(zone.name);
    });
});

Object.values(BOSSES).forEach(boss => {
    boss.lootTable.forEach(loot => {
        if (!itemDropLocations.has(loot.itemId)) {
            itemDropLocations.set(loot.itemId, []);
        }
        itemDropLocations.get(loot.itemId)?.push(boss.name);
    });
});


export const ItemInfoModal: React.FC<ItemInfoModalProps> = ({ itemId, onClose }) => {
  const item = ITEMS[itemId];
  if (!item) return null;

  const dropsFrom = itemDropLocations.get(itemId) || [];
  const equipableItem = item.type === 'Equipable' ? item as EquipableItem : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6">
          <div className="flex gap-4 items-start mb-4">
            <div className={`flex-shrink-0 flex items-center justify-center w-20 h-20 bg-gray-900/50 rounded-lg`}>
                <ItemIcon item={item} className="text-5xl" imgClassName="w-14 h-14 object-contain" />
            </div>
            <div className="flex-1">
                <h2 className={`text-2xl font-orbitron font-bold ${RarityTextMap[item.rarity]}`}>{item.name}</h2>
                <p className="text-gray-500">{item.rarity} {item.type}</p>
                 {equipableItem && <p className="text-red-400 font-bold">Power: {equipableItem.power}</p>}
            </div>
          </div>

          <p className="text-gray-400 mb-6 italic">"{item.description}"</p>

          {dropsFrom.length > 0 && (
            <div className="mb-6">
                <h3 className="text-md font-orbitron text-gray-300 mb-2">Drops From:</h3>
                <div className="flex flex-wrap gap-2">
                    {dropsFrom.map(zoneName => (
                        <span key={zoneName} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                            {zoneName}
                        </span>
                    ))}
                </div>
            </div>
          )}

          <StyledButton id="item-info-modal-close-btn" onClick={onClose} className="w-full">
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};
