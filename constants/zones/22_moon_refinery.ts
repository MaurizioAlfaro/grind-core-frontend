
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone22: Zone = {
    id: 'moon_refinery',
    name: 'Moon\'s Refinery',
    image: '/assets/images/missions-backgrounds/Moon\'s Refinery.png',
    lore: "Their power source for the Mars base is a refinery on the Moon, harvesting exotic energies. By destroying it, I can cripple their entire off-world presence. The vacuum of space is a minor inconvenience for my kind.",
    requiredPower: 5000,
    missionDurations: createDurations(1600, 800),
    lootTable: [
      { itemId: 'moon_refinery_plasma_cutter', chance: 0.15 },
      { itemId: 'moon_refinery_lunar_regolith_armor', chance: 0.15 },
      { itemId: 'moon_refinery_space_wrench', chance: 0.20 },
      { itemId: 'moon_refinery_magnetic_boots', chance: 0.20 },
      { itemId: 'moon_refinery_mining_laser', chance: 0.10 },
    ],
    exclusiveLoot: [{ itemId: 'moon_refinery_helium3_canister', duration: 'LONG' }],
    completionBonus: {
      description: "+200 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 200}),
    },
    jobName: 'Helium-3 Extractor',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 10, [HomunculusTrait.Strength]: 10 },
    hourlyRate: 200,
};
