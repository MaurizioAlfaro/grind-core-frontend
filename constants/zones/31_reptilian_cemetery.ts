
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone31: Zone = {
    id: 'reptilian_cementary',
    name: 'Reptilian Cementary',
    image: '/images/missions-backgrounds/Reptilian Cementary.png',
    lore: "My liberated brethren lead me to a sacred burial ground, hidden from human eyes. The spirits of our ancestors whisper of a great power, a legacy buried deep within the earth, waiting for a true heir to reclaim it.",
    requiredPower: 100000,
    missionDurations: createDurations(10000, 5000),
    lootTable: [
        { itemId: 'small_xp_potion', chance: 0.1 },
        { itemId: 'small_gold_pouch', chance: 0.1 },
        { itemId: 'power_shard', chance: 0.08 },
        { itemId: 'cemetery_grave_dirt', chance: 0.20 },
        { itemId: 'cemetery_tombstone_fragment', chance: 0.15 },
        { itemId: 'cemetery_ancestral_dust', chance: 0.10 },
    ],
    exclusiveLoot: [
        { itemId: 'cemetery_femur', duration: 'LONG' },
        { itemId: 'cemetery_spirit_ward', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+1200 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 1200}),
    },
    jobName: 'Groundskeeper',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Psionics]: 10, [HomunculusTrait.Cunning]: 10 },
    hourlyRate: 450,
};
