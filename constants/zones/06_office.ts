
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone06: Zone = {
    id: 'office',
    name: 'Corporate Office',
    image: '/assets/images/missions-backgrounds/office.png',
    lore: "I have infiltrated one of their corporate fronts. The 'TPS reports' are encoded with troop movements. My human disguise, 'Bob from accounting', is holding up. The fluorescent lights are slowly driving me mad, as designed.",
    requiredPower: 70,
    missionDurations: createDurations(40, 20),
    lootTable: [
      { itemId: 'office_keyboard', chance: 0.15 },
      { itemId: 'office_suit_jacket', chance: 0.15 },
      { itemId: 'office_stapler', chance: 0.1 },
      { itemId: 'power_shard', chance: 0.015 },
    ],
    exclusiveLoot: [{ itemId: 'office_badge', duration: 'MEDIUM' }, { itemId: 'office_locket', duration: 'LONG' }],
    completionBonus: {
      description: "+15 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 15}),
    },
    jobName: 'Junior Accountant',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Intelligence]: 4, [HomunculusTrait.Charisma]: 2 },
    hourlyRate: 12,
};
