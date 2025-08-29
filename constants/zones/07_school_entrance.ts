
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone07: Zone = {
    id: 'school_entrance',
    name: 'School Entrance',
    image: '/images/missions-backgrounds/School Entrance.png',
    lore: "The indoctrination begins early. I monitor the 'school' where they shape young minds. The curriculum is riddled with subliminal messages from the Order. A teacher here is a contact for the resistance. I must pass them a message.",
    requiredPower: 90,
    missionDurations: createDurations(50, 25),
    lootTable: [
      { itemId: 'school_textbook', chance: 0.15 },
      { itemId: 'school_backpack', chance: 0.15 },
      { itemId: 'school_detention_slip', chance: 0.1 },
      { itemId: 'school_hall_pass', chance: 0.12 },
      { itemId: 'school_class_ring', chance: 0.08 },
    ],
    exclusiveLoot: [{ itemId: 'school_janitors_keyring', duration: 'LONG' }],
    completionBonus: {
      description: "+15 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 15}),
    },
    jobName: 'Crossing Guard',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Diplomacy]: 4, [HomunculusTrait.Cunning]: 2 },
    hourlyRate: 14,
};
