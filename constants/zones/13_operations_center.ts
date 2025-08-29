
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone13: Zone = {
    id: 'operations_center',
    name: 'Operations Center',
    image: '/images/missions-backgrounds/Operations Center.png',
    lore: "Inside the bunker, the 'Operations Center' buzzes with activity. They are coordinating a global psychic event to reinforce their control. I must sabotage the broadcast before it begins. Their security is high, but their arrogance is higher.",
    requiredPower: 400,
    missionDurations: createDurations(180, 90),
    lootTable: [
      { itemId: 'ops_center_taser', chance: 0.15 },
      { itemId: 'ops_center_riot_shield', chance: 0.15 },
      { itemId: 'ops_center_earpiece', chance: 0.1 },
      { itemId: 'ops_center_handcuffs', chance: 0.08 },
      { itemId: 'ops_center_flak_jacket', chance: 0.12 },
    ],
    exclusiveLoot: [
        { itemId: 'ops_center_master_keycard', duration: 'LONG' },
        { itemId: 'ops_center_intel_folder', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+30 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 30}),
    },
    jobName: 'Data Analyst',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Cunning]: 8, [HomunculusTrait.Intelligence]: 7 },
    hourlyRate: 40,
};
