import connectDB from "../config/db";
import mongoose from "mongoose";
import { startMission } from "../logic/startMission";
import { claimMission } from "../logic/claimMission";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";

const playerId = "66a01123456789abcdef1234";

async function debugRewardFlow() {
  console.log("🔍 DEBUGGING REWARD FLOW");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    // Setup test player
    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      level: 10,
      xp: 0,
      power: 100,
      gold: 1000,
      tutorialCompleted: true,
      unlockedZoneIds: ["caffeteria"],
    });

    const initialState = await getPlayerState(playerId);
    console.log("✅ Initial state:", {
      level: initialState.level,
      power: initialState.power,
      tutorialCompleted: initialState.tutorialCompleted,
    });

    // Test 1: Start Mission
    console.log("\n🔧 Test 1: Starting Mission");
    const startResult = startMission(
      initialState,
      "caffeteria",
      "SHORT",
      false
    );

    if (!startResult.success || !startResult.activeMission) {
      throw new Error(`Mission start failed: ${startResult.message}`);
    }

    console.log("✅ Mission started successfully");
    console.log(
      "✅ Active mission:",
      JSON.stringify(startResult.activeMission, null, 2)
    );

    // Test 2: Claim Mission (simulate completion)
    console.log("\n🔧 Test 2: Claiming Mission");

    // Manually set the mission as complete by adjusting the endTime
    const modifiedMission = {
      ...startResult.activeMission,
      endTime: Date.now() - 1000, // 1 second ago
    };

    const claimResult = claimMission(initialState, modifiedMission);

    if (!claimResult.success) {
      throw new Error(`Mission claim failed: ${claimResult.message}`);
    }

    console.log("✅ Mission claimed successfully");
    console.log("✅ Claim result:", JSON.stringify(claimResult, null, 2));

    // Check if rewards are present
    if (claimResult.rewards) {
      console.log("✅ Rewards found in claim result");
      console.log("✅ Rewards:", JSON.stringify(claimResult.rewards, null, 2));
    } else {
      console.log("❌ No rewards found in claim result");
    }
  } catch (error) {
    console.error("💥 Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
  }
}

debugRewardFlow();
