
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone19: Zone = {
    id: 'after_the_war',
    name: 'After the War',
    image: '/images/missions-backgrounds/After the War.png',
    lore: "The truth is out. Chaos reigns. The Order is fractured, but not destroyed. The world is in ruins, but it's free. My mission is complete... or so I thought. A signal from the stars tells me the fight has just begun.",
    requiredPower: 2000,
    missionDurations: createDurations(800, 400),
    lootTable: [
      { itemId: 'after_war_scrapsword', chance: 0.15 },
      { itemId: 'after_war_roadsign_shield', chance: 0.15 },
      { itemId: 'after_war_mutant_rat_skull', chance: 0.1 },
      { itemId: 'after_war_gas_mask', chance: 0.18 },
      { itemId: 'after_war_barbed_wire', chance: 0.18 },
    ],
    exclusiveLoot: [{ itemId: 'after_war_dog_tags', duration: 'LONG' }],
    completionBonus: {
      description: "+100 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 100}),
    },
    jobName: 'Wasteland Scout',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Strength]: 10, [HomunculusTrait.Stealth]: 10, [HomunculusTrait.Luck]: 5 },
    hourlyRate: 120,
};
