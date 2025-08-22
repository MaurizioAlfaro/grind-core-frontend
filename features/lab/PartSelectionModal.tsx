
import React, { useMemo } from 'react';
import type { InventoryItem, Item } from '../../types';
import { ITEMS, ALL_REPTILIAN_PARTS, CORE_COMPONENT_ID } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';
import { InfoIcon } from '../../components/common/icons/InfoIcon';
import { ItemIcon } from '../../components/common/ItemIcon';

interface PartSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPart: (itemId: string) => void;
    playerInventory: InventoryItem[];
    slotType: 'core' | 'material1' | 'material2';
    partsToExclude: string[];
    onShowItemInfo: (itemId: string) => void;
}

const RarityBorderMap: { [key: string]: string } = {
    Common: 'border-gray-600',
    Rare: 'border-blue-500',
    Epic: 'border-purple-600',
    Legendary: 'border-orange-600',
};

const RarityTextMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};

const PartCard: React.FC<{
    item: Item;
    quantity: number;
    onSelect: () => void;
    onShowInfo: (e: React.MouseEvent) => void;
}> = ({ item, quantity, onSelect, onShowInfo }) => (
    <div className="relative">
        <button
            onClick={onSelect}
            className={`flex flex-col items-center justify-between p-2 h-28 w-full bg-gray-800 rounded-lg border-2 text-left transition-colors hover:bg-gray-700 hover:border-cyan-400 ${RarityBorderMap[item.rarity]}`}
        >
            <div className="flex-grow flex flex-col items-center justify-center">
                 <ItemIcon item={item} className="text-4xl" imgClassName="w-12 h-12 object-contain" />
                 <p className={`text-xs text-center font-semibold ${RarityTextMap[item.rarity]}`}>{item.name}</p>
            </div>
            <p className="text-xs text-cyan-400 font-bold self-end">x{quantity}</p>
        </button>
        <button onClick={onShowInfo} className="absolute top-1 right-1 p-0.5 text-gray-500 hover:text-cyan-300 z-10" aria-label={`Info for ${item.name}`}>
            <InfoIcon className="w-4 h-4" />
        </button>
    </div>
);

export const PartSelectionModal: React.FC<PartSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelectPart,
    playerInventory,
    slotType,
    partsToExclude,
    onShowItemInfo
}) => {
    const availableParts = useMemo(() => {
        const inventoryMap = new Map(playerInventory.map(i => [i.itemId, i.quantity]));
        
        return ALL_REPTILIAN_PARTS
            .map(id => ITEMS[id])
            .filter(item => {
                if (!item || !inventoryMap.has(item.id) || inventoryMap.get(item.id)! <= 0) {
                    return false; // Not in inventory
                }
                if (partsToExclude.includes(item.id)) {
                    return false; // Already slotted elsewhere
                }
                if (slotType === 'core') {
                    return item.id === CORE_COMPONENT_ID; // Only core component for core slot
                }
                // For material slots, exclude the core component
                return item.id !== CORE_COMPONENT_ID;
            })
            .map(item => ({
                ...item,
                quantity: inventoryMap.get(item.id)!,
            }));
    }, [playerInventory, slotType, partsToExclude]);

    const title = slotType === 'core' ? 'Select Core Component' : 'Select Material';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="p-6">
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-4 text-center">{title}</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto p-2 bg-gray-900 rounded-lg">
                        {availableParts.length > 0 ? (
                            availableParts.map(item => (
                                <PartCard
                                    key={item.id}
                                    item={item}
                                    quantity={item.quantity}
                                    onSelect={() => onSelectPart(item.id)}
                                    onShowInfo={(e) => {
                                        e.stopPropagation();
                                        onShowItemInfo(item.id);
                                    }}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 py-8">No compatible parts available.</p>
                        )}
                    </div>
                    
                    <StyledButton onClick={onClose} variant="secondary" className="mt-6 w-full">
                        Cancel
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};
