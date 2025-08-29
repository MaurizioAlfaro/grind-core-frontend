
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone23: Zone = {
    id: 'ancient_moon_temple',
    name: 'Ancient Moon Temple',
    image: '/images/missions-backgrounds/Ancient Moon Temple.png',
    lore: "While sabotaging the refinery, I discovered something impossible: an ancient temple, buried beneath the lunar dust. It predates humanity. It seems the Order did not build on the Moon, they occupied it. What secrets does this place hold?",
    requiredPower: 7000,
    missionDurations: createDurations(2000, 1000),
    lootTable: [
      { itemId: 'moon_temple_energy_lance', chance: 0.15 },
      { itemId: 'moon_temple_ceremonial_robes', chance: 0.15 },
      { itemId: 'moon_temple_dusty_tome', chance: 0.20 },
      { itemId: 'moon_temple_star_chart', chance: 0.12 },
      { itemId: 'moon_temple_alien_artifact', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'moon_temple_lunar_relic', duration: 'LONG' },
        { itemId: 'moon_temple_gravity_orb', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+250 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 250}),
    },
    jobName: 'Artifact Conservator',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Psionics]: 10, [HomunculusTrait.Luck]: 8 },
    hourlyRate: 250,
};
