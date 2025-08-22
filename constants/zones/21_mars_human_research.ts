
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone21: Zone = {
    id: 'mars_human_research',
    name: 'Mars Human Research',
    image: '/assets/images/missions-backgrounds/Mars\' Human Research.jpeg',
    lore: "They weren't just hiding. They were experimenting. This facility is dedicated to creating a new breed of human, one loyal to the Order from birth. It's a perversion of life. This lab cannot be allowed to stand.",
    requiredPower: 3500,
    missionDurations: createDurations(1250, 625),
    lootTable: [
      { itemId: 'mars_research_gene_gun', chance: 0.15 },
      { itemId: 'mars_research_biohazard_suit', chance: 0.15 },
      { itemId: 'power_shard', chance: 0.04 },
      { itemId: 'mars_research_syringe', chance: 0.18 },
      { itemId: 'mars_research_lab_notes', chance: 0.12 },
    ],
    exclusiveLoot: [
        { itemId: 'mars_research_sentient_growth', duration: 'LONG' },
        { itemId: 'mars_research_prototype_implant', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+150 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 150}),
    },
    jobName: 'Ethical Oversight',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Intelligence]: 10, [HomunculusTrait.Psionics]: 8 },
    hourlyRate: 180,
};
