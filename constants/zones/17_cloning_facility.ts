
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone17: Zone = {
    id: 'cloning_facility',
    name: 'Cloning Facility',
    image: '/images/missions-backgrounds/Cloning Facility.png',
    lore: "Deep inside Area 69, I find this. A cloning facility. They aren't just controlling world leaders; they are replacing them. The implications are staggering. I must destroy their genetic archives.",
    requiredPower: 1000,
    missionDurations: createDurations(450, 225),
    lootTable: [
      { itemId: 'cloning_facility_bone_saw', chance: 0.15 },
      { itemId: 'cloning_facility_reinforced_labcoat', chance: 0.15 },
      { itemId: 'cloning_facility_specimen_jar', chance: 0.1 },
      { itemId: 'cloning_facility_test_tube', chance: 0.18 },
      { itemId: 'cloning_facility_petri_dish', chance: 0.18 },
    ],
    exclusiveLoot: [
        { itemId: 'cloning_facility_scalpel', duration: 'LONG' },
        { itemId: 'cloning_facility_dna_sequencer', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+50 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 50}),
    },
    jobName: 'Specimen Cleaner',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 10, [HomunculusTrait.Intelligence]: 10, [HomunculusTrait.Psionics]: 2 },
    hourlyRate: 85,
};
