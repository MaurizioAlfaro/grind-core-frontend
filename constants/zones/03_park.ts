
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone03: Zone = {
    id: 'park',
    name: 'Public Park',
    image: '/assets/images/missions-backgrounds/Getting High at the Park.png',
    lore: "The humans 'relax' here, lowering their guard. I sit on a bench, disguised, monitoring their conversations. They speak of trivialities, unaware of the psychic net the Order has cast over them. A rogue agent has hidden a data cache near the duck pond.",
    requiredPower: 20,
    missionDurations: createDurations(20, 10),
    lootTable: [
      { itemId: 'park_frisbee', chance: 0.15 },
      { itemId: 'park_bench_plank', chance: 0.15 },
      { itemId: 'power_shard', chance: 0.01 },
      { itemId: 'park_squirrel_nut', chance: 0.10 },
      { itemId: 'park_goose_blade', chance: 0.02 },
    ],
    exclusiveLoot: [{ itemId: 'park_duck_feather', duration: 'LONG' }],
    completionBonus: {
      description: "+5 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 5}),
    },
    jobName: 'Trash Picker',
    workerLimit: 3,
    workRequirements: {},
    hourlyRate: 2,
};
