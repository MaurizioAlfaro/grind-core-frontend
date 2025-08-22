import React from 'react';
import type { Equipment as EquipmentType, InventoryItem } from '../../types';
import { EquipmentSlot } from '../../types';
import { ITEMS } from '../../constants/index';

interface EquipmentProps {
  equipment: EquipmentType;
  inventory: InventoryItem[];
  onEquip: (itemId: string) => void;
  onUnequip: (slot: EquipmentSlot) => void;
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
    onUnequip: (slot: EquipmentSlot) => void;
}> = ({ slot, itemId, onUnequip }) => {
    const item = itemId ? ITEMS[itemId] : null;

    return (
        <div className={`relative flex flex-col items-center justify-center w-20 h-24 p-2 bg-gray-800 rounded-lg border-2 ${item ? RarityBorderMap[item.rarity] : 'border-gray-700'}`}>
            <span className="absolute top-1 left-1 text-xs text-gray-500">{slot}</span>
            {item ? (
                <>
                    <span className="text-4xl">{item.icon}</span>
                    <p className={`text-xs font-bold ${RarityTextMap[item.rarity]}`}>{item.name}</p>
                    <button onClick={() => onUnequip(slot)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center">&times;</button>
                </>
            ) : (
                 <span className="text-gray-600 text-sm">Empty</span>
            )}
        </div>
    )
}

export const Equipment: React.FC<EquipmentProps> = ({ equipment, inventory, onEquip, onUnequip }) => {
    const equipableInventory = inventory.filter(invItem => ITEMS[invItem.itemId].type === 'Equipable');

    return (
        <div className="space-y-6 p-4 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700">
            <div>
                <h3 className="text-lg font-orbitron mb-4 text-cyan-400">Equipment</h3>
                <div className="grid grid-cols-3 gap-4">
                    {Object.values(EquipmentSlot).map(slot => (
                        <EquipmentSlotDisplay key={slot} slot={slot} itemId={equipment[slot]} onUnequip={onUnequip} />
                    ))}
                </div>
            </div>
            <div>
                 <h3 className="text-lg font-orbitron mb-4 text-cyan-400">Inventory</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-900/50 rounded-lg">
                    {equipableInventory.length > 0 ? equipableInventory.map(invItem => {
                        const item = ITEMS[invItem.itemId];
                        if (!item) return null;
                        return (
                            <button key={item.id} onClick={() => onEquip(item.id)} className={`flex items-center gap-2 p-2 bg-gray-800 rounded-lg border ${RarityBorderMap[item.rarity]} hover:bg-gray-700 transition-colors text-left`}>
                                <span className="text-2xl">{item.icon}</span>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${RarityTextMap[item.rarity]}`}>{item.name}</p>
                                    <p className="text-xs text-gray-400">x{invItem.quantity}</p>
                                </div>
                            </button>
                        );
                    }) : <p className="text-gray-500 col-span-full text-center">No equipable items.</p>}
                 </div>
            </div>
        </div>
    );
};