import mongoose from "mongoose";
import type { PlayerState } from "../../types";

const PlayerSchema = new mongoose.Schema(
  {
    user: { type: String, unique: true, sparse: true },
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
    equipment: { type: Object, default: {} },
    equipmentUpgrades: { type: Object, default: {} },
    equipmentEnchantments: {
      type: Object,
      default: {},
    },
    unlockedZoneIds: [String],
    discoveredItemIds: { type: [String], default: [] },
    completedZoneIds: { type: [String], default: [] },
    completedLongMissionZoneIds: { type: [String], default: [] },
    permanentPowerBonus: { type: Number, default: 0 },
    powerMultiplier: { type: Number, default: 1.0 },
    activeBoosts: {
      type: [
        {
          _id: false,
          boostType: String,
          value: Number,
          endTime: Number,
          sourceId: String,
        },
      ],
      default: [],
    },
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
    tutorialStep: { type: Number, default: 99 },
    tutorialCompleted: { type: Boolean, default: true },
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
    walletAddress: { type: String, unique: true, sparse: true },
    guestId: { type: String, unique: true, sparse: true },
    isWalletConnected: { type: Boolean, default: false },
    ownsReptilianzNFT: { type: Boolean, default: false },
    hasSeenWalletConnectPrompt: { type: Boolean, default: false },
    reptilianzNFTs: {
      type: [
        {
          _id: false,
          name: String,
          tokenNumber: Number,
          json_uri: String,
          image: String,
          assetId: String,
        },
      ],
      default: [],
    },
    bossDefeatCounts: { type: Object, default: {} },
    dailySafeguardUses: { type: Object, default: {} },
    lastSafeguardUseTimestamp: { type: Number, default: 0 },
    displayName: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
    minimize: false, // Important to store empty objects/maps
  }
);

// Type workaround for Mongoose document
interface PlayerDocument extends PlayerState, mongoose.Document {}

export default mongoose.model<PlayerDocument>("Player", PlayerSchema);
