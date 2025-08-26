import {
  ensureTestPlayer,
  getPlayerState,
  cleanupTestPlayer,
  forceSetPlayerCurrency,
  forceUnlockZone,
  forceSetPlayerState,
} from "../testUtils";
import { startMission, claimMission } from "../logic";
import connectDB from "../config/db";
import mongoose from "mongoose";

// Mock API functions for testing
async function startMissionAPI(
  playerId: string,
  zoneId: string,
  durationKey: "SHORT" | "MEDIUM" | "LONG"
) {
  // Simulate API call by calling the logic directly
  const player = await getPlayerState(playerId);
  return startMission(player, zoneId, durationKey, true); // Use dev mode for instant completion
}

async function claimMissionAPI(playerId: string, activeMission: any) {
  // Simulate API call by calling the logic directly
  const player = await getPlayerState(playerId);
  return claimMission(player, activeMission);
}

// Main test function
export async function testMissionLifecycle() {
  // Use an existing player ID from the database to avoid duplicate key issues
  const testPlayerId = "66a01123456789abcdef1234"; // Use the existing player ID

  try {
    console.log("🚀 Starting Mission Lifecycle Test...");

    // 1. Setup: Reset existing player to known state
    console.log("📋 Resetting existing player...");
    await forceSetPlayerState(testPlayerId, {
      level: 1,
      gold: 100,
      xp: 0,
      unlockedZoneIds: ["caffeteria", "02_supermarket"],
    });

    // Verify initial state
    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state verified:", {
      level: initialState.level,
      gold: initialState.gold,
      xp: initialState.xp,
      unlockedZones: initialState.unlockedZoneIds.length,
    });

    // 2. Execute: Start mission via API
    console.log("🎯 Starting mission...");
    const startResult = await startMissionAPI(
      testPlayerId,
      "caffeteria",
      "SHORT"
    );

    if (!startResult.success) {
      throw new Error(`Failed to start mission: ${startResult.message}`);
    }

    console.log("✅ Mission started successfully:", startResult.activeMission);

    // 3. Verify: Check mission object
    if (!startResult.activeMission) {
      throw new Error("No active mission returned from startMission");
    }

    if (startResult.activeMission.zoneId !== "caffeteria") {
      throw new Error(
        `Expected zone caffeteria, got ${startResult.activeMission.zoneId}`
      );
    }

    console.log("✅ Mission object verified");

    // 4. Execute: Claim mission (simulating completion)
    console.log("🏆 Claiming mission...");

    // Wait for mission to complete (dev mode sets duration to 1 second)
    console.log("⏰ Waiting for mission to complete...");
    await new Promise((resolve) => setTimeout(resolve, 1100)); // Wait 1.1 seconds to ensure completion

    const claimResult = await claimMissionAPI(
      testPlayerId,
      startResult.activeMission
    );

    if (!claimResult.success) {
      throw new Error(`Failed to claim mission: ${claimResult.message}`);
    }

    console.log("✅ Mission claimed successfully");

    // 5. Verify: Check rewards and final state
    if (!claimResult.newPlayerState) {
      throw new Error("No new player state returned from claimMission");
    }

    const finalState = claimResult.newPlayerState;

    // Check that gold increased
    if (finalState.gold <= 100) {
      throw new Error(
        `Expected gold to increase, got ${finalState.gold} (was 100)`
      );
    }

    // Check that XP increased
    if (finalState.xp <= 0) {
      throw new Error(`Expected XP to increase, got ${finalState.xp} (was 0)`);
    }

    // Check that missions completed increased by 1
    if (finalState.missionsCompleted !== 11) {
      // Original was 10, now should be 11
      throw new Error(
        `Expected missionsCompleted to be 11, got ${finalState.missionsCompleted}`
      );
    }

    console.log("✅ Final state verified:", {
      gold: finalState.gold,
      xp: finalState.xp,
      missionsCompleted: finalState.missionsCompleted,
    });

    console.log("🎉 Mission lifecycle test PASSED!");
    return {
      success: true,
      initialGold: 100,
      finalGold: finalState.gold,
      goldGained: finalState.gold - 100,
      xpGained: finalState.xp,
    };
  } catch (error) {
    console.log("❌ Mission lifecycle test FAILED:", error);
    return { success: false, error: error.message };
  } finally {
    // 6. Cleanup - Reset player to original state instead of deleting
    console.log("🧹 Resetting player to original state...");
    await forceSetPlayerState(testPlayerId, {
      level: 2,
      gold: 50,
      xp: 0,
      power: 14,
      inventory: [
        { itemId: "cafeteria_hairnet", quantity: 2 },
        { itemId: "cafeteria_spork", quantity: 1 },
      ],
      unlockedZoneIds: ["caffeteria"],
      discoveredItemIds: ["cafeteria_spork", "cafeteria_hairnet"],
      missionsCompleted: 10,
      hasReceivedInitialBoost: true,
      tutorialStep: 10,
      tutorialCompleted: false,
    });
    console.log("✅ Player reset to original state");
  }
}

// Test runner function
async function runTest() {
  console.log("=".repeat(60));
  console.log("🧪 RUNNING MISSION LIFECYCLE TEST");
  console.log("=".repeat(60));

  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    const result = await testMissionLifecycle();

    console.log("\n" + "=".repeat(60));
    if (result.success) {
      console.log("🎉 TEST PASSED!");
      console.log(`💰 Gold gained: ${result.goldGained}`);
      console.log(`⭐ XP gained: ${result.xpGained}`);
    } else {
      console.log("❌ TEST FAILED!");
      console.log(`Error: ${result.error}`);
    }
    console.log("=".repeat(60));

    return result;
  } catch (error) {
    console.log("💥 TEST CRASHED!");
    console.log("Error:", error);
    return { success: false, error: error.message };
  } finally {
    // Disconnect from database
    console.log("🔌 Disconnecting from database...");
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
  }
}

// Export for use in other tests
export { runTest };

// Run the test if this file is executed directly
if (require.main === module) {
  runTest()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test runner crashed:", error);
      process.exit(1);
    });
}
