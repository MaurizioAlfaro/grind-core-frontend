
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone11: Zone = {
    id: 'crash_site',
    name: 'Crash Site',
    image: '/images/missions-backgrounds/Crash Site.png',
    lore: "The resistance has downed an Order transport ship. It's a race against time to salvage its cargo and black box before their cleanup crews arrive. The technology within could be a game-changer.",
    requiredPower: 250,
    missionDurations: createDurations(125, 60),
    lootTable: [
        { itemId: 'crash_site_blaster', chance: 0.1 },
        { itemId: 'crash_site_plating', chance: 0.1 },
        { itemId: 'crash_site_energy_core', chance: 0.1 },
        { itemId: 'crash_site_scrap_metal', chance: 0.18 },
        { itemId: 'crash_site_tattered_parachute', chance: 0.18 },
    ],
    exclusiveLoot: [{ itemId: 'crash_site_zero_point_module', duration: 'LONG' }],
    completionBonus: {
      description: "+25 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 25}),
    },
    jobName: 'Scavenger',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 7, [HomunculusTrait.Speed]: 5 },
    hourlyRate: 30,
};
