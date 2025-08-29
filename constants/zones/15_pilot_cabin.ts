
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone15: Zone = {
    id: 'pilot_cabin',
    name: 'Pilot Cabin',
    image: '/assets/images/missions-backgrounds/pilot cabin.png',
    lore: "I'm on the plane. The director is in first class, but the pilots are Order members. I must take control of the aircraft and divert it to a resistance-controlled location. The view is nice, but the company is terrible.",
    requiredPower: 650,
    missionDurations: createDurations(270, 135),
    lootTable: [
      { itemId: 'pilot_cabin_flare_gun', chance: 0.15 },
      { itemId: 'pilot_cabin_flight_jacket', chance: 0.15 },
      { itemId: 'pilot_cabin_instrument_panel', chance: 0.1 },
      { itemId: 'pilot_cabin_fire_extinguisher', chance: 0.12 },
      { itemId: 'pilot_cabin_aviator_goggles', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'pilot_cabin_altimeter_ring', duration: 'LONG' },
        { itemId: 'pilot_cabin_oxygen_mask', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+40 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 40}),
    },
    jobName: 'Co-Pilot',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 9, [HomunculusTrait.Speed]: 9 },
    hourlyRate: 55,
};
