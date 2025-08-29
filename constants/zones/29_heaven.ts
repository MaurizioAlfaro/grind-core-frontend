
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone29: Zone = {
    id: 'heaven',
    name: 'So-called Heaven',
    image: '/images/missions-backgrounds/Heaven.png',
    lore: "I've breached the highest plane. This isn't a realm of angels, it's the server room of the universe. The beings here, the 'Architects', view our entire existence as a simulation. The Order were merely their system admins. It is time for a hard reboot.",
    requiredPower: 75000,
    missionDurations: createDurations(8000, 4000),
    lootTable: [
      { itemId: 'heaven_firewall_sword', chance: 0.15 },
      { itemId: 'heaven_holy_server_rack', chance: 0.15 },
      { itemId: 'heaven_data_stream', chance: 0.20 },
      { itemId: 'heaven_hard_light_armor', chance: 0.20 },
      { itemId: 'heaven_ring_of_code', chance: 0.10 },
      { itemId: 'heaven_source_code_tablet', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'heaven_admin_access_key', duration: 'LONG' },
        { itemId: 'heaven_genesis_seed', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+1000 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 1000}),
    },
    jobName: 'Simulation QA Tester',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Psionics]: 10, [HomunculusTrait.Intelligence]: 10, [HomunculusTrait.Tech]: 10, [HomunculusTrait.Diplomacy]: 10 },
    hourlyRate: 1000,
};
