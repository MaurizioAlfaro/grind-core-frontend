import React, { useState, useEffect } from "react";
import type { PlayerState, EquipableItem } from "../../types";
import { EquipmentSlot } from "../../types";
import {
  ITEMS,
  FORGE_CONFIG,
  MAX_UPGRADE_LEVEL,
  FORGE_ATTRIBUTES,
} from "../../constants/index";
import { GoldIcon } from "../player/icons/GoldIcon";
import { StyledButton } from "../../components/common/StyledButton";
import type { UpgradeResult } from "../../hooks/useGameLoop";
import { ForgeAttributeRow } from "./ForgeAttributeRow";
import { ItemIcon } from "../../components/common/ItemIcon";

interface ForgeUpgradePanelProps {
  player: PlayerState;
  selectedSlot: EquipmentSlot | null;
  onUpgrade: (slot: EquipmentSlot, isSafe: boolean) => void;
  upgradeResult: UpgradeResult;
}

const ChanceBar: React.FC<{
  chances: { success: number; stay: number; downgrade: number };
}> = ({ chances }) => {
  const { success, stay, downgrade } = chances;
  return (
    <div
      id="forge-chance-bar"
      className="flex w-full h-4 rounded-full overflow-hidden bg-gray-700"
    >
      <div
        className="bg-green-500 transition-all"
        style={{ width: `${success * 100}%` }}
        title={`Success: ${(success * 100).toFixed(0)}%`}
      ></div>
      <div
        className="bg-yellow-500 transition-all"
        style={{ width: `${stay * 100}%` }}
        title={`Stay: ${(stay * 100).toFixed(0)}%`}
      ></div>
      <div
        className="bg-red-500 transition-all"
        style={{ width: `${downgrade * 100}%` }}
        title={`Downgrade: ${(downgrade * 100).toFixed(0)}%`}
      ></div>
    </div>
  );
};

export const ForgeUpgradePanel: React.FC<ForgeUpgradePanelProps> = ({
  player,
  selectedSlot,
  onUpgrade,
  upgradeResult,
}) => {
  const [newlyUnlockedLevel, setNewlyUnlockedLevel] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (
      upgradeResult?.outcome === "success" &&
      selectedSlot &&
      upgradeResult.itemId === player.equipment[selectedSlot]
    ) {
      const itemId = player.equipment[selectedSlot];
      if (!itemId) return;

      const prevLevel = (player.equipmentUpgrades[itemId] || 1) - 1;
      const newLevel = prevLevel + 1;
      if ([5, 10, 15].includes(newLevel)) {
        setNewlyUnlockedLevel(newLevel);
        const timer = setTimeout(() => setNewlyUnlockedLevel(null), 1500); // Animation duration
        return () => clearTimeout(timer);
      }
    }
  }, [upgradeResult, selectedSlot, player.equipment, player.equipmentUpgrades]);

  if (!selectedSlot) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 text-center">
        <p>Select an equipped item to upgrade.</p>
      </div>
    );
  }

  const itemId = player.equipment[selectedSlot];
  if (!itemId) return null; // Should not happen if slot is selectable

  const item = ITEMS[itemId] as EquipableItem;
  const currentLevel = player.equipmentUpgrades[itemId] || 0;
  const isMaxLevel = currentLevel >= MAX_UPGRADE_LEVEL;
  const upgradeInfo = isMaxLevel ? null : FORGE_CONFIG.levels[currentLevel];

  const basePower = item.type === "Equipable" ? item.power : 0;
  const currentBonus =
    basePower * currentLevel * FORGE_CONFIG.powerBonusPerLevel;
  const nextBonus =
    basePower * (currentLevel + 1) * FORGE_CONFIG.powerBonusPerLevel;

  const canAfford = upgradeInfo && player.gold >= upgradeInfo.gold;
  const canAffordSafe =
    upgradeInfo &&
    player.gold >= upgradeInfo.gold * FORGE_CONFIG.safeUpgradeCostMultiplier;

  const forgePerks = item.forgeAttributes
    ? Object.entries(item.forgeAttributes)
    : [];

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

  return (
    <div
      id="forge-upgrade-panel"
      className={`p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4 transition-all ${getResultClasses()}`}
    >
      <div className="flex gap-4 items-center">
        <ItemIcon
          item={item}
          className="text-5xl flex-shrink-0"
          imgClassName="w-14 h-14 object-contain flex-shrink-0"
        />
        <div>
          <h3 className="text-xl font-bold font-orbitron text-white">
            {item.name} <span className="text-yellow-400">+{currentLevel}</span>
          </h3>
          <p className="text-gray-400">Base Power: {basePower}</p>
          <p className="text-green-400">
            Bonus Power: +{currentBonus.toFixed(1)}
          </p>
        </div>
      </div>

      {forgePerks.length > 0 && (
        <div id="forge-perks-section">
          <h4 className="text-md font-orbitron text-cyan-300 mb-2">
            Forge Perks
          </h4>
          <div className="space-y-2">
            {forgePerks.map(([levelStr, attrId]) => {
              const level = parseInt(levelStr, 10);
              const attribute = FORGE_ATTRIBUTES[attrId];
              if (!attribute) return null;
              return (
                <ForgeAttributeRow
                  key={attrId}
                  attribute={attribute}
                  milestoneLevel={level}
                  isUnlocked={currentLevel >= level}
                  isPermanent={level === 15}
                  isNewlyUnlocked={newlyUnlockedLevel === level}
                />
              );
            })}
          </div>
        </div>
      )}

      {isMaxLevel ? (
        <div className="text-center p-4 bg-yellow-900/50 rounded-lg">
          <h4 className="font-bold text-yellow-300">MAX LEVEL REACHED</h4>
          <p className="text-yellow-400">
            This item has unlocked its final permanent perk!
          </p>
        </div>
      ) : (
        upgradeInfo && (
          <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <div>
              <h4 className="text-lg font-orbitron text-cyan-300 mb-2">
                Upgrade to +{currentLevel + 1}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="text-gray-400">Potential Power:</span>
                <span className="text-white font-semibold">
                  {basePower} +{" "}
                  <span className="text-green-400">{nextBonus.toFixed(1)}</span>
                </span>
                <span className="text-gray-400">Success Chance:</span>
                <span className="text-green-400 font-semibold">
                  {(upgradeInfo.success * 100).toFixed(0)}%
                </span>
                <span className="text-gray-400">Downgrade Chance:</span>
                <span className="text-red-400 font-semibold">
                  {(upgradeInfo.downgrade * 100).toFixed(0)}%
                </span>
              </div>
              <div className="mt-2">
                <ChanceBar chances={upgradeInfo} />
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="forge-upgrade-button"
                onClick={() => onUpgrade(selectedSlot, false)}
                disabled={!canAfford}
                className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-bold text-white">Upgrade</span>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <GoldIcon className="w-5 h-5" />
                  <span>{upgradeInfo.gold.toLocaleString()}</span>
                </div>
              </button>

              <button
                onClick={() => onUpgrade(selectedSlot, true)}
                disabled={!canAffordSafe}
                className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div>
                  <span className="font-bold text-white">Safe Upgrade</span>
                  <p className="text-xs text-gray-400">
                    No downgrade on failure
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <GoldIcon className="w-5 h-5" />
                  <span>
                    {(
                      upgradeInfo.gold * FORGE_CONFIG.safeUpgradeCostMultiplier
                    ).toLocaleString()}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
