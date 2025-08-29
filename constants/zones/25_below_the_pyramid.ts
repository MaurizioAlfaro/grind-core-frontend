
import type { Zone } from '../../types';
import { HomunculusTrait } from '../../types';

// Helper function for scaling mission durations for this massive list
const createDurations = (baseXp: number, baseGold: number) => ({
  SHORT: { seconds: 30, baseXp: baseXp, baseGold: baseGold },
  MEDIUM: { seconds: 1800, baseXp: Math.round(baseXp * 10), baseGold: Math.round(baseGold * 10) },
  LONG: { seconds: 28800, baseXp: Math.round(baseXp * 50), baseGold: Math.round(baseGold * 50) },
});

export const zone25: Zone = {
    id: 'below_the_pyramid',
    name: 'Below the Pyramid',
    image: '/assets/images/missions-backgrounds/Below the Pyramid.png',
    lore: "Another portal in Atlantis leads to the great pyramids of Egypt. As I suspected, they are not tombs, but power plants. Deep below, a focusing chamber channels ley-line energy to the Order's true masters.",
    requiredPower: 15000,
    missionDurations: createDurations(3200, 1600),
    lootTable: [
      { itemId: 'pyramid_khopesh', chance: 0.15 },
      { itemId: 'pyramid_sarcophagus_plating', chance: 0.15 },
      { itemId: 'power_shard', chance: 0.05 },
      { itemId: 'pyramid_torch', chance: 0.20 },
      { itemId: 'pyramid_mummy_wrappings', chance: 0.20 },
      { itemId: 'pyramid_scarab_brooch', chance: 0.10 },
    ],
    exclusiveLoot: [
        { itemId: 'pyramid_eye_of_ra', duration: 'LONG' },
        { itemId: 'pyramid_canopic_jar', duration: 'MEDIUM' }
    ],
    completionBonus: {
      description: "+350 Permanent Power",
      apply: (state) => ({...state, permanentPowerBonus: state.permanentPowerBonus + 350}),
    },
    jobName: 'Dig Assistant',
    workerLimit: 1,
    workRequirements: { [HomunculusTrait.Cunning]: 10, [HomunculusTrait.Intelligence]: 10, [HomunculusTrait.Luck]: 7 },
    hourlyRate: 350,
};
