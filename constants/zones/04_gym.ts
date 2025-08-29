
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone04: Zone = {
    id: 'gym',
    name: 'The Gymnasium',
    image: '/images/missions-backgrounds/Gym.png',
    lore: "A facility for 'physical fitness'. They are surprisingly dedicated to strengthening their fragile bodies. This is a recruitment ground for the Order's enforcers. I will lift their heavy objects and listen to their plans.",
    requiredPower: 35,
    missionDurations: createDurations(25, 12),
    lootTable: [
        { itemId: 'gym_dumbbell', chance: 0.15 },
        { itemId: 'gym_shorts', chance: 0.15 },
        { itemId: 'power_shard', chance: 0.01 },
        { itemId: 'gym_towel', chance: 0.1 },
    ],
    exclusiveLoot: [
        { itemId: 'gym_sweatband', duration: 'LONG' },
        { itemId: 'gym_preworkout_ring', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+10 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 10}),
    },
    jobName: 'Personal Trainer',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Strength]: 5 },
    hourlyRate: 8,
};
