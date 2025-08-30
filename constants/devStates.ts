import type { PlayerState, Homunculus, HomunculusTraits } from "../types";
import { ItemRarity, HomunculusTrait, EquipmentSlot, ItemType } from "../types";
import { ZONES } from "./zones";
import { ITEMS } from "./items";
import { BOSSES } from "./bosses";
import { LAB_EQUIPMENT } from "./lab";
import { BADGE_UNLOCK_CONDITIONS } from "./badges";
import { CORE_COMPONENT_ID } from "./homunculus";
import { LEVEL_XP_REQUIREMENTS } from "./player";

// --- HELPERS ---

const getUnlockedZonesUpTo = (count: number): string[] =>
  ZONES.slice(0, count).map((z) => z.id);
const getCompletedZonesUpTo = (count: number): string[] =>
  getUnlockedZonesUpTo(count);
const getDefeatedBossesUpTo = (zoneCount: number): string[] => {
  const unlockedZoneIds = new Set(getUnlockedZonesUpTo(zoneCount));
  return Object.values(BOSSES)
    .filter((b) => unlockedZoneIds.has(b.zoneId))
    .map((b) => b.id);
};
const getDiscoveredItemsForZones = (zoneIds: string[]): string[] => {
  const discovered = new Set<string>();
  ZONES.forEach((zone) => {
    if (zoneIds.includes(zone.id)) {
      zone.lootTable.forEach((loot) => discovered.add(loot.itemId));
      if (zone.exclusiveLoot) {
        zone.exclusiveLoot.forEach((loot) => discovered.add(loot.itemId));
      }
    }
  });
  const defeatedBosses = Object.values(BOSSES).filter((b) =>
    zoneIds.includes(b.zoneId)
  );
  defeatedBosses.forEach((boss) => {
    boss.lootTable.forEach((loot) => discovered.add(loot.itemId));
  });
  return Array.from(discovered);
};
const createHomunculus = (
  id: number,
  rarity: ItemRarity,
  isAdult: boolean,
  traits: Partial<HomunculusTraits>,
  workZoneId: string | null = null
): Homunculus => ({
  id: Date.now() - id * 1000, // unique id
  rarity,
  isAdult,
  hibernationEndTime: null,
  traits: {
    [HomunculusTrait.Intelligence]: 0,
    [HomunculusTrait.Speed]: 0,
    [HomunculusTrait.Charisma]: 0,
    [HomunculusTrait.Diplomacy]: 0,
    [HomunculusTrait.Strength]: 0,
    [HomunculusTrait.Stealth]: 0,
    [HomunculusTrait.Luck]: 0,
    [HomunculusTrait.Cunning]: 0,
    [HomunculusTrait.Tech]: 0,
    [HomunculusTrait.Psionics]: 0,
    ...traits,
  },
  work: workZoneId ? { zoneId: workZoneId, startTime: Date.now() } : null,
  equipment: {},
});

const getBadgesForState = (state: PlayerState): string[] => {
  const unlocked: string[] = [];
  for (const badgeId in BADGE_UNLOCK_CONDITIONS) {
    if (BADGE_UNLOCK_CONDITIONS[badgeId](state)) {
      unlocked.push(badgeId);
    }
  }
  return unlocked;
};

const baseStateAdditions = {
  bossDefeatCounts: {},
  dailySafeguardUses: {},
  lastSafeguardUseTimestamp: 0,
  walletAddress: undefined,
  guestId: undefined,
  isWalletConnected: false,
  ownsReptilianzNFT: false,
  hasSeenWalletConnectPrompt: false,
  displayName: undefined,
};

const completedTutorialState = {
  tutorialStep: 99,
  tutorialCompleted: true,
};

// --- STATE DEFINITIONS ---

export const DEV_PLAYER_STATES: PlayerState[] = [];

// MODE 0: Fresh Start
DEV_PLAYER_STATES[0] = {
  level: 1,
  xp: 0,
  gold: 0,
  dollars: 0,
  power: 0,
  inventory: [],
  equipment: {},
  equipmentUpgrades: {},
  unlockedZoneIds: ["caffeteria"],
  discoveredItemIds: [],
  completedZoneIds: [],
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [],
  unlockedBadgeIds: [],
  defeatedBossIds: [],
  globalBossCooldownEndTime: 0,
  completedLongMissionZoneIds: [],
  unlockedPermanentPerks: [],
  labLevel: 1,
  labXp: 0,
  purchasedLabEquipmentIds: [],
  homunculusCreatedCount: 0,
  homunculi: [],
  consecutiveCancels: 0,
  hasEquippedWeapon: false,
  highChanceForgeFails: 0,
  consecutiveCommonCacheOpens: 0,
  missionsCompleted: 0,
  hasReceivedInitialBoost: false,
  ...completedTutorialState,
  ...baseStateAdditions,
};

// MODE 1: Early Progression
let state1: PlayerState = {
  level: 5,
  xp: 1000,
  gold: 1000,
  dollars: 10,
  power: 0,
  inventory: [{ itemId: "power_shard", quantity: 5 }],
  equipment: { Weapon: "cafeteria_spork", Armor: "supermarket_vest" },
  equipmentUpgrades: { Weapon: 1 },
  unlockedZoneIds: getUnlockedZonesUpTo(3),
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(3)),
  completedZoneIds: getCompletedZonesUpTo(1),
  completedLongMissionZoneIds: getCompletedZonesUpTo(1),
  defeatedBossIds: getDefeatedBossesUpTo(1),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 1,
  labXp: 0,
  purchasedLabEquipmentIds: [],
  homunculusCreatedCount: 0,
  homunculi: [],
  missionsCompleted: 10,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state1.unlockedBadgeIds = getBadgesForState(state1);
DEV_PLAYER_STATES[1] = state1;

// MODE 2: First Homunculus
let state2: PlayerState = {
  level: 15,
  xp: 604500,
  gold: 25000,
  dollars: 100,
  power: 0,
  inventory: [
    { itemId: "power_shard", quantity: 20 },
    { itemId: "reptilian_scale", quantity: 5 },
    { itemId: "cybernetic_eye", quantity: 2 },
    { itemId: CORE_COMPONENT_ID, quantity: 1 },
  ],
  equipment: {
    Weapon: "post_office_opener",
    Armor: "post_office_uniform",
    Ring: "post_office_signet_ring",
  },
  equipmentUpgrades: { Weapon: 2, Armor: 2, Ring: 1 },
  unlockedZoneIds: getUnlockedZonesUpTo(6),
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(6)),
  completedZoneIds: getCompletedZonesUpTo(4),
  completedLongMissionZoneIds: getCompletedZonesUpTo(4),
  defeatedBossIds: getDefeatedBossesUpTo(4),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 2,
  labXp: 5000,
  purchasedLabEquipmentIds: ["auto_loader"],
  homunculusCreatedCount: 1,
  homunculi: [
    createHomunculus(1, ItemRarity.Rare, false, { Intelligence: 2, Speed: 1 }),
  ],
  missionsCompleted: 50,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state2.unlockedBadgeIds = getBadgesForState(state2);
DEV_PLAYER_STATES[2] = state2;

// MODE 3: Mid-Game Start
let state3: PlayerState = {
  level: 25,
  xp: 3170000,
  gold: 100000,
  dollars: 500,
  power: 0,
  inventory: [{ itemId: "power_shard", quantity: 50 }],
  equipment: {
    Weapon: "office_keyboard",
    Armor: "office_suit_jacket",
    Ring: "post_office_signet_ring",
    Amulet: "office_locket",
    Misc: "office_badge",
  },
  equipmentUpgrades: { Weapon: 4, Armor: 4, Ring: 3, Amulet: 3, Misc: 2 },
  unlockedZoneIds: getUnlockedZonesUpTo(9),
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(9)),
  completedZoneIds: getCompletedZonesUpTo(7),
  completedLongMissionZoneIds: getCompletedZonesUpTo(7),
  defeatedBossIds: getDefeatedBossesUpTo(7),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: ["upgrade_xp_1"],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 4,
  labXp: 0,
  purchasedLabEquipmentIds: ["auto_loader"],
  homunculusCreatedCount: 2,
  homunculi: [
    createHomunculus(
      2,
      ItemRarity.Rare,
      true,
      { Strength: 4, Speed: 3 },
      "gym"
    ),
    createHomunculus(3, ItemRarity.Epic, false, { Intelligence: 3, Tech: 2 }),
  ],
  missionsCompleted: 100,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state3.unlockedBadgeIds = getBadgesForState(state3);
DEV_PLAYER_STATES[3] = state3;

// MODE 4: Mid-Game Deep
let state4: PlayerState = {
  level: 35,
  xp: 16600000,
  gold: 500000,
  dollars: 2000,
  power: 0,
  inventory: [{ itemId: "power_shard", quantity: 100 }],
  equipment: {
    Weapon: "crash_site_blaster",
    Armor: "crash_site_plating",
    Ring: "post_office_signet_ring",
    Amulet: "office_locket",
  },
  equipmentUpgrades: { Weapon: 6, Armor: 6, Ring: 5, Amulet: 5, Misc: 5 },
  unlockedZoneIds: getUnlockedZonesUpTo(13),
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(13)),
  completedZoneIds: getCompletedZonesUpTo(11),
  completedLongMissionZoneIds: getCompletedZonesUpTo(11),
  defeatedBossIds: getDefeatedBossesUpTo(11),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: ["upgrade_xp_1", "upgrade_gold_1"],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 6,
  labXp: 0,
  purchasedLabEquipmentIds: ["auto_loader", "catalytic_converter"],
  homunculusCreatedCount: 4,
  homunculi: [
    createHomunculus(
      4,
      ItemRarity.Epic,
      true,
      { Tech: 7, Intelligence: 5 },
      "data_center"
    ),
    createHomunculus(
      5,
      ItemRarity.Rare,
      true,
      { Strength: 6, Speed: 5 },
      "gym"
    ),
    createHomunculus(6, ItemRarity.Epic, false, { Cunning: 4, Stealth: 4 }),
    createHomunculus(7, ItemRarity.Rare, false, {}),
  ],
  missionsCompleted: 150,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state4.unlockedBadgeIds = getBadgesForState(state4);
DEV_PLAYER_STATES[4] = state4;

// MODE 5: Late-Game Threshold
let state5: PlayerState = {
  level: 50,
  xp: 168458000,
  gold: 2000000,
  dollars: 10000,
  power: 0,
  inventory: [{ itemId: "power_shard", quantity: 250 }],
  equipment: {
    Weapon: "boss_the_alien_probe",
    Armor: "boss_sentient_mops_bucket",
    Ring: "boss_the_big_red_button",
    Amulet: "boss_the_last_hot_dog",
    Misc: "boss_the_neuralyzer",
  },
  equipmentUpgrades: { Weapon: 10, Armor: 10, Ring: 10, Amulet: 10, Misc: 10 },
  unlockedZoneIds: getUnlockedZonesUpTo(18),
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(18)),
  completedZoneIds: getCompletedZonesUpTo(16),
  completedLongMissionZoneIds: getCompletedZonesUpTo(16),
  defeatedBossIds: getDefeatedBossesUpTo(16),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [
    "upgrade_xp_1",
    "upgrade_gold_1",
    "upgrade_loot_1",
  ],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 8,
  labXp: 0,
  purchasedLabEquipmentIds: [
    "auto_loader",
    "catalytic_converter",
    "resonance_chamber",
  ],
  homunculusCreatedCount: 6,
  homunculi: [
    createHomunculus(
      8,
      ItemRarity.Epic,
      true,
      { Tech: 10, Intelligence: 8, Psionics: 4 },
      "cloning_facility"
    ),
    createHomunculus(
      9,
      ItemRarity.Legendary,
      true,
      { Strength: 10, Stealth: 8, Cunning: 6 },
      "area_69"
    ),
    createHomunculus(
      10,
      ItemRarity.Epic,
      true,
      { Charisma: 8, Diplomacy: 7 },
      "white_house"
    ),
    createHomunculus(11, ItemRarity.Epic, false, { Luck: 5 }),
    createHomunculus(12, ItemRarity.Rare, false, {}),
  ],
  missionsCompleted: 200,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state5.unlockedBadgeIds = getBadgesForState(state5);
DEV_PLAYER_STATES[5] = state5;

// MODE 6: Entering Space
let state6: PlayerState = {
  level: 60,
  xp: 1040392000,
  gold: 10000000,
  dollars: 50000,
  power: 0,
  inventory: [],
  equipment: {
    Weapon: "boss_presidents_secret",
    Armor: "boss_the_perfect_copy",
    Ring: "boss_the_big_red_button",
    Amulet: "boss_the_priority_tag",
    Misc: "boss_sash_of_supreme_authority",
  },
  equipmentUpgrades: { Weapon: 12, Armor: 12, Ring: 12, Amulet: 12, Misc: 12 },
  unlockedZoneIds: getUnlockedZonesUpTo(21), // Up to Mars Base
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(21)),
  completedZoneIds: getCompletedZonesUpTo(19),
  completedLongMissionZoneIds: getCompletedZonesUpTo(19),
  defeatedBossIds: getDefeatedBossesUpTo(19),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [
    "upgrade_xp_1",
    "upgrade_gold_1",
    "upgrade_loot_1",
  ],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 10,
  labXp: 0,
  purchasedLabEquipmentIds: Object.keys(LAB_EQUIPMENT),
  homunculusCreatedCount: 8,
  homunculi: [
    createHomunculus(
      13,
      ItemRarity.Legendary,
      true,
      { Tech: 10, Strength: 10, Intelligence: 8 },
      "mars_base"
    ),
    ...state5.homunculi,
  ],
  missionsCompleted: 250,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state6.unlockedBadgeIds = getBadgesForState(state6);
DEV_PLAYER_STATES[6] = state6;

// MODE 7: Deep Space
let state7: PlayerState = {
  level: 70,
  xp: 6425395000,
  gold: 25000000,
  dollars: 150000,
  power: 0,
  inventory: [],
  equipment: {
    Weapon: "boss_illudium_q-36",
    Armor: "boss_silver-lined_oxygen_tank",
    Ring: "boss_the_cosmic_snooze_button",
    Amulet: "boss_the_pacifier_of_silence",
    Misc: "boss_tinfoil_hat_of_ultimate_protection",
  },
  equipmentUpgrades: { Weapon: 15, Armor: 13, Ring: 13, Amulet: 13, Misc: 13 },
  unlockedZoneIds: getUnlockedZonesUpTo(25), // up to atlantis
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(25)),
  completedZoneIds: getCompletedZonesUpTo(23),
  completedLongMissionZoneIds: getCompletedZonesUpTo(23),
  defeatedBossIds: getDefeatedBossesUpTo(23),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [
    "upgrade_xp_1",
    "upgrade_gold_1",
    "upgrade_loot_1",
  ],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 10,
  labXp: 0,
  purchasedLabEquipmentIds: Object.keys(LAB_EQUIPMENT),
  homunculusCreatedCount: 12,
  homunculi: [
    createHomunculus(
      14,
      ItemRarity.Legendary,
      true,
      { Psionics: 10, Luck: 8 },
      "ancient_moon_temple"
    ),
    ...state6.homunculi,
  ],
  missionsCompleted: 300,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state7.unlockedBadgeIds = getBadgesForState(state7);
DEV_PLAYER_STATES[7] = state7;

// MODE 8: Interdimensional
let state8: PlayerState = {
  level: 80,
  xp: 39683400000,
  gold: 75000000,
  dollars: 500000,
  power: 0,
  inventory: [],
  equipment: {
    Weapon: "boss_the_royal_plunger",
    Armor: "boss_junk-forged_exosuit",
    Ring: "boss_scales_of_work-life_balance",
    Amulet: "boss_the_fragmented_crown",
    Misc: "boss_steves_clipboard",
  },
  equipmentUpgrades: { Weapon: 15, Armor: 14, Ring: 14, Amulet: 14, Misc: 14 },
  unlockedZoneIds: getUnlockedZonesUpTo(28),
  discoveredItemIds: getDiscoveredItemsForZones(getUnlockedZonesUpTo(28)),
  completedZoneIds: getCompletedZonesUpTo(27),
  completedLongMissionZoneIds: getCompletedZonesUpTo(27),
  defeatedBossIds: getDefeatedBossesUpTo(27),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [
    "upgrade_xp_1",
    "upgrade_gold_1",
    "upgrade_loot_1",
  ],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 10,
  labXp: 0,
  purchasedLabEquipmentIds: Object.keys(LAB_EQUIPMENT),
  homunculusCreatedCount: 15,
  homunculi: [
    createHomunculus(
      15,
      ItemRarity.Legendary,
      true,
      {
        ...Object.values(HomunculusTrait).reduce(
          (a, v) => ({ ...a, [v]: 10 }),
          {}
        ),
      },
      "heaven"
    ),
    ...state7.homunculi,
  ],
  missionsCompleted: 350,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state8.unlockedBadgeIds = getBadgesForState(state8);
DEV_PLAYER_STATES[8] = state8;

// MODE 9: Almost There
let state9: PlayerState = {
  level: 90,
  xp: 245062000000,
  gold: 200000000,
  dollars: 2000000,
  power: 0,
  inventory: [],
  equipment: {
    Weapon: "boss_the_tranq_gun",
    Armor: "boss_junk-forged_exosuit",
    Ring: "boss_the_cosmic_snooze_button",
    Amulet: "boss_grandfathers_pocketwatch",
    Misc: "boss_the_elders_skull",
  },
  equipmentUpgrades: {
    [EquipmentSlot.Weapon]: 15,
    [EquipmentSlot.Armor]: 15,
    [EquipmentSlot.Ring]: 15,
    [EquipmentSlot.Amulet]: 15,
    [EquipmentSlot.Misc]: 15,
  },
  unlockedZoneIds: getUnlockedZonesUpTo(ZONES.length - 1),
  discoveredItemIds: getDiscoveredItemsForZones(
    getUnlockedZonesUpTo(ZONES.length - 1)
  ),
  completedZoneIds: getCompletedZonesUpTo(ZONES.length - 1),
  completedLongMissionZoneIds: getCompletedZonesUpTo(ZONES.length - 1),
  defeatedBossIds: getDefeatedBossesUpTo(ZONES.length - 2),
  permanentPowerBonus: 0,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [
    "upgrade_xp_1",
    "upgrade_gold_1",
    "upgrade_loot_1",
  ],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 10,
  labXp: 0,
  purchasedLabEquipmentIds: Object.keys(LAB_EQUIPMENT),
  homunculusCreatedCount: 18,
  homunculi: [
    ...state8.homunculi.map((h) => ({
      ...h,
      isAdult: true,
      traits: Object.values(HomunculusTrait).reduce(
        (a, v) => ({ ...a, [v]: 10 }),
        {} as HomunculusTraits
      ),
    })),
  ],
  missionsCompleted: 400,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state9.unlockedBadgeIds = getBadgesForState(state9);
DEV_PLAYER_STATES[9] = state9;

// MODE 10: Everything Unlocked
let state10: PlayerState = {
  level: 100,
  xp: 999999999,
  gold: 999999999,
  dollars: 9999999,
  power: 0,
  inventory: Object.keys(ITEMS).map((id) => ({ itemId: id, quantity: 100 })),
  equipment: {
    Weapon: "boss_the_tranq_gun",
    Armor: "boss_junk-forged_exosuit",
    Ring: "boss_the_cosmic_snooze_button",
    Amulet: "boss_grandfathers_pocketwatch",
    Misc: "boss_the_elders_skull",
  },
  equipmentUpgrades: {
    [EquipmentSlot.Weapon]: 15,
    [EquipmentSlot.Armor]: 15,
    [EquipmentSlot.Ring]: 15,
    [EquipmentSlot.Amulet]: 15,
    [EquipmentSlot.Misc]: 15,
  },
  unlockedZoneIds: getUnlockedZonesUpTo(ZONES.length),
  discoveredItemIds: Object.keys(ITEMS),
  completedZoneIds: getCompletedZonesUpTo(ZONES.length),
  completedLongMissionZoneIds: getCompletedZonesUpTo(ZONES.length),
  defeatedBossIds: getDefeatedBossesUpTo(ZONES.length),
  permanentPowerBonus: 5000,
  powerMultiplier: 1.0,
  activeBoosts: [],
  purchasedStoreUpgradeIds: [
    "upgrade_xp_1",
    "upgrade_gold_1",
    "upgrade_loot_1",
  ],
  unlockedBadgeIds: [],
  globalBossCooldownEndTime: 0,
  unlockedPermanentPerks: [],
  labLevel: 10,
  labXp: 0,
  purchasedLabEquipmentIds: Object.keys(LAB_EQUIPMENT),
  homunculusCreatedCount: 20,
  homunculi: [
    ...Array.from({ length: 15 }).map((_, i) =>
      createHomunculus(
        20 + i,
        ItemRarity.Legendary,
        true,
        Object.values(HomunculusTrait).reduce(
          (a, v) => ({ ...a, [v]: 10 }),
          {} as Partial<HomunculusTraits>
        ),
        ZONES[ZONES.length - 1].id
      )
    ),
    ...Array.from({ length: 5 }).map((_, i) =>
      createHomunculus(35 + i, ItemRarity.Legendary, false, {})
    ),
  ],
  missionsCompleted: 500,
  hasReceivedInitialBoost: true,
  ...completedTutorialState,
  ...baseStateAdditions,
};
state10.unlockedBadgeIds = getBadgesForState(state10);
DEV_PLAYER_STATES[10] = state10;
