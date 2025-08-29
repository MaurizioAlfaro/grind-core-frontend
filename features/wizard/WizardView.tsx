import React, { useState } from "react";
import type { PlayerState } from "../../types";
import { EquipmentSlot } from "../../types";
import { WizardSlot } from "./WizardSlot";
import { EnchantmentPanel } from "./EnchantmentPanel";
import { OddsModal } from "./OddsModal";

interface WizardViewProps {
  player: PlayerState;
  onEnchant: (slot: EquipmentSlot, costMultiplier: number) => void;
  onReroll: (
    slot: EquipmentSlot,
    enchantmentIndex: number,
    costMultiplier: number
  ) => void;
}

export const WizardView: React.FC<WizardViewProps> = ({
  player,
  onEnchant,
  onReroll,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [isOddsModalOpen, setIsOddsModalOpen] = useState(false);
  const [costMultiplier, setCostMultiplier] = useState(1);

  return (
    <>
      {isOddsModalOpen && (
        <OddsModal
          multiplier={costMultiplier}
          onClose={() => setIsOddsModalOpen(false)}
        />
      )}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-orbitron text-cyan-400">
            Enchanter's Spire
          </h2>
          <p className="text-gray-400">
            Imbue your equipment with powerful, random attributes.
          </p>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <h3 className="text-lg font-orbitron mb-4 text-cyan-400 text-center">
            Your Equipment
          </h3>
          <div className="grid grid-cols-5 gap-1 md:gap-3 justify-center">
            {Object.values(EquipmentSlot).map((slot) => (
              <WizardSlot
                key={slot}
                slot={slot}
                player={player}
                isSelected={selectedSlot === slot}
                onSelect={setSelectedSlot}
              />
            ))}
          </div>
        </div>

        <EnchantmentPanel
          player={player}
          selectedSlot={selectedSlot}
          onEnchant={onEnchant}
          onReroll={onReroll}
          onShowOdds={() => setIsOddsModalOpen(true)}
          costMultiplier={costMultiplier}
          setCostMultiplier={setCostMultiplier}
        />
      </div>
    </>
  );
};
