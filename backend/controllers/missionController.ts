import asyncHandler from "express-async-handler";
import {
  startMission as startMissionLogic,
  claimMission as claimMissionLogic,
  cancelMission as cancelMissionLogic,
} from "../logic";

// Note: In this simplified model, `activeMission` is stored on the client.
// A more robust backend would store this in the database as well.
// For this project, we receive the activeMission from the client to claim it.

export const startMission = asyncHandler(async (req: any, res: any) => {
  const { zoneId, durationKey, isDevMode } = req.body;
  const player = req.player.toObject();

  const result = startMissionLogic(player, zoneId, durationKey, isDevMode);

  if (result.success && result.activeMission) {
    // Save the active mission to the player document
    const playerDoc = req.player;
    playerDoc.activeMission = result.activeMission;
    await playerDoc.save();

    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

export const claimMission = asyncHandler(async (req: any, res: any) => {
  console.log("🔍 [missionController.claimMission] Starting claim mission");

  const playerDoc = req.player;
  console.log(2222, playerDoc);
  const activeMission = playerDoc.activeMission;

  if (!activeMission) {
    res.status(400).json({ success: false, message: "No active mission." });
    return;
  }

  console.log(
    "🔍 [missionController.claimMission] Current playerDoc.activeBoosts:",
    JSON.stringify(playerDoc.activeBoosts, null, 2)
  );
  console.log(
    "🔍 [missionController.claimMission] Current playerDoc.activeBoosts type:",
    typeof playerDoc.activeBoosts
  );
  console.log(
    "🔍 [missionController.claimMission] Current playerDoc.activeBoosts isArray:",
    Array.isArray(playerDoc.activeBoosts)
  );

  const result = claimMissionLogic(playerDoc.toObject(), activeMission);

  if (result.success && result.newPlayerState) {
    console.log(
      "🔍 [missionController.claimMission] Logic result.newPlayerState.activeBoosts:",
      JSON.stringify(result.newPlayerState.activeBoosts, null, 2)
    );
    console.log(
      "🔍 [missionController.claimMission] Logic result.newPlayerState.activeBoosts type:",
      typeof result.newPlayerState.activeBoosts
    );
    console.log(
      "🔍 [missionController.claimMission] Logic result.newPlayerState.activeBoosts isArray:",
      Array.isArray(result.newPlayerState.activeBoosts)
    );

    // Check if activeBoosts is somehow a string
    if (typeof result.newPlayerState.activeBoosts === "string") {
      console.log(
        "🔍 [missionController.claimMission] WARNING: activeBoosts is already a string!"
      );
      console.log(
        "🔍 [missionController.claimMission] String content:",
        result.newPlayerState.activeBoosts
      );
    }

    console.log(
      "🔍 [missionController.claimMission] About to update playerDoc properties individually"
    );
    console.log(
      "🔍 [missionController.claimMission] playerDoc before updates:",
      JSON.stringify(playerDoc.toObject(), null, 2)
    );

    // Update properties individually instead of using Object.assign to avoid Mongoose document corruption
    playerDoc.level = result.newPlayerState.level;
    playerDoc.xp = result.newPlayerState.xp;
    playerDoc.gold = result.newPlayerState.gold;
    playerDoc.dollars = result.newPlayerState.dollars;
    playerDoc.power = result.newPlayerState.power;
    playerDoc.inventory = result.newPlayerState.inventory;
    playerDoc.equipment = result.newPlayerState.equipment;
    playerDoc.equipmentUpgrades = result.newPlayerState.equipmentUpgrades;
    playerDoc.equipmentEnchantments =
      result.newPlayerState.equipmentEnchantments;
    playerDoc.unlockedZoneIds = result.newPlayerState.unlockedZoneIds;
    playerDoc.discoveredItemIds = result.newPlayerState.discoveredItemIds;
    playerDoc.completedZoneIds = result.newPlayerState.completedZoneIds;
    playerDoc.completedLongMissionZoneIds =
      result.newPlayerState.completedLongMissionZoneIds;
    playerDoc.permanentPowerBonus = result.newPlayerState.permanentPowerBonus;
    playerDoc.powerMultiplier = result.newPlayerState.powerMultiplier;
    console.log(1111, result.newPlayerState.activeBoosts);
    // playerDoc.activeBoosts = result.newPlayerState.activeBoosts;
    playerDoc.purchasedStoreUpgradeIds =
      result.newPlayerState.purchasedStoreUpgradeIds;
    playerDoc.unlockedBadgeIds = result.newPlayerState.unlockedBadgeIds;
    playerDoc.defeatedBossIds = result.newPlayerState.defeatedBossIds;
    playerDoc.purchasedLabEquipmentIds =
      result.newPlayerState.purchasedLabEquipmentIds;
    playerDoc.unlockedPermanentPerks =
      result.newPlayerState.unlockedPermanentPerks;
    playerDoc.globalBossCooldownEndTime =
      result.newPlayerState.globalBossCooldownEndTime;
    playerDoc.labLevel = result.newPlayerState.labLevel;
    playerDoc.labXp = result.newPlayerState.labXp;
    playerDoc.homunculusCreatedCount =
      result.newPlayerState.homunculusCreatedCount;
    playerDoc.homunculi = result.newPlayerState.homunculi;
    playerDoc.consecutiveCancels = result.newPlayerState.consecutiveCancels;
    playerDoc.hasEquippedWeapon = result.newPlayerState.hasEquippedWeapon;
    playerDoc.highChanceForgeFails = result.newPlayerState.highChanceForgeFails;
    playerDoc.consecutiveCommonCacheOpens =
      result.newPlayerState.consecutiveCommonCacheOpens;
    playerDoc.missionsCompleted = result.newPlayerState.missionsCompleted;
    playerDoc.hasReceivedInitialBoost =
      result.newPlayerState.hasReceivedInitialBoost;
    playerDoc.tutorialStep = result.newPlayerState.tutorialStep;
    playerDoc.tutorialCompleted = result.newPlayerState.tutorialCompleted;
    playerDoc.isWalletConnected = result.newPlayerState.isWalletConnected;
    playerDoc.ownsReptilianzNFT = result.newPlayerState.ownsReptilianzNFT;
    playerDoc.hasSeenWalletConnectPrompt =
      result.newPlayerState.hasSeenWalletConnectPrompt;
    playerDoc.bossDefeatCounts = result.newPlayerState.bossDefeatCounts;
    playerDoc.dailySafeguardUses = result.newPlayerState.dailySafeguardUses;
    playerDoc.lastSafeguardUseTimestamp =
      result.newPlayerState.lastSafeguardUseTimestamp;

    console.log(
      "🔍 [missionController.claimMission] After individual property updates, playerDoc.activeBoosts:",
      JSON.stringify(playerDoc.activeBoosts, null, 2)
    );
    console.log(
      "🔍 [missionController.claimMission] After individual property updates, playerDoc.activeBoosts type:",
      typeof playerDoc.activeBoosts
    );
    console.log(
      "🔍 [missionController.claimMission] After individual property updates, playerDoc.activeBoosts isArray:",
      Array.isArray(playerDoc.activeBoosts)
    );

    // Check if activeBoosts got corrupted during property updates
    if (typeof playerDoc.activeBoosts === "string") {
      console.log(
        "🔍 [missionController.claimMission] ERROR: activeBoosts became a string during property updates!"
      );
      console.log(
        "🔍 [missionController.claimMission] String content:",
        playerDoc.activeBoosts
      );
    }

    // Clear the active mission
    playerDoc.activeMission = null;

    console.log(
      "🔍 [missionController.claimMission] About to save playerDoc to database"
    );
    console.log(3333, playerDoc);
    await playerDoc.save();
    console.log(
      "🔍 [missionController.claimMission] Successfully saved to database"
    );

    const responseData = { ...result, newPlayerState: playerDoc.toObject() };
    console.log(
      "🔍 [missionController.claimMission] Final response data:",
      JSON.stringify(responseData, null, 2)
    );

    res.status(200).json(responseData);
  } else {
    res.status(400).json(result);
  }
});

export const cancelMission = asyncHandler(async (req: any, res: any) => {
  const playerDoc = req.player;
  const result = cancelMissionLogic(playerDoc.toObject());

  if (result.success && result.newPlayerState) {
    // Update properties individually instead of using Object.assign to avoid Mongoose document corruption
    playerDoc.level = result.newPlayerState.level;
    playerDoc.xp = result.newPlayerState.xp;
    playerDoc.gold = result.newPlayerState.gold;
    playerDoc.dollars = result.newPlayerState.dollars;
    playerDoc.power = result.newPlayerState.power;
    playerDoc.inventory = result.newPlayerState.inventory;
    playerDoc.equipment = result.newPlayerState.equipment;
    playerDoc.equipmentUpgrades = result.newPlayerState.equipmentUpgrades;
    playerDoc.equipmentEnchantments =
      result.newPlayerState.equipmentEnchantments;
    playerDoc.unlockedZoneIds = result.newPlayerState.unlockedZoneIds;
    playerDoc.discoveredItemIds = result.newPlayerState.discoveredItemIds;
    playerDoc.completedZoneIds = result.newPlayerState.completedZoneIds;
    playerDoc.completedLongMissionZoneIds =
      result.newPlayerState.completedLongMissionZoneIds;
    playerDoc.permanentPowerBonus = result.newPlayerState.permanentPowerBonus;
    playerDoc.powerMultiplier = result.newPlayerState.powerMultiplier;
    playerDoc.activeBoosts = result.newPlayerState.activeBoosts;
    playerDoc.purchasedStoreUpgradeIds =
      result.newPlayerState.purchasedStoreUpgradeIds;
    playerDoc.unlockedBadgeIds = result.newPlayerState.unlockedBadgeIds;
    playerDoc.defeatedBossIds = result.newPlayerState.defeatedBossIds;
    playerDoc.purchasedLabEquipmentIds =
      result.newPlayerState.purchasedLabEquipmentIds;
    playerDoc.unlockedPermanentPerks =
      result.newPlayerState.unlockedPermanentPerks;
    playerDoc.globalBossCooldownEndTime =
      result.newPlayerState.globalBossCooldownEndTime;
    playerDoc.labLevel = result.newPlayerState.labLevel;
    playerDoc.labXp = result.newPlayerState.labXp;
    playerDoc.homunculusCreatedCount =
      result.newPlayerState.homunculusCreatedCount;
    playerDoc.homunculi = result.newPlayerState.homunculi;
    playerDoc.consecutiveCancels = result.newPlayerState.consecutiveCancels;
    playerDoc.hasEquippedWeapon = result.newPlayerState.hasEquippedWeapon;
    playerDoc.highChanceForgeFails = result.newPlayerState.highChanceForgeFails;
    playerDoc.consecutiveCommonCacheOpens =
      result.newPlayerState.consecutiveCommonCacheOpens;
    playerDoc.missionsCompleted = result.newPlayerState.missionsCompleted;
    playerDoc.hasReceivedInitialBoost =
      result.newPlayerState.hasReceivedInitialBoost;
    playerDoc.tutorialStep = result.newPlayerState.tutorialStep;
    playerDoc.tutorialCompleted = result.newPlayerState.tutorialCompleted;
    playerDoc.isWalletConnected = result.newPlayerState.isWalletConnected;
    playerDoc.ownsReptilianzNFT = result.newPlayerState.ownsReptilianzNFT;
    playerDoc.hasSeenWalletConnectPrompt =
      result.newPlayerState.hasSeenWalletConnectPrompt;
    playerDoc.bossDefeatCounts = result.newPlayerState.bossDefeatCounts;
    playerDoc.dailySafeguardUses = result.newPlayerState.dailySafeguardUses;
    playerDoc.lastSafeguardUseTimestamp =
      result.newPlayerState.lastSafeguardUseTimestamp;

    // Clear the active mission
    playerDoc.activeMission = null;
    await playerDoc.save();
    res.status(200).json({ ...result, newPlayerState: playerDoc.toObject() });
  } else {
    res.status(400).json(result);
  }
});
