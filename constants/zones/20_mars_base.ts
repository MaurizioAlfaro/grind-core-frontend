
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone20: Zone = {
    id: 'mars_base',
    name: 'Mars\' Base',
    image: '/assets/images/missions-backgrounds/Mars\' Base.jpeg',
    lore: "The signal leads here. Mars. The Order had an entire off-world base, a contingency plan. They are regrouping, preparing a counter-invasion. I cannot let them return. I must dismantle their Martian operations.",
    requiredPower: 2800,
    missionDurations: createDurations(1000, 500),
    lootTable: [
      { itemId: 'mars_base_phaser', chance: 0.15 },
      { itemId: 'mars_base_spacesuit', chance: 0.15 },
      { itemId: 'mars_base_rover_wheel', chance: 0.1 },
      { itemId: 'mars_base_rock_sample', chance: 0.20 },
      { itemId: 'mars_base_antenna', chance: 0.18 },
    ],
    exclusiveLoot: [{ itemId: 'mars_base_red_dust_pendant', duration: 'LONG' }],
    completionBonus: {
      description: "+125 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 125}),
    },
    jobName: 'Terraforming Engineer',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Tech]: 10, [HomunculusTrait.Strength]: 10, [HomunculusTrait.Intelligence]: 8 },
    hourlyRate: 150,
};
