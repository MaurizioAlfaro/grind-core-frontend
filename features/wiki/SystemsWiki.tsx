
import React from 'react';
import { WikiSection } from './components/WikiSection';
import { CalculationStep } from './components/CalculationStep';

export const SystemsWiki: React.FC = () => {
  return (
    <div className="space-y-4">
      <WikiSection title="The Forge" startExpanded>
        <p>The Forge is where you upgrade your equipable items to increase their power and unlock potent attributes. Each item can be upgraded to a maximum level of +15.</p>
        <ul className="list-disc list-inside space-y-2 pl-4 mt-4">
          <li><strong>Upgrading:</strong> Each upgrade attempt costs Gold. The cost increases with the item's level and rarity.</li>
          <li><strong>Success & Failure:</strong> At lower levels, success is guaranteed. At higher levels, there are three possible outcomes:
            <ul className="list-disc list-inside space-y-1 pl-6">
                <li><span className="text-green-400">Success:</span> The item gains a level.</li>
                <li><span className="text-yellow-400">Stay:</span> The item's level does not change.</li>
                <li><span className="text-red-400">Downgrade:</span> The item loses a level.</li>
            </ul>
          </li>
          <li><strong>Safe Upgrade:</strong> You can pay 3x the Gold cost to perform a "Safe Upgrade." This prevents the item from downgrading on failure; it will either succeed or stay at its current level.</li>
          <li><strong>Forge Attributes:</strong> At levels +5, +10, and +15, items unlock powerful, permanent attributes that provide bonuses to Power, Gold, XP, or Loot Chance. A +15 attribute becomes a permanent, passive bonus for your character, even if the item is unequipped!</li>
        </ul>
      </WikiSection>

      <WikiSection title="The Bio-Forge (Lab)">
        <p>Unlocked at Player Level 10, the Bio-Forge allows you to create powerful allies called Homunculi by synthesizing Reptilian Parts found on missions. These creatures are a major source of passive Power and the game's secondary currency, USD.</p>
         <ul className="list-disc list-inside space-y-2 pl-4 mt-4">
            <li><strong>Synthesis:</strong> Requires 1 Core Component (Shapeshifter's Gene) and 2 Material Components. The rarity of the resulting Homunculus is based on the average rarity of the two materials.</li>
            <li><strong>Hibernation & Feeding:</strong> A newly created Homunculus enters a 24-hour hibernation. During this time, you can feed it special Food items to permanently increase its Traits.</li>
            <li><strong>Traits:</strong> Once hibernation ends, the Homunculus becomes an adult. Its Traits provide a direct, permanent boost to your Power.</li>
            <li><strong>Jobs & USD:</strong> Adult Homunculi can be assigned to jobs in unlocked Zones. They require certain Trait levels to qualify. Over time, they generate USD ($) which can be collected and used in the Marketplace tab of the Store.</li>
        </ul>
      </WikiSection>

      <WikiSection title="Reward Bonus Calculation">
        <p>Bonuses to XP, Gold, and Loot Chance from different sources are applied in a specific order. Understanding this is vital for maximizing your gains.</p>
        <div className="space-y-3 mt-4">
            <CalculationStep step={1} title="Start with Base Value">
                The calculation begins with the base reward value from the mission or boss you are fighting.
            </CalculationStep>
            <CalculationStep step={2} title="Apply Forge Attribute Multipliers">
                First, all percentage multipliers from your equipped items' Forge Attributes are applied. These are multiplicative.
                <p className="mt-2 text-xs">Example: An item with '+10% Gold' (a 1.10x multiplier) and another with '+5% Gold' (a 1.05x multiplier) result in a total multiplier of <code>1.10 * 1.05 = 1.155x</code>.</p>
            </CalculationStep>
            <CalculationStep step={3} title="Add Store Upgrade Bonuses">
                Next, permanent bonuses from the Upgrade tab in the Store are added directly to your multiplier from the previous step.
                <p className="mt-2 text-xs">Example: If your multiplier from Step 2 is <code>1.155x</code>, and you have a store upgrade for '+2% Gold', your new multiplier is <code>1.155 + 0.02 = 1.175x</code>. This is an <strong>additive</strong> step.</p>
            </CalculationStep>
            <CalculationStep step={4} title="Apply Consumable Buff Multipliers">
                After store upgrades, any active buffs from consumables (like a Gold Rush Potion) are multiplicatively applied.
                <p className="mt-2 text-xs">Example: With a <code>1.175x</code> multiplier and a '+25% Gold' potion (1.25x), your new multiplier becomes <code>1.175 * 1.25 = 1.46875x</code>.</p>
            </CalculationStep>
            <CalculationStep step={5} title="Apply Badge Multipliers">
                Finally, all percentage multipliers from your unlocked Badges are applied multiplicatively.
                 <p className="mt-2 text-xs">Example: With a <code>1.46875x</code> multiplier and Badges giving a total of '+5% Gold' (1.05x), your final multiplier is <code>1.46875 * 1.05 = 1.542x</code>.</p>
            </CalculationStep>
        </div>
        <p className="text-xs text-center mt-4 p-2 bg-gray-900 rounded-md">
            <strong>Formula:</strong> Base Reward * (((Forge Multiplier) + Store Bonus) * Buff Multiplier * Badge Multiplier) = <strong>Final Reward</strong>
        </p>
      </WikiSection>
    </div>
  );
};
