import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import {
  startMission,
  claimMission,
  purchaseStoreItem,
  useConsumableItem,
} from "../logic";
import { ZONES, STORE, ITEMS } from "../../constants/index";
import { ItemRarity } from "../../types";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// BONUS SYSTEM INTEGRATION TESTS
// ============================================================================

// Test 1: XP Bonus Integration Testing
async function testXpBonusIntegration() {
  console.log("🔧 Test 1: XP Bonus Integration Testing");

  const testCases = [
    {
      name: "No XP Bonuses",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      },
      baseXp: 10,
      expectedXp: 10,
    },
    {
      name: "Badge XP Bonus Only",
      playerState: {
        unlockedBadgeIds: ["level_10"], // +0.5% XP
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      },
      baseXp: 10,
      expectedXp: Math.floor(10 * 1.005), // 10 * 1.005 = 10.05 → 10
    },
    {
      name: "Store Upgrade XP Bonus Only",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: ["upgrade_xp_1"], // +2% XP
        activeBoosts: [],
      },
      baseXp: 10,
      expectedXp: Math.floor(10 * 1.02), // 10 * 1.02 = 10.2 → 10
    },
    {
      name: "Active Boost XP Bonus Only",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [
          {
            sourceId: "consumable_buff_xp_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          }, // +25% XP
        ],
      },
      baseXp: 10,
      expectedXp: Math.floor(10 * 1.25), // 10 * 1.25 = 12.5 → 12
    },
    {
      name: "All XP Bonuses Combined",
      playerState: {
        unlockedBadgeIds: ["level_10"], // +0.5% XP
        purchasedStoreUpgradeIds: ["upgrade_xp_1"], // +2% XP
        activeBoosts: [
          {
            sourceId: "consumable_buff_xp_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          }, // +25% XP
        ],
      },
      baseXp: 10,
      expectedXp: Math.floor(10 * 1.005 * 1.02 * 1.25), // 10 * 1.005 * 1.02 * 1.25 = 12.81 → 12
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      gold: 10000,
      ...testCase.playerState,
    });

    const playerState = await getPlayerState(playerId);

    // Start and complete mission
    const startResult = startMission(playerState, "caffeteria", "SHORT", true);
    if (!startResult.success) {
      throw new Error(`Mission start failed: ${startResult.message}`);
    }

    // Simulate mission completion
    const completedMission = {
      ...startResult.activeMission,
      endTime: Date.now() - 1000,
    };

    const claimResult = claimMission(playerState, completedMission);
    if (!claimResult.success) {
      throw new Error(`Mission claim failed: ${claimResult.message}`);
    }

    // Verify XP calculation
    const actualXp = claimResult.newPlayerState.xp - playerState.xp;

    if (actualXp !== testCase.expectedXp) {
      throw new Error(
        `${testCase.name}: Expected XP ${testCase.expectedXp}, got ${actualXp}`
      );
    }

    console.log(
      `    ✅ ${testCase.name}: Expected XP ${testCase.expectedXp}, got ${actualXp}`
    );
  }

  console.log("✅ XP bonus integration working correctly");
  return { success: true, xpBonusIntegration: "working" };
}

// Test 2: Gold Bonus Integration Testing
async function testGoldBonusIntegration() {
  console.log("🔧 Test 2: Gold Bonus Integration Testing");

  const testCases = [
    {
      name: "No Gold Bonuses",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      },
      baseGold: 5,
      expectedGold: 5,
    },
    {
      name: "Badge Gold Bonus Only",
      playerState: {
        unlockedBadgeIds: ["gold_100k"], // +1% Gold
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      },
      baseGold: 5,
      expectedGold: Math.floor(5 * 1.01), // 5 * 1.01 = 5.05 → 5
    },
    {
      name: "Store Upgrade Gold Bonus Only",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: ["upgrade_gold_1"], // +2% Gold
        activeBoosts: [],
      },
      baseGold: 5,
      expectedGold: Math.floor(5 * 1.02), // 5 * 1.02 = 5.1 → 5
    },
    {
      name: "Active Boost Gold Bonus Only",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [
          {
            sourceId: "consumable_buff_gold_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          }, // +25% Gold
        ],
      },
      baseGold: 5,
      expectedGold: Math.floor(5 * 1.25), // 5 * 1.25 = 6.25 → 6
    },
    {
      name: "All Gold Bonuses Combined",
      playerState: {
        unlockedBadgeIds: ["gold_100k"], // +1% Gold
        purchasedStoreUpgradeIds: ["upgrade_gold_1"], // +2% Gold
        activeBoosts: [
          {
            sourceId: "consumable_buff_gold_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          }, // +25% Gold
        ],
      },
      baseGold: 5,
      expectedGold: Math.floor(5 * 1.01 * 1.02 * 1.25), // 5 * 1.01 * 1.02 * 1.25 = 6.44 → 6
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      gold: 10000,
      ...testCase.playerState,
    });

    const playerState = await getPlayerState(playerId);

    // Start and complete mission
    const startResult = startMission(playerState, "caffeteria", "SHORT", true);
    if (!startResult.success) {
      throw new Error(`Mission start failed: ${startResult.message}`);
    }

    // Simulate mission completion
    const completedMission = {
      ...startResult.activeMission,
      endTime: Date.now() - 1000,
    };

    const claimResult = claimMission(playerState, completedMission);
    if (!claimResult.success) {
      throw new Error(`Mission claim failed: ${claimResult.message}`);
    }

    // Verify gold calculation
    const actualGold = claimResult.newPlayerState.gold - playerState.gold;

    if (actualGold !== testCase.expectedGold) {
      throw new Error(
        `${testCase.name}: Expected gold ${testCase.expectedGold}, got ${actualGold}`
      );
    }

    console.log(
      `    ✅ ${testCase.name}: Expected gold ${testCase.expectedGold}, got ${actualGold}`
    );
  }

  console.log("✅ Gold bonus integration working correctly");
  return { success: true, goldBonusIntegration: "working" };
}

// Test 3: Loot Chance Bonus Integration Testing
async function testLootChanceBonusIntegration() {
  console.log("🔧 Test 3: Loot Chance Bonus Integration Testing");

  const testCases = [
    {
      name: "No Loot Bonuses",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      },
      baseDropRate: 0.005, // power_shard
      iterations: 2000,
    },
    {
      name: "Badge Loot Bonus Only",
      playerState: {
        unlockedBadgeIds: ["collector_10"], // +0.5% loot chance
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      },
      baseDropRate: 0.005,
      iterations: 2000,
    },
    {
      name: "Store Upgrade Loot Bonus Only",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: ["upgrade_loot_1"], // +1% loot chance
        activeBoosts: [],
      },
      baseDropRate: 0.005,
      iterations: 2000,
    },
    {
      name: "Active Boost Loot Bonus Only",
      playerState: {
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [
          {
            sourceId: "consumable_buff_loot_1",
            value: 0.1,
            endTime: Date.now() + 600000,
          }, // +10% loot chance
        ],
      },
      baseDropRate: 0.005,
      iterations: 2000,
    },
    {
      name: "All Loot Bonuses Combined",
      playerState: {
        unlockedBadgeIds: ["collector_10"], // +0.5% loot chance
        purchasedStoreUpgradeIds: ["upgrade_loot_1"], // +1% loot chance
        activeBoosts: [
          {
            sourceId: "consumable_buff_loot_1",
            value: 0.1,
            endTime: Date.now() + 600000,
          }, // +10% loot chance
        ],
      },
      baseDropRate: 0.005,
      iterations: 2000,
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    // Calculate expected drop rate
    let expectedDropRate = testCase.baseDropRate;

    // Apply badge multiplier
    if (testCase.playerState.unlockedBadgeIds.includes("collector_10")) {
      expectedDropRate *= 1.005;
    }

    // Add store upgrade bonus
    if (
      testCase.playerState.purchasedStoreUpgradeIds.includes("upgrade_loot_1")
    ) {
      expectedDropRate += 0.01;
    }

    // Add active boost bonus
    const activeBoost = testCase.playerState.activeBoosts.find((b) =>
      b.sourceId.startsWith("consumable_buff_loot_")
    );
    if (activeBoost) {
      expectedDropRate += activeBoost.value;
    }

    // Cap at 100%
    expectedDropRate = Math.min(expectedDropRate, 1.0);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      gold: 10000,
      ...testCase.playerState,
    });

    const playerState = await getPlayerState(playerId);

    // Run drop rate test
    const results = [];

    for (let i = 0; i < testCase.iterations; i++) {
      // Reset inventory for each iteration
      await forceSetPlayerState(playerId, {
        inventory: [],
        unlockedZoneIds: ["caffeteria"],
        gold: 10000,
        ...testCase.playerState,
      });

      const currentState = await getPlayerState(playerId);

      // Start and complete mission
      const startResult = startMission(
        currentState,
        "caffeteria",
        "SHORT",
        true
      );
      const completedMission = {
        ...startResult.activeMission,
        endTime: Date.now() - 1000,
      };

      const claimResult = claimMission(currentState, completedMission);

      // Check if power_shard dropped
      const itemDropped = claimResult.newPlayerState.inventory.some(
        (item) => item.itemId === "power_shard"
      );

      results.push(itemDropped);
    }

    const actualRate = results.filter(Boolean).length / testCase.iterations;
    const acceptableRange = {
      min: expectedDropRate * 0.7,
      max: expectedDropRate * 1.3,
    };

    if (actualRate < acceptableRange.min || actualRate > acceptableRange.max) {
      throw new Error(
        `${testCase.name}: Expected drop rate ~${expectedDropRate.toFixed(
          4
        )}, got ${actualRate.toFixed(4)} ` +
          `(range: ${acceptableRange.min.toFixed(
            4
          )}-${acceptableRange.max.toFixed(4)})`
      );
    }

    console.log(
      `    ✅ ${testCase.name}: Expected ~${expectedDropRate.toFixed(
        4
      )}, got ${actualRate.toFixed(4)}`
    );
  }

  console.log("✅ Loot chance bonus integration working correctly");
  return { success: true, lootChanceIntegration: "working" };
}

// Test 4: Store Purchase and Bonus Application
async function testStorePurchaseAndBonusApplication() {
  console.log("🔧 Test 4: Store Purchase and Bonus Application");

  const testCases = [
    {
      name: "Purchase XP Upgrade",
      itemId: "upgrade_xp_1",
      cost: 10000,
      expectedEffect: { type: "xp", value: 0.02 },
    },
    {
      name: "Purchase Gold Upgrade",
      itemId: "upgrade_gold_1",
      cost: 10000,
      expectedEffect: { type: "gold", value: 0.02 },
    },
    {
      name: "Purchase Loot Upgrade",
      itemId: "upgrade_loot_1",
      cost: 25000,
      expectedEffect: { type: "loot", value: 0.01 },
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      gold: testCase.cost + 1000,
      purchasedStoreUpgradeIds: [],
    });

    const playerState = await getPlayerState(playerId);

    // Purchase upgrade
    const purchaseResult = purchaseStoreItem(playerState, testCase.itemId);
    if (!purchaseResult.success) {
      throw new Error(`Purchase failed: ${purchaseResult.message}`);
    }

    // Verify upgrade purchased
    if (
      !purchaseResult.newPlayerState.purchasedStoreUpgradeIds.includes(
        testCase.itemId
      )
    ) {
      throw new Error(`Upgrade ${testCase.itemId} not added to purchased list`);
    }

    // Verify gold deducted
    if (
      purchaseResult.newPlayerState.gold !==
      playerState.gold - testCase.cost
    ) {
      throw new Error(
        `Gold deduction failed: Expected ${
          playerState.gold - testCase.cost
        }, got ${purchaseResult.newPlayerState.gold}`
      );
    }

    // Verify upgrade effect matches expected
    const upgradeItem = STORE.upgrades.find((u) => u.id === testCase.itemId);
    if (!upgradeItem) {
      throw new Error(`Upgrade ${testCase.itemId} not found in STORE.upgrades`);
    }

    if (upgradeItem.effect.type !== testCase.expectedEffect.type) {
      throw new Error(
        `Upgrade effect type mismatch: Expected ${testCase.expectedEffect.type}, got ${upgradeItem.effect.type}`
      );
    }

    if (upgradeItem.effect.value !== testCase.expectedEffect.value) {
      throw new Error(
        `Upgrade effect value mismatch: Expected ${testCase.expectedEffect.value}, got ${upgradeItem.effect.value}`
      );
    }

    console.log(
      `    ✅ ${testCase.name}: Purchase successful, effect verified`
    );
  }

  console.log("✅ Store purchase and bonus application working correctly");
  return { success: true, storePurchase: "working" };
}

// Test 5: Consumable Item Bonus Application
async function testConsumableItemBonusApplication() {
  console.log("🔧 Test 5: Consumable Item Bonus Application");

  const testCases = [
    {
      name: "XP Boost Potion",
      itemId: "buy_buff_xp_1",
      expectedBoost: { type: "xp", value: 0.25 },
    },
    {
      name: "Gold Boost Potion",
      itemId: "buy_buff_gold_1",
      expectedBoost: { type: "gold", value: 0.25 },
    },
    {
      name: "Loot Boost Potion",
      itemId: "buy_buff_loot_1",
      expectedBoost: { type: "loot", value: 0.1 },
    },
    {
      name: "Power Boost Potion",
      itemId: "buy_buff_power_1",
      expectedBoost: { type: "power", value: 20 },
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      gold: 10000,
      inventory: [{ itemId: testCase.itemId, quantity: 1 }],
    });

    const playerState = await getPlayerState(playerId);

    // Use consumable item
    const useResult = useConsumableItem(playerState, testCase.itemId);
    if (!useResult.success) {
      throw new Error(`Use consumable failed: ${useResult.message}`);
    }

    // Verify boost applied
    if (useResult.newPlayerState.activeBoosts.length !== 1) {
      throw new Error(
        `Expected 1 active boost, got ${useResult.newPlayerState.activeBoosts.length}`
      );
    }

    const boost = useResult.newPlayerState.activeBoosts[0];
    if (
      !boost.sourceId.startsWith(
        `consumable_buff_${testCase.expectedBoost.type}_`
      )
    ) {
      throw new Error(
        `Boost source mismatch: Expected consumable_buff_${testCase.expectedBoost.type}_, got ${boost.sourceId}`
      );
    }

    if (boost.value !== testCase.expectedBoost.value) {
      throw new Error(
        `Boost value mismatch: Expected ${testCase.expectedBoost.value}, got ${boost.value}`
      );
    }

    // Verify boost has end time
    if (!boost.endTime || boost.endTime <= Date.now()) {
      throw new Error(`Boost missing or invalid end time: ${boost.endTime}`);
    }

    console.log(`    ✅ ${testCase.name}: Boost applied successfully`);
  }

  console.log("✅ Consumable item bonus application working correctly");
  return { success: true, consumableBonuses: "working" };
}

// Test 6: Complex Bonus Stacking Scenarios
async function testComplexBonusStackingScenarios() {
  console.log("🔧 Test 6: Complex Bonus Stacking Scenarios");

  const complexScenarios = [
    {
      name: "Maximum XP Bonus Stacking",
      playerState: {
        unlockedBadgeIds: ["level_10", "level_20"], // +0.5% XP each
        purchasedStoreUpgradeIds: ["upgrade_xp_1", "upgrade_xp_2"], // +2% XP each
        activeBoosts: [
          {
            sourceId: "consumable_buff_xp_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          }, // +25% XP
          {
            sourceId: "consumable_buff_xp_2",
            value: 0.15,
            endTime: Date.now() + 600000,
          }, // +15% XP
        ],
      },
      baseXp: 100,
      expectedXp: Math.floor(100 * 1.005 * 1.005 * 1.02 * 1.02 * 1.25 * 1.15),
    },
    {
      name: "Maximum Gold Bonus Stacking",
      playerState: {
        unlockedBadgeIds: ["gold_100k", "gold_1m"], // +1% Gold each
        purchasedStoreUpgradeIds: ["upgrade_gold_1", "upgrade_gold_2"], // +2% Gold each
        activeBoosts: [
          {
            sourceId: "consumable_buff_gold_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          }, // +25% Gold
          {
            sourceId: "consumable_buff_gold_2",
            value: 0.2,
            endTime: Date.now() + 600000,
          }, // +20% Gold
        ],
      },
      baseGold: 50,
      expectedGold: Math.floor(50 * 1.01 * 1.01 * 1.02 * 1.02 * 1.25 * 1.2),
    },
  ];

  for (const scenario of complexScenarios) {
    console.log(`  Testing: ${scenario.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      gold: 10000,
      ...scenario.playerState,
    });

    const playerState = await getPlayerState(playerId);

    // Start and complete mission
    const startResult = startMission(playerState, "caffeteria", "SHORT", true);
    if (!startResult.success) {
      throw new Error(`Mission start failed: ${startResult.message}`);
    }

    // Simulate mission completion
    const completedMission = {
      ...startResult.activeMission,
      endTime: Date.now() - 1000,
    };

    const claimResult = claimMission(playerState, completedMission);
    if (!claimResult.success) {
      throw new Error(`Mission claim failed: ${claimResult.message}`);
    }

    // Verify bonus stacking
    if (scenario.name.includes("XP")) {
      const actualXp = claimResult.newPlayerState.xp - playerState.xp;
      if (actualXp !== scenario.expectedXp) {
        throw new Error(
          `${scenario.name}: Expected XP ${scenario.expectedXp}, got ${actualXp}`
        );
      }
      console.log(
        `    ✅ ${scenario.name}: Expected XP ${scenario.expectedXp}, got ${actualXp}`
      );
    } else if (scenario.name.includes("Gold")) {
      const actualGold = claimResult.newPlayerState.gold - playerState.gold;
      if (actualGold !== scenario.expectedGold) {
        throw new Error(
          `${scenario.name}: Expected gold ${scenario.expectedGold}, got ${actualGold}`
        );
      }
      console.log(
        `    ✅ ${scenario.name}: Expected gold ${scenario.expectedGold}, got ${actualGold}`
      );
    }
  }

  console.log("✅ Complex bonus stacking scenarios working correctly");
  return { success: true, complexStacking: "working" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runEarlyGameplayBonusIntegrationTests() {
  console.log("============================================================");
  console.log("🎁 TESTING EARLY GAMEPLAY BONUS INTEGRATION");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all bonus integration tests
    console.log("\n🔧 Running Bonus Integration Tests...");
    results.push(await testXpBonusIntegration());
    results.push(await testGoldBonusIntegration());
    results.push(await testLootChanceBonusIntegration());
    results.push(await testStorePurchaseAndBonusApplication());
    results.push(await testConsumableItemBonusApplication());
    results.push(await testComplexBonusStackingScenarios());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 EARLY GAMEPLAY BONUS INTEGRATION TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL BONUS INTEGRATION TESTS PASSED!");
      console.log("🎁 Bonus system integration is bulletproof!");
      console.log("📈 XP bonuses stacking correctly!");
      console.log("💰 Gold bonuses applying properly!");
      console.log("🍀 Loot chance bonuses working!");
      console.log("🛒 Store purchases integrating well!");
      console.log("⚡ Consumable items functioning!");
      console.log("🔗 Complex bonus combinations working!");
    } else {
      console.log("💥 Some tests failed!");
    }

    // Detailed results
    console.log("\n📋 Test Details:");
    const testNames = [
      "XP Bonus Integration",
      "Gold Bonus Integration",
      "Loot Chance Integration",
      "Store Purchase Integration",
      "Consumable Item Integration",
      "Complex Bonus Stacking",
    ];

    results.forEach((result, index) => {
      const status = result.success ? "✅" : "❌";
      console.log(
        `${status} Test ${index + 1}: ${testNames[index]} - ${
          result.success ? "PASSED" : "FAILED"
        }`
      );
    });
  } catch (error) {
    console.error("💥 Test suite failed:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
  }
}

// Run tests if called directly
if (require.main === module) {
  runEarlyGameplayBonusIntegrationTests().catch(console.error);
}

export { runEarlyGameplayBonusIntegrationTests };
