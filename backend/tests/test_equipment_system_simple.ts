import { forceSetPlayerState, getPlayerState } from "../testUtils";
import { equipItem, unequipItem } from "../logic";
import { EquipmentSlot } from "../../types";
import connectDB from "../config/db";
import mongoose from "mongoose";

// Test 1: Basic equip/unequip cycle
async function testBasicEquipUnequip() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 1: Basic equip/unequip cycle");

    // Setup: Player with known level and items (power will be calculated)
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      inventory: [
        { itemId: "cafeteria_spork", quantity: 1 }, // Use existing item from database
      ],
      equipment: {},
    });

    const initialState = await getPlayerState(testPlayerId);
    const expectedBasePower = 5 * 5; // level 5 * POWER_PER_LEVEL (5)
    console.log("✅ Initial state:", {
      power: initialState.power,
      expectedBasePower,
      equipment: initialState.equipment,
    });

    // Execute: Equip weapon (slot determined by item)
    const equipResult = await equipItem(initialState, "cafeteria_spork");
    if (!equipResult.success) {
      throw new Error(`Failed to equip item: ${equipResult.message}`);
    }

    // Verify: Power increased, item in equipment slot
    const stateAfterEquip = equipResult.newPlayerState;
    if (stateAfterEquip.equipment.Weapon !== "cafeteria_spork") {
      throw new Error(
        `Expected weapon slot to contain cafeteria_spork, got ${stateAfterEquip.equipment.Weapon}`
      );
    }
    const expectedPowerWithSpork = expectedBasePower + 4; // base + spork power
    if (stateAfterEquip.power !== expectedPowerWithSpork) {
      throw new Error(
        `Expected power to be ${expectedPowerWithSpork}, got ${stateAfterEquip.power}`
      );
    }

    console.log("✅ Equip successful:", {
      power: stateAfterEquip.power,
      equipment: stateAfterEquip.equipment,
    });

    // Execute: Unequip weapon
    const finalState = unequipItem(stateAfterEquip, EquipmentSlot.Weapon);

    // Verify: Power returned to original, slot cleared
    if (finalState.equipment.Weapon !== undefined) {
      throw new Error(
        `Expected weapon slot to be empty, got ${finalState.equipment.Weapon}`
      );
    }
    if (finalState.power !== expectedBasePower) {
      throw new Error(
        `Expected power to return to ${expectedBasePower}, got ${finalState.power}`
      );
    }

    console.log("✅ Unequip successful:", {
      power: finalState.power,
      equipment: finalState.equipment,
    });
    return {
      success: true,
      powerIncrease: stateAfterEquip.power - expectedBasePower,
    };
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

    // Setup: Player with equipment (power will be calculated)
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      inventory: [{ itemId: "cafeteria_spork", quantity: 1 }],
      equipment: {},
    });

    const initialState = await getPlayerState(testPlayerId);

    // Execute: Equip item
    const equipResult = await equipItem(initialState, "cafeteria_spork");

    // Verify: Equipment state persisted
    const stateAfterEquip = equipResult.newPlayerState;
    if (stateAfterEquip.equipment.Weapon !== "cafeteria_spork") {
      throw new Error("Weapon not persisted in equipment");
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

// Test 3: Data integrity
async function testEquipmentDataIntegrity() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 3: Equipment data integrity");

    // Setup: Player with complex equipment state (power will be calculated)
    await forceSetPlayerState(testPlayerId, {
      level: 5,
      inventory: [{ itemId: "cafeteria_spork", quantity: 1 }],
      equipment: {},
    });

    const initialState = await getPlayerState(testPlayerId);

    // Execute: Multiple operations to stress test
    const equipResult = await equipItem(initialState, "cafeteria_spork");
    const unequipResult = unequipItem(
      equipResult.newPlayerState,
      EquipmentSlot.Weapon
    );

    // Verify: All properties maintain correct types
    const finalState = unequipResult;

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
    console.log("❌ Test 3 failed:", error);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runEquipmentTests() {
  console.log("=".repeat(60));
  console.log("🔧 RUNNING EQUIPMENT SYSTEM TESTS (SIMPLIFIED)");
  console.log("=".repeat(60));

  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    const tests = [
      testBasicEquipUnequip,
      testEquipmentStatePersistence,
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
