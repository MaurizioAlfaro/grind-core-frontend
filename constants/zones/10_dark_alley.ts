
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone10: Zone = {
    id: 'dark_alley',
    name: 'Dark Alley',
    image: '/images/missions-backgrounds/Dark Alley.png',
    lore: "I escaped, but the Order's agents are hunting me. The city's dark alleys are my refuge. The shadows hide secrets and danger. My resistance contact is waiting for me here with new orders and a piece of upgraded gear.",
    requiredPower: 200,
    missionDurations: createDurations(100, 50),
    lootTable: [
      { itemId: 'dark_alley_broken_bottle', chance: 0.15 },
      { itemId: 'dark_alley_trench_coat', chance: 0.15 },
      { itemId: 'dark_alley_rat_skull_ring', chance: 0.1 },
      { itemId: 'dark_alley_cardboard_box', chance: 0.04 },
    ],
    exclusiveLoot: [
        { itemId: 'dark_alley_informants_watch', duration: 'LONG' },
        { itemId: 'dark_alley_graffiti_can', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+25 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 25}),
    },
    jobName: 'Information Broker',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Stealth]: 6, [HomunculusTrait.Cunning]: 4 },
    hourlyRate: 25,
};
