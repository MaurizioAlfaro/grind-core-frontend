import mongoose from "mongoose";
import type { PlayerState } from "../../types";

const PlayerSchema = new mongoose.Schema(
  {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    dollars: { type: Number, default: 0 },
    power: { type: Number, default: 1 },
    inventory: [
      {
        _id: false,
        itemId: String,
        quantity: Number,
      },
    ],
    equipment: { type: Map, of: String, default: {} },
    equipmentUpgrades: { type: Map, of: Number, default: {} },
    equipmentEnchantments: {
      type: Map,
      of: [
        {
          _id: false,
          attributeId: String,
          tier: Number,
        },
      ],
      default: {},
    },
    unlockedZoneIds: [String],
    discoveredItemIds: { type: [String], default: [] },
    completedZoneIds: { type: [String], default: [] },
    completedLongMissionZoneIds: { type: [String], default: [] },
    permanentPowerBonus: { type: Number, default: 0 },
    powerMultiplier: { type: Number, default: 1.0 },
    activeBoosts: [
      {
        _id: false,
        type: String,
        value: Number,
        endTime: Number,
        sourceId: String,
      },
    ],
    purchasedStoreUpgradeIds: { type: [String], default: [] },
    unlockedBadgeIds: { type: [String], default: [] },
    defeatedBossIds: { type: [String], default: [] },
    purchasedLabEquipmentIds: { type: [String], default: [] },
    unlockedPermanentPerks: { type: [String], default: [] },
    globalBossCooldownEndTime: { type: Number, default: 0 },
    labLevel: { type: Number, default: 1 },
    labXp: { type: Number, default: 0 },
    homunculusCreatedCount: { type: Number, default: 0 },
    homunculi: { type: [mongoose.Schema.Types.Mixed], default: [] },
    consecutiveCancels: { type: Number, default: 0 },
    hasEquippedWeapon: { type: Boolean, default: false },
    highChanceForgeFails: { type: Number, default: 0 },
    consecutiveCommonCacheOpens: { type: Number, default: 0 },
    missionsCompleted: { type: Number, default: 0 },
    hasReceivedInitialBoost: { type: Boolean, default: false },
    tutorialStep: { type: Number, default: 1 },
    tutorialCompleted: { type: Boolean, default: false },
    activeMission: {
      zoneId: String,
      startTime: Number,
      endTime: Number,
      durationKey: String,
      preRolledRewards: {
        xp: Number,
        gold: Number,
        dollars: Number,
        items: [
          {
            _id: false,
            itemId: String,
            quantity: Number,
          },
        ],
      },
    },
    isWalletConnected: { type: Boolean, default: false },
    ownsReptilianzNFT: { type: Boolean, default: false },
    hasSeenWalletConnectPrompt: { type: Boolean, default: false },
    bossDefeatCounts: { type: Map, of: Number, default: {} },
    dailySafeguardUses: { type: Map, of: Number, default: {} },
    lastSafeguardUseTimestamp: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    minimize: false, // Important to store empty objects/maps
  }
);

// Type workaround for Mongoose document
interface PlayerDocument extends PlayerState, mongoose.Document {}

export default mongoose.model<PlayerDocument>("Player", PlayerSchema);
