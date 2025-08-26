import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import {
  createHomunculus,
  feedHomunculus,
  startHibernation,
  claimHibernation,
  purchaseLabEquipment,
  investLabXp,
} from "../logic";
import {
  ITEMS,
  LAB_EQUIPMENT,
  LAB_LEVEL_PERKS,
  LAB_XP_REQUIREMENTS,
  MAX_TRAIT_LEVEL,
} from "../../constants/index";
import { ItemRarity, HomunculusTrait } from "../../types";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// ============================================================================
// HOMUNCULUS CREATION TESTS
// ============================================================================

// Test 1: Basic homunculus creation
async function testBasicHomunculusCreation() {
  console.log("🔧 Test 1: Basic Homunculus Creation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifters_gene", quantity: 1 },
      { itemId: "reptilian_scale", quantity: 1 },
      { itemId: "cybernetic_eye", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Verify initial state
  if (initialState.homunculi.length !== 0) {
    throw new Error("Should start with no homunculi");
  }

  if (initialState.homunculusCreatedCount !== 0) {
    throw new Error("Should start with 0 homunculus creation count");
  }

  // Create homunculus
  const result = createHomunculus(initialState, {
    core: "shapeshifters_gene",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });

  if (!result.success) {
    throw new Error(`Homunculus creation failed: ${result.message}`);
  }

  // Verify homunculus created
  if (result.newPlayerState.homunculi.length !== 1) {
    throw new Error(
      `Expected 1 homunculus, got ${result.newPlayerState.homunculi.length}`
    );
  }

  const homunculus = result.newPlayerState.homunculi[0];
  if (!homunculus) {
    throw new Error("Homunculus not found in result");
  }

  // Verify homunculus properties
  if (homunculus.isAdult) {
    throw new Error("New homunculus should not be adult");
  }

  if (homunculus.hibernationEndTime !== null) {
    throw new Error("New homunculus should not be hibernating initially");
  }

  if (homunculus.rarity !== ItemRarity.Epic) {
    throw new Error(`Expected Epic rarity, got ${homunculus.rarity}`);
  }

  // Verify creation count increased
  if (result.newPlayerState.homunculusCreatedCount !== 1) {
    throw new Error(
      `Expected creation count 1, got ${result.newPlayerState.homunculusCreatedCount}`
    );
  }

  console.log("✅ Basic homunculus creation working correctly");
  return { success: true, basicCreation: "working" };
}

// Test 2: Homunculus creation with different rarities
async function testHomunculusRarityCreation() {
  console.log("🔧 Test 2: Homunculus Rarity Creation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifters_gene", quantity: 1 },
      { itemId: "reptilian_scale", quantity: 1 },
      { itemId: "cybernetic_eye", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Test with different material combinations to get different rarities
  const testCombinations = [
    {
      materials: ["reptilian_scale", "cybernetic_eye"],
      expectedRarity: ItemRarity.Epic,
    },
    {
      materials: ["reptilian_scale", "reptilian_scale"], // Same material should fail
      expectedRarity: null, // Should fail
    },
  ];

  for (const test of testCombinations) {
    if (test.expectedRarity === null) {
      // Test should fail
      const result = createHomunculus(initialState, {
        core: "shapeshifters_gene",
        material1: test.materials[0],
        material2: test.materials[1],
      });

      if (result.success) {
        throw new Error(
          `Homunculus creation should have failed with duplicate materials`
        );
      }

      if (!result.message.includes("Material components must be unique")) {
        throw new Error(
          `Expected 'Material components must be unique' message, got: ${result.message}`
        );
      }
    } else {
      // Test should succeed
      const result = createHomunculus(initialState, {
        core: "shapeshifters_gene",
        material1: test.materials[0],
        material2: test.materials[1],
      });

      if (!result.success) {
        throw new Error(`Homunculus creation failed: ${result.message}`);
      }

      const homunculus = result.newPlayerState.homunculi[0];
      if (homunculus.rarity !== test.expectedRarity) {
        throw new Error(
          `Expected rarity ${test.expectedRarity}, got ${homunculus.rarity}`
        );
      }
    }
  }

  console.log("✅ Homunculus rarity creation working correctly");
  return { success: true, rarityCreation: "working" };
}

// Test 3: Homunculus creation validation
async function testHomunculusCreationValidation() {
  console.log("🔧 Test 3: Homunculus Creation Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Test missing core component
  const missingCoreResult = createHomunculus(initialState, {
    core: "invalid_core",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });

  if (missingCoreResult.success) {
    throw new Error("Creation should have failed with invalid core");
  }

  if (
    !missingCoreResult.message.includes(
      "Shapeshifter's Gene must be the core component"
    )
  ) {
    throw new Error(
      `Expected core component message, got: ${missingCoreResult.message}`
    );
  }

  // Test missing material components
  const missingMaterialResult = createHomunculus(initialState, {
    core: "shapeshifters_gene",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });

  if (missingMaterialResult.success) {
    throw new Error("Creation should have failed with missing materials");
  }

  if (!missingMaterialResult.message.includes("Missing component")) {
    throw new Error(
      `Expected missing component message, got: ${missingMaterialResult.message}`
    );
  }

  console.log("✅ Homunculus creation validation working correctly");
  return { success: true, creationValidation: "working" };
}

// ============================================================================
// HOMUNCULUS FEEDING TESTS
// ============================================================================

// Test 4: Basic homunculus feeding
async function testBasicHomunculusFeeding() {
  console.log("🔧 Test 4: Basic Homunculus Feeding");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "power_bar_plus", quantity: 1 },
      { itemId: "shapeshifters_gene", quantity: 1 },
      { itemId: "reptilian_scale", quantity: 1 },
      { itemId: "cybernetic_eye", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // First create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifters_gene",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for feeding test");
  }

  const homunculusId = createResult.newPlayerState.homunculi[0].id;

  // Feed the homunculus
  const feedResult = feedHomunculus(
    createResult.newPlayerState,
    homunculusId,
    "power_bar_plus"
  );

  if (!feedResult.success) {
    throw new Error(`Feeding failed: ${feedResult.message}`);
  }

  // Verify feeding effects
  const fedHomunculus = feedResult.newPlayerState.homunculi.find(
    (h) => h.id === homunculusId
  );
  if (!fedHomunculus) {
    throw new Error("Fed homunculus not found");
  }

  // Verify trait increased
  const originalTraitValue = 0;
  const expectedTraitValue = Math.min(originalTraitValue + 1, MAX_TRAIT_LEVEL);

  if (fedHomunculus.traits[HomunculusTrait.Strength] !== expectedTraitValue) {
    throw new Error(
      `Expected trait value ${expectedTraitValue}, got ${
        fedHomunculus.traits[HomunculusTrait.Strength]
      }`
    );
  }

  // Verify food consumed
  const foodItem = feedResult.newPlayerState.inventory.find(
    (i) => i.itemId === "power_bar_plus"
  );
  if (foodItem && foodItem.quantity > 0) {
    throw new Error("Food should have been consumed");
  }

  // Verify fed food tracked
  if (
    !fedHomunculus.fedFoodIds ||
    !fedHomunculus.fedFoodIds.includes("power_bar_plus")
  ) {
    throw new Error("Fed food not tracked in homunculus");
  }

  console.log("✅ Basic homunculus feeding working correctly");
  return { success: true, basicFeeding: "working" };
}

// Test 5: Homunculus feeding validation
async function testHomunculusFeedingValidation() {
  console.log("🔧 Test 5: Homunculus Feeding Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "power_bar_plus", quantity: 1 },
      { itemId: "shapeshifters_gene", quantity: 1 },
      { itemId: "reptilian_scale", quantity: 1 },
      { itemId: "cybernetic_eye", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifters_gene",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for feeding validation test");
  }

  const homunculusId = createResult.newPlayerState.homunculi[0].id;

  // Test feeding non-existent homunculus
  const nonExistentResult = feedHomunculus(
    createResult.newPlayerState,
    99999,
    "power_bar_plus"
  );

  if (nonExistentResult.success) {
    throw new Error("Feeding non-existent homunculus should have failed");
  }

  if (!nonExistentResult.message.includes("Homunculus not found")) {
    throw new Error(
      `Expected 'Homunculus not found' message, got: ${nonExistentResult.message}`
    );
  }

  // Test feeding with invalid food
  const invalidFoodResult = feedHomunculus(
    createResult.newPlayerState,
    homunculusId,
    "invalid_food"
  );

  if (invalidFoodResult.success) {
    throw new Error("Feeding with invalid food should have failed");
  }

  if (!invalidFoodResult.message.includes("Invalid food item")) {
    throw new Error(
      `Expected 'Invalid food item' message, got: ${invalidFoodResult.message}`
    );
  }

  // Test feeding without food in inventory
  const noFoodState = {
    ...createResult.newPlayerState,
    inventory: createResult.newPlayerState.inventory.filter(
      (i) => i.itemId !== "power_bar_plus"
    ),
  };

  const noFoodResult = feedHomunculus(
    noFoodState,
    homunculusId,
    "power_bar_plus"
  );

  if (noFoodResult.success) {
    throw new Error("Feeding without food should have failed");
  }

  if (!noFoodResult.message.includes("don't have that food")) {
    throw new Error(
      `Expected 'don't have that food' message, got: ${noFoodResult.message}`
    );
  }

  console.log("✅ Homunculus feeding validation working correctly");
  return { success: true, feedingValidation: "working" };
}

// ============================================================================
// HIBERNATION TESTS
// ============================================================================

// Test 6: Basic hibernation cycle
async function testBasicHibernationCycle() {
  console.log("🔧 Test 6: Basic Hibernation Cycle");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    inventory: [
      { itemId: "shapeshifters_gene", quantity: 1 },
      { itemId: "reptilian_scale", quantity: 1 },
      { itemId: "cybernetic_eye", quantity: 1 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Create a homunculus
  const createResult = createHomunculus(initialState, {
    core: "shapeshifters_gene",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });

  if (!createResult.success) {
    throw new Error("Failed to create homunculus for hibernation test");
  }

  const homunculusId = createResult.newPlayerState.homunculi[0].id;

  // Verify homunculus is hibernating
  const hibernatingHomunculus = createResult.newPlayerState.homunculi.find(
    (h) => h.id === homunculusId
  );
  if (!hibernatingHomunculus) {
    throw new Error("Homunculus not found after creation");
  }

  if (hibernatingHomunculus.isAdult) {
    throw new Error("New homunculus should not be adult");
  }

  if (hibernatingHomunculus.hibernationEndTime === null) {
    throw new Error("New homunculus should be hibernating");
  }

  // Try to start hibernation when already hibernating
  const startHibernationResult = startHibernation(
    createResult.newPlayerState,
    homunculusId,
    false // isDevMode parameter
  );

  if (startHibernationResult.success) {
    throw new Error(
      "Starting hibernation when already hibernating should have failed"
    );
  }

  if (!startHibernationResult.message.includes("already hibernating")) {
    throw new Error(
      `Expected 'already hibernating' message, got: ${startHibernationResult.message}`
    );
  }

  // Try to claim hibernation before completion
  const claimEarlyResult = claimHibernation(
    createResult.newPlayerState,
    hibernatingHomunculus.id
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

  console.log("✅ Basic hibernation cycle working correctly");
  return { success: true, hibernationCycle: "working" };
}

// ============================================================================
// LAB EQUIPMENT TESTS
// ============================================================================

// Test 7: Lab equipment purchase
async function testLabEquipmentPurchase() {
  console.log("🔧 Test 7: Lab Equipment Purchase");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 10000,
    purchasedLabEquipmentIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Get available lab equipment
  const availableEquipment = Object.values(LAB_EQUIPMENT);
  if (availableEquipment.length === 0) {
    throw new Error("No lab equipment available for testing");
  }

  const testEquipment = availableEquipment[0];

  // Purchase lab equipment
  const purchaseResult = purchaseLabEquipment(initialState, testEquipment.id);

  if (!purchaseResult.success) {
    throw new Error(`Lab equipment purchase failed: ${purchaseResult.message}`);
  }

  // Verify equipment purchased
  if (
    !purchaseResult.newPlayerState.purchasedLabEquipmentIds.includes(
      testEquipment.id
    )
  ) {
    throw new Error("Equipment ID not added to purchased list");
  }

  // Verify gold deducted
  const expectedGold = initialState.gold - testEquipment.cost;
  if (purchaseResult.newPlayerState.gold !== expectedGold) {
    throw new Error(
      `Expected gold ${expectedGold}, got ${purchaseResult.newPlayerState.gold}`
    );
  }

  // Try to purchase same equipment again
  const duplicatePurchaseResult = purchaseLabEquipment(
    purchaseResult.newPlayerState,
    testEquipment.id
  );

  if (duplicatePurchaseResult.success) {
    throw new Error("Duplicate purchase should have failed");
  }

  if (!duplicatePurchaseResult.message.includes("already purchased")) {
    throw new Error(
      `Expected 'already purchased' message, got: ${duplicatePurchaseResult.message}`
    );
  }

  console.log("✅ Lab equipment purchase working correctly");
  return { success: true, equipmentPurchase: "working" };
}

// Test 8: Lab equipment purchase validation
async function testLabEquipmentPurchaseValidation() {
  console.log("🔧 Test 8: Lab Equipment Purchase Validation");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 100,
    purchasedLabEquipmentIds: [],
  });

  const initialState = await getPlayerState(playerId);

  // Get expensive lab equipment
  const expensiveEquipment = Object.values(LAB_EQUIPMENT).find(
    (eq) => eq.cost > initialState.gold
  );
  if (!expensiveEquipment) {
    throw new Error("No expensive lab equipment available for testing");
  }

  // Try to purchase with insufficient gold
  const insufficientGoldResult = purchaseLabEquipment(
    initialState,
    expensiveEquipment.id
  );

  if (insufficientGoldResult.success) {
    throw new Error("Purchase with insufficient gold should have failed");
  }

  if (!insufficientGoldResult.message.includes("Not enough gold")) {
    throw new Error(
      `Expected 'Not enough gold' message, got: ${insufficientGoldResult.message}`
    );
  }

  // Try to purchase non-existent equipment
  const nonExistentResult = purchaseLabEquipment(
    initialState,
    "non_existent_equipment"
  );

  if (nonExistentResult.success) {
    throw new Error("Purchase of non-existent equipment should have failed");
  }

  if (!nonExistentResult.message.includes("Equipment not found")) {
    throw new Error(
      `Expected 'Equipment not found' message, got: ${nonExistentResult.message}`
    );
  }

  console.log("✅ Lab equipment purchase validation working correctly");
  return { success: true, equipmentValidation: "working" };
}

// ============================================================================
// LAB XP & LEVELING TESTS
// ============================================================================

// Test 9: Lab XP investment
async function testLabXpInvestment() {
  console.log("🔧 Test 9: Lab XP Investment");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    labXp: 0,
    xp: 1000,
  });

  const initialState = await getPlayerState(playerId);

  // Invest XP in lab
  const investResult = investLabXp(initialState, 500);

  if (!investResult.success) {
    throw new Error(`Lab XP investment failed: ${investResult.message}`);
  }

  // Verify XP transferred
  if (investResult.newPlayerState.xp !== 500) {
    throw new Error(`Expected XP 500, got ${investResult.newPlayerState.xp}`);
  }

  if (investResult.newPlayerState.labXp !== 500) {
    throw new Error(
      `Expected lab XP 500, got ${investResult.newPlayerState.labXp}`
    );
  }

  // Try to invest more XP than available
  const overInvestResult = investLabXp(investResult.newPlayerState, 1000);

  if (overInvestResult.success) {
    throw new Error("Over-investment should have failed");
  }

  if (!overInvestResult.message.includes("Not enough XP")) {
    throw new Error(
      `Expected 'Not enough XP' message, got: ${overInvestResult.message}`
    );
  }

  // Try to invest negative XP
  const negativeInvestResult = investLabXp(investResult.newPlayerState, -100);

  if (negativeInvestResult.success) {
    throw new Error("Negative investment should have failed");
  }

  if (!negativeInvestResult.message.includes("Invalid amount")) {
    throw new Error(
      `Expected 'Invalid amount' message, got: ${negativeInvestResult.message}`
    );
  }

  console.log("✅ Lab XP investment working correctly");
  return { success: true, xpInvestment: "working" };
}

// Test 10: Lab level progression
async function testLabLevelProgression() {
  console.log("🔧 Test 10: Lab Level Progression");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    labXp: 0,
  });

  const initialState = await getPlayerState(playerId);

  // Get XP requirement for next level
  const xpForNextLevel = LAB_XP_REQUIREMENTS[initialState.labLevel];

  // Invest enough XP to level up
  const investResult = investLabXp(initialState, xpForNextLevel);

  if (!investResult.success) {
    throw new Error(`Lab XP investment failed: ${investResult.message}`);
  }

  // Verify level increased
  if (investResult.newPlayerState.labLevel !== 2) {
    throw new Error(
      `Expected lab level 2, got ${investResult.newPlayerState.labLevel}`
    );
  }

  // Verify lab XP reset
  if (investResult.newPlayerState.labXp !== 0) {
    throw new Error(
      `Expected lab XP 0 after level up, got ${investResult.newPlayerState.labXp}`
    );
  }

  // Verify new level perks available
  const newLevelPerks = LAB_LEVEL_PERKS[investResult.newPlayerState.labLevel];
  if (!newLevelPerks) {
    throw new Error("New level perks not found");
  }

  console.log("✅ Lab level progression working correctly");
  return { success: true, levelProgression: "working" };
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

// Test 11: Complete homunculus lifecycle
async function testCompleteHomunculusLifecycle() {
  console.log("🔧 Test 11: Complete Homunculus Lifecycle");

  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    labLevel: 1,
    gold: 10000,
    xp: 1000,
    inventory: [
      { itemId: "shapeshifters_gene", quantity: 1 },
      { itemId: "reptilian_scale", quantity: 1 },
      { itemId: "cybernetic_eye", quantity: 1 },
      { itemId: "power_bar_plus", quantity: 5 },
    ],
    homunculi: [],
    homunculusCreatedCount: 0,
    purchasedLabEquipmentIds: [],
  });

  const initialState = await getPlayerState(playerId);
  let currentState = initialState;

  // 1. Purchase lab equipment
  const equipment = Object.values(LAB_EQUIPMENT)[0];
  const equipmentResult = purchaseLabEquipment(currentState, equipment.id);
  if (!equipmentResult.success) throw new Error("Equipment purchase failed");
  currentState = equipmentResult.newPlayerState;

  // 2. Invest XP in lab
  const investResult = investLabXp(currentState, 500);
  if (!investResult.success) throw new Error("XP investment failed");
  currentState = investResult.newPlayerState;

  // 3. Create homunculus
  const createResult = createHomunculus(currentState, {
    core: "shapeshifters_gene",
    material1: "reptilian_scale",
    material2: "cybernetic_eye",
  });
  if (!createResult.success) throw new Error("Homunculus creation failed");
  currentState = createResult.newPlayerState;

  // 4. Feed homunculus multiple times
  const homunculusId = currentState.homunculi[0].id;
  for (let i = 0; i < 3; i++) {
    const feedResult = feedHomunculus(
      currentState,
      homunculusId,
      "power_bar_plus"
    );
    if (!feedResult.success) throw new Error(`Feeding ${i + 1} failed`);
    currentState = feedResult.newPlayerState;
  }

  // 5. Verify final state
  if (currentState.homunculi.length !== 1) {
    throw new Error("Expected 1 homunculus after lifecycle");
  }

  if (currentState.homunculusCreatedCount !== 1) {
    throw new Error("Expected creation count 1 after lifecycle");
  }

  if (currentState.purchasedLabEquipmentIds.length !== 1) {
    throw new Error("Expected 1 purchased equipment after lifecycle");
  }

  if (currentState.labXp !== 500) {
    throw new Error("Expected lab XP 500 after lifecycle");
  }

  const finalHomunculus = currentState.homunculi[0];
  if (finalHomunculus.traits[HomunculusTrait.Strength] !== 3) {
    throw new Error(
      `Expected trait value 3, got ${
        finalHomunculus.traits[HomunculusTrait.Strength]
      }`
    );
  }

  console.log("✅ Complete homunculus lifecycle working correctly");
  return { success: true, completeLifecycle: "working" };
}

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runLabHomunculusSystemTests() {
  console.log("============================================================");
  console.log("🧪 TESTING LAB & HOMUNCULUS SYSTEM");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all tests
    console.log("\n🔧 Running Homunculus Creation Tests...");
    results.push(await testBasicHomunculusCreation());
    results.push(await testHomunculusRarityCreation());
    results.push(await testHomunculusCreationValidation());

    console.log("\n🔧 Running Homunculus Feeding Tests...");
    results.push(await testBasicHomunculusFeeding());
    results.push(await testHomunculusFeedingValidation());

    console.log("\n🔧 Running Hibernation Tests...");
    results.push(await testBasicHibernationCycle());

    console.log("\n🔧 Running Lab Equipment Tests...");
    results.push(await testLabEquipmentPurchase());
    results.push(await testLabEquipmentPurchaseValidation());

    console.log("\n🔧 Running Lab XP & Leveling Tests...");
    results.push(await testLabXpInvestment());
    results.push(await testLabLevelProgression());

    console.log("\n🔧 Running Integration Tests...");
    results.push(await testCompleteHomunculusLifecycle());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 LAB & HOMUNCULUS SYSTEM TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL LAB & HOMUNCULUS SYSTEM TESTS PASSED!");
      console.log("🧪 Lab system is working perfectly!");
      console.log("👾 Homunculus creation, feeding, and hibernation working!");
      console.log("🔬 Lab equipment and leveling system functional!");
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
  runLabHomunculusSystemTests().catch(console.error);
}

export { runLabHomunculusSystemTests };
