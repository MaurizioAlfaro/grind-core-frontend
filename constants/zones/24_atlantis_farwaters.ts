
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone24: Zone = {
    id: 'atlantis_farwaters',
    name: 'Atlantis Farwaters',
    image: '/images/missions-backgrounds/Atlantis Farwaters?.png',
    lore: "The Moon Temple contained a portal. It led me here, to the depths of Earth's ocean, to a city that is supposed to be a myth. Atlantis. The architecture is reptilian. This was one of our ancient capitals before the Great Betrayal.",
    requiredPower: 10000,
    missionDurations: createDurations(2500, 1250),
    lootTable: [
      { itemId: 'atlantis_trident', chance: 0.15 },
      { itemId: 'atlantis_coral_armor', chance: 0.15 },
      { itemId: 'atlantis_barnacle_club', chance: 0.20 },
      { itemId: 'atlantis_seaweed_garb', chance: 0.20 },
      { itemId: 'atlantis_conch_horn', chance: 0.12 },
      { itemId: 'atlantis_abyssal_gem', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'atlantis_pearl_of_wisdom', duration: 'LONG' },
        { itemId: 'atlantis_kraken_ink', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+300 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 300}),
    },
    jobName: 'Marine Biologist',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Strength]: 10, [HomunculusTrait.Psionics]: 9 },
    hourlyRate: 300,
};
