
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone26: Zone = {
    id: 'dark_throne',
    name: 'The Dark Throne',
    image: '/images/missions-backgrounds/Dark Throne.png',
    lore: "At the heart of the pyramid network sits the Dark Throne, the seat of the Order's terrestrial leader. He is ancient, powerful, and not human. He is one of the traitors from the First War. It is time to reclaim our birthright.",
    requiredPower: 22000,
    missionDurations: createDurations(4000, 2000),
    lootTable: [
      { itemId: 'dark_throne_executioner_axe', chance: 0.15 },
      { itemId: 'dark_throne_obsidian_armor', chance: 0.15 },
      { itemId: 'dark_throne_shackle_whip', chance: 0.20 },
      { itemId: 'dark_throne_tattered_banner', chance: 0.20 },
      { itemId: 'dark_throne_goblet_of_shadows', chance: 0.10 },
      { itemId: 'dark_throne_whispering_skull', chance: 0.08 },
    ],
    exclusiveLoot: [{ itemId: 'dark_throne_crown_of_tyranny', duration: 'LONG' }],
    completionBonus: {
      description: "+400 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 400}),
    },
    jobName: 'Royal Attendant',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Charisma]: 10, [HomunculusTrait.Diplomacy]: 10, [HomunculusTrait.Strength]: 10 },
    hourlyRate: 400,
};
