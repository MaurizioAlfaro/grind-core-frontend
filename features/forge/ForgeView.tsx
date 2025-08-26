import React from "react";
import type { GameState } from "../../types";
import { EquipmentSlot } from "../../types";
import type { UpgradeResult } from "../../hooks/useGameLoop";
import { ForgeSlot } from "./ForgeSlot";
import { ForgeUpgradePanel } from "./ForgeUpgradePanel";
import { Tabs } from "../../components/Tabs";
import { WizardView } from "../wizard/WizardView";
import { WizardIcon } from "../navigation/icons/WizardIcon";

interface ForgeAndWizardViewProps {
  gameState: GameState;
  onUpgrade: (slot: EquipmentSlot, isSafe: boolean) => void;
  upgradeResult: UpgradeResult;
  onEnchant: (slot: EquipmentSlot, costMultiplier: number) => void;
  onReroll: (
    slot: EquipmentSlot,
    enchantmentIndex: number,
    costMultiplier: number
  ) => void;
  selectedSlot: EquipmentSlot | null;
  onSelectSlot: (slot: EquipmentSlot) => void;
}

const LockedView: React.FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
}> = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg h-96 animate-fade-in-up">
    <div className="text-6xl text-gray-600 mb-4">{icon}</div>
    <h2 className="text-2xl font-orbitron text-gray-500">{title} Locked</h2>
    <p className="text-gray-400 mt-2">{message}</p>
  </div>
);

const ForgeTabContent: React.FC<
  Omit<ForgeAndWizardViewProps, "onEnchant" | "onReroll">
> = ({ gameState, onUpgrade, upgradeResult, selectedSlot, onSelectSlot }) => {
  const { player } = gameState;
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-lg font-orbitron mb-4 text-cyan-400 text-center">
          Your Equipment
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 justify-center">
          {Object.values(EquipmentSlot).map((slot) => {
            const itemId = player.equipment[slot];
            const upgradeLevel = itemId
              ? player.equipmentUpgrades[itemId] || 0
              : 0;

            return (
              <ForgeSlot
                key={slot}
                slot={slot}
                itemId={itemId}
                upgradeLevel={upgradeLevel}
                isSelected={selectedSlot === slot}
                onSelect={onSelectSlot}
                upgradeResult={upgradeResult}
              />
            );
          })}
        </div>
      </div>
      <ForgeUpgradePanel
        player={player}
        selectedSlot={selectedSlot}
        onUpgrade={onUpgrade}
        upgradeResult={upgradeResult}
      />
    </div>
  );
};

export const ForgeView: React.FC<ForgeAndWizardViewProps> = ({
  gameState,
  onUpgrade,
  upgradeResult,
  onEnchant,
  onReroll,
  selectedSlot,
  onSelectSlot,
}) => {
  const isWizardUnlocked = gameState.player.level >= 10;

  const tabs = [
    {
      label: "Forge",
      content: (
        <ForgeTabContent
          gameState={gameState}
          onUpgrade={onUpgrade}
          upgradeResult={upgradeResult}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
      ),
    },
    {
      label: "Enchant",
      content: isWizardUnlocked ? (
        <WizardView
          player={gameState.player}
          onEnchant={onEnchant}
          onReroll={onReroll}
        />
      ) : (
        <LockedView
          icon={<WizardIcon />}
          title="Enchanter's Spire"
          message="Reach Level 10 to unlock enchanting."
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-orbitron text-cyan-400">
          Crafting Station
        </h2>
        <p className="text-gray-400">Enhance and imbue your equipment.</p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
};
