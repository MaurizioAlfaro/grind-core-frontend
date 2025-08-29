
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone14: Zone = {
    id: 'airport',
    name: 'Airport',
    image: '/images/missions-backgrounds/Airport.png',
    lore: "With the broadcast averted, the regional director is fleeing. I must intercept him at the airport. He's disguised as a tourist, but he carries a briefcase containing a list of all resistance members. I cannot let that plane take off.",
    requiredPower: 500,
    missionDurations: createDurations(220, 110),
    lootTable: [
      { itemId: 'airport_cattle_prod', chance: 0.15 },
      { itemId: 'airport_pilot_uniform', chance: 0.15 },
      { itemId: 'airport_contraband', chance: 0.1 },
      { itemId: 'airport_signal_wand', chance: 0.08 },
      { itemId: 'airport_security_vest', chance: 0.12 },
    ],
    exclusiveLoot: [
        { itemId: 'airport_black_box_amulet', duration: 'LONG' },
        { itemId: 'airport_first_class_ticket', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+40 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 40}),
    },
    jobName: 'Baggage Handler',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Speed]: 8, [HomunculusTrait.Charisma]: 6 },
    hourlyRate: 45,
};
