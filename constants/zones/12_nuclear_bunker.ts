
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone12: Zone = {
    id: 'nuclear_bunker',
    name: 'Nuclear Bunker',
    image: '/images/missions-backgrounds/Nuclear Bunker.png',
    lore: "Intel from the crash site leads me to a decommissioned nuclear bunker. It's not abandoned. It's a command center for one of the Order's regional directors. Time to go knock on a very, very thick door.",
    requiredPower: 320,
    missionDurations: createDurations(150, 75),
    lootTable: [
      { itemId: 'bunker_lead_pipe', chance: 0.15 },
      { itemId: 'bunker_hazmat_suit', chance: 0.15 },
      { itemId: 'bunker_geiger_counter', chance: 0.1 },
      { itemId: 'power_shard', chance: 0.025 },
    ],
    exclusiveLoot: [{ itemId: 'bunker_launch_key', duration: 'LONG' }],
    completionBonus: {
      description: "+30 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 30}),
    },
    jobName: 'Security Guard',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 8, [HomunculusTrait.Strength]: 6 },
    hourlyRate: 35,
};
