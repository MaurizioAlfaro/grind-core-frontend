
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone02: Zone = {
    id: 'supermarket',
    name: 'The Supermarket',
    image: '/assets/images/missions-backgrounds/Supermarket.jpeg',
    lore: "I trace their supply lines to this 'Supermarket'. Aisle 69 is a known dead drop for local Order agents. I must intercept their communications while pretending to analyze 'nutritional information'. Their obsession with processed grains is a strategic weakness.",
    requiredPower: 10,
    missionDurations: createDurations(15, 8),
    lootTable: [
      { itemId: 'supermarket_price_gun', chance: 0.15 },
      { itemId: 'supermarket_vest', chance: 0.15 },
      { itemId: 'small_xp_potion', chance: 0.05 },
      { itemId: 'supermarket_coupon', chance: 0.10 },
    ],
    exclusiveLoot: [
        { itemId: 'supermarket_wheel', duration: 'LONG' },
        { itemId: 'supermarket_loyalty_card', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+5 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 5}),
    },
    jobName: 'Stocker',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Strength]: 2 },
    hourlyRate: 6,
};
