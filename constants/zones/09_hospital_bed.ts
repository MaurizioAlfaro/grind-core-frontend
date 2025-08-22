
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone09: Zone = {
    id: 'hospital_bed',
    name: 'Hospital Bed',
    image: '/assets/images/missions-backgrounds/Hospital Bed.jpeg',
    lore: "My cover was nearly blown. A 'workplace accident'. Now I'm in their 'hospital', a place of healing and biological data theft. They are taking my vitals, my blood... I must escape before my reptilian physiology is discovered.",
    requiredPower: 150,
    missionDurations: createDurations(80, 40),
    lootTable: [
      { itemId: 'hospital_iv_stand', chance: 0.15 },
      { itemId: 'hospital_patient_gown', chance: 0.15 },
      { itemId: 'hospital_heart_monitor', chance: 0.1 },
      { itemId: 'hospital_scalpel', chance: 0.05 },
      { itemId: 'hospital_surgical_mask', chance: 0.12 },
    ],
    exclusiveLoot: [
        { itemId: 'hospital_doctors_stethoscope', duration: 'LONG' },
        { itemId: 'hospital_heartbeat_ring', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+20 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 20}),
    },
    jobName: 'Medical Transcriptionist',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Intelligence]: 6, [HomunculusTrait.Diplomacy]: 3 },
    hourlyRate: 22,
};
