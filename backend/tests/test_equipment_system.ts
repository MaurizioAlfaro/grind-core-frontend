import {
  forceSetPlayerState,
  getPlayerState,
  forceGiveItem,
} from "../testUtils";
import { equipItem, unequipItem } from "../logic";
import connectDB from "../config/db";
import mongoose from "mongoose";

// Mock API functions for testing
async function equipItemAPI(playerId: string, itemId: string) {
  const player = await getPlayerState(playerId);
  return equipItem(player, itemId);
}

async function unequipItemAPI(playerId: string, slot: string) {
  const player = await getPlayerState(playerId);
  const newState = unequipItem(player, slot as any); // Cast to EquipmentSlot
  return { success: true, newPlayerState: newState };
}

// Test 1: Basic equip/unequip cycle
async function testBasicEquipUnequip() {
  const testPlayerId = "66a01123456789abcdef1234"; // Use existing player

  try {
    console.log("🔧 Test 1: Basic equip/unequip cycle");

    // Setup: Player with known power and items
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [
        { itemId: "sword_001", quantity: 1 },
        { itemId: "armor_001", quantity: 1 },
      ],
      equipment: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      power: initialState.power,
      equipment: initialState.equipment,
    });

    // Execute: Equip weapon
    const equipResult = await equipItemAPI(testPlayerId, "sword_001");
    if (!equipResult.success) {
      throw new Error(`Failed to equip item: ${equipResult.message}`);
    }

    // Verify: Power increased, item in equipment slot
    const stateAfterEquip = await getPlayerState(testPlayerId);
    if (stateAfterEquip.equipment.weapon !== "sword_001") {
      throw new Error(
        `Expected weapon slot to contain sword_001, got ${stateAfterEquip.equipment.weapon}`
      );
    }
    if (stateAfterEquip.power <= 50) {
      throw new Error(
        `Expected power to increase, got ${stateAfterEquip.power} (was 50)`
      );
    }

    console.log("✅ Equip successful:", {
      power: stateAfterEquip.power,
      equipment: stateAfterEquip.equipment,
    });

    // Execute: Unequip weapon
    const unequipResult = await unequipItemAPI(testPlayerId, "weapon");
    if (!unequipResult.success) {
      throw new Error(`Failed to unequip item: ${unequipResult.message}`);
    }

    // Verify: Power returned to original, slot cleared
    const finalState = await getPlayerState(testPlayerId);
    if (finalState.equipment.weapon !== undefined) {
      throw new Error(
        `Expected weapon slot to be empty, got ${finalState.equipment.weapon}`
      );
    }
    if (finalState.power !== 50) {
      throw new Error(
        `Expected power to return to 50, got ${finalState.power}`
      );
    }

    console.log("✅ Unequip successful:", {
      power: finalState.power,
      equipment: finalState.equipment,
    });
    return { success: true, powerIncrease: stateAfterEquip.power - 50 };
  } catch (error) {
    console.log("❌ Test 1 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 2: Equipment state persistence
async function testEquipmentStatePersistence() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 2: Equipment state persistence");

    // Setup: Player with equipment
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [
        { itemId: "sword_001", quantity: 1 },
        { itemId: "armor_001", quantity: 1 },
      ],
      equipment: {},
    });

    // Execute: Equip multiple items
    await equipItemAPI(testPlayerId, "sword_001");
    await equipItemAPI(testPlayerId, "armor_001");

    // Verify: Equipment state persisted
    const stateAfterEquip = await getPlayerState(testPlayerId);
    if (stateAfterEquip.equipment.weapon !== "sword_001") {
      throw new Error("Weapon not persisted in equipment");
    }
    if (stateAfterEquip.equipment.armor !== "armor_001") {
      throw new Error("Armor not persisted in equipment");
    }
    if (typeof stateAfterEquip.equipment !== "object") {
      throw new Error("Equipment is not an object");
    }

    console.log("✅ Equipment state persisted correctly");
    return { success: true };
  } catch (error) {
    console.log("❌ Test 2 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 3: Inventory equipment sync
async function testInventoryEquipmentSync() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 3: Inventory equipment sync");

    // Setup: Player with items
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [
        { itemId: "sword_001", quantity: 1 },
        { itemId: "armor_001", quantity: 1 },
      ],
      equipment: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    const initialInventoryCount = initialState.inventory.length;

    // Execute: Equip item
    await equipItemAPI(testPlayerId, "sword_001");

    // Verify: Item removed from inventory
    const stateAfterEquip = await getPlayerState(testPlayerId);
    if (stateAfterEquip.inventory.length !== initialInventoryCount - 1) {
      throw new Error(
        `Expected inventory to decrease by 1, got ${stateAfterEquip.inventory.length} vs ${initialInventoryCount}`
      );
    }

    // Execute: Unequip item
    await unequipItemAPI(testPlayerId, "weapon");

    // Verify: Item returned to inventory
    const finalState = await getPlayerState(testPlayerId);
    if (finalState.inventory.length !== initialInventoryCount) {
      throw new Error(
        `Expected inventory to return to original size, got ${finalState.inventory.length} vs ${initialInventoryCount}`
      );
    }

    console.log("✅ Inventory equipment sync working correctly");
    return { success: true };
  } catch (error) {
    console.log("❌ Test 3 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 4: Power calculation accuracy
async function testPowerCalculationAccuracy() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 4: Power calculation accuracy");

    // Setup: Player with known base power
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [
        { itemId: "sword_001", quantity: 1 },
        { itemId: "sword_002", quantity: 1 },
      ],
      equipment: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial power:", initialState.power);

    // Execute: Equip first weapon
    await equipItemAPI(testPlayerId, "sword_001", "weapon");
    const stateAfterFirstEquip = await getPlayerState(testPlayerId);
    const powerIncrease1 = stateAfterFirstEquip.power - initialState.power;

    console.log("✅ First weapon power increase:", powerIncrease1);

    // Execute: Equip second weapon (should replace first)
    await equipItemAPI(testPlayerId, "sword_002", "weapon");
    const stateAfterSecondEquip = await getPlayerState(testPlayerId);
    const powerIncrease2 = stateAfterSecondEquip.power - initialState.power;

    console.log("✅ Second weapon power increase:", powerIncrease2);

    // Verify: Power calculation is correct (not additive)
    if (powerIncrease2 <= powerIncrease1) {
      throw new Error(
        `Expected second weapon to provide different power, got ${powerIncrease2} vs ${powerIncrease1}`
      );
    }

    console.log("✅ Power calculation accurate");
    return { success: true, powerIncrease1, powerIncrease2 };
  } catch (error) {
    console.log("❌ Test 4 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 5: Equipment swapping
async function testEquipmentSwapping() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 5: Equipment swapping");

    // Setup: Player with weapon equipped
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [{ itemId: "sword_002", quantity: 1 }],
      equipment: { weapon: "sword_001" },
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      power: initialState.power,
      equipment: initialState.equipment,
    });

    // Execute: Swap weapon
    await equipItemAPI(testPlayerId, "sword_002", "weapon");

    // Verify: Equipment updated, power recalculated
    const finalState = await getPlayerState(testPlayerId);
    if (finalState.equipment.weapon !== "sword_002") {
      throw new Error(
        `Expected weapon to be sword_002, got ${finalState.equipment.weapon}`
      );
    }

    console.log("✅ Equipment swapping successful:", {
      power: finalState.power,
      equipment: finalState.equipment,
    });
    return { success: true };
  } catch (error) {
    console.log("❌ Test 5 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 6: Multiple equipment slots
async function testMultipleEquipmentSlots() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 6: Multiple equipment slots");

    // Setup: Player with weapon and armor
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [],
      equipment: { weapon: "sword_001", armor: "armor_001" },
    });

    const initialState = await getPlayerState(testPlayerId);
    console.log("✅ Initial state:", {
      power: initialState.power,
      equipment: initialState.equipment,
    });

    // Execute: Unequip only weapon
    await unequipItemAPI(testPlayerId, "weapon");

    // Verify: Only weapon unequipped, armor remains
    const finalState = await getPlayerState(testPlayerId);
    if (finalState.equipment.weapon !== undefined) {
      throw new Error("Weapon should be unequipped");
    }
    if (finalState.equipment.armor !== "armor_001") {
      throw new Error("Armor should remain equipped");
    }

    console.log("✅ Multiple slots working correctly:", {
      equipment: finalState.equipment,
    });
    return { success: true };
  } catch (error) {
    console.log("❌ Test 6 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 7: Invalid equipment operations
async function testInvalidEquipmentOperations() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 7: Invalid equipment operations");

    // Setup: Player with no items
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [],
      equipment: {},
    });

    // Execute: Try to equip non-existent item
    const equipResult = await equipItemAPI(
      testPlayerId,
      "non_existent_item",
      "weapon"
    );

    // Verify: Operation should fail gracefully
    if (equipResult.success) {
      throw new Error("Expected equip of non-existent item to fail");
    }

    console.log("✅ Invalid operations handled correctly");
    return { success: true };
  } catch (error) {
    console.log("❌ Test 7 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 8: Equipment data integrity
async function testEquipmentDataIntegrity() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 8: Equipment data integrity");

    // Setup: Player with complex equipment state
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      power: 50,
      inventory: [
        { itemId: "sword_001", quantity: 1 },
        { itemId: "armor_001", quantity: 1 },
      ],
      equipment: { weapon: "sword_001" },
    });

    // Execute: Multiple operations to stress test
    await equipItemAPI(testPlayerId, "armor_001", "armor");
    await unequipItemAPI(testPlayerId, "weapon");
    await equipItemAPI(testPlayerId, "sword_001", "weapon");

    // Verify: All properties maintain correct types
    const finalState = await getPlayerState(testPlayerId);

    // Check equipment is object
    if (typeof finalState.equipment !== "object") {
      throw new Error("Equipment is not an object");
    }

    // Check inventory is array
    if (!Array.isArray(finalState.inventory)) {
      throw new Error("Inventory is not an array");
    }

    // Check power is number
    if (typeof finalState.power !== "number") {
      throw new Error("Power is not a number");
    }

    console.log("✅ Data integrity maintained");
    return { success: true };
  } catch (error) {
    console.log("❌ Test 8 failed:", error);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runEquipmentTests() {
  console.log("=".repeat(60));
  console.log("🔧 RUNNING EQUIPMENT SYSTEM TESTS");
  console.log("=".repeat(60));

  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    const tests = [
      testBasicEquipUnequip,
      testEquipmentStatePersistence,
      testInventoryEquipmentSync,
      testPowerCalculationAccuracy,
      testEquipmentSwapping,
      testMultipleEquipmentSlots,
      testInvalidEquipmentOperations,
      testEquipmentDataIntegrity,
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
    console.log("📊 TEST RESULTS SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Total: ${tests.length}`);

    if (failedTests === 0) {
      console.log("🎉 ALL EQUIPMENT TESTS PASSED!");
    } else {
      console.log("⚠️  Some tests failed. Check logs above.");
    }
    console.log("=".repeat(60));

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
export { runEquipmentTests };

// Run the tests if this file is executed directly
if (require.main === module) {
  runEquipmentTests()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test runner crashed:", error);
      process.exit(1);
    });
}
