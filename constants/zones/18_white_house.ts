
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone18: Zone = {
    id: 'white_house',
    name: 'The White House',
    image: '/images/missions-backgrounds/white house.png',
    lore: "The archives revealed the ultimate target. The President is a clone. The entire executive branch is compromised. The time for subtlety is over. I'm going to the White House to expose the truth to the world.",
    requiredPower: 1500,
    missionDurations: createDurations(600, 300),
    lootTable: [
      { itemId: 'white_house_ceremonial_sword', chance: 0.15 },
      { itemId: 'white_house_kevlar_suit', chance: 0.15 },
      { itemId: 'white_house_red_phone', chance: 0.1 },
      { itemId: 'white_house_flag_pin', chance: 0.18 },
      { itemId: 'white_house_briefcase', chance: 0.18 },
    ],
    exclusiveLoot: [
        { itemId: 'white_house_declaration_of_independence', duration: 'LONG' },
        { itemId: 'white_house_presidential_seal', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+75 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 75}),
    },
    jobName: 'Policy Intern',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Diplomacy]: 10, [HomunculusTrait.Charisma]: 10, [HomunculusTrait.Cunning]: 5 },
    hourlyRate: 100,
};
