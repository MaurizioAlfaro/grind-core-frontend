import React from "react";
import type { PlayerState, Enchantment } from "../../types";
import { EquipmentSlot, ItemRarity } from "../../types";
import {
  ITEMS,
  ENCHANTMENT_CONFIG,
  ENCHANTABLE_ATTRIBUTES,
} from "../../constants/index";
import { StyledButton } from "../../components/common/StyledButton";
import { ItemIcon } from "../../components/common/ItemIcon";
import { XpIcon } from "../player/icons/XpIcon";

interface EnchantmentPanelProps {
  player: PlayerState;
  selectedSlot: EquipmentSlot | null;
  onEnchant: (slot: EquipmentSlot, costMultiplier: number) => void;
  onReroll: (
    slot: EquipmentSlot,
    enchantmentIndex: number,
    costMultiplier: number
  ) => void;
  onShowOdds: () => void;
  costMultiplier: number;
  setCostMultiplier: (value: number) => void;
}

const EnchantmentRow: React.FC<{
  enchantment: Enchantment;
  onReroll: () => void;
  canAfford: boolean;
}> = ({ enchantment, onReroll, canAfford }) => {
  const attr = ENCHANTABLE_ATTRIBUTES[enchantment.attributeId];
  if (!attr) return null;

  const tierColorClasses: { [key: number]: string } = {
    1: "border-gray-700",
    2: "border-green-600 bg-green-900/20",
    3: "border-blue-600 bg-blue-900/20",
    4: "border-purple-600 bg-purple-900/20",
    5: "border-orange-500 bg-orange-900/20",
  };

  const tierTextClasses: { [key: number]: string } = {
    1: "text-gray-400",
    2: "text-green-400",
    3: "text-blue-400",
    4: "text-purple-400",
    5: "text-orange-400",
  };

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg border ${
        tierColorClasses[enchantment.tier] || "border-gray-700"
      }`}
    >
      <div className="w-8 h-8 rounded-md flex items-center justify-center text-xl bg-gray-800">
        {attr.icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-white">
          {attr.name} -{" "}
          <span
            className={tierTextClasses[enchantment.tier] || "text-gray-400"}
          >
            Tier {enchantment.tier}
          </span>
        </p>
        <p className="text-sm text-cyan-300">
          {attr.effectDescription(enchantment.tier)}
        </p>
      </div>
      <StyledButton
        onClick={onReroll}
        disabled={!canAfford}
        variant="secondary"
      >
        Reroll
      </StyledButton>
    </div>
  );
};

export const EnchantmentPanel: React.FC<EnchantmentPanelProps> = ({
  player,
  selectedSlot,
  onEnchant,
  onReroll,
  onShowOdds,
  costMultiplier,
  setCostMultiplier,
}) => {
  if (!selectedSlot) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <p>Select an equipped item to enchant.</p>
      </div>
    );
  }

  const itemId = player.equipment[selectedSlot];
  if (!itemId) return null;

  const item = ITEMS[itemId];
  const upgradeLevel = player.equipmentUpgrades[itemId] || 0;
  const currentEnchantments =
    player.equipmentEnchantments?.[selectedSlot] || [];
  const maxSlots =
    ENCHANTMENT_CONFIG.SLOTS_BY_RARITY[item.rarity as ItemRarity];

  const xpCost = Math.floor(
    ENCHANTMENT_CONFIG.BASE_XP_COST *
      Math.pow(ENCHANTMENT_CONFIG.XP_COST_PER_LEVEL_MULTIPLIER, upgradeLevel) *
      costMultiplier
  );
  const canAfford = player.xp >= xpCost;

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
      <div className="flex gap-4 items-center">
        <ItemIcon
          item={item}
          className="text-5xl flex-shrink-0"
          imgClassName="w-14 h-14 object-contain flex-shrink-0"
        />
        <div>
          <h3 className="text-xl font-bold font-orbitron text-white">
            {item.name} <span className="text-yellow-400">+{upgradeLevel}</span>
          </h3>
          <p className="text-gray-400">
            {item.rarity} - {currentEnchantments.length}/{maxSlots} Enchantments
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: maxSlots }).map((_, i) => {
          if (currentEnchantments[i]) {
            return (
              <EnchantmentRow
                key={i}
                enchantment={currentEnchantments[i]}
                onReroll={() => onReroll(selectedSlot, i, costMultiplier)}
                canAfford={canAfford}
              />
            );
          } else {
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-gray-800/50"
              >
                <p className="text-gray-500 font-semibold">-- Empty Slot --</p>
                <StyledButton
                  onClick={() => onEnchant(selectedSlot, costMultiplier)}
                  disabled={!canAfford}
                >
                  Enchant
                </StyledButton>
              </div>
            );
          }
        })}
      </div>

      <div className="pt-4 border-t border-gray-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="cost-multiplier" className="font-bold text-gray-300">
            Cost Multiplier:{" "}
            <span className="text-cyan-400">{costMultiplier}x</span>
          </label>
          <button
            onClick={onShowOdds}
            className="text-sm text-cyan-400 hover:underline"
          >
            View Odds
          </button>
        </div>
        <input
          id="cost-multiplier"
          type="range"
          min="1"
          max="10"
          step="1"
          value={costMultiplier}
          onChange={(e) => setCostMultiplier(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div
          className={`flex items-center justify-center gap-2 p-3 rounded-lg text-lg font-bold ${
            canAfford ? "text-green-400" : "text-red-400"
          } bg-gray-800`}
        >
          <XpIcon className="w-6 h-6" />
          <span>Cost: {xpCost.toLocaleString()} XP</span>
        </div>
      </div>
    </div>
  );
};
