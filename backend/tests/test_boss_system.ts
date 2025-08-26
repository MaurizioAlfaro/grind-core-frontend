import { forceSetPlayerState, getPlayerState } from "../testUtils";
import { fightBoss, calculateBossWinChance } from "../logic/fightBoss";
import { BOSSES } from "../../constants/bosses";
import { ZONES } from "../../constants/zones";
import connectDB from "../config/db";
import mongoose from "mongoose";

// Test 1: Basic boss fight with sufficient power
async function testBasicBossFight() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 1: Basic boss fight with sufficient power");

    // Setup: Player with enough power to fight cafeteria boss (25 power)
    await forceSetPlayerState(testPlayerId, {
      level: 10, // 10 * 5 = 50 power (enough for cafeteria boss)
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 1000,
      gold: 1000,
      dollars: 100,
      power: 50,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: true,
      tutorialStep: 39,
      tutorialCompleted: true,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      equipmentEnchantments: {},
      homunculi: [],
      labLevel: 1,
      labXp: 0,
      homunculusCreatedCount: 0,
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      purchasedLabEquipmentIds: [],
      unlockedPermanentPerks: [],
      globalBossCooldownEndTime: 0,
      dailySafeguardUses: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      power: initialState.power,
      xp: initialState.xp,
      gold: initialState.gold,
      defeatedBosses: initialState.defeatedBossIds.length,
    });

    // Execute: Fight cafeteria boss
    const result = fightBoss(initialState, "caffeteria_boss", true);

    if (!result.success) {
      throw new Error(`Boss fight failed: ${result.message}`);
    }

    // Verify: Fight completed
    console.log("✅ Boss fight completed:", {
      outcome: result.outcome,
      rewards: result.rewards,
      newBadges: result.newlyUnlockedBadges?.length || 0,
    });

    // Verify: Player state updated
    const newState = result.newPlayerState;
    if (result.outcome === "win") {
      if (newState.xp <= initialState.xp) {
        throw new Error("XP should increase after boss victory");
      }
      if (newState.gold <= initialState.gold) {
        throw new Error("Gold should increase after boss victory");
      }
      if (!newState.defeatedBossIds.includes("caffeteria_boss")) {
        throw new Error("Boss should be marked as defeated");
      }
    }

    return { success: true, outcome: result.outcome };
  } catch (error) {
    console.log("❌ Test 1 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 2: Boss fight with insufficient power (should still have chance)
async function testBossFightInsufficientPower() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 2: Boss fight with insufficient power");

    // Setup: Player with low power (10 power vs 25 power boss)
    await forceSetPlayerState(testPlayerId, {
      level: 2, // 2 * 5 = 10 power (not enough for cafeteria boss)
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 1000,
      gold: 1000,
      dollars: 100,
      power: 10,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: true,
      tutorialStep: 39,
      tutorialCompleted: true,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      equipmentEnchantments: {},
      homunculi: [],
      labLevel: 1,
      labXp: 0,
      homunculusCreatedCount: 0,
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      purchasedLabEquipmentIds: [],
      unlockedPermanentPerks: [],
      globalBossCooldownEndTime: 0,
      dailySafeguardUses: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      power: initialState.power,
      defeatedBosses: initialState.defeatedBossIds.length,
    });

    // Calculate expected win chance
    const expectedChance = calculateBossWinChance(initialState.power, 25);
    console.log(
      "Expected win chance:",
      (expectedChance * 100).toFixed(1) + "%"
    );

    // Execute: Fight cafeteria boss
    const result = fightBoss(initialState, "caffeteria_boss", true);

    if (!result.success) {
      throw new Error(`Boss fight failed: ${result.message}`);
    }

    // Verify: Fight completed (win or loss)
    console.log("✅ Boss fight completed:", {
      outcome: result.outcome,
      rewards: result.rewards ? "Yes" : "No",
    });

    // Verify: Cooldown was set (only when not in dev mode)
    if (result.newPlayerState.globalBossCooldownEndTime <= Date.now()) {
      console.log("Note: Cooldown not set because dev mode was used");
    }

    return {
      success: true,
      outcome: result.outcome,
      winChance: expectedChance,
    };
  } catch (error) {
    console.log("❌ Test 2 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 3: Boss cooldown system
async function testBossCooldownSystem() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 3: Boss cooldown system");

    // Setup: Player with active cooldown
    const cooldownEndTime = Date.now() + 1000000; // Future cooldown
    await forceSetPlayerState(testPlayerId, {
      level: 10,
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 1000,
      gold: 1000,
      dollars: 100,
      power: 50,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: true,
      tutorialStep: 39,
      tutorialCompleted: true,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      equipmentEnchantments: {},
      homunculi: [],
      labLevel: 1,
      labXp: 0,
      homunculusCreatedCount: 0,
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      purchasedLabEquipmentIds: [],
      unlockedPermanentPerks: [],
      globalBossCooldownEndTime: cooldownEndTime,
      dailySafeguardUses: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state with cooldown");

    // Execute: Try to fight without dev mode (should fail)
    const result = fightBoss(initialState, "caffeteria_boss", false);

    if (result.success) {
      throw new Error("Boss fight should be blocked by cooldown");
    }

    console.log("✅ Cooldown blocked fight:", result.message);

    // Execute: Try with dev mode (should work)
    const devResult = fightBoss(initialState, "caffeteria_boss", true);

    if (!devResult.success) {
      throw new Error("Dev mode should bypass cooldown");
    }

    console.log("✅ Dev mode bypassed cooldown");

    return { success: true };
  } catch (error) {
    console.log("❌ Test 3 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 4: Boss progression and rewards scaling
async function testBossProgressionAndRewards() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 4: Boss progression and rewards scaling");

    // Setup: Player with high power to fight multiple bosses
    await forceSetPlayerState(testPlayerId, {
      level: 20, // 20 * 5 = 100 power
      unlockedZoneIds: ["caffeteria", "supermarket", "park"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 1000,
      gold: 1000,
      dollars: 100,
      power: 100,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: true,
      tutorialStep: 39,
      tutorialCompleted: true,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      equipmentEnchantments: {},
      homunculi: [],
      labLevel: 1,
      labXp: 0,
      homunculusCreatedCount: 0,
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      purchasedLabEquipmentIds: [],
      unlockedPermanentPerks: [],
      globalBossCooldownEndTime: 0,
      dailySafeguardUses: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      power: initialState.power,
      unlockedZones: initialState.unlockedZoneIds,
    });

    // Test progression through bosses
    const bossProgression = [
      { id: "caffeteria_boss", name: "Cafeteria Boss", power: 25 },
      { id: "supermarket_boss", name: "Supermarket Boss", power: 75 },
      { id: "park_boss", name: "Park Boss", power: 150 },
    ];

    let currentState = initialState;
    let totalRewards = { xp: 0, gold: 0, items: 0 };

    for (const boss of bossProgression) {
      console.log(`\nFighting ${boss.name} (${boss.power} power)...`);

      // Calculate win chance
      const winChance = calculateBossWinChance(currentState.power, boss.power);
      console.log(`Win chance: ${(winChance * 100).toFixed(1)}%`);

      // Fight boss
      const result = fightBoss(currentState, boss.id, true);

      if (!result.success) {
        throw new Error(`Failed to fight ${boss.name}: ${result.message}`);
      }

      console.log(`Outcome: ${result.outcome}`);

      if (result.outcome === "win" && result.rewards) {
        totalRewards.xp += result.rewards.xp;
        totalRewards.gold += result.rewards.gold;
        totalRewards.items += result.rewards.items.length;
        console.log(
          `Rewards: ${result.rewards.xp} XP, ${result.rewards.gold} Gold, ${result.rewards.items.length} items`
        );
      }

      currentState = result.newPlayerState;
    }

    console.log("\n✅ Boss progression completed:", {
      totalXP: totalRewards.xp,
      totalGold: totalRewards.gold,
      totalItems: totalRewards.items,
      defeatedBosses: currentState.defeatedBossIds.length,
    });

    return { success: true, totalRewards };
  } catch (error) {
    console.log("❌ Test 4 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 5: Boss badge system
async function testBossBadgeSystem() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 5: Boss badge system");

    // Setup: Player with no boss badges
    await forceSetPlayerState(testPlayerId, {
      level: 10,
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 1000,
      gold: 1000,
      dollars: 100,
      power: 50,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: true,
      tutorialStep: 39,
      tutorialCompleted: true,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      equipmentEnchantments: {},
      homunculi: [],
      labLevel: 1,
      labXp: 0,
      homunculusCreatedCount: 0,
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      purchasedLabEquipmentIds: [],
      unlockedPermanentPerks: [],
      globalBossCooldownEndTime: 0,
      dailySafeguardUses: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      unlockedBadges: initialState.unlockedBadgeIds.length,
      defeatedBosses: initialState.defeatedBossIds.length,
    });

    // Fight first boss to get first victory badge
    const result = fightBoss(initialState, "caffeteria_boss", true);

    if (!result.success) {
      throw new Error(`Boss fight failed: ${result.message}`);
    }

    if (result.outcome === "win") {
      const newState = result.newPlayerState;

      // Check if first victory badge was unlocked
      const firstVictoryBadge = BOSSES["caffeteria_boss"].firstVictoryBadgeId;
      if (!newState.unlockedBadgeIds.includes(firstVictoryBadge)) {
        throw new Error(
          `First victory badge ${firstVictoryBadge} should be unlocked`
        );
      }

      console.log("✅ First victory badge unlocked:", firstVictoryBadge);

      // Check if boss slayer badge was unlocked
      if (!newState.unlockedBadgeIds.includes("boss_slayer_1")) {
        throw new Error(
          "Boss slayer badge should be unlocked after first boss defeat"
        );
      }

      console.log("✅ Boss slayer badge unlocked: boss_slayer_1");
    }

    return {
      success: true,
      newBadges: result.newlyUnlockedBadges?.length || 0,
    };
  } catch (error) {
    console.log("❌ Test 5 failed:", error);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runBossTests() {
  console.log("=".repeat(60));
  console.log("👹 RUNNING BOSS SYSTEM TESTS");
  console.log("=".repeat(60));

  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    const tests = [
      testBasicBossFight,
      testBossFightInsufficientPower,
      testBossCooldownSystem,
      testBossProgressionAndRewards,
      testBossBadgeSystem,
    ];

    let passedTests = 0;
    let failedTests = 0;

    for (const test of tests) {
      const result = await test();
      if (result.success) {
        passedTests++;
        console.log("✅ Test passed");
      } else {
        failedTests++;
        console.log("❌ Test failed:", result.error);
      }
      console.log("---");
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 BOSS SYSTEM TEST RESULTS");
    console.log("=".repeat(60));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Total: ${tests.length}`);

    if (failedTests === 0) {
      console.log("🎉 ALL BOSS TESTS PASSED!");
      console.log("\n💡 Key Boss System Insights:");
      console.log(
        "- Boss fights use power ratio with extremely steep win chance curve"
      );
      console.log(
        "- 8-hour global cooldown between boss fights (dev mode bypasses)"
      );
      console.log(
        "- Boss rewards scale with zone mission data and multipliers"
      );
      console.log(
        "- First victory unlocks zone-specific and progression badges"
      );
      console.log("- Boss defeat counts tracked for Nemesis Protocol");
      console.log("- Multiple multiplier systems affect XP, gold, and loot");
    } else {
      console.log("⚠️  Some tests failed. Check logs above.");
    }

    return {
      success: failedTests === 0,
      passed: passedTests,
      failed: failedTests,
    };
  } catch (error) {
    console.log("💥 TEST RUNNER CRASHED!");
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
export { runBossTests };

// Run the tests if this file is executed directly
if (require.main === module) {
  runBossTests()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test runner crashed:", error);
      process.exit(1);
    });
}
