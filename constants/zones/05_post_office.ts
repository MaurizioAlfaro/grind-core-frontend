
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone05: Zone = {
    id: 'post_office',
    name: 'Post Office',
    image: '/assets/images/missions-backgrounds/Post Office.jpeg',
    lore: "An archaic physical message delivery system. Yet, the Order uses it for sensitive documents, believing it to be beneath digital surveillance. I must swap a critical package before it reaches its destination.",
    requiredPower: 50,
    missionDurations: createDurations(30, 15),
    lootTable: [
      { itemId: 'post_office_opener', chance: 0.15 },
      { itemId: 'post_office_uniform', chance: 0.15 },
      { itemId: 'post_office_rubber_band_ball', chance: 0.1 },
      { itemId: 'post_office_junk_mail', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'post_office_signet_ring', duration: 'LONG' },
        { itemId: 'post_office_certified_locket', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+10 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 10}),
    },
    jobName: 'Mail Sorter',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Speed]: 3 },
    hourlyRate: 9,
};
