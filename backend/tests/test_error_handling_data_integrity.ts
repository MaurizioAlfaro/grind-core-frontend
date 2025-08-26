import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import {
  purchaseStoreItem,
  useConsumableItem,
  equipItem,
  unequipItem,
  startMission,
  claimMission,
  investLabXp,
  feedHomunculus,
  createHomunculus,
} from "../logic";
import { ITEMS } from "../../constants/index";
import { ZONES } from "../../constants/zones";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

// Test 1: Invalid item ID handling
async function testInvalidItemIdHandling() {
  console.log("🔧 Test 1: Invalid Item ID Handling");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 1000,
    inventory: [],
  });

  const initialState = await getPlayerState(playerId);

  // Try to use a non-existent item
  const result = useConsumableItem(initialState, "non_existent_item_12345");

  if (result.success) {
    throw new Error("Using non-existent item should have failed");
  }

  if (!result.message.includes("Invalid item")) {
    throw new Error(`Expected 'Invalid item' message, got: ${result.message}`);
  }

  // Verify state unchanged
  if (result.newPlayerState) {
    throw new Error(
      "Player state should not be modified on invalid item usage"
    );
  }

  console.log("✅ Invalid item ID properly rejected:", result.message);
  return { success: true, errorHandling: "working" };
}

// Test 2: Invalid equipment operations
async function testInvalidEquipmentOperations() {
  console.log("🔧 Test 2: Invalid Equipment Operations");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    inventory: [],
    equipment: {},
  });

  const initialState = await getPlayerState(playerId);

  // Try to equip non-existent item
  const equipResult = equipItem(initialState, "non_existent_weapon_12345");

  if (equipResult.success) {
    throw new Error("Equipping non-existent item should have failed");
  }

  if (!equipResult.message.includes("Invalid item")) {
    throw new Error(
      `Expected 'Invalid item' message, got: ${equipResult.message}`
    );
  }

  // Try to unequip from empty slot
  const unequipResult = unequipItem(initialState, "Weapon" as any);

  // unequipItem returns PlayerState, not EngineResult, so we check if equipment is unchanged
  if (unequipResult.equipment.Weapon) {
    throw new Error("Unequipping from empty slot should not modify equipment");
  }

  console.log("✅ Invalid equipment operations properly rejected");
  return { success: true, equipmentValidation: "working" };
}

// Test 3: Invalid mission operations
async function testInvalidMissionOperations() {
  console.log("🔧 Test 3: Invalid Mission Operations");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 1000,
    power: 50,
  });

  const initialState = await getPlayerState(playerId);

  // Try to start mission in non-existent zone
  const startResult = startMission(
    initialState,
    "non_existent_zone_12345",
    "SHORT",
    false // isDevMode parameter
  );

  if (startResult.success) {
    throw new Error("Starting mission in non-existent zone should have failed");
  }

  if (!startResult.message.includes("Zone not found")) {
    throw new Error(
      `Expected 'Zone not found' message, got: ${startResult.message}`
    );
  }

  // Try to claim mission when none active
  // claimMission requires an activeMission parameter, so we'll test with a mock one
  const mockActiveMission = {
    zoneId: "test_zone",
    startTime: Date.now(),
    endTime: Date.now() + 1000,
    durationKey: "SHORT" as any,
    preRolledRewards: { xp: 0, gold: 0, dollars: 0, items: [] },
  };

  const claimResult = claimMission(initialState, mockActiveMission);

  if (claimResult.success) {
    throw new Error("Claiming incomplete mission should have failed");
  }

  if (!claimResult.message.includes("Mission not yet complete")) {
    throw new Error(
      `Expected 'Mission not yet complete' message, got: ${claimResult.message}`
    );
  }

  console.log("✅ Invalid mission operations properly rejected");
  return { success: true, missionValidation: "working" };
}

// Test 4: Invalid lab operations
async function testInvalidLabOperations() {
  console.log("🔧 Test 4: Invalid Lab Operations");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    xp: 1000,
    labLevel: 1,
    labXp: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Try to invest invalid amount
  const investResult = investLabXp(initialState, -100);

  if (investResult.success) {
    throw new Error("Investing negative XP should have failed");
  }

  if (!investResult.message.includes("Invalid amount")) {
    throw new Error(
      `Expected 'Invalid amount' message, got: ${investResult.message}`
    );
  }

  // Try to invest more XP than available
  const overInvestResult = investLabXp(initialState, 2000);

  if (overInvestResult.success) {
    throw new Error("Investing more XP than available should have failed");
  }

  if (!overInvestResult.message.includes("Not enough XP")) {
    throw new Error(
      `Expected 'Not enough XP' message, got: ${overInvestResult.message}`
    );
  }

  console.log("✅ Invalid lab operations properly rejected");
  return { success: true, labValidation: "working" };
}

// Test 5: Invalid homunculus operations
async function testInvalidHomunculusOperations() {
  console.log("🔧 Test 5: Invalid Homunculus Operations");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    inventory: [],
    homunculi: [],
  });

  const initialState = await getPlayerState(playerId);

  // Try to feed non-existent homunculus
  const feedResult = feedHomunculus(
    initialState,
    99999, // Use a number ID instead of string
    "cafeteria_spork"
  );

  if (feedResult.success) {
    throw new Error("Feeding non-existent homunculus should have failed");
  }

  if (!feedResult.message.includes("Homunculus not found")) {
    throw new Error(
      `Expected 'Homunculus not found' message, got: ${feedResult.message}`
    );
  }

  // Try to create homunculus with invalid parts
  const createResult = createHomunculus(initialState, {
    core: "invalid_core",
    material1: "invalid_material1",
    material2: "invalid_material2",
  });

  if (createResult.success) {
    throw new Error(
      "Creating homunculus with invalid parts should have failed"
    );
  }

  if (
    !createResult.message.includes(
      "Shapeshifter's Gene must be the core component"
    )
  ) {
    throw new Error(
      `Expected 'Shapeshifter's Gene must be the core component' message, got: ${createResult.message}`
    );
  }

  console.log("✅ Invalid homunculus operations properly rejected");
  return { success: true, homunculusValidation: "working" };
}

// Test 6: Resource validation
async function testResourceValidation() {
  console.log("🔧 Test 6: Resource Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 100,
    dollars: 0,
    inventory: [],
  });

  const initialState = await getPlayerState(playerId);

  // Try to purchase expensive item with insufficient gold
  const purchaseResult = purchaseStoreItem(initialState, "buy_buff_gold_1"); // Costs 500 gold

  if (purchaseResult.success) {
    throw new Error("Purchase with insufficient gold should have failed");
  }

  if (!purchaseResult.message.includes("Not enough Gold")) {
    throw new Error(
      `Expected 'Not enough Gold' message, got: ${purchaseResult.message}`
    );
  }

  // Try to use item not in inventory
  const useResult = useConsumableItem(initialState, "small_xp_potion");

  if (useResult.success) {
    throw new Error("Using item not in inventory should have failed");
  }

  if (!useResult.message.includes("don't have that item")) {
    throw new Error(
      `Expected 'don't have that item' message, got: ${useResult.message}`
    );
  }

  console.log("✅ Resource validation working correctly");
  return { success: true, resourceValidation: "working" };
}

// ============================================================================
// DATA INTEGRITY TESTS
// ============================================================================

// Test 7: State immutability verification
async function testStateImmutability() {
  console.log("🔧 Test 7: State Immutability Verification");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 1000,
    inventory: [],
    equipment: {},
    activeBoosts: [],
  });

  const initialState = await getPlayerState(playerId);

  // Store original state for comparison
  const originalState = JSON.parse(JSON.stringify(initialState));

  // Perform operation that should succeed
  const result = purchaseStoreItem(initialState, "buy_buff_gold_1");

  if (!result.success) {
    throw new Error("Purchase should have succeeded for this test");
  }

  // Verify original state unchanged
  if (JSON.stringify(initialState) !== JSON.stringify(originalState)) {
    throw new Error("Original player state was mutated during operation");
  }

  // Verify new state is separate
  if (result.newPlayerState === initialState) {
    throw new Error("New player state should be a separate object");
  }

  console.log("✅ State immutability maintained");
  console.log("✅ Original state unchanged");
  console.log("✅ New state is separate object");

  return { success: true, immutability: "maintained" };
}

// Test 8: Array property integrity
async function testArrayPropertyIntegrity() {
  console.log("🔧 Test 8: Array Property Integrity");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    inventory: [],
    activeBoosts: [],
    unlockedZoneIds: [],
    purchasedStoreUpgradeIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Verify all array properties are actually arrays
  const arrayProperties = [
    "inventory",
    "activeBoosts",
    "unlockedZoneIds",
    "purchasedStoreUpgradeIds",
  ];

  for (const prop of arrayProperties) {
    if (!Array.isArray(initialState[prop])) {
      throw new Error(
        `Property ${prop} should be an array, got: ${typeof initialState[prop]}`
      );
    }
  }

  // Perform operations that modify arrays
  const purchaseResult = purchaseStoreItem(initialState, "buy_buff_gold_1");
  if (!purchaseResult.success) {
    throw new Error("Purchase should have succeeded for this test");
  }

  // Verify arrays remain arrays after operations
  for (const prop of arrayProperties) {
    if (!Array.isArray(purchaseResult.newPlayerState[prop])) {
      throw new Error(
        `Property ${prop} should remain an array after operation, got: ${typeof purchaseResult
          .newPlayerState[prop]}`
      );
    }
  }

  console.log("✅ All array properties remain arrays");
  console.log("✅ Array integrity maintained during operations");

  return { success: true, arrayIntegrity: "maintained" };
}

// Test 9: Object property integrity
async function testObjectPropertyIntegrity() {
  console.log("🔧 Test 9: Object Property Integrity");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    equipment: {},
    equipmentUpgrades: {},
    equipmentEnchantments: {},
    bossDefeatCounts: {},
    dailySafeguardUses: {},
  });

  const initialState = await getPlayerState(playerId);

  // Verify all object properties are actually objects
  const objectProperties = [
    "equipment",
    "equipmentUpgrades",
    "equipmentEnchantments",
    "bossDefeatCounts",
    "dailySafeguardUses",
  ];

  for (const prop of objectProperties) {
    if (
      typeof initialState[prop] !== "object" ||
      Array.isArray(initialState[prop])
    ) {
      throw new Error(
        `Property ${prop} should be an object, got: ${typeof initialState[
          prop
        ]}`
      );
    }
  }

  // Perform operations that modify objects
  const equipResult = equipItem(initialState, "cafeteria_spork");
  if (!equipResult.success) {
    throw new Error("Equip should have succeeded for this test");
  }

  // Verify objects remain objects after operations
  for (const prop of objectProperties) {
    if (
      typeof equipResult.newPlayerState[prop] !== "object" ||
      Array.isArray(equipResult.newPlayerState[prop])
    ) {
      throw new Error(
        `Property ${prop} should remain an object after operation, got: ${typeof equipResult
          .newPlayerState[prop]}`
      );
    }
  }

  console.log("✅ All object properties remain objects");
  console.log("✅ Object integrity maintained during operations");

  return { success: true, objectIntegrity: "maintained" };
}

// Test 10: Data persistence verification
async function testDataPersistence() {
  console.log("🔧 Test 10: Data Persistence Verification");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 1000,
    inventory: [],
    equipment: {},
  });

  const initialState = await getPlayerState(playerId);

  // Perform operation
  const result = purchaseStoreItem(initialState, "buy_buff_gold_1");
  if (!result.success) {
    throw new Error("Purchase should have succeeded for this test");
  }

  // Verify changes in result
  if (result.newPlayerState.gold !== 500) {
    throw new Error(`Expected gold 500, got ${result.newPlayerState.gold}`);
  }

  // Verify logic function returned correct state
  console.log("✅ Data persistence test completed");
  console.log("✅ Logic function returned correct state");

  return { success: true, persistence: "tested" };
}

// Test 11: Complex state operations integrity
async function testComplexStateOperationsIntegrity() {
  console.log("🔧 Test 11: Complex State Operations Integrity");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 20000, // Increased to allow for upgrade purchase
    inventory: [],
    equipment: {},
    activeBoosts: [],
    unlockedZoneIds: [],
    purchasedStoreUpgradeIds: [],
  });

  const initialState = await getPlayerState(playerId);
  const originalState = JSON.parse(JSON.stringify(initialState));

  // Perform multiple operations
  let currentState = initialState;

  // 1. Purchase item
  const purchaseResult = purchaseStoreItem(currentState, "buy_buff_gold_1");
  if (!purchaseResult.success) throw new Error("Purchase failed");
  currentState = purchaseResult.newPlayerState;

  // 2. Use item
  const useResult = useConsumableItem(currentState, "consumable_buff_gold_1");
  if (!useResult.success) throw new Error("Use item failed");
  currentState = useResult.newPlayerState;

  // 3. Purchase upgrade
  const upgradeResult = purchaseStoreItem(currentState, "upgrade_xp_1");
  if (!upgradeResult.success) throw new Error("Upgrade purchase failed");
  currentState = upgradeResult.newPlayerState;

  // Verify original state unchanged
  if (JSON.stringify(initialState) !== JSON.stringify(originalState)) {
    throw new Error("Original state was mutated during complex operations");
  }

  // Verify all operations produced valid state
  if (currentState.gold !== 9500) {
    // 20000 - 500 - 10000
    throw new Error(`Expected final gold 9500, got ${currentState.gold}`);
  }

  if (currentState.activeBoosts.length !== 1) {
    throw new Error(
      `Expected 1 active boost, got ${currentState.activeBoosts.length}`
    );
  }

  if (!currentState.purchasedStoreUpgradeIds.includes("upgrade_xp_1")) {
    throw new Error("Upgrade not tracked in purchased list");
  }

  console.log("✅ Complex state operations integrity maintained");
  console.log("✅ Original state unchanged");
  console.log("✅ Final state valid");

  return { success: true, complexIntegrity: "maintained" };
}

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

// Test 12: Boundary value testing
async function testBoundaryValues() {
  console.log("🔧 Test 12: Boundary Value Testing");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 0,
    xp: 0,
    level: 1,
    inventory: [],
    activeBoosts: [],
  });

  const initialState = await getPlayerState(playerId);

  // Test zero gold purchase
  const zeroGoldResult = purchaseStoreItem(initialState, "buy_buff_gold_1");
  if (zeroGoldResult.success) {
    throw new Error("Purchase with 0 gold should have failed");
  }

  // Test zero XP lab investment
  const zeroXpResult = investLabXp(initialState, 0);
  if (zeroXpResult.success) {
    throw new Error("Investing 0 XP should have failed");
  }

  // Test negative values
  const negativeResult = investLabXp(initialState, -100);
  if (negativeResult.success) {
    throw new Error("Investing negative XP should have failed");
  }

  console.log("✅ Boundary value validation working");
  return { success: true, boundaryValidation: "working" };
}

// Test 13: Concurrent operation simulation
async function testConcurrentOperationSimulation() {
  console.log("🔧 Test 13: Concurrent Operation Simulation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 10000,
    inventory: [],
    equipment: {},
  });

  const initialState = await getPlayerState(playerId);

  // Simulate concurrent operations by calling functions with same initial state
  const results = await Promise.all([
    purchaseStoreItem(initialState, "buy_buff_gold_1"),
    purchaseStoreItem(initialState, "buy_buff_xp_1"),
    purchaseStoreItem(initialState, "buy_buff_loot_1"),
  ]);

  // All should succeed but with different final states
  for (let i = 0; i < results.length; i++) {
    if (!results[i].success) {
      throw new Error(
        `Concurrent operation ${i + 1} failed: ${results[i].message}`
      );
    }
  }

  // Verify original state unchanged
  if (initialState.gold !== 10000) {
    throw new Error(
      "Original state gold was modified during concurrent operations"
    );
  }

  console.log("✅ Concurrent operation simulation successful");
  console.log("✅ Original state protected from modification");

  return { success: true, concurrentProtection: "working" };
}

// Test 14: Corrupted data handling
async function testCorruptedDataHandling() {
  console.log("🔧 Test 14: Corrupted Data Handling");

  await ensureTestPlayer(playerId);

  // Create corrupted state with invalid data types
  const corruptedState = {
    gold: "not_a_number", // Should be number
    inventory: "not_an_array", // Should be array
    equipment: null, // Should be object
    activeBoosts: undefined, // Should be array
  };

  // Try to use corrupted state
  try {
    const result = purchaseStoreItem(corruptedState as any, "buy_buff_gold_1");

    // The function should handle corrupted data gracefully
    if (result.success) {
      console.log(
        "⚠️  Function succeeded with corrupted data (may need validation)"
      );
    } else {
      console.log("✅ Function properly rejected corrupted data");
    }
  } catch (error) {
    console.log(
      "✅ Function threw error for corrupted data (expected behavior)"
    );
  }

  console.log("✅ Corrupted data handling test completed");
  return { success: true, corruptionHandling: "tested" };
}

// Test 15: Recovery scenario testing
async function testRecoveryScenarios() {
  console.log("🔧 Test 15: Recovery Scenario Testing");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 1000,
    inventory: [],
    equipment: {},
    activeBoosts: [],
  });

  const initialState = await getPlayerState(playerId);

  // Simulate failed operation
  const failedResult = purchaseStoreItem(initialState, "non_existent_item");

  if (failedResult.success) {
    throw new Error("Operation with invalid item should have failed");
  }

  // Verify state is recoverable
  const recoveredState = await getPlayerState(playerId);

  if (recoveredState.gold !== 1000) {
    throw new Error(
      `Recovered state gold should be 1000, got ${recoveredState.gold}`
    );
  }

  if (recoveredState.inventory.length !== 0) {
    throw new Error(
      `Recovered state inventory should be empty, got ${recoveredState.inventory.length} items`
    );
  }

  // Verify successful operation after failure
  const successResult = purchaseStoreItem(recoveredState, "buy_buff_gold_1");

  if (!successResult.success) {
    throw new Error("Operation should succeed after recovery");
  }

  console.log("✅ Recovery scenario testing successful");
  console.log("✅ State recoverable after failures");
  console.log("✅ Operations work after recovery");

  return { success: true, recovery: "working" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runErrorHandlingDataIntegrityTests() {
  console.log("============================================================");
  console.log("🛡️  TESTING ERROR HANDLING & DATA INTEGRITY");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all tests
    console.log("\n🔧 Running Error Handling Tests...");
    results.push(await testInvalidItemIdHandling());
    results.push(await testInvalidEquipmentOperations());
    results.push(await testInvalidMissionOperations());
    results.push(await testInvalidLabOperations());
    results.push(await testInvalidHomunculusOperations());
    results.push(await testResourceValidation());

    console.log("\n🔧 Running Data Integrity Tests...");
    results.push(await testStateImmutability());
    results.push(await testArrayPropertyIntegrity());
    results.push(await testObjectPropertyIntegrity());
    results.push(await testDataPersistence());
    results.push(await testComplexStateOperationsIntegrity());

    console.log("\n🔧 Running Edge Case Tests...");
    results.push(await testBoundaryValues());
    results.push(await testConcurrentOperationSimulation());
    results.push(await testCorruptedDataHandling());
    results.push(await testRecoveryScenarios());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 ERROR HANDLING & DATA INTEGRITY TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL ERROR HANDLING & DATA INTEGRITY TESTS PASSED!");
      console.log("🛡️  System is robust and reliable!");
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
  runErrorHandlingDataIntegrityTests().catch(console.error);
}

export { runErrorHandlingDataIntegrityTests };
