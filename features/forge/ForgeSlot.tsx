import React from "react";
import { EquipmentSlot } from "../../types";
import { ITEMS } from "../../constants/index";
import type { UpgradeResult } from "../../hooks/useGameLoop";
import { ItemIcon } from "../../components/common/ItemIcon";

interface ForgeSlotProps {
  slot: EquipmentSlot;
  itemId?: string;
  upgradeLevel: number;
  isSelected: boolean;
  onSelect: (slot: EquipmentSlot) => void;
  upgradeResult: UpgradeResult;
}

const RarityBorderMap: { [key: string]: string } = {
  Common: "border-gray-600",
  Rare: "border-blue-500",
  Epic: "border-purple-600",
  Legendary: "border-orange-600",
};

export const ForgeSlot: React.FC<ForgeSlotProps> = ({
  slot,
  itemId,
  upgradeLevel,
  isSelected,
  onSelect,
  upgradeResult,
}) => {
  const item = itemId ? ITEMS[itemId] : null;

  const getResultClasses = () => {
    if (!upgradeResult || upgradeResult.itemId !== itemId) return "";
    switch (upgradeResult.outcome) {
      case "success":
        return "animate-pulse-green";
      case "stay":
        return "animate-pulse-yellow";
      case "downgrade":
        return "animate-pulse-red";
      default:
        return "";
    }
  };

  const borderClasses = isSelected
    ? "border-cyan-400 ring-2 ring-cyan-400"
    : item
    ? RarityBorderMap[item.rarity]
    : "border-gray-700";

  return (
    <button
      onClick={() => onSelect(slot)}
      disabled={!item}
      data-slotid={slot}
      className={`relative flex flex-col items-center justify-center w-18 md:w-24 h-28 p-2 bg-gray-800 rounded-lg border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${borderClasses} ${getResultClasses()}`}
    >
      <span className="absolute top-1 left-1 text-xs text-gray-500">
        {slot}
      </span>
      {item ? (
        <>
          <ItemIcon
            item={item}
            className="text-5xl"
            imgClassName="w-14 h-14 object-contain"
          />
          <p className="text-xs font-bold text-gray-200">{item.name}</p>
          {upgradeLevel > 0 && (
            <p className="text-sm font-bold text-yellow-400">+{upgradeLevel}</p>
          )}
        </>
      ) : (
        <span className="text-gray-600 text-sm">Empty</span>
      )}
    </button>
  );
};
