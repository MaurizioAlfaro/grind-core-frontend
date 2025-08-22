

import React from 'react';
import type { PlayerState, Homunculus, HomunculusClothingItem } from '../../types';
import { HomunculusEquipmentSlot, ItemType } from '../../types';
import { ITEMS } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';
import { ItemIcon } from '../../components/common/ItemIcon';
import { InfoIcon } from '../../components/common/icons/InfoIcon';

interface HomunculusEquipmentModalProps {
    homunculus: Homunculus;
    player: PlayerState;
    onEquip: (homunculusId: number, itemId: string) => void;
    onUnequip: (homunculusId: number, slot: HomunculusEquipmentSlot) => void;
    onClose: () => void;
    onShowItemInfo: (itemId: string) => void;
}

const RarityBorderMap: { [key: string]: string } = {
    Common: 'border-gray-600',
    Rare: 'border-blue-500',
    Epic: 'border-purple-600',
    Legendary: 'border-orange-600',
};

const EquipmentSlotDisplay: React.FC<{
    slot: HomunculusEquipmentSlot;
    itemId?: string;
    onUnequip: () => void;
}> = ({ slot, itemId, onUnequip }) => {
    const item = itemId ? ITEMS[itemId] as HomunculusClothingItem : null;
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400 font-bold">{slot}</span>
            <div className={`relative flex flex-col items-center justify-center w-20 h-24 p-2 bg-gray-800 rounded-lg border-2 ${item ? RarityBorderMap[item.rarity] : 'border-gray-700'}`}>
                {item ? (
                    <>
                        <ItemIcon item={item} className="text-4xl" imgClassName="w-12 h-12 object-contain" />
                        <p className="text-xs text-center font-bold text-gray-200 mt-1">{item.name}</p>
                        <button onClick={onUnequip} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center" aria-label={`Unequip ${item.name}`}>&times;</button>
                    </>
                ) : (
                    <span className="text-gray-600 text-sm">Empty</span>
                )}
            </div>
        </div>
    );
};

const InventoryItemCard: React.FC<{
    item: HomunculusClothingItem;
    onEquip: () => void;
    onShowItemInfo: (itemId: string) => void;
}> = ({ item, onEquip, onShowItemInfo }) => {
    return (
        <div className={`relative p-2 bg-gray-900/50 rounded-lg border ${RarityBorderMap[item.rarity]} flex items-center gap-2`}>
            <ItemIcon item={item} className="text-3xl w-10 text-center" imgClassName="w-10 h-10 object-contain"/>
            <div className="flex-1">
                <p className="font-bold text-sm text-white">{item.name}</p>
                <p className="text-xs text-red-400">+{item.powerBonus} Power</p>
                <p className="text-xs text-green-400">+{item.wageBonus * 100}% Wage</p>
            </div>
            <StyledButton onClick={onEquip} className="!py-1 !px-2 text-sm">Equip</StyledButton>
            <button onClick={() => onShowItemInfo(item.id)} className="absolute top-1 right-1 p-0.5 text-gray-500 hover:text-cyan-300 z-10" aria-label={`Info for ${item.name}`}>
                <InfoIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export const HomunculusEquipmentModal: React.FC<HomunculusEquipmentModalProps> = ({ homunculus, player, onEquip, onUnequip, onClose, onShowItemInfo }) => {
    const availableClothing = player.inventory
        .map(invItem => ({ item: ITEMS[invItem.itemId] as HomunculusClothingItem, quantity: invItem.quantity }))
        .filter(({ item, quantity }) => item && item.type === ItemType.HomunculusClothing && quantity > 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6">
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-4 text-center">Reptilianz Gear</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Equipment Side */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-orbitron text-center text-gray-300">Equipped</h3>
                            <div className="grid grid-cols-2 gap-4 justify-items-center">
                                {Object.values(HomunculusEquipmentSlot).map(slot => (
                                    <EquipmentSlotDisplay 
                                        key={slot}
                                        slot={slot}
                                        itemId={homunculus.equipment?.[slot]}
                                        onUnequip={() => onUnequip(homunculus.id, slot)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Inventory Side */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-orbitron text-center text-gray-300">Inventory</h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto p-2 bg-gray-900 rounded-lg">
                                {availableClothing.length > 0 ? (
                                    availableClothing.map(({ item }) => (
                                        <InventoryItemCard 
                                            key={item.id}
                                            item={item}
                                            onEquip={() => onEquip(homunculus.id, item.id)}
                                            onShowItemInfo={onShowItemInfo}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-16">No clothing items in inventory.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <StyledButton onClick={onClose} variant="secondary" className="mt-6 w-full">
                        Close
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};
