
import React from 'react';
import { WikiSection } from './components/WikiSection';
import { CalculationStep } from './components/CalculationStep';

export const CoreConceptsWiki: React.FC = () => {
  return (
    <div className="space-y-4">
      <WikiSection title="Primary Stats" startExpanded>
        <p>These are the four main resources you will manage throughout the game.</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Level & XP:</strong> Experience Points (XP) are gained from missions and bosses. When you accumulate enough XP, you level up. Each level grants a flat amount of Power.</li>
          <li><strong>Gold:</strong> The primary currency, earned from missions and bosses. Gold is crucial for upgrading equipment in The Forge and purchasing items from the Store.</li>
          <li><strong>USD ($):</strong> A secondary currency earned exclusively from assigning adult Homunculi to jobs. USD is used to purchase exclusive Homunculus clothing and gear from the Marketplace.</li>
          <li><strong>Power:</strong> This is your primary combat statistic. Your Power determines which zones you can enter and your chance of success against bosses. It is a calculated value based on many factors.</li>
        </ul>
      </WikiSection>

      <WikiSection title="Power Calculation Formula">
        <p>Understanding how Power is calculated is key to optimizing your agent. The formula follows a specific order of operations, where flat bonuses are summed first before multiplicative bonuses are applied.</p>
        <div className="space-y-3 mt-4">
          <CalculationStep step={1} title="Sum All Base Power Sources">
            This is the foundation of your power. We take all the major flat-power contributors and add them together.
            <ul className="list-disc list-inside mt-2 text-xs">
              <li><strong>Level Power:</strong> <code>Current Level * 5</code></li>
              <li><strong>Equipment Power:</strong> The sum of the Power from all equipped items, including bonuses from Forge upgrades.</li>
              <li><strong>Permanent Bonuses:</strong> Power gained from Zone Completion bonuses, specific Badges, and permanent perks from +15 items.</li>
              <li><strong>Homunculus Power:</strong> Power from adult Homunculi traits and their equipped gear.</li>
              <li><strong>Temporary Buffs:</strong> Flat power bonuses from consumables like the <em>Giant's Strength Potion</em>.</li>
            </ul>
          </CalculationStep>
          <CalculationStep step={2} title="Add Flat Forge Attribute Bonuses">
            Next, we add any flat power bonuses granted by attributes on your equipped gear (that are not permanent +15 perks).
            <p className="mt-2 text-xs">Example: An item with the <strong>'Major Might'</strong> attribute adds a flat <code>+50 Power</code> to the total from Step 1.</p>
          </CalculationStep>
           <CalculationStep step={3} title="Apply Multiplicative Bonuses">
            Finally, all percentage-based multipliers are applied to the total from the previous steps. All multipliers are multiplicative with each other.
            <ul className="list-disc list-inside mt-2 text-xs">
              <li><strong>Badge Multipliers:</strong> Percentage bonuses from unlocked Badges (e.g., '+1% Global Power').</li>
              <li><strong>Power Shard Multiplier:</strong> Each Power Shard consumed provides a multiplicative <code>+0.1%</code> bonus.</li>
            </ul>
          </CalculationStep>
        </div>
        <p className="text-xs text-center mt-4 p-2 bg-gray-900 rounded-md">
            <strong>Formula:</strong> (Sum of Base Power + Flat Forge Bonuses) * Badge Multiplier * Shard Multiplier = <strong>Total Power</strong>
        </p>
      </WikiSection>
      
      <WikiSection title="The Mission Loop">
        <p>The core gameplay loop involves starting missions in different zones. Each zone has three mission durations:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Short:</strong> Quickest duration, lowest base rewards. Ideal for active play.</li>
            <li><strong>Medium:</strong> Moderate duration and rewards. Good for shorter breaks.</li>
            <li><strong>Long (8-hour):</strong> Longest duration with the highest base rewards. Completing a Long mission in a zone for the first time is required to unlock that zone's Boss encounter.</li>
        </ul>
        <p>Mission rewards (XP, Gold, and Items) are pre-rolled the moment you start the mission, based on your stats and buffs at that time.</p>
      </WikiSection>
    </div>
  );
};
