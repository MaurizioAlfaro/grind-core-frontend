
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone30: Zone = {
    id: 'zoo',
    name: 'The Zoo',
    image: '/assets/images/missions-backgrounds/Zoo.png',
    lore: "After rebooting reality, I find myself in a 'Zoo'. They have specimens of my kind in cages. They call us 'exhibits'. This indignity will not stand. I will liberate my brethren and remind these humans who the real animals are.",
    requiredPower: 85000,
    missionDurations: createDurations(8500, 4250),
    lootTable: [
      { itemId: 'zoo_tranquilizer_rifle', chance: 0.15 },
      { itemId: 'zoo_reinforced_keepers_vest', chance: 0.15 },
      { itemId: 'zoo_feeding_bucket', chance: 0.20 },
      { itemId: 'zoo_khaki_shorts', chance: 0.20 },
      { itemId: 'zoo_key_to_cages', chance: 0.10 },
      { itemId: 'zoo_exotic_animal_pelt', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'zoo_primal_totem', duration: 'LONG' },
        { itemId: 'zoo_alpha_fang', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+1100 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 1100}),
    },
    jobName: 'Animal Caretaker',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Charisma]: 10, [HomunculusTrait.Stealth]: 8 },
    hourlyRate: 125,
};
