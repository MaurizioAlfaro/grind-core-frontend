import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import { startMission, claimMission } from "../logic";
import { ZONES, ITEMS } from "../../constants/index";
import { ItemRarity } from "../../types";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// DROP RATE VALIDATION TESTS
// ============================================================================

// Test 1: Basic Loot Table Validation
async function testBasicLootTableValidation() {
  console.log("🔧 Test 1: Basic Loot Table Validation");

  const testZones = [
    {
      zoneId: "caffeteria",
      expectedItems: [
        { itemId: "cafeteria_spork", expectedRate: 0.15 },
        { itemId: "cafeteria_apron", expectedRate: 0.15 },
        { itemId: "small_gold_pouch", expectedRate: 0.05 },
        { itemId: "cafeteria_hairnet", expectedRate: 0.1 },
        { itemId: "power_shard", expectedRate: 0.005 },
      ],
    },
    {
      zoneId: "supermarket",
      expectedItems: [
        { itemId: "supermarket_price_gun", expectedRate: 0.15 },
        { itemId: "supermarket_vest", expectedRate: 0.15 },
        { itemId: "small_gold_pouch", expectedRate: 0.05 },
        { itemId: "supermarket_nametag", expectedRate: 0.1 },
        { itemId: "power_shard", expectedRate: 0.005 },
      ],
    },
  ];

  for (const zone of testZones) {
    const zoneData = ZONES.find((z) => z.id === zone.zoneId);
    if (!zoneData) {
      throw new Error(`Zone ${zone.zoneId} not found`);
    }

    // Verify loot table structure
    if (!zoneData.lootTable || !Array.isArray(zoneData.lootTable)) {
      throw new Error(`Zone ${zone.zoneId} missing loot table`);
    }

    // Verify each expected item exists in loot table
    for (const expectedItem of zone.expectedItems) {
      const lootItem = zoneData.lootTable.find(
        (item) => item.itemId === expectedItem.itemId
      );
      if (!lootItem) {
        throw new Error(
          `Expected item ${expectedItem.itemId} not found in ${zone.zoneId} loot table`
        );
      }

      if (lootItem.chance !== expectedItem.expectedRate) {
        throw new Error(
          `Item ${expectedItem.itemId} in ${zone.zoneId}: Expected rate ${expectedItem.expectedRate}, got ${lootItem.chance}`
        );
      }
    }

    // Verify exclusive loot exists
    if (!zoneData.exclusiveLoot || !Array.isArray(zoneData.exclusiveLoot)) {
      throw new Error(`Zone ${zone.zoneId} missing exclusive loot`);
    }
  }

  console.log("✅ Basic loot table validation working correctly");
  return { success: true, basicLootTable: "working" };
}

// Test 2: Drop Rate Statistical Validation
async function testDropRateStatisticalValidation() {
  console.log("🔧 Test 2: Drop Rate Statistical Validation");

  const testCases = [
    {
      zoneId: "caffeteria",
      itemId: "cafeteria_spork",
      expectedRate: 0.15,
      iterations: 1000,
      acceptableRange: { min: 0.12, max: 0.18 }, // ±20%
    },
    {
      zoneId: "caffeteria",
      itemId: "power_shard",
      expectedRate: 0.005,
      iterations: 5000,
      acceptableRange: { min: 0.004, max: 0.006 }, // ±20%
    },
  ];

  for (const testCase of testCases) {
    console.log(
      `  Testing ${testCase.itemId} in ${testCase.zoneId} (${testCase.iterations} iterations)`
    );

    const results = [];

    for (let i = 0; i < testCase.iterations; i++) {
      // Reset player state for each iteration
      await ensureTestPlayer(playerId);
      await forceSetPlayerState(playerId, {
        unlockedZoneIds: [testCase.zoneId],
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      });

      const playerState = await getPlayerState(playerId);

      // Start and complete mission
      const startResult = startMission(
        playerState,
        testCase.zoneId,
        "SHORT",
        true
      );
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

      // Check if item dropped
      const itemDropped = claimResult.newPlayerState.inventory.some(
        (item) => item.itemId === testCase.itemId
      );

      results.push(itemDropped);

      // Progress indicator for long tests
      if (i % 1000 === 0 && i > 0) {
        console.log(`    Completed ${i}/${testCase.iterations} iterations`);
      }
    }

    // Calculate actual drop rate
    const actualRate = results.filter(Boolean).length / testCase.iterations;

    // Validate within acceptable range
    if (
      actualRate < testCase.acceptableRange.min ||
      actualRate > testCase.acceptableRange.max
    ) {
      throw new Error(
        `Drop rate validation failed for ${testCase.itemId} in ${testCase.zoneId}: ` +
          `Expected ~${testCase.expectedRate}, got ${actualRate.toFixed(4)} ` +
          `(range: ${testCase.acceptableRange.min}-${testCase.acceptableRange.max})`
      );
    }

    console.log(
      `    ✅ ${testCase.itemId}: Expected ~${
        testCase.expectedRate
      }, got ${actualRate.toFixed(4)}`
    );
  }

  console.log("✅ Drop rate statistical validation working correctly");
  return { success: true, statisticalValidation: "working" };
}

// Test 3: Badge Loot Chance Multipliers
async function testBadgeLootChanceMultipliers() {
  console.log("🔧 Test 3: Badge Loot Chance Multipliers");

  const testCases = [
    {
      name: "No Loot Badges",
      unlockedBadgeIds: [],
      expectedMultiplier: 1.0,
    },
    {
      name: "Single Loot Badge (collector_10)",
      unlockedBadgeIds: ["collector_10"],
      expectedMultiplier: 1.005,
    },
    {
      name: "Multiple Loot Badges",
      unlockedBadgeIds: ["collector_10", "misc_lucky"],
      expectedMultiplier: 1.015, // 1.005 * 1.01
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      unlockedBadgeIds: testCase.unlockedBadgeIds,
      purchasedStoreUpgradeIds: [],
      activeBoosts: [],
    });

    const playerState = await getPlayerState(playerId);

    // Test with power_shard (0.5% base rate)
    const baseDropRate = 0.005;
    const expectedDropRate = baseDropRate * testCase.expectedMultiplier;

    // Run smaller test for badge effects
    const iterations = 2000;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      // Reset inventory for each iteration
      await forceSetPlayerState(playerId, {
        inventory: [],
        unlockedZoneIds: ["caffeteria"],
        unlockedBadgeIds: testCase.unlockedBadgeIds,
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
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

    const actualRate = results.filter(Boolean).length / iterations;
    const acceptableRange = {
      min: expectedDropRate * 0.7, // Allow more variance for low rates
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

  console.log("✅ Badge loot chance multipliers working correctly");
  return { success: true, badgeLootMultipliers: "working" };
}

// Test 4: Store Upgrade Loot Bonuses
async function testStoreUpgradeLootBonuses() {
  console.log("🔧 Test 4: Store Upgrade Loot Bonuses");

  const testCases = [
    {
      name: "No Loot Upgrades",
      purchasedStoreUpgradeIds: [],
      expectedBonus: 0,
    },
    {
      name: "Single Loot Upgrade (upgrade_loot_1)",
      purchasedStoreUpgradeIds: ["upgrade_loot_1"],
      expectedBonus: 0.01, // +1%
    },
    {
      name: "Multiple Loot Upgrades",
      purchasedStoreUpgradeIds: ["upgrade_loot_1", "upgrade_loot_2"],
      expectedBonus: 0.02, // +2%
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      unlockedBadgeIds: [],
      purchasedStoreUpgradeIds: testCase.purchasedStoreUpgradeIds,
      activeBoosts: [],
    });

    const playerState = await getPlayerState(playerId);

    // Test with power_shard (0.5% base rate)
    const baseDropRate = 0.005;
    const expectedDropRate = baseDropRate + testCase.expectedBonus;

    // Run test for store upgrade effects
    const iterations = 2000;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      // Reset inventory for each iteration
      await forceSetPlayerState(playerId, {
        inventory: [],
        unlockedZoneIds: ["caffeteria"],
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: testCase.purchasedStoreUpgradeIds,
        activeBoosts: [],
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

    const actualRate = results.filter(Boolean).length / iterations;
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

  console.log("✅ Store upgrade loot bonuses working correctly");
  return { success: true, storeUpgradeLoot: "working" };
}

// Test 5: Active Boost Loot Bonuses
async function testActiveBoostLootBonuses() {
  console.log("🔧 Test 5: Active Boost Loot Bonuses");

  const testCases = [
    {
      name: "No Active Boosts",
      activeBoosts: [],
      expectedBonus: 0,
    },
    {
      name: "Single Loot Boost",
      activeBoosts: [
        {
          sourceId: "consumable_buff_loot_1",
          value: 0.1,
          endTime: Date.now() + 600000,
        },
      ],
      expectedBonus: 0.1, // +10%
    },
    {
      name: "Multiple Loot Boosts",
      activeBoosts: [
        {
          sourceId: "consumable_buff_loot_1",
          value: 0.1,
          endTime: Date.now() + 600000,
        },
        {
          sourceId: "consumable_buff_loot_2",
          value: 0.05,
          endTime: Date.now() + 600000,
        },
      ],
      expectedBonus: 0.15, // +15%
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: ["caffeteria"],
      unlockedBadgeIds: [],
      purchasedStoreUpgradeIds: [],
      activeBoosts: testCase.activeBoosts,
    });

    const playerState = await getPlayerState(playerId);

    // Test with power_shard (0.5% base rate)
    const baseDropRate = 0.005;
    const expectedDropRate = baseDropRate + testCase.expectedBonus;

    // Run test for active boost effects
    const iterations = 2000;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      // Reset inventory for each iteration
      await forceSetPlayerState(playerId, {
        inventory: [],
        unlockedZoneIds: ["caffeteria"],
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: testCase.activeBoosts,
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

    const actualRate = results.filter(Boolean).length / iterations;
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

  console.log("✅ Active boost loot bonuses working correctly");
  return { success: true, activeBoostLoot: "working" };
}

// Test 6: Combined Bonus Effects
async function testCombinedBonusEffects() {
  console.log("🔧 Test 6: Combined Bonus Effects");

  const testCases = [
    {
      name: "Badges + Store Upgrades + Active Boosts",
      playerState: {
        unlockedZoneIds: ["caffeteria"],
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
      baseDropRate: 0.005, // power_shard base rate
      expectedDropRate: 0.005 * 1.005 + 0.01 + 0.1, // base * badge + store + boost
    },
  ];

  for (const testCase of testCases) {
    console.log(`  Testing: ${testCase.name}`);

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, testCase.playerState);

    const playerState = await getPlayerState(playerId);

    // Run test for combined bonus effects
    const iterations = 3000; // More iterations for complex scenario
    const results = [];

    for (let i = 0; i < iterations; i++) {
      // Reset inventory for each iteration
      await forceSetPlayerState(playerId, {
        inventory: [],
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

    const actualRate = results.filter(Boolean).length / iterations;
    const acceptableRange = {
      min: testCase.expectedDropRate * 0.7,
      max: testCase.expectedDropRate * 1.3,
    };

    if (actualRate < acceptableRange.min || actualRate > acceptableRange.max) {
      throw new Error(
        `${
          testCase.name
        }: Expected drop rate ~${testCase.expectedDropRate.toFixed(
          4
        )}, got ${actualRate.toFixed(4)} ` +
          `(range: ${acceptableRange.min.toFixed(
            4
          )}-${acceptableRange.max.toFixed(4)})`
      );
    }

    console.log(
      `    ✅ ${testCase.name}: Expected ~${testCase.expectedDropRate.toFixed(
        4
      )}, got ${actualRate.toFixed(4)}`
    );
  }

  console.log("✅ Combined bonus effects working correctly");
  return { success: true, combinedBonuses: "working" };
}

// Test 7: Exclusive Loot Validation
async function testExclusiveLootValidation() {
  console.log("🔧 Test 7: Exclusive Loot Validation");

  const testCases = [
    {
      zoneId: "caffeteria",
      duration: "MEDIUM",
      expectedItem: "cafeteria_jello_amulet",
    },
    {
      zoneId: "caffeteria",
      duration: "LONG",
      expectedItem: "cafeteria_onion_ring",
    },
  ];

  for (const testCase of testCases) {
    console.log(
      `  Testing ${testCase.expectedItem} from ${testCase.zoneId} ${testCase.duration} mission`
    );

    await ensureTestPlayer(playerId);
    await forceSetPlayerState(playerId, {
      unlockedZoneIds: [testCase.zoneId],
      unlockedBadgeIds: [],
      purchasedStoreUpgradeIds: [],
      activeBoosts: [],
    });

    const playerState = await getPlayerState(playerId);

    // Run test for exclusive loot
    const iterations = 1000;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      // Reset inventory for each iteration
      await forceSetPlayerState(playerId, {
        inventory: [],
        unlockedZoneIds: [testCase.zoneId],
        unlockedBadgeIds: [],
        purchasedStoreUpgradeIds: [],
        activeBoosts: [],
      });

      const currentState = await getPlayerState(playerId);

      // Start and complete mission with specified duration
      const startResult = startMission(
        currentState,
        testCase.zoneId,
        testCase.duration,
        true
      );
      const completedMission = {
        ...startResult.activeMission,
        endTime: Date.now() - 1000,
      };

      const claimResult = claimMission(currentState, completedMission);

      // Check if exclusive item dropped
      const itemDropped = claimResult.newPlayerState.inventory.some(
        (item) => item.itemId === testCase.expectedItem
      );

      results.push(itemDropped);
    }

    const actualRate = results.filter(Boolean).length / iterations;

    // Exclusive loot should have a reasonable drop rate (not too low)
    if (actualRate < 0.01) {
      // At least 1%
      throw new Error(
        `${testCase.expectedItem} drop rate too low: ${actualRate.toFixed(
          4
        )} (expected >= 0.01)`
      );
    }

    console.log(
      `    ✅ ${testCase.expectedItem}: Drop rate ${actualRate.toFixed(4)}`
    );
  }

  console.log("✅ Exclusive loot validation working correctly");
  return { success: true, exclusiveLoot: "working" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runEarlyGameplayDropRateTests() {
  console.log("============================================================");
  console.log("🎲 TESTING EARLY GAMEPLAY DROP RATES");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all drop rate tests
    console.log("\n🔧 Running Drop Rate Validation Tests...");
    results.push(await testBasicLootTableValidation());
    results.push(await testDropRateStatisticalValidation());
    results.push(await testBadgeLootChanceMultipliers());
    results.push(await testStoreUpgradeLootBonuses());
    results.push(await testActiveBoostLootBonuses());
    results.push(await testCombinedBonusEffects());
    results.push(await testExclusiveLootValidation());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 EARLY GAMEPLAY DROP RATE TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL DROP RATE TESTS PASSED!");
      console.log("🎲 Loot table system is bulletproof!");
      console.log("📊 Statistical validation accurate!");
      console.log("🏆 Badge bonuses working correctly!");
      console.log("🛒 Store upgrades applying properly!");
      console.log("⚡ Active boosts integrating well!");
      console.log("🔗 Combined bonuses stacking correctly!");
      console.log("💎 Exclusive loot mechanics functional!");
    } else {
      console.log("💥 Some tests failed!");
    }

    // Detailed results
    console.log("\n📋 Test Details:");
    const testNames = [
      "Basic Loot Table",
      "Statistical Validation",
      "Badge Multipliers",
      "Store Upgrades",
      "Active Boosts",
      "Combined Bonuses",
      "Exclusive Loot",
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
  runEarlyGameplayDropRateTests().catch(console.error);
}

export { runEarlyGameplayDropRateTests };
