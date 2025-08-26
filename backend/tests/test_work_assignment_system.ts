import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import {
  assignToWork,
  collectPay,
  createHomunculus,
  claimHibernation,
} from "../logic";
import { ZONES } from "../../constants/zones";
import { ITEMS } from "../../constants/index";
import { ItemRarity } from "../../types";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// WORK ASSIGNMENT TESTS
// ============================================================================

// Test 1: Basic work assignment
async function testBasicWorkAssignment() {
  console.log("🔧 Test 1: Basic Work Assignment");

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

  // Create a homunculus and complete its hibernation
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for work assignment test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Simulate completed hibernation
  const completedHibernationHomunculus = {
    ...homunculus,
    hibernationEndTime: Date.now() - 1000,
    isAdult: true,
  };

  const stateWithAdultHomunculus = {
    ...createResult.newPlayerState,
    homunculi: [completedHibernationHomunculus],
  };

  // Assign homunculus to work
  const workZone = ZONES.find((z) => z.id === "caffeteria");
  if (!workZone) {
    throw new Error("Cafeteria zone not found for work assignment test");
  }

  const assignResult = assignToWork(
    stateWithAdultHomunculus,
    completedHibernationHomunculus.id,
    workZone.id
  );

  if (!assignResult.success) {
    throw new Error(`Work assignment failed: ${assignResult.message}`);
  }

  // Verify homunculus is now working
  const workingHomunculus = assignResult.newPlayerState.homunculi.find(
    (h) => h.id === completedHibernationHomunculus.id
  );
  if (!workingHomunculus) {
    throw new Error("Working homunculus not found");
  }

  if (!workingHomunculus.work) {
    throw new Error("Homunculus should be assigned to work");
  }

  if (workingHomunculus.work.zoneId !== workZone.id) {
    throw new Error(
      `Expected work zone ${workZone.id}, got ${workingHomunculus.work.zoneId}`
    );
  }

  if (!workingHomunculus.work.startTime) {
    throw new Error("Work start time should be set");
  }

  console.log("✅ Basic work assignment working correctly");
  return { success: true, basicAssignment: "working" };
}

// Test 2: Work assignment validation
async function testWorkAssignmentValidation() {
  console.log("🔧 Test 2: Work Assignment Validation");

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
    throw new Error("Failed to create homunculus for work validation test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Try to assign non-existent homunculus to work
  const nonExistentResult = assignToWork(
    createResult.newPlayerState,
    99999,
    "caffeteria"
  );

  if (nonExistentResult.success) {
    throw new Error("Assigning non-existent homunculus should have failed");
  }

  if (!nonExistentResult.message.includes("Homunculus not found")) {
    throw new Error(
      `Expected 'Homunculus not found' message, got: ${nonExistentResult.message}`
    );
  }

  // Try to assign juvenile homunculus to work
  const juvenileResult = assignToWork(
    createResult.newPlayerState,
    homunculus.id,
    "caffeteria"
  );

  if (juvenileResult.success) {
    throw new Error("Assigning juvenile homunculus should have failed");
  }

  if (!juvenileResult.message.includes("Only adult Reptilianz can work")) {
    throw new Error(
      `Expected 'Only adult Reptilianz can work' message, got: ${juvenileResult.message}`
    );
  }

  // Try to assign to non-existent workplace
  const nonExistentWorkplace = createResult.newPlayerState.homunculi.map(
    (h) => ({
      ...h,
      hibernationEndTime: Date.now() - 1000,
      isAdult: true,
    })
  );

  const stateWithAdultHomunculi = {
    ...createResult.newPlayerState,
    homunculi: nonExistentWorkplace,
  };

  const invalidWorkplaceResult = assignToWork(
    stateWithAdultHomunculi,
    nonExistentWorkplace[0].id,
    "non_existent_workplace"
  );

  if (invalidWorkplaceResult.success) {
    throw new Error("Assigning to non-existent workplace should have failed");
  }

  if (!invalidWorkplaceResult.message.includes("Workplace not found")) {
    throw new Error(
      `Expected 'Workplace not found' message, got: ${invalidWorkplaceResult.message}`
    );
  }

  console.log("✅ Work assignment validation working correctly");
  return { success: true, assignmentValidation: "working" };
}

// Test 3: Workplace capacity management
async function testWorkplaceCapacityManagement() {
  console.log("🔧 Test 3: Workplace Capacity Management");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 5 },
      { itemId: "reptilian_heart", quantity: 5 },
      { itemId: "alien_brain", quantity: 5 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create multiple homunculi
  let currentState = initialState;
  const homunculusIds = [];

  for (let i = 0; i < 5; i++) {
    const createResult = createHomunculus(currentState, {
      core: "shapeshifter_gene",
      material1: "reptilian_heart",
      material2: "alien_brain",
    });

    if (!createResult.success) {
      throw new Error(`Failed to create homunculus ${i + 1}`);
    }

    currentState = createResult.newPlayerState;
    homunculusIds.push(createResult.newPlayerState.homunculi[i].id);
  }

  // Make all homunculi adult
  const adultHomunculi = currentState.homunculi.map((h) => ({
    ...h,
    hibernationEndTime: Date.now() - 1000,
    isAdult: true,
  }));

  const stateWithAdultHomunculi = {
    ...currentState,
    homunculi: adultHomunculi,
  };

  // Get a zone with limited capacity
  const workZone = ZONES.find((z) => z.id === "caffeteria");
  if (!workZone) {
    throw new Error("Cafeteria zone not found for capacity test");
  }

  // Assign homunculi to work until capacity is reached
  let assignedCount = 0;
  let lastAssignmentResult = null;

  for (const homunculusId of homunculusIds) {
    lastAssignmentResult = assignToWork(
      stateWithAdultHomunculi,
      homunculusId,
      workZone.id
    );

    if (lastAssignmentResult.success) {
      assignedCount++;
      stateWithAdultHomunculi.homunculi =
        lastAssignmentResult.newPlayerState.homunculi;
    } else {
      break; // Capacity reached
    }
  }

  // Verify capacity limit is enforced
  if (assignedCount >= homunculusIds.length) {
    throw new Error("All homunculi were assigned despite capacity limits");
  }

  if (lastAssignmentResult && lastAssignmentResult.success) {
    throw new Error("Assignment should have failed when capacity reached");
  }

  if (
    lastAssignmentResult &&
    !lastAssignmentResult.message.includes("fully staffed")
  ) {
    throw new Error(
      `Expected 'fully staffed' message, got: ${lastAssignmentResult.message}`
    );
  }

  console.log("✅ Workplace capacity management working correctly");
  return { success: true, capacityManagement: "working" };
}

// ============================================================================
// PAY COLLECTION TESTS
// ============================================================================

// Test 4: Basic pay collection
async function testBasicPayCollection() {
  console.log("🔧 Test 4: Basic Pay Collection");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 1000,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create and assign homunculus to work
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for pay collection test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Make homunculus adult
  const adultHomunculus = {
    ...homunculus,
    hibernationEndTime: Date.now() - 1000,
    isAdult: true,
  };

  const stateWithAdultHomunculus = {
    ...createResult.newPlayerState,
    homunculi: [adultHomunculus],
  };

  // Assign to work
  const workZone = ZONES.find((z) => z.id === "caffeteria");
  if (!workZone) {
    throw new Error("Cafeteria zone not found for pay collection test");
  }

  const assignResult = assignToWork(
    stateWithAdultHomunculus,
    adultHomunculus.id,
    workZone.id
  );

  if (!assignResult.success) {
    throw new Error(`Work assignment failed: ${assignResult.message}`);
  }

  // Simulate some work time passing
  const workingHomunculus = {
    ...assignResult.newPlayerState.homunculi[0],
    work: {
      zoneId: workZone.id,
      startTime: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    },
  };

  const stateWithWorkingHomunculus = {
    ...assignResult.newPlayerState,
    homunculi: [workingHomunculus],
  };

  // Collect pay
  const collectResult = collectPay(
    stateWithWorkingHomunculus,
    workingHomunculus.id
  );

  if (!collectResult.success) {
    throw new Error(`Pay collection failed: ${collectResult.message}`);
  }

  // Verify pay was collected
  if (collectResult.newPlayerState.gold <= stateWithWorkingHomunculus.gold) {
    throw new Error("Gold should have increased after pay collection");
  }

  // Verify homunculus is no longer working
  const paidHomunculus = collectResult.newPlayerState.homunculi.find(
    (h) => h.id === workingHomunculus.id
  );
  if (!paidHomunculus) {
    throw new Error("Paid homunculus not found");
  }

  if (paidHomunculus.work !== null) {
    throw new Error(
      "Homunculus should no longer be working after pay collection"
    );
  }

  console.log("✅ Basic pay collection working correctly");
  return { success: true, basicPayCollection: "working" };
}

// Test 5: Pay collection validation
async function testPayCollectionValidation() {
  console.log("🔧 Test 5: Pay Collection Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 1000,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for pay validation test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Try to collect pay from non-existent homunculus
  const nonExistentResult = collectPay(createResult.newPlayerState, 99999);

  if (nonExistentResult.success) {
    throw new Error(
      "Collecting pay from non-existent homunculus should have failed"
    );
  }

  if (!nonExistentResult.message.includes("Homunculus not found")) {
    throw new Error(
      `Expected 'Homunculus not found' message, got: ${nonExistentResult.message}`
    );
  }

  // Try to collect pay from homunculus that's not working
  const notWorkingResult = collectPay(
    createResult.newPlayerState,
    homunculus.id
  );

  if (notWorkingResult.success) {
    throw new Error(
      "Collecting pay from non-working homunculus should have failed"
    );
  }

  if (!notWorkingResult.message.includes("not working")) {
    throw new Error(
      `Expected 'not working' message, got: ${notWorkingResult.message}`
    );
  }

  console.log("✅ Pay collection validation working correctly");
  return { success: true, payValidation: "working" };
}

// ============================================================================
// WORKPLACE MANAGEMENT TESTS
// ============================================================================

// Test 6: Multiple workplace assignments
async function testMultipleWorkplaceAssignments() {
  console.log("🔧 Test 6: Multiple Workplace Assignments");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 3 },
      { itemId: "reptilian_heart", quantity: 3 },
      { itemId: "alien_brain", quantity: 3 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create multiple homunculi
  let currentState = initialState;
  const homunculusIds = [];

  for (let i = 0; i < 3; i++) {
    const createResult = createHomunculus(currentState, {
      core: "shapeshifter_gene",
      material1: "reptilian_heart",
      material2: "alien_brain",
    });

    if (!createResult.success) {
      throw new Error(`Failed to create homunculus ${i + 1}`);
    }

    currentState = createResult.newPlayerState;
    homunculusIds.push(createResult.newPlayerState.homunculi[i].id);
  }

  // Make all homunculi adult
  const adultHomunculi = currentState.homunculi.map((h) => ({
    ...h,
    hibernationEndTime: Date.now() - 1000,
    isAdult: true,
  }));

  const stateWithAdultHomunculi = {
    ...currentState,
    homunculi: adultHomunculi,
  };

  // Assign to different workplaces
  const workplaces = ["caffeteria", "supermarket", "park"];
  let assignedState = stateWithAdultHomunculi;

  for (let i = 0; i < homunculusIds.length; i++) {
    const assignResult = assignToWork(
      assignedState,
      homunculusIds[i],
      workplaces[i]
    );

    if (!assignResult.success) {
      throw new Error(
        `Failed to assign homunculus ${i + 1} to ${workplaces[i]}`
      );
    }

    assignedState = assignResult.newPlayerState;
  }

  // Verify all homunculi are working at different places
  for (let i = 0; i < assignedState.homunculi.length; i++) {
    const homunculus = assignedState.homunculi[i];

    if (!homunculus.work) {
      throw new Error(`Homunculus ${i + 1} is not working`);
    }

    if (homunculus.work.zoneId !== workplaces[i]) {
      throw new Error(
        `Expected workplace ${workplaces[i]}, got ${homunculus.work.zoneId}`
      );
    }
  }

  console.log("✅ Multiple workplace assignments working correctly");
  return { success: true, multipleWorkplaces: "working" };
}

// Test 7: Work assignment with different zone types
async function testWorkAssignmentWithDifferentZoneTypes() {
  console.log("🔧 Test 7: Work Assignment with Different Zone Types");

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

  // Create homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for zone type test");
  }

  const homunculus = createResult.newPlayerState.homunculi[0];

  // Make homunculus adult
  const adultHomunculus = {
    ...homunculus,
    hibernationEndTime: Date.now() - 1000,
    isAdult: true,
  };

  const stateWithAdultHomunculus = {
    ...createResult.newPlayerState,
    homunculi: [adultHomunculus],
  };

  // Test different zone types
  const testZones = ["caffeteria", "supermarket", "park", "gym"];

  for (const zoneId of testZones) {
    const zone = ZONES.find((z) => z.id === zoneId);
    if (!zone) {
      console.log(`⚠️  Zone ${zoneId} not found, skipping`);
      continue;
    }

    // Reset homunculus to not working
    const resetHomunculus = {
      ...adultHomunculus,
      work: null,
    };

    const resetState = {
      ...stateWithAdultHomunculus,
      homunculi: [resetHomunculus],
    };

    // Assign to this zone
    const assignResult = assignToWork(resetState, resetHomunculus.id, zoneId);

    if (!assignResult.success) {
      throw new Error(
        `Failed to assign to zone ${zoneId}: ${assignResult.message}`
      );
    }

    // Verify assignment
    const workingHomunculus = assignResult.newPlayerState.homunculi.find(
      (h) => h.id === resetHomunculus.id
    );
    if (!workingHomunculus || !workingHomunculus.work) {
      throw new Error(`Homunculus not working after assignment to ${zoneId}`);
    }

    if (workingHomunculus.work.zoneId !== zoneId) {
      throw new Error(
        `Expected zone ${zoneId}, got ${workingHomunculus.work.zoneId}`
      );
    }
  }

  console.log("✅ Work assignment with different zone types working correctly");
  return { success: true, differentZoneTypes: "working" };
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

// Test 8: Complete work cycle
async function testCompleteWorkCycle() {
  console.log("🔧 Test 8: Complete Work Cycle");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 1000,
    inventory: [
      { itemId: "shapeshifter_gene", quantity: 1 },
      { itemId: "reptilian_heart", quantity: 1 },
      { itemId: "alien_brain", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);
  let currentState = initialState;

  // 1. Create homunculus
  const createResult = createHomunculus(currentState, {
    core: "shapeshifter_gene",
    material1: "reptilian_heart",
    material2: "alien_brain",
  });
  if (!createResult.success) throw new Error("Homunculus creation failed");
  currentState = createResult.newPlayerState;

  // 2. Complete hibernation
  const homunculus = currentState.homunculi[0];
  const adultHomunculus = {
    ...homunculus,
    hibernationEndTime: Date.now() - 1000,
    isAdult: true,
  };
  currentState = {
    ...currentState,
    homunculi: [adultHomunculus],
  };

  // 3. Assign to work
  const assignResult = assignToWork(
    currentState,
    adultHomunculus.id,
    "caffeteria"
  );
  if (!assignResult.success) throw new Error("Work assignment failed");
  currentState = assignResult.newPlayerState;

  // 4. Simulate work time
  const workingHomunculus = {
    ...currentState.homunculi[0],
    work: {
      zoneId: "caffeteria",
      startTime: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    },
  };
  currentState = {
    ...currentState,
    homunculi: [workingHomunculus],
  };

  // 5. Collect pay
  const collectResult = collectPay(currentState, workingHomunculus.id);
  if (!collectResult.success) throw new Error("Pay collection failed");
  currentState = collectResult.newPlayerState;

  // 6. Verify final state
  if (currentState.homunculi.length !== 1) {
    throw new Error("Expected 1 homunculus after work cycle");
  }

  const finalHomunculus = currentState.homunculi[0];
  if (finalHomunculus.work !== null) {
    throw new Error("Homunculus should not be working after pay collection");
  }

  if (currentState.gold <= 1000) {
    throw new Error("Gold should have increased after work cycle");
  }

  console.log("✅ Complete work cycle working correctly");
  return { success: true, completeWorkCycle: "working" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runWorkAssignmentSystemTests() {
  console.log("============================================================");
  console.log("💼 TESTING WORK ASSIGNMENT SYSTEM");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all tests
    console.log("\n🔧 Running Work Assignment Tests...");
    results.push(await testBasicWorkAssignment());
    results.push(await testWorkAssignmentValidation());
    results.push(await testWorkplaceCapacityManagement());

    console.log("\n🔧 Running Pay Collection Tests...");
    results.push(await testBasicPayCollection());
    results.push(await testPayCollectionValidation());

    console.log("\n🔧 Running Workplace Management Tests...");
    results.push(await testMultipleWorkplaceAssignments());
    results.push(await testWorkAssignmentWithDifferentZoneTypes());

    console.log("\n🔧 Running Integration Tests...");
    results.push(await testCompleteWorkCycle());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 WORK ASSIGNMENT SYSTEM TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL WORK ASSIGNMENT SYSTEM TESTS PASSED!");
      console.log("💼 Work assignment system is working perfectly!");
      console.log("⏰ Timing and capacity management accurate!");
      console.log("💰 Pay collection and workplace management functional!");
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
  runWorkAssignmentSystemTests().catch(console.error);
}

export { runWorkAssignmentSystemTests };
