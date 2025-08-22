
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone01: Zone = {
    id: 'caffeteria',
    name: 'The Cafeteria',
    image: '/assets/images/missions-backgrounds/caffeteria.jpeg',
    lore: "My infiltration begins. They call this a 'cafeteria'. I observe the humans in their feeding ritual. Their social structures are weak, their food is bland. A perfect place to start gathering intel unnoticed. The Order's influence is subtle, even here.",
    requiredPower: 1,
    missionDurations: createDurations(10, 5),
    lootTable: [
      { itemId: 'cafeteria_spork', chance: 0.15 },
      { itemId: 'cafeteria_apron', chance: 0.15 },
      { itemId: 'small_gold_pouch', chance: 0.05 },
      { itemId: 'cafeteria_hairnet', chance: 0.10 },
      { itemId: 'power_shard', chance: 0.005 },
    ],
    exclusiveLoot: [
        { itemId: 'cafeteria_onion_ring', duration: 'LONG' },
        { itemId: 'cafeteria_jello_amulet', duration: 'MEDIUM' },
    ],
    completionBonus: {
      description: "+5 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 5}),
    },
    jobName: 'Dish Washer',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Charisma]: 1 },
    hourlyRate: 5,
};
