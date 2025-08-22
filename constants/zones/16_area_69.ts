
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone16: Zone = {
    id: 'area_69',
    name: 'Area 69',
    image: '/assets/images/missions-backgrounds/Area 69.jpeg',
    lore: "The director's briefcase revealed the location of their primary research facility: Area 69. It's exactly what the human conspiracy theorists imagined, and worse. I'm going in deep to uncover the truth of their origins.",
    requiredPower: 800,
    missionDurations: createDurations(350, 175),
    lootTable: [
      { itemId: 'area_69_laser_pistol', chance: 0.15 },
      { itemId: 'area_69_alien_exoskeleton', chance: 0.15 },
      { itemId: 'area_69_alien_probe_misc', chance: 0.1 },
      { itemId: 'power_shard', chance: 0.03 },
    ],
    exclusiveLoot: [{ itemId: 'area_69_mind_control_helmet', duration: 'LONG' }],
    completionBonus: {
      description: "+50 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 50}),
    },
    jobName: 'Lab Assistant',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Stealth]: 10, [HomunculusTrait.Tech]: 10 },
    hourlyRate: 70,
};
