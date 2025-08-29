
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone08: Zone = {
    id: 'data_center',
    name: 'Data Center',
    image: '/images/missions-backgrounds/Data Center.png',
    lore: "The heart of their local propaganda network. The hum of the servers is a symphony of lies. I'm inside to plant a virus that will subtly alter their 'news' feeds with inconvenient truths. The cooling system is my only cover.",
    requiredPower: 120,
    missionDurations: createDurations(65, 30),
    lootTable: [
      { itemId: 'data_center_cat5_whip', chance: 0.15 },
      { itemId: 'data_center_server_rack_panel', chance: 0.15 },
      { itemId: 'data_center_coolant_ring', chance: 0.1 },
      { itemId: 'data_center_zip_tie', chance: 0.12 },
    ],
    exclusiveLoot: [
        { itemId: 'data_center_admin_keycard', duration: 'LONG' },
        { itemId: 'data_center_firewall_charm', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+20 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 20}),
    },
    jobName: 'Cable Management',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 5, [HomunculusTrait.Intelligence]: 3 },
    hourlyRate: 20,
};
