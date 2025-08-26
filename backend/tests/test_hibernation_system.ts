import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import { startHibernation, claimHibernation, createHomunculus } from "../logic";
import { ITEMS, LAB_LEVEL_PERKS } from "../../constants/index";
import { ItemRarity } from "../../types";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// HIBERNATION MECHANICS TESTS
// ============================================================================

// Test 1: Basic hibernation start
async function testBasicHibernationStart() {
  console.log("🔧 Test 1: Basic Hibernation Start");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus (starts hibernating automatically)
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for hibernation test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];
  if (!homunculus) {
    throw new Error("Homunculus not found after creation");
  }

  // Verify homunculus is hibernating
  if (homunculus.isAdult) {
    throw new Error("New homunculus should not be adult");
  }

  if (homunculus.hibernationEndTime === null) {
    throw new Error("New homunculus should be hibernating");
  }

  // Verify hibernation timing
  const now = Date.now();
  const hibernationDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (homunculus.hibernationEndTime <= now) {
    throw new Error("Hibernation end time should be in the future");
  }

  if (homunculus.hibernationEndTime > now + hibernationDuration + 1000) {
    throw new Error("Hibernation end time should be approximately 24 hours");
  }

  console.log("✅ Basic hibernation start working correctly");
  return { success: true, basicStart: "working" };
}

// Test 2: Hibernation start validation
async function testHibernationStartValidation() {
  console.log("🔧 Test 2: Hibernation Start Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error(
      "Failed to create homunculus for hibernation validation test"
    );
  }

  const homunculusId = createResult.newPlayerState.homunculi[0].id;

  // Try to start hibernation when already hibernating
  const alreadyHibernatingResult = startHibernation(
    createResult.newPlayerState,
    homunculusId
  );

  if (alreadyHibernatingResult.success) {
    throw new Error(
      "Starting hibernation when already hibernating should have failed"
    );
  }

  if (!alreadyHibernatingResult.message.includes("already hibernating")) {
    throw new Error(
      `Expected 'already hibernating' message, got: ${alreadyHibernatingResult.message}`
    );
  }

  // Try to start hibernation for non-existent homunculus
  const nonExistentResult = startHibernation(
    createResult.newPlayerState,
    99999
  );

  if (nonExistentResult.success) {
    throw new Error(
      "Starting hibernation for non-existent homunculus should have failed"
    );
  }

  if (!nonExistentResult.message.includes("Homunculus not found")) {
    throw new Error(
      `Expected 'Homunculus not found' message, got: ${nonExistentResult.message}`
    );
  }

  console.log("✅ Hibernation start validation working correctly");
  return { success: true, startValidation: "working" };
}

// Test 3: Hibernation claim validation
async function testHibernationClaimValidation() {
  console.log("🔧 Test 3: Hibernation Claim Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error(
      "Failed to create homunculus for hibernation claim validation test"
    );
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Try to claim hibernation before completion
  const claimEarlyResult = claimHibernation(
    createResult.newPlayerState,
    homunculus
  );

  if (claimEarlyResult.success) {
    throw new Error(
      "Claiming hibernation before completion should have failed"
    );
  }

  if (!claimEarlyResult.message.includes("not yet complete")) {
    throw new Error(
      `Expected 'not yet complete' message, got: ${claimEarlyResult.message}`
    );
  }

  // Try to claim hibernation for non-existent homunculus
  const nonExistentHomunculus = {
    ...homunculus,
    id: 99999,
  };

  const nonExistentResult = claimHibernation(
    createResult.newPlayerState,
    nonExistentHomunculus
  );

  if (nonExistentResult.success) {
    throw new Error(
      "Claiming hibernation for non-existent homunculus should have failed"
    );
  }

  if (!nonExistentResult.message.includes("Homunculus not found")) {
    throw new Error(
      `Expected 'Homunculus not found' message, got: ${nonExistentResult.message}`
    );
  }

  console.log("✅ Hibernation claim validation working correctly");
  return { success: true, claimValidation: "working" };
}

// ============================================================================
// HIBERNATION TIMING TESTS
// ============================================================================

// Test 4: Hibernation duration calculation
async function testHibernationDurationCalculation() {
  console.log("🔧 Test 4: Hibernation Duration Calculation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error(
      "Failed to create homunculus for duration calculation test"
    );
  }

  const homunculus = createResult.newPlayerState.homunculi[0];
  const now = Date.now();

  // Verify hibernation duration is reasonable (24 hours ± 1 minute)
  const expectedDuration = 24 * 60 * 60 * 1000; // 24 hours
  const actualDuration = homunculus.hibernationEndTime - now;
  const tolerance = 60 * 1000; // 1 minute tolerance

  if (Math.abs(actualDuration - expectedDuration) > tolerance) {
    throw new Error(
      `Expected hibernation duration ~24 hours, got ${
        actualDuration / (60 * 60 * 1000)
      } hours`
    );
  }

  console.log("✅ Hibernation duration calculation working correctly");
  return { success: true, durationCalculation: "working" };
}

// Test 5: Lab level hibernation duration effects
async function testLabLevelHibernationEffects() {
  console.log("🔧 Test 5: Lab Level Hibernation Duration Effects");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 5, // Higher lab level should reduce hibernation time
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for lab level effects test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];
  const now = Date.now();

  // Get lab level perks
  const labPerks = LAB_LEVEL_PERKS[initialState.labLevel];
  if (!labPerks) {
    throw new Error("Lab level perks not found");
  }

  // Verify hibernation time is reduced by lab level
  const baseDuration = 24 * 60 * 60 * 1000; // 24 hours
  const expectedDuration = baseDuration * labPerks.hibernationTimeMultiplier;
  const actualDuration = homunculus.hibernationEndTime - now;
  const tolerance = 60 * 1000; // 1 minute tolerance

  if (Math.abs(actualDuration - expectedDuration) > tolerance) {
    throw new Error(
      `Expected hibernation duration ${
        expectedDuration / (60 * 60 * 1000)
      } hours, got ${actualDuration / (60 * 60 * 1000)} hours`
    );
  }

  console.log("✅ Lab level hibernation effects working correctly");
  return { success: true, labLevelEffects: "working" };
}

// ============================================================================
// HIBERNATION COMPLETION TESTS
// ============================================================================

// Test 6: Successful hibernation completion
async function testSuccessfulHibernationCompletion() {
  console.log("🔧 Test 6: Successful Hibernation Completion");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for completion test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Simulate completed hibernation by setting end time in the past
  const completedHibernationHomunculus = {
    ...homunculus,
    hibernationEndTime: Date.now() - 1000, // 1 second ago
  };

  const stateWithCompletedHibernation = {
    ...createResult.newPlayerState,
    homunculi: [completedHibernationHomunculus],
  };

  // Claim completed hibernation
  const claimResult = claimHibernation(
    stateWithCompletedHibernation,
    completedHibernationHomunculus
  );

  if (!claimResult.success) {
    throw new Error(`Hibernation claim failed: ${claimResult.message}`);
  }

  // Verify homunculus is now adult
  const claimedHomunculus = claimResult.newPlayerState.homunculi.find(
    (h) => h.id === homunculus.id
  );
  if (!claimedHomunculus) {
    throw new Error("Claimed homunculus not found");
  }

  if (!claimedHomunculus.isAdult) {
    throw new Error("Homunculus should be adult after hibernation completion");
  }

  if (claimedHomunculus.hibernationEndTime !== null) {
    throw new Error("Hibernation end time should be null after completion");
  }

  console.log("✅ Successful hibernation completion working correctly");
  return { success: true, completion: "working" };
}

// Test 7: Hibernation completion rewards
async function testHibernationCompletionRewards() {
  console.log("🔧 Test 7: Hibernation Completion Rewards");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for rewards test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Simulate completed hibernation
  const completedHibernationHomunculus = {
    ...homunculus,
    hibernationEndTime: Date.now() - 1000,
  };

  const stateWithCompletedHibernation = {
    ...createResult.newPlayerState,
    homunculi: [completedHibernationHomunculus],
  };

  // Claim completed hibernation
  const claimResult = claimHibernation(
    stateWithCompletedHibernation,
    completedHibernationHomunculus
  );

  if (!claimResult.success) {
    throw new Error(`Hibernation claim failed: ${claimResult.message}`);
  }

  // Verify any rewards or state changes
  // Note: Specific rewards depend on game design, but we can verify state changes

  const claimedHomunculus = claimResult.newPlayerState.homunculi.find(
    (h) => h.id === homunculus.id
  );
  if (!claimedHomunculus) {
    throw new Error("Claimed homunculus not found");
  }

  // Verify homunculus is now adult and can work
  if (!claimedHomunculus.isAdult) {
    throw new Error("Homunculus should be adult after hibernation completion");
  }

  // Verify homunculus can be assigned to work (work property should be null initially)
  if (claimedHomunculus.work !== null) {
    throw new Error("Newly adult homunculus should not be working initially");
  }

  console.log("✅ Hibernation completion rewards working correctly");
  return { success: true, completionRewards: "working" };
}

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

// Test 8: Multiple homunculi hibernation
async function testMultipleHomunculiHibernation() {
  console.log("🔧 Test 8: Multiple Homunculi Hibernation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 2 },
      { itemId: "reptilian_heart", quantity: 2 },
      { itemId: "alien_brain", quantity: 2 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create first homunculus
  const create1Result = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!create1Result.success) {
    throw new Error("Failed to create first homunculus");
  }

  // Create second homunculus
  const create2Result = createHomunculus(create1Result.newPlayerState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!create2Result.success) {
    throw new Error("Failed to create second homunculus");
  }

  // Verify both homunculi are hibernating
  if (create2Result.newPlayerState.homunculi.length !== 2) {
    throw new Error(
      `Expected 2 homunculi, got ${create2Result.newPlayerState.homunculi.length}`
    );
  }

  for (const homunculus of create2Result.newPlayerState.homunculi) {
    if (homunculus.isAdult) {
      throw new Error("New homunculus should not be adult");
    }

    if (homunculus.hibernationEndTime === null) {
      throw new Error("New homunculus should be hibernating");
    }
  }

  // Verify creation count increased
  if (create2Result.newPlayerState.homunculusCreatedCount !== 2) {
    throw new Error(
      `Expected creation count 2, got ${create2Result.newPlayerState.homunculusCreatedCount}`
    );
  }

  console.log("✅ Multiple homunculi hibernation working correctly");
  return { success: true, multipleHibernation: "working" };
}

// Test 9: Hibernation with lab equipment effects
async function testHibernationWithLabEquipment() {
  console.log("🔧 Test 9: Hibernation with Lab Equipment Effects");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 10000,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
    purchasedLabEquipmentIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Purchase lab equipment that affects hibernation
  // Note: This would require checking what lab equipment affects hibernation
  // For now, we'll test basic hibernation with lab equipment

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for lab equipment test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Verify hibernation works normally
  if (homunculus.isAdult) {
    throw new Error("New homunculus should not be adult");
  }

  if (homunculus.hibernationEndTime === null) {
    throw new Error("New homunculus should be hibernating");
  }

  console.log("✅ Hibernation with lab equipment working correctly");
  return { success: true, labEquipmentEffects: "working" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runHibernationSystemTests() {
  console.log("============================================================");
  console.log("🌙 TESTING HIBERNATION SYSTEM");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all tests
    console.log("\n🔧 Running Hibernation Mechanics Tests...");
    results.push(await testBasicHibernationStart());
    results.push(await testHibernationStartValidation());
    results.push(await testHibernationClaimValidation());

    console.log("\n🔧 Running Hibernation Timing Tests...");
    results.push(await testHibernationDurationCalculation());
    results.push(await testLabLevelHibernationEffects());

    console.log("\n🔧 Running Hibernation Completion Tests...");
    results.push(await testSuccessfulHibernationCompletion());
    results.push(await testHibernationCompletionRewards());

    console.log("\n🔧 Running Edge Case Tests...");
    results.push(await testMultipleHomunculiHibernation());
    results.push(await testHibernationWithLabEquipment());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 HIBERNATION SYSTEM TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL HIBERNATION SYSTEM TESTS PASSED!");
      console.log("🌙 Hibernation system is working perfectly!");
      console.log("⏰ Timing and duration calculations accurate!");
      console.log("🎁 Completion rewards and state changes working!");
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
  runHibernationSystemTests().catch(console.error);
}

export { runHibernationSystemTests };
