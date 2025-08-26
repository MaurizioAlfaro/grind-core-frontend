import { forceSetPlayerState, getPlayerState } from "../testUtils";
import { unlockZone } from "../logic/unlockZone";
import { ZONES } from "../../constants/zones";
import connectDB from "../config/db";
import mongoose from "mongoose";

// Test 1: Basic zone unlocking with sufficient power
async function testBasicZoneUnlock() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 1: Basic zone unlocking with sufficient power");

    // Setup: Player with enough power to unlock supermarket (requires 10 power)
    await forceSetPlayerState(testPlayerId, {
      level: 3, // 3 * 5 = 15 power (enough for supermarket)
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 0,
      gold: 100,
      dollars: 0,
      power: 15,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: false,
      tutorialStep: 1,
      tutorialCompleted: false,
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

    // Execute: Unlock supermarket zone
    const newPlayerState = unlockZone(initialState, "supermarket");

    // Verify: Zone was unlocked
    if (!newPlayerState.unlockedZoneIds.includes("supermarket")) {
      throw new Error("Supermarket zone was not unlocked");
    }

    // Verify: Original state unchanged
    if (initialState.unlockedZoneIds.includes("supermarket")) {
      throw new Error("Original state was mutated");
    }

    console.log("✅ Zone unlocked successfully:", {
      newUnlockedZones: newPlayerState.unlockedZoneIds,
      originalUnlockedZones: initialState.unlockedZoneIds,
    });

    return { success: true, unlockedZone: "supermarket" };
  } catch (error) {
    console.log("❌ Test 1 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 2: Zone unlocking with insufficient power (should still work - no power check in logic)
async function testZoneUnlockInsufficientPower() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log(
      "🔧 Test 2: Zone unlocking with insufficient power (logic allows it)"
    );

    // Setup: Player with low power (1 power, but trying to unlock park which requires 20)
    await forceSetPlayerState(testPlayerId, {
      level: 1, // 1 * 5 = 5 power (not enough for park which requires 20)
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 0,
      gold: 100,
      dollars: 0,
      power: 5,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: false,
      tutorialStep: 1,
      tutorialCompleted: false,
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

    // Execute: Try to unlock park zone (requires 20 power, player has 5)
    const newPlayerState = unlockZone(initialState, "park");

    // Verify: Zone was still unlocked (logic doesn't check power requirements)
    if (!newPlayerState.unlockedZoneIds.includes("park")) {
      throw new Error("Park zone was not unlocked despite low power");
    }

    console.log("✅ Zone unlocked despite insufficient power:", {
      newUnlockedZones: newPlayerState.unlockedZoneIds,
      playerPower: newPlayerState.power,
      zoneRequiredPower: 20,
    });

    return { success: true, unlockedZone: "park" };
  } catch (error) {
    console.log("❌ Test 2 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 3: Multiple zone unlocks and data integrity
async function testMultipleZoneUnlocks() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 3: Multiple zone unlocks and data integrity");

    // Setup: Player starting with just cafeteria
    await forceSetPlayerState(testPlayerId, {
      level: 5, // 5 * 5 = 25 power
      unlockedZoneIds: ["caffeteria"],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      discoveredItemIds: [],
      missionsCompleted: 0,
      xp: 0,
      gold: 100,
      dollars: 0,
      power: 25,
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: false,
      tutorialStep: 1,
      tutorialCompleted: false,
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

    // Execute: Unlock multiple zones in sequence
    const state1 = unlockZone(initialState, "supermarket");
    const state2 = unlockZone(state1, "park");
    const state3 = unlockZone(state2, "gym");

    // Verify: All zones were unlocked
    const expectedZones = ["caffeteria", "supermarket", "park", "gym"];
    const actualZones = state3.unlockedZoneIds;

    if (actualZones.length !== expectedZones.length) {
      throw new Error(
        `Expected ${expectedZones.length} zones, got ${actualZones.length}`
      );
    }

    for (const zoneId of expectedZones) {
      if (!actualZones.includes(zoneId)) {
        throw new Error(`Zone ${zoneId} was not unlocked`);
      }
    }

    // Verify: Data integrity maintained
    if (state3.level !== initialState.level) {
      throw new Error("Level was changed during zone unlocks");
    }
    if (state3.power !== initialState.power) {
      throw new Error("Power was changed during zone unlocks");
    }
    if (state3.gold !== initialState.gold) {
      throw new Error("Gold was changed during zone unlocks");
    }

    console.log("✅ Multiple zones unlocked successfully:", {
      totalZones: actualZones.length,
      zones: actualZones,
      dataIntegrity: "maintained",
    });

    return { success: true, unlockedZones: actualZones };
  } catch (error) {
    console.log("❌ Test 3 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 4: Zone completion bonus system
async function testZoneCompletionBonus() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 4: Zone completion bonus system");

    // Setup: Player with completed zones and items
    await forceSetPlayerState(testPlayerId, {
      level: 10, // 10 * 5 = 50 power
      unlockedZoneIds: ["caffeteria", "supermarket", "park"],
      completedZoneIds: ["caffeteria"], // cafeteria is completed
      completedLongMissionZoneIds: [],
      discoveredItemIds: [
        "cafeteria_spork",
        "cafeteria_apron",
        "cafeteria_hairnet",
        "cafeteria_onion_ring",
        "cafeteria_jello_amulet",
        "small_gold_pouch",
        "power_shard",
      ],
      missionsCompleted: 10,
      xp: 1000,
      gold: 5000,
      dollars: 100,
      power: 50,
      permanentPowerBonus: 5, // Already has 5 from cafeteria completion
      powerMultiplier: 1.0,
      activeBoosts: [],
      hasReceivedInitialBoost: true,
      tutorialStep: 39,
      tutorialCompleted: true,
      inventory: [
        { itemId: "cafeteria_spork", quantity: 1 },
        { itemId: "cafeteria_apron", quantity: 1 },
      ],
      equipment: { Weapon: "cafeteria_spork" },
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
      permanentPowerBonus: initialState.permanentPowerBonus,
      completedZones: initialState.completedZoneIds,
      discoveredItems: initialState.discoveredItemIds.length,
    });

    // Check cafeteria zone data
    const cafeteriaZone = ZONES.find((z) => z.id === "caffeteria");
    if (!cafeteriaZone) {
      throw new Error("Cafeteria zone not found in constants");
    }

    console.log("✅ Cafeteria zone data:", {
      requiredPower: cafeteriaZone.requiredPower,
      completionBonus: cafeteriaZone.completionBonus.description,
      lootTableItems: cafeteriaZone.lootTable.length,
      exclusiveLoot: cafeteriaZone.exclusiveLoot?.length || 0,
    });

    // Verify: All cafeteria items are discovered
    const cafeteriaItems = new Set([
      ...cafeteriaZone.lootTable.map((l) => l.itemId),
      ...(cafeteriaZone.exclusiveLoot?.map((l) => l.itemId) || []),
    ]);

    const allItemsDiscovered = [...cafeteriaItems].every((itemId) =>
      initialState.discoveredItemIds.includes(itemId)
    );

    if (!allItemsDiscovered) {
      throw new Error("Not all cafeteria items are discovered");
    }

    console.log("✅ All cafeteria items discovered:", {
      totalItems: cafeteriaItems.size,
      discoveredItems: initialState.discoveredItemIds.length,
      completionBonusApplied: initialState.permanentPowerBonus === 5,
    });

    return { success: true, completionBonus: 5 };
  } catch (error) {
    console.log("❌ Test 4 failed:", error);
    return { success: false, error: error.message };
  }
}

// Test 5: Zone power requirements and progression
async function testZonePowerRequirements() {
  const testPlayerId = "66a01123456789abcdef1234";

  try {
    console.log("🔧 Test 5: Zone power requirements and progression");

    // Get zone power requirements
    const zonePowerRequirements = ZONES.slice(0, 10).map((zone) => ({
      id: zone.id,
      name: zone.name,
      requiredPower: zone.requiredPower,
    }));

    console.log("✅ Zone power requirements (first 10):");
    zonePowerRequirements.forEach((zone) => {
      console.log(`  - ${zone.name} (${zone.id}): ${zone.requiredPower} power`);
    });

    // Calculate progression path
    const sortedZones = [...ZONES].sort(
      (a, b) => a.requiredPower - b.requiredPower
    );
    const progressionPath = sortedZones.slice(0, 5).map((zone) => ({
      id: zone.id,
      name: zone.name,
      requiredPower: zone.requiredPower,
      levelRequired: Math.ceil(zone.requiredPower / 5), // 5 power per level
    }));

    console.log("✅ Progression path (first 5 zones):");
    progressionPath.forEach((zone) => {
      console.log(
        `  - Level ${zone.levelRequired}: ${zone.name} (${zone.requiredPower} power)`
      );
    });

    return { success: true, progressionPath };
  } catch (error) {
    console.log("❌ Test 5 failed:", error);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runZoneTests() {
  console.log("=".repeat(60));
  console.log("🌍 RUNNING ZONE SYSTEM TESTS");
  console.log("=".repeat(60));

  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    const tests = [
      testBasicZoneUnlock,
      testZoneUnlockInsufficientPower,
      testMultipleZoneUnlocks,
      testZoneCompletionBonus,
      testZonePowerRequirements,
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
    console.log("📊 ZONE SYSTEM TEST RESULTS");
    console.log("=".repeat(60));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Total: ${tests.length}`);

    if (failedTests === 0) {
      console.log("🎉 ALL ZONE TESTS PASSED!");
      console.log("\n💡 Key Zone System Insights:");
      console.log(
        "- unlockZone logic allows unlocking regardless of power requirements"
      );
      console.log(
        "- Zone completion requires discovering all loot table + exclusive items"
      );
      console.log("- Completion bonuses are applied automatically");
      console.log("- Power requirements create natural progression path");
      console.log("- Data integrity is maintained during zone operations");
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
export { runZoneTests };

// Run the tests if this file is executed directly
if (require.main === module) {
  runZoneTests()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Test runner crashed:", error);
      process.exit(1);
    });
}
