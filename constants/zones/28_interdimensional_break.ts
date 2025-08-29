
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone28: Zone = {
    id: 'interdimensional_break',
    name: 'Interdimensional Break',
    image: '/images/missions-backgrounds/Interdimensional break.png',
    lore: "The fabric of reality tears. I see glimpses of other worlds, other possibilities. The barriers between dimensions are failing. I must find a way to stabilize this realm before it collapses and unleashes its prisoners upon the universe.",
    requiredPower: 45000,
    missionDurations: createDurations(6500, 3250),
    lootTable: [
      { itemId: 'interdimensional_reality_blade', chance: 0.15 },
      { itemId: 'interdimensional_paradox_plate', chance: 0.15 },
      { itemId: 'interdimensional_glitch_fragment', chance: 0.20 },
      { itemId: 'interdimensional_shifting_cloak', chance: 0.20 },
      { itemId: 'interdimensional_fractal_ring', chance: 0.10 },
      { itemId: 'interdimensional_causality_knot', chance: 0.08 },
    ],
    exclusiveLoot: [
        { itemId: 'interdimensional_broken_hourglass', duration: 'LONG' },
        { itemId: 'interdimensional_echo_of_the_future', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+750 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 750}),
    },
    jobName: 'Reality Stabilizer',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Psionics]: 10, [HomunculusTrait.Luck]: 10, [HomunculusTrait.Intelligence]: 10 },
    hourlyRate: 750,
};
