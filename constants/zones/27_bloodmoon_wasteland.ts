
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone27: Zone = {
    id: 'bloodmoon_wasteland',
    name: 'Bloodmoon Wasteland',
    image: '/assets/images/missions-backgrounds/Blood Moon Wasteland.png',
    lore: "Defeating the traitor shattered his throne and transported me to a wasteland under a crimson moon. This is a prison dimension, where our greatest enemies were sealed away. The Order wasn't just controlling Earth, they were guarding this place.",
    requiredPower: 30000,
    missionDurations: createDurations(5000, 2500),
    lootTable: [
      { itemId: 'bloodmoon_chainsaw_sword', chance: 0.15 },
      { itemId: 'bloodmoon_scrapmetal_pauldrons', chance: 0.15 },
      { itemId: 'bloodmoon_shiv', chance: 0.20 },
      { itemId: 'bloodmoon_leather_straps', chance: 0.20 },
      { itemId: 'bloodmoon_demon_eye', chance: 0.10 },
      { itemId: 'bloodmoon_soul_cage', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'bloodmoon_mutagen_vial', duration: 'LONG' },
        { itemId: 'bloodmoon_eternal_flame', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+500 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 500}),
    },
    jobName: 'Scrap Collector',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Strength]: 10, [HomunculusTrait.Cunning]: 10, [HomunculusTrait.Speed]: 10 },
    hourlyRate: 500,
};
