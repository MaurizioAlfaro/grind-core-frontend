import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import { checkForBadgeUnlocks } from "../logic/_internal/checkForBadgeUnlocks";
import { BADGES, BADGE_UNLOCK_CONDITIONS } from "../../constants/index";
import { ITEMS } from "../../constants/index";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// BADGE UNLOCK DETECTION TESTS
// ============================================================================

// Test 1: Basic level badge unlock
async function testLevelBadgeUnlock() {
  console.log("🔧 Test 1: Basic Level Badge Unlock");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 9,
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Verify no level_10 badge initially
  if (initialState.unlockedBadgeIds.includes("level_10")) {
    throw new Error("Level 10 badge should not be unlocked initially");
  }

  // Set level to 10 to trigger badge unlock
  const stateWithLevel10 = {
    ...initialState,
    level: 10,
  };

  const result = checkForBadgeUnlocks(stateWithLevel10);

  if (!result.newlyUnlockedBadges.length) {
    throw new Error("Level 10 badge should have been unlocked");
  }

  const level10Badge = result.newlyUnlockedBadges.find(
    (b) => b.id === "level_10"
  );
  if (!level10Badge) {
    throw new Error("Level 10 badge not found in newly unlocked badges");
  }

  if (level10Badge.name !== "Junior Analyst") {
    throw new Error(
      `Expected badge name "Junior Analyst", got "${level10Badge.name}"`
    );
  }

  if (level10Badge.bonus.type !== "MULTIPLY_XP") {
    throw new Error(
      `Expected bonus type "MULTIPLY_XP", got "${level10Badge.bonus.type}"`
    );
  }

  if (level10Badge.bonus.value !== 1.005) {
    throw new Error(
      `Expected bonus value 1.005, got ${level10Badge.bonus.value}`
    );
  }

  // Verify badge ID added to unlockedBadgeIds
  if (!result.newPlayerState.unlockedBadgeIds.includes("level_10")) {
    throw new Error("Level 10 badge ID not added to unlockedBadgeIds");
  }

  console.log("✅ Level 10 badge unlock working correctly");
  return { success: true, levelBadge: "working" };
}

// Test 2: Power threshold badge unlock
async function testPowerBadgeUnlock() {
  console.log("🔧 Test 2: Power Threshold Badge Unlock");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    power: 999,
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Verify no power_1k badge initially
  if (initialState.unlockedBadgeIds.includes("power_1k")) {
    throw new Error("Power 1k badge should not be unlocked initially");
  }

  // Set power to 1000 to trigger badge unlock
  const stateWithPower1k = {
    ...initialState,
    power: 1000,
  };

  const result = checkForBadgeUnlocks(stateWithPower1k);

  if (!result.newlyUnlockedBadges.length) {
    throw new Error("Power 1k badge should have been unlocked");
  }

  const power1kBadge = result.newlyUnlockedBadges.find(
    (b) => b.id === "power_1k"
  );
  if (!power1kBadge) {
    throw new Error("Power 1k badge not found in newly unlocked badges");
  }

  if (power1kBadge.name !== "Global Contender") {
    throw new Error(
      `Expected badge name "Global Contender", got "${power1kBadge.name}"`
    );
  }

  if (power1kBadge.bonus.type !== "MULTIPLY_POWER") {
    throw new Error(
      `Expected bonus type "MULTIPLY_POWER", got "${power1kBadge.bonus.type}"`
    );
  }

  if (power1kBadge.bonus.value !== 1.005) {
    throw new Error(
      `Expected bonus value 1.005, got ${power1kBadge.bonus.value}`
    );
  }

  console.log("✅ Power 1k badge unlock working correctly");
  return { success: true, powerBadge: "working" };
}

// Test 3: Wealth badge unlock
async function testWealthBadgeUnlock() {
  console.log("🔧 Test 3: Wealth Badge Unlock");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 99999,
    dollars: 999,
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Verify no wealth badges initially
  if (
    initialState.unlockedBadgeIds.includes("gold_100k") ||
    initialState.unlockedBadgeIds.includes("dollars_1k")
  ) {
    throw new Error("Wealth badges should not be unlocked initially");
  }

  // Set wealth to trigger badge unlocks
  const stateWithWealth = {
    ...initialState,
    gold: 100000,
    dollars: 1000,
  };

  const result = checkForBadgeUnlocks(stateWithWealth);

  if (result.newlyUnlockedBadges.length < 2) {
    throw new Error(
      `Expected at least 2 wealth badges, got ${result.newlyUnlockedBadges.length}`
    );
  }

  const goldBadge = result.newlyUnlockedBadges.find(
    (b) => b.id === "gold_100k"
  );
  const dollarsBadge = result.newlyUnlockedBadges.find(
    (b) => b.id === "dollars_1k"
  );

  if (!goldBadge) {
    throw new Error("Gold 100k badge not found in newly unlocked badges");
  }

  if (!dollarsBadge) {
    throw new Error("Dollars 1k badge not found in newly unlocked badges");
  }

  if (goldBadge.bonus.type !== "MULTIPLY_GOLD") {
    throw new Error(
      `Expected gold badge bonus type "MULTIPLY_GOLD", got "${goldBadge.bonus.type}"`
    );
  }

  if (dollarsBadge.bonus.type !== "MULTIPLY_GOLD") {
    throw new Error(
      `Expected dollars badge bonus type "MULTIPLY_GOLD", got "${dollarsBadge.bonus.type}"`
    );
  }

  console.log("✅ Wealth badge unlocks working correctly");
  return { success: true, wealthBadge: "working" };
}

// Test 4: Collection badge unlock
async function testCollectionBadgeUnlock() {
  console.log("🔧 Test 4: Collection Badge Unlock");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    discoveredItemIds: [],
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Verify no collection badges initially
  if (initialState.unlockedBadgeIds.includes("collector_10")) {
    throw new Error("Collector 10 badge should not be unlocked initially");
  }

  // Add 10 discovered items to trigger badge unlock
  const stateWithItems = {
    ...initialState,
    discoveredItemIds: Array.from({ length: 10 }, (_, i) => `item_${i}`),
  };

  const result = checkForBadgeUnlocks(stateWithItems);

  if (!result.newlyUnlockedBadges.length) {
    throw new Error("Collector 10 badge should have been unlocked");
  }

  const collectorBadge = result.newlyUnlockedBadges.find(
    (b) => b.id === "collector_10"
  );
  if (!collectorBadge) {
    throw new Error("Collector 10 badge not found in newly unlocked badges");
  }

  if (collectorBadge.category !== "Collection") {
    throw new Error(
      `Expected badge category "Collection", got "${collectorBadge.category}"`
    );
  }

  console.log("✅ Collection badge unlock working correctly");
  return { success: true, collectionBadge: "working" };
}

// Test 5: Multiple badge unlocks in single check
async function testMultipleBadgeUnlocks() {
  console.log("🔧 Test 5: Multiple Badge Unlocks in Single Check");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 9,
    power: 999,
    gold: 99999,
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Set multiple thresholds to trigger multiple badge unlocks
  const stateWithMultipleThresholds = {
    ...initialState,
    level: 10,
    power: 1000,
    gold: 100000,
  };

  const result = checkForBadgeUnlocks(stateWithMultipleThresholds);

  if (result.newlyUnlockedBadges.length < 3) {
    throw new Error(
      `Expected at least 3 badges, got ${result.newlyUnlockedBadges.length}`
    );
  }

  const expectedBadgeIds = ["level_10", "power_1k", "gold_100k"];
  for (const expectedId of expectedBadgeIds) {
    if (!result.newlyUnlockedBadges.find((b) => b.id === expectedId)) {
      throw new Error(
        `Expected badge ${expectedId} not found in newly unlocked badges`
      );
    }
  }

  // Verify all badge IDs added to unlockedBadgeIds
  for (const expectedId of expectedBadgeIds) {
    if (!result.newPlayerState.unlockedBadgeIds.includes(expectedId)) {
      throw new Error(`Badge ID ${expectedId} not added to unlockedBadgeIds`);
    }
  }

  console.log("✅ Multiple badge unlocks working correctly");
  return { success: true, multipleUnlocks: "working" };
}

// ============================================================================
// BADGE BONUS APPLICATION TESTS
// ============================================================================

// Test 6: XP multiplier badge bonus
async function testXpMultiplierBadgeBonus() {
  console.log("🔧 Test 6: XP Multiplier Badge Bonus");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 10,
    unlockedBadgeIds: ["level_10"], // Junior Analyst: +0.5% XP
  });

  const initialState = await getPlayerState(playerId);

  // Verify badge is unlocked
  if (!initialState.unlockedBadgeIds.includes("level_10")) {
    throw new Error("Level 10 badge should be unlocked for this test");
  }

  // Get the badge data
  const level10Badge = BADGES["level_10"];
  if (!level10Badge) {
    throw new Error("Level 10 badge not found in BADGES constant");
  }

  if (level10Badge.bonus.type !== "MULTIPLY_XP") {
    throw new Error(
      `Expected bonus type "MULTIPLY_XP", got "${level10Badge.bonus.type}"`
    );
  }

  if (level10Badge.bonus.value !== 1.005) {
    throw new Error(
      `Expected bonus value 1.005, got ${level10Badge.bonus.value}`
    );
  }

  console.log("✅ XP multiplier badge bonus verified");
  console.log(
    `✅ Badge: ${level10Badge.name} - ${level10Badge.bonusDescription}`
  );

  return { success: true, xpBonus: "verified" };
}

// Test 7: Power multiplier badge bonus
async function testPowerMultiplierBadgeBonus() {
  console.log("🔧 Test 7: Power Multiplier Badge Bonus");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    power: 1000,
    unlockedBadgeIds: ["power_1k"], // Global Contender: +0.5% Power
  });

  const initialState = await getPlayerState(playerId);

  // Verify badge is unlocked
  if (!initialState.unlockedBadgeIds.includes("power_1k")) {
    throw new Error("Power 1k badge should be unlocked for this test");
  }

  // Get the badge data
  const power1kBadge = BADGES["power_1k"];
  if (!power1kBadge) {
    throw new Error("Power 1k badge not found in BADGES constant");
  }

  if (power1kBadge.bonus.type !== "MULTIPLY_POWER") {
    throw new Error(
      `Expected bonus type "MULTIPLY_POWER", got "${power1kBadge.bonus.type}"`
    );
  }

  if (power1kBadge.bonus.value !== 1.005) {
    throw new Error(
      `Expected bonus value 1.005, got ${power1kBadge.bonus.value}`
    );
  }

  console.log("✅ Power multiplier badge bonus verified");
  console.log(
    `✅ Badge: ${power1kBadge.name} - ${power1kBadge.bonusDescription}`
  );

  return { success: true, powerBonus: "verified" };
}

// Test 8: Gold multiplier badge bonus
async function testGoldMultiplierBadgeBonus() {
  console.log("🔧 Test 8: Gold Multiplier Badge Bonus");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    permanentPowerBonus: 100,
    unlockedBadgeIds: ["perm_power_100"], // Innate Strength: +1% Gold
  });

  const initialState = await getPlayerState(playerId);

  // Verify badge is unlocked
  if (!initialState.unlockedBadgeIds.includes("perm_power_100")) {
    throw new Error("Perm power 100 badge should be unlocked for this test");
  }

  // Get the badge data
  const permPowerBadge = BADGES["perm_power_100"];
  if (!permPowerBadge) {
    throw new Error("Perm power 100 badge not found in BADGES constant");
  }

  if (permPowerBadge.bonus.type !== "MULTIPLY_GOLD") {
    throw new Error(
      `Expected bonus type "MULTIPLY_GOLD", got "${permPowerBadge.bonus.type}"`
    );
  }

  if (permPowerBadge.bonus.value !== 1.01) {
    throw new Error(
      `Expected bonus value 1.01, got ${permPowerBadge.bonus.value}`
    );
  }

  console.log("✅ Gold multiplier badge bonus verified");
  console.log(
    `✅ Badge: ${permPowerBadge.name} - ${permPowerBadge.bonusDescription}`
  );

  return { success: true, goldBonus: "verified" };
}

// Test 9: Permanent power badge bonus
async function testPermanentPowerBadgeBonus() {
  console.log("🔧 Test 9: Permanent Power Badge Bonus");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    permanentPowerBonus: 500,
    unlockedBadgeIds: ["perm_power_500"], // Unbreakable Core: +1% Gold
  });

  const initialState = await getPlayerState(playerId);

  // Verify badge is unlocked
  if (!initialState.unlockedBadgeIds.includes("perm_power_500")) {
    throw new Error("Perm power 500 badge should be unlocked for this test");
  }

  // Get the badge data
  const permPowerBadge = BADGES["perm_power_500"];
  if (!permPowerBadge) {
    throw new Error("Perm power 500 badge not found in BADGES constant");
  }

  if (permPowerBadge.bonus.type !== "MULTIPLY_GOLD") {
    throw new Error(
      `Expected bonus type "MULTIPLY_GOLD", got "${permPowerBadge.bonus.type}"`
    );
  }

  if (permPowerBadge.bonus.value !== 1.01) {
    throw new Error(
      `Expected bonus value 1.01, got ${permPowerBadge.bonus.value}`
    );
  }

  console.log("✅ Permanent power badge bonus verified");
  console.log(
    `✅ Badge: ${permPowerBadge.name} - ${permPowerBadge.bonusDescription}`
  );

  return { success: true, permPowerBonus: "verified" };
}

// ============================================================================
// FRONTEND INTEGRATION TESTS
// ============================================================================

// Test 10: Frontend integration - newlyUnlockedBadges array
async function testFrontendIntegration() {
  console.log("🔧 Test 10: Frontend Integration - newlyUnlockedBadges Array");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 9,
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Simulate level up that should trigger badge unlock
  const stateAfterLevelUp = {
    ...initialState,
    level: 10,
  };

  const result = checkForBadgeUnlocks(stateAfterLevelUp);

  // Verify newlyUnlockedBadges array is returned for frontend
  if (!result.newlyUnlockedBadges) {
    throw new Error(
      "newlyUnlockedBadges array should be returned for frontend"
    );
  }

  if (!Array.isArray(result.newlyUnlockedBadges)) {
    throw new Error("newlyUnlockedBadges should be an array");
  }

  if (result.newlyUnlockedBadges.length === 0) {
    throw new Error("newlyUnlockedBadges should contain unlocked badges");
  }

  // Verify each badge in array has required properties for frontend
  for (const badge of result.newlyUnlockedBadges) {
    if (!badge.id) {
      throw new Error("Badge missing id property");
    }
    if (!badge.name) {
      throw new Error("Badge missing name property");
    }
    if (!badge.description) {
      throw new Error("Badge missing description property");
    }
    if (!badge.icon) {
      throw new Error("Badge missing icon property");
    }
    if (!badge.category) {
      throw new Error("Badge missing category property");
    }
    if (!badge.bonus) {
      throw new Error("Badge missing bonus property");
    }
    if (!badge.bonusDescription) {
      throw new Error("Badge missing bonusDescription property");
    }
  }

  console.log("✅ Frontend integration working correctly");
  console.log(
    `✅ ${result.newlyUnlockedBadges.length} badges ready for UI display`
  );

  return { success: true, frontendIntegration: "working" };
}

// Test 11: Badge unlock conditions validation
async function testBadgeUnlockConditions() {
  console.log("🔧 Test 11: Badge Unlock Conditions Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 1,
    power: 50,
    gold: 100,
    unlockedBadgeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Test a few specific unlock conditions
  const testConditions = [
    { badgeId: "level_10", condition: BADGE_UNLOCK_CONDITIONS["level_10"] },
    { badgeId: "power_1k", condition: BADGE_UNLOCK_CONDITIONS["power_1k"] },
    { badgeId: "gold_100k", condition: BADGE_UNLOCK_CONDITIONS["gold_100k"] },
  ];

  for (const { badgeId, condition } of testConditions) {
    if (!condition) {
      throw new Error(`Unlock condition not found for badge: ${badgeId}`);
    }

    // Test condition with current state (should be false)
    const shouldNotUnlock = condition(initialState);
    if (shouldNotUnlock) {
      throw new Error(`Badge ${badgeId} should not unlock with current state`);
    }

    // Test condition with modified state (should be true)
    let modifiedState = { ...initialState };
    switch (badgeId) {
      case "level_10":
        modifiedState.level = 10;
        break;
      case "power_1k":
        modifiedState.power = 1000;
        break;
      case "gold_100k":
        modifiedState.gold = 100000;
        break;
    }

    const shouldUnlock = condition(modifiedState);
    if (!shouldUnlock) {
      throw new Error(`Badge ${badgeId} should unlock with modified state`);
    }
  }

  console.log("✅ Badge unlock conditions working correctly");
  return { success: true, unlockConditions: "working" };
}

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

// Test 12: No new badges scenario
async function testNoNewBadgesScenario() {
  console.log("🔧 Test 12: No New Badges Scenario");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 5,
    power: 100,
    gold: 1000,
    permanentPowerBonus: 0, // Ensure no permanent power badges can unlock
    unlockedBadgeIds: [
      "level_10",
      "power_1k",
      "gold_100k",
      "level_5",
      "power_500",
      "gold_100",
      "perm_power_100",
      "perm_power_500",
    ], // All possible badges for this state
  });

  const initialState = await getPlayerState(playerId);

  // Try to unlock badges when all thresholds are already met
  const result = checkForBadgeUnlocks(initialState);

  if (result.newlyUnlockedBadges.length > 0) {
    console.log("🔍 Debug: Found badges that could unlock:");
    result.newlyUnlockedBadges.forEach((badge) => {
      console.log(`  - ${badge.id}: ${badge.name}`);
    });
    throw new Error(
      `Expected no new badges, got ${result.newlyUnlockedBadges.length}`
    );
  }

  if (result.newPlayerState !== initialState) {
    throw new Error(
      "Player state should not change when no new badges unlocked"
    );
  }

  console.log("✅ No new badges scenario handled correctly");
  return { success: true, noNewBadges: "working" };
}

// Test 13: Badge unlock with existing badges
async function testBadgeUnlockWithExistingBadges() {
  console.log("🔧 Test 13: Badge Unlock with Existing Badges");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    level: 9,
    power: 999,
    unlockedBadgeIds: ["level_5", "power_500"], // Some existing badges
  });

  const initialState = await getPlayerState(playerId);

  // Trigger new badge unlocks while preserving existing ones
  const stateWithNewThresholds = {
    ...initialState,
    level: 10,
    power: 1000,
  };

  const result = checkForBadgeUnlocks(stateWithNewThresholds);

  // Verify existing badges are preserved
  if (!result.newPlayerState.unlockedBadgeIds.includes("level_5")) {
    throw new Error("Existing level_5 badge was lost");
  }

  if (!result.newPlayerState.unlockedBadgeIds.includes("power_500")) {
    throw new Error("Existing power_500 badge was lost");
  }

  // Verify new badges are added
  if (!result.newPlayerState.unlockedBadgeIds.includes("level_10")) {
    throw new Error("New level_10 badge not added");
  }

  if (!result.newPlayerState.unlockedBadgeIds.includes("power_1k")) {
    throw new Error("New power_1k badge not added");
  }

  console.log("✅ Badge unlock with existing badges working correctly");
  return { success: true, existingBadges: "preserved" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runBadgeSystemTests() {
  console.log("============================================================");
  console.log("🏆 TESTING BADGE SYSTEM");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all tests
    console.log("\n🔧 Running Badge Unlock Detection Tests...");
    results.push(await testLevelBadgeUnlock());
    results.push(await testPowerBadgeUnlock());
    results.push(await testWealthBadgeUnlock());
    results.push(await testCollectionBadgeUnlock());
    results.push(await testMultipleBadgeUnlocks());

    console.log("\n🔧 Running Badge Bonus Application Tests...");
    results.push(await testXpMultiplierBadgeBonus());
    results.push(await testPowerMultiplierBadgeBonus());
    results.push(await testGoldMultiplierBadgeBonus());
    results.push(await testPermanentPowerBadgeBonus());

    console.log("\n🔧 Running Frontend Integration Tests...");
    results.push(await testFrontendIntegration());
    results.push(await testBadgeUnlockConditions());

    console.log("\n🔧 Running Edge Case Tests...");
    results.push(await testNoNewBadgesScenario());
    results.push(await testBadgeUnlockWithExistingBadges());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 BADGE SYSTEM TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL BADGE SYSTEM TESTS PASSED!");
      console.log("🏆 Badge system is working perfectly!");
      console.log(
        "🎯 Frontend will receive newlyUnlockedBadges for UI updates!"
      );
      console.log("⚡ All badge bonuses are properly configured!");
    } else {
      console.log("💥 Some tests failed!");
    }

    // Detailed results
    console.log("\n📋 Test Details:");
    results.forEach((result, index) => {
      const status = result.success ? "✅" : "❌";
      console.log(
        `${status} Test ${index + 1}: ${result.success ? "PASSED" : "FAILED"}`
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
  runBadgeSystemTests().catch(console.error);
}

export { runBadgeSystemTests };
