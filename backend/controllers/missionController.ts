import asyncHandler from "express-async-handler";
import { startMission, cancelMission } from "../logic";
import { claimMission } from "../logic";
import { ZONES } from "../../constants/index";
import { clockService } from "../../services/clockService";
import { applyRewards } from "../logic/_internal/applyRewards";
import { calculatePlayerPower } from "../logic/_internal/calculatePlayerPower";
import { checkForBadgeUnlocks } from "../logic/_internal/checkForBadgeUnlocks";
import type { ActiveBoost } from "../../types";

export const startMissionController = asyncHandler(
  async (req: any, res: any) => {
    const { zoneId, durationKey, isDevMode } = req.body;
    const player = req.player.toObject();

    // Clean up expired boosts before calculating rewards
    const activeBoosts = player.activeBoosts.filter((boost) => {
      return boost.endTime > Date.now();
    });

    player.activeBoosts = activeBoosts;

    const result = startMission(player, zoneId, durationKey, isDevMode);

    if (result.success && result.activeMission) {
      req.player.activeMission = result.activeMission;
      await req.player.save();
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  }
);

export const claimMissionController = asyncHandler(
  async (req: any, res: any) => {
    let playerDoc = req.player;
    const activeMission = playerDoc.activeMission;

    if (!activeMission) {
      res.status(400).json({ success: false, message: "No active mission." });
      return;
    }

    const now = clockService.getCurrentTime();
    if (now < activeMission.endTime) {
      res
        .status(400)
        .json({ success: false, message: "Mission not yet complete." });
      return;
    }

    const rewards = activeMission.preRolledRewards;
    let newPlayerState = applyRewards(playerDoc.toObject(), rewards);

    // Reset consecutive cancels for "Leeroy Jenkins" badge
    newPlayerState.consecutiveCancels = 0;

    // Track total missions completed
    newPlayerState.missionsCompleted =
      (newPlayerState.missionsCompleted || 0) + 1;

    let isInitialBoost = false;
    // Grant initial speed boost after 3rd mission
    if (
      newPlayerState.missionsCompleted === 3 &&
      !newPlayerState.hasReceivedInitialBoost
    ) {
      newPlayerState.hasReceivedInitialBoost = true;
      const speedBoost: ActiveBoost = {
        boostType: "speed",
        value: 1 / 15, // 15x speed
        endTime: now + 10 * 60 * 1000, // 10 minutes
        sourceId: "initial_boost",
      };
      newPlayerState.activeBoosts = [
        ...newPlayerState.activeBoosts,
        speedBoost,
      ];
      isInitialBoost = true;
    }

    if (
      activeMission.durationKey === "LONG" &&
      !newPlayerState.completedLongMissionZoneIds.includes(activeMission.zoneId)
    ) {
      const updatedCompletedLongMissions = [
        ...newPlayerState.completedLongMissionZoneIds,
      ];
      updatedCompletedLongMissions.push(activeMission.zoneId);
      newPlayerState.completedLongMissionZoneIds = updatedCompletedLongMissions;
    }

    const zone = ZONES.find((z) => z.id === activeMission.zoneId);
    if (zone && !newPlayerState.completedZoneIds.includes(zone.id)) {
      const zoneItems = new Set(zone.lootTable.map((l) => l.itemId));
      if (zone.exclusiveLoot) {
        zone.exclusiveLoot.forEach((l) => zoneItems.add(l.itemId));
      }

      const allFound = [...zoneItems].every((itemId) =>
        newPlayerState.discoveredItemIds.includes(itemId)
      );
      if (allFound) {
        const updatedCompletedZones = [...newPlayerState.completedZoneIds];
        updatedCompletedZones.push(zone.id);
        newPlayerState.completedZoneIds = updatedCompletedZones;
        newPlayerState = zone.completionBonus.apply(newPlayerState);
      }
    }

    newPlayerState.power = calculatePlayerPower(newPlayerState);
    const badgeCheckResult = checkForBadgeUnlocks(newPlayerState);

    const result = {
      success: true,
      message: "Mission complete!",
      newPlayerState: badgeCheckResult.newPlayerState,
      rewards,
      newlyUnlockedBadges: badgeCheckResult.newlyUnlockedBadges,
      isInitialBoost,
    };

    const resultDeepCopy = JSON.parse(JSON.stringify(result));

    if (result.success && result.newPlayerState) {
      Object.assign(playerDoc, {
        ...result.newPlayerState,
        activeMission: null,
      });
      await playerDoc.save();
      res.status(200).json(resultDeepCopy);
    } else {
      res.status(400).json(resultDeepCopy);
    }
  }
);

export const cancelMissionController = asyncHandler(
  async (req: any, res: any) => {
    const playerDoc = req.player;
    const result = cancelMission(playerDoc.toObject());

    if (result.success && result.newPlayerState) {
      Object.assign(playerDoc, result.newPlayerState);
      playerDoc.activeMission = null;
      await playerDoc.save();
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  }
);
