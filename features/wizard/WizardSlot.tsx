import React from 'react';
import type { PlayerState } from '../../types';
import { EquipmentSlot, ItemRarity } from '../../types';
import { ITEMS, ENCHANTMENT_CONFIG } from '../../constants/index';
import { ItemIcon } from '../../components/common/ItemIcon';

interface WizardSlotProps {
  slot: EquipmentSlot;
  player: PlayerState;
  isSelected: boolean;
  onSelect: (slot: EquipmentSlot) => void;
}

const RarityBorderMap: { [key: string]: string } = {
    Common: 'border-gray-600',
    Rare: 'border-blue-500',
    Epic: 'border-purple-600',
    Legendary: 'border-orange-600',
};

export const WizardSlot: React.FC<WizardSlotProps> = ({ slot, player, isSelected, onSelect }) => {
  const itemId = player.equipment[slot];
  const item = itemId ? ITEMS[itemId] : null;
  const upgradeLevel = player.equipmentUpgrades[slot] || 0;
  const enchantments = player.equipmentEnchantments?.[slot] || [];
  const maxEnchantments = item ? ENCHANTMENT_CONFIG.SLOTS_BY_RARITY[item.rarity as ItemRarity] : 0;

  const borderClasses = isSelected 
    ? 'border-purple-400 ring-2 ring-purple-400' 
    : item ? RarityBorderMap[item.rarity] : 'border-gray-700';

  return (
    <button
      onClick={() => onSelect(slot)}
      disabled={!item}
      className={`relative flex flex-col items-center justify-center w-24 h-28 p-2 bg-gray-800 rounded-lg border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${borderClasses}`}
    >
        <span className="absolute top-1 left-1 text-xs text-gray-500">{slot}</span>
        {item ? (
            <>
                <ItemIcon item={item} className="text-5xl" imgClassName="w-14 h-14 object-contain" />
                <p className="text-xs font-bold text-gray-200">{item.name} <span className="text-yellow-400">+{upgradeLevel}</span></p>
                {maxEnchantments > 0 && (
                    <div className="absolute bottom-1 flex gap-1">
                        {Array.from({ length: maxEnchantments }).map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i < enchantments.length ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                        ))}
                    </div>
                )}
            </>
        ) : (
            <span className="text-gray-600 text-sm">Empty</span>
        )}
    </button>
  );
};
