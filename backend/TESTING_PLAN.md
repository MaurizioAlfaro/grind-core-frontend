# Backend Testing Plan

## Overview

This document outlines a comprehensive testing strategy for the entire backend game system. Each section will have dedicated test scripts that verify functionality, data integrity, and state persistence.

## Test Categories

### 1. Mission System Testing

**Purpose**: Verify the complete mission lifecycle and reward distribution

**Test Scripts Needed**:

- `test_mission_lifecycle.ts` - Start, wait, claim mission flow
- `test_mission_durations.ts` - Test short/medium/long missions
- `test_mission_zones.ts` - Test different zone types
- `test_mission_dev_mode.ts` - Test dev mode vs normal mode
- `test_mission_cancellation.ts` - Test mission cancellation
- `test_mission_persistence.ts` - Verify database state persistence

**What to Test**:

- Mission start with different durations and zones
- Mission state saving to database
- Mission completion and reward distribution
- Mission cancellation and state reset
- Verify rewards: gold, XP, items, badges
- Mission progress tracking

### 2. Player State & Progression Testing

**Purpose**: Verify core player statistics and progression mechanics

**Test Scripts Needed**:

- `test_player_progression.ts` - Level, XP, power calculations
- `test_currency_system.ts` - Gold and dollar accumulation
- `test_power_calculations.ts` - Power bonuses and multipliers
- `test_inventory_management.ts` - Item discovery and collection

**What to Test**:

- Level progression and XP calculation accuracy
- Gold/dollar accumulation and spending
- Power calculation with equipment and bonuses
- Inventory item discovery and management
- Zone completion tracking
- Permanent power bonuses and multipliers

### 3. Equipment System Testing

**Purpose**: Verify equipment management and effects

**Test Scripts Needed**:

- `test_equipment_management.ts` - Equip/unequip operations
- `test_equipment_upgrades.ts` - Item upgrade mechanics
- `test_equipment_enchantments.ts` - Enchantment system
- `test_equipment_persistence.ts` - State persistence

**What to Test**:

- Equip items to different slots
- Unequip items
- Equipment upgrades and costs
- Equipment enchantments
- Power calculations after equipment changes
- Equipment state persistence in database
- Equipment combinations and effects

### 4. Store System Testing

**Purpose**: Verify purchase mechanics and inventory updates

**Test Scripts Needed**:

- `test_store_purchases.ts` - Item purchases
- `test_lab_equipment_purchases.ts` - Lab equipment buying
- `test_store_upgrades.ts` - Store upgrade purchases
- `test_cache_system.ts` - Cache opening mechanics

**What to Test**:

- Buy store items and verify currency deduction
- Buy lab equipment
- Buy store upgrades
- Open different cache types
- Verify cache contents and mechanics
- Inventory updates after purchases

### 5. Lab & Homunculus System Testing

**Purpose**: Verify lab operations and homunculus management

**Test Scripts Needed**:

- `test_lab_operations.ts` - Lab XP and equipment
- `test_homunculus_creation.ts` - Homunculus creation
- `test_homunculus_management.ts` - Feeding and equipment
- `test_lab_persistence.ts` - Lab state persistence

**What to Test**:

- Invest lab XP and level progression
- Purchase lab equipment
- Create homunculus
- Feed homunculus
- Equip/unequip homunculus items
- Lab and homunculus state persistence

### 6. Forge System Testing

**Purpose**: Verify item upgrade and enchantment mechanics

**Test Scripts Needed**:

- `test_forge_upgrades.ts` - Item upgrade system
- `test_forge_enchantments.ts` - Enchantment application
- `test_forge_rates.ts` - Success/failure rates
- `test_forge_costs.ts` - Upgrade and enchantment costs

**What to Test**:

- Item upgrade success/failure rates
- Upgrade costs and resource consumption
- Enchantment application
- Enchantment effects and costs
- Forge state persistence

### 7. Boss System Testing

**Purpose**: Verify boss combat and reward mechanics

**Test Scripts Needed**:

- `test_boss_combat.ts` - Boss fighting mechanics
- `test_boss_rewards.ts` - Reward distribution
- `test_boss_cooldowns.ts` - Cooldown mechanics
- `test_boss_tracking.ts` - Boss defeat tracking

**What to Test**:

- Boss combat mechanics
- Boss defeat rewards
- Boss cooldown periods
- Boss defeat count tracking
- Global boss cooldowns

### 8. Badge System Testing

**Purpose**: Verify badge unlock conditions and rewards

**Test Scripts Needed**:

- `test_badge_unlocks.ts` - Badge unlock mechanics
- `test_badge_conditions.ts` - Unlock condition verification
- `test_badge_rewards.ts` - Badge reward distribution

**What to Test**:

- Badge unlock conditions
- Badge unlock rewards
- Badge state persistence
- Badge progression tracking

### 9. Zone & Progression Testing

**Purpose**: Verify zone unlocking and completion mechanics

**Test Scripts Needed**:

- `test_zone_unlocking.ts` - Zone unlock mechanics
- `test_zone_completion.ts` - Zone completion tracking
- `test_zone_rewards.ts` - Zone-specific rewards

**What to Test**:

- Zone unlocking conditions
- Zone completion tracking
- Zone-specific rewards
- Zone progression state

### 10. Wallet & NFT Integration Testing

**Purpose**: Verify wallet connection and NFT ownership

**Test Scripts Needed**:

- `test_wallet_connection.ts` - Wallet connection state
- `test_nft_verification.ts` - NFT ownership verification
- `test_wallet_prompts.ts` - Wallet prompt states

**What to Test**:

- Wallet connection state
- NFT ownership verification
- Wallet prompt states
- Connection state persistence

### 11. Tutorial System Testing

**Purpose**: Verify tutorial progression and completion

**Test Scripts Needed**:

- `test_tutorial_progression.ts` - Tutorial step progression
- `test_tutorial_completion.ts` - Tutorial completion state

**What to Test**:

- Tutorial step progression
- Tutorial completion state
- Tutorial state persistence

### 12. Hibernation System Testing

**Purpose**: Verify hibernation mechanics and rewards

**Test Scripts Needed**:

- `test_hibernation_mechanics.ts` - Hibernation start/claim
- `test_hibernation_rewards.ts` - Reward distribution

**What to Test**:

- Start hibernation
- Claim hibernation rewards
- Hibernation state persistence

### 13. Work Assignment Testing

**Purpose**: Verify work system mechanics

**Test Scripts Needed**:

- `test_work_assignment.ts` - Work assignment and pay collection

**What to Test**:

- Assign to work
- Collect pay
- Work state persistence

### 14. Data Integrity Testing

**Purpose**: Verify data consistency and prevent corruption

**Test Scripts Needed**:

- `test_data_integrity.ts` - State consistency verification
- `test_persistence.ts` - Database persistence verification
- `test_array_properties.ts` - Array property integrity

**What to Test**:

- All player properties properly updated
- Database persistence accuracy
- No data corruption during updates
- Array properties remain arrays (e.g., activeBoosts)
- State consistency across operations

### 15. Error Handling Testing

**Purpose**: Verify proper error handling and edge cases

**Test Scripts Needed**:

- `test_error_handling.ts` - Invalid request handling
- `test_edge_cases.ts` - Edge case scenarios
- `test_database_errors.ts` - Database connection issues

**What to Test**:

- Invalid request handling
- Missing data scenarios
- Database connection issues
- Invalid item IDs
- Insufficient resources
- Malformed requests

### 16. Performance Testing

**Purpose**: Verify system performance under load

**Test Scripts Needed**:

- `test_concurrent_requests.ts` - Multiple concurrent operations
- `test_large_operations.ts` - Large inventory operations
- `test_database_performance.ts` - Query performance

**What to Test**:

- Multiple concurrent requests
- Large inventory operations
- Database query performance
- Response time under load
- Memory usage patterns

## Test Script Structure

Each test script should follow this pattern:

```typescript
// 1. Setup test data using testUtils
// 2. Execute the action (API call or logic function)
// 3. Verify the results using testUtils.getPlayerState()
// 4. Clean up test data using testUtils.cleanupTestPlayer()
// 5. Generate test report with pass/fail status
```

## Test Utilities Integration

All tests will use the comprehensive `testUtils.ts` file which provides direct state manipulation functions:

- **Setup**: Use `ensureTestPlayer()`, `forceSetPlayerState()`, `forceGiveItem()`, etc.
- **Verification**: Use `getPlayerState()` to check final state
- **Cleanup**: Use `cleanupTestPlayer()` to remove test data
- **Isolation**: Each test starts with a clean, known player state

## Detailed Implementation Examples

### Mission System Testing Implementation

```typescript
// test_mission_lifecycle.ts
export async function testMissionLifecycle() {
  const testPlayerId = "test_mission_001";

  try {
    // 1. Setup: Create test player with known state
    await ensureTestPlayer(testPlayerId, {
      level: 1,
      gold: 100,
      xp: 0,
      unlockedZoneIds: ["01_cafeteria", "02_supermarket"],
    });

    // 2. Execute: Start mission via API
    const startResult = await startMissionAPI(
      testPlayerId,
      "01_cafeteria",
      "short"
    );

    // 3. Verify: Check mission state and player changes
    const playerState = await getPlayerState(testPlayerId);
    assert(playerState.activeMission !== null);
    assert(playerState.activeMission.zoneId === "01_cafeteria");

    // 4. Execute: Wait and claim mission
    const claimResult = await claimMissionAPI(testPlayerId);

    // 5. Verify: Check rewards and final state
    const finalState = await getPlayerState(testPlayerId);
    assert(finalState.gold > 100); // Gold increased
    assert(finalState.xp > 0); // XP gained
    assert(finalState.activeMission === null); // Mission cleared

    console.log("✅ Mission lifecycle test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Mission lifecycle test failed:", error);
    return { success: false, error };
  } finally {
    // 6. Cleanup
    await cleanupTestPlayer(testPlayerId);
  }
}
```

### Equipment System Testing Implementation

```typescript
// test_equipment_management.ts
export async function testEquipmentManagement() {
  const testPlayerId = "test_equipment_001";

  try {
    // 1. Setup: Create test player with items
    await ensureTestPlayer(testPlayerId, {
      level: 5,
      power: 50,
      inventory: ["sword_001", "shield_001", "helmet_001"],
    });

    // 2. Execute: Equip item via API
    const equipResult = await equipItemAPI(testPlayerId, "sword_001", "weapon");

    // 3. Verify: Check equipment state and power changes
    const playerState = await getPlayerState(testPlayerId);
    assert(playerState.equipment.weapon === "sword_001");
    assert(playerState.power > 50); // Power increased

    // 4. Execute: Unequip item
    const unequipResult = await unequipItemAPI(testPlayerId, "weapon");

    // 5. Verify: Check unequip state
    const finalState = await getPlayerState(testPlayerId);
    assert(finalState.equipment.weapon === undefined);
    assert(finalState.power === 50); // Power back to original

    console.log("✅ Equipment management test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Equipment management test failed:", error);
    return { success: false, error };
  } finally {
    await cleanupTestPlayer(testPlayerId);
  }
}
```

### Store System Testing Implementation

```typescript
// test_store_purchases.ts
export async function testStorePurchases() {
  const testPlayerId = "test_store_001";

  try {
    // 1. Setup: Create test player with currency
    await ensureTestPlayer(testPlayerId, {
      gold: 1000,
      dollars: 100,
      inventory: [],
    });

    // 2. Execute: Purchase item via API
    const purchaseResult = await purchaseStoreItemAPI(
      testPlayerId,
      "cache_common",
      "gold"
    );

    // 3. Verify: Check currency deduction and inventory
    const playerState = await getPlayerState(testPlayerId);
    assert(playerState.gold < 1000); // Gold decreased
    assert(playerState.inventory.includes("cache_common")); // Item added

    // 4. Execute: Open cache
    const openResult = await openCacheAPI(testPlayerId, "cache_common");

    // 5. Verify: Check cache contents
    const finalState = await getPlayerState(testPlayerId);
    assert(finalState.inventory.length > 1); // More items from cache

    console.log("✅ Store purchase test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Store purchase test failed:", error);
    return { success: false, error };
  } finally {
    await cleanupTestPlayer(testPlayerId);
  }
}
```

### Lab & Homunculus Testing Implementation

```typescript
// test_homunculus_creation.ts
export async function testHomunculusCreation() {
  const testPlayerId = "test_homunculus_001";

  try {
    // 1. Setup: Create test player with lab access
    await ensureTestPlayer(testPlayerId, {
      labLevel: 3,
      labXp: 500,
      purchasedLabEquipmentIds: ["lab_equipment_001"],
      homunculusCreatedCount: 0,
    });

    // 2. Execute: Create homunculus via API
    const createResult = await createHomunculusAPI(testPlayerId);

    // 3. Verify: Check homunculus creation
    const playerState = await getPlayerState(testPlayerId);
    assert(playerState.homunculusCreatedCount === 1);
    assert(playerState.homunculi.length === 1);

    // 4. Execute: Feed homunculus
    const feedResult = await feedHomunculusAPI(testPlayerId, 0, "food_001");

    // 5. Verify: Check feeding effects
    const finalState = await getPlayerState(testPlayerId);
    assert(finalState.homunculi[0].stats.level > 1); // Level increased

    console.log("✅ Homunculus creation test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Homunculus creation test failed:", error);
    return { success: false, error };
  } finally {
    await cleanupTestPlayer(testPlayerId);
  }
}
```

### Forge System Testing Implementation

```typescript
// test_forge_upgrades.ts
export async function testForgeUpgrades() {
  const testPlayerId = "test_forge_001";

  try {
    // 1. Setup: Create test player with upgradeable item
    await ensureTestPlayer(testPlayerId, {
      inventory: ["sword_001"],
      equipment: { weapon: "sword_001" },
      equipmentUpgrades: {},
      gold: 1000,
    });

    // 2. Execute: Upgrade item via API
    const upgradeResult = await upgradeItemAPI(testPlayerId, "sword_001");

    // 3. Verify: Check upgrade state and costs
    const playerState = await getPlayerState(testPlayerId);
    assert(playerState.equipmentUpgrades.sword_001 === 1);
    assert(playerState.gold < 1000); // Gold spent

    // 4. Execute: Apply enchantment
    const enchantResult = await enchantItemAPI(
      testPlayerId,
      "sword_001",
      "fire_damage"
    );

    // 5. Verify: Check enchantment
    const finalState = await getPlayerState(testPlayerId);
    assert(finalState.equipmentEnchantments.sword_001.includes("fire_damage"));

    console.log("✅ Forge upgrade test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Forge upgrade test failed:", error);
    return { success: false, error };
  } finally {
    await cleanupTestPlayer(testPlayerId);
  }
}
```

### Boss System Testing Implementation

```typescript
// test_boss_combat.ts
export async function testBossCombat() {
  const testPlayerId = "test_boss_001";

  try {
    // 1. Setup: Create test player with combat stats
    await ensureTestPlayer(testPlayerId, {
      level: 10,
      power: 200,
      equipment: { weapon: "sword_001", armor: "armor_001" },
      defeatedBossIds: [],
      bossDefeatCounts: {},
    });

    // 2. Execute: Fight boss via API
    const fightResult = await fightBossAPI(testPlayerId, "boss_001");

    // 3. Verify: Check boss defeat state
    const playerState = await getPlayerState(testPlayerId);
    assert(playerState.defeatedBossIds.includes("boss_001"));
    assert(playerState.bossDefeatCounts.boss_001 === 1);

    // 4. Verify: Check rewards
    assert(playerState.gold > 0); // Gold reward
    assert(playerState.xp > 0); // XP reward

    console.log("✅ Boss combat test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Boss combat test failed:", error);
    return { success: false, error };
  } finally {
    await cleanupTestPlayer(testPlayerId);
  }
}
```

### Data Integrity Testing Implementation

```typescript
// test_data_integrity.ts
export async function testDataIntegrity() {
  const testPlayerId = "test_integrity_001";

  try {
    // 1. Setup: Create test player with complex state
    await ensureTestPlayer(testPlayerId, {
      activeBoosts: ["boost_001", "boost_002"],
      inventory: ["item_001", "item_002"],
      equipment: { weapon: "sword_001" },
    });

    // 2. Execute: Multiple operations to stress test
    await forceGiveItem(testPlayerId, "item_003");
    await forceEquipItem(testPlayerId, "armor", "armor_001");
    await forceUnlockZone(testPlayerId, "03_park");

    // 3. Verify: Check all properties maintain correct types
    const playerState = await getPlayerState(testPlayerId);

    // Check array properties remain arrays
    assert(Array.isArray(playerState.activeBoosts)); // ✅ RESOLVED: Schema issue fixed
    assert(Array.isArray(playerState.inventory));
    assert(Array.isArray(playerState.unlockedZoneIds));

    // Check object properties remain objects
    assert(typeof playerState.equipment === "object");
    assert(typeof playerState.equipmentUpgrades === "object");

    // Check primitive properties remain correct types
    assert(typeof playerState.level === "number");
    assert(typeof playerState.gold === "number");
    assert(typeof playerState.isWalletConnected === "boolean");

    console.log("✅ Data integrity test passed");
    return { success: true };
  } catch (error) {
    console.log("❌ Data integrity test failed:", error);
    return { success: false, error };
  } finally {
    await cleanupTestPlayer(testPlayerId);
  }
}
```

## Test Data Management

- Use dedicated test player accounts
- Reset player state before each test
- Clean up after tests complete
- Maintain test data isolation

## ✅ **RESOLVED ISSUES**

### **ActiveBoosts Schema Validation Issue - RESOLVED**

**Problem**: The `activeBoosts` field was failing validation with `Cast to [string] failed` errors.

**Root Cause**: The field name `type` is a reserved keyword in Mongoose, causing schema compilation conflicts.

**Solution**: Renamed the field to `boostType` in both the schema and TypeScript interface.

**Status**: ✅ **FULLY RESOLVED** - All power calculation tests now pass successfully.

## Test Utilities Usage Guide

### For Each Test Category, Use These Utility Functions:

#### **Mission System Tests**

- **Setup**: `ensureTestPlayer()`, `forceUnlockZone()`, `forceSetPlayerCurrency()`
- **Verification**: `getPlayerState()` to check mission state, rewards, progress
- **Cleanup**: `cleanupTestPlayer()`

#### **Equipment System Tests**

- **Setup**: `ensureTestPlayer()`, `forceGiveItem()`, `forceSetPlayerPower()`
- **Verification**: `getPlayerState()` to check equipment slots, power changes
- **Cleanup**: `cleanupTestPlayer()`

#### **Store System Tests**

- **Setup**: `ensureTestPlayer()`, `forceSetPlayerCurrency()`, `forceSetInventory()`
- **Verification**: `getPlayerState()` to check currency, inventory updates
- **Cleanup**: `cleanupTestPlayer()`

#### **Lab & Homunculus Tests**

- **Setup**: `ensureTestPlayer()`, `forceSetLabLevel()`, `forcePurchaseLabEquipment()`
- **Verification**: `getPlayerState()` to check lab progress, homunculus stats
- **Cleanup**: `cleanupTestPlayer()`

#### **Forge System Tests**

- **Setup**: `ensureTestPlayer()`, `forceGiveItem()`, `forceSetPlayerCurrency()`
- **Verification**: `getPlayerState()` to check upgrades, enchantments, costs
- **Cleanup**: `cleanupTestPlayer()`

#### **Boss System Tests**

- **Setup**: `ensureTestPlayer()`, `forceSetPlayerPower()`, `forceEquipItem()`
- **Verification**: `getPlayerState()` to check boss defeat state, rewards
- **Cleanup**: `cleanupTestPlayer()`

#### **Badge System Tests**

- **Setup**: `ensureTestPlayer()`, `forceSetPlayerState()` for specific conditions
- **Verification**: `getPlayerState()` to check badge unlocks, rewards
- **Cleanup**: `cleanupTestPlayer()`

#### **Zone & Progression Tests**

- **Setup**: `ensureTestPlayer()`, `forceUnlockZone()`, `forceCompleteZone()`
- **Verification**: `getPlayerState()` to check zone states, progression
- **Cleanup**: `cleanupTestPlayer()`

#### **Data Integrity Tests**

- **Setup**: `ensureTestPlayer()`, `forceSetPlayerState()` with complex data
- **Verification**: `getPlayerState()` to check data types, consistency
- **Cleanup**: `cleanupTestPlayer()`

### Common Test Patterns:

1. **State Verification Pattern**:

```typescript
const beforeState = await getPlayerState(testPlayerId);
// Execute action
const afterState = await getPlayerState(testPlayerId);
// Verify changes
assert(afterState.gold > beforeState.gold);
```

2. **Array Property Testing**:

```typescript
await forceGiveItem(testPlayerId, "item_001");
const state = await getPlayerState(testPlayerId);
assert(Array.isArray(state.inventory));
assert(state.inventory.includes("item_001"));
```

3. **Object Property Testing**:

```typescript
await forceEquipItem(testPlayerId, "weapon", "sword_001");
const state = await getPlayerState(testPlayerId);
assert(typeof state.equipment === "object");
assert(state.equipment.weapon === "sword_001");
```

4. **Complex State Testing**:

```typescript
await forceSetPlayerState(testPlayerId, {
  level: 10,
  power: 200,
  inventory: ["sword_001", "armor_001"],
  equipment: { weapon: "sword_001" },
});
// Execute multiple operations
// Verify final state integrity
```

## Reporting

Each test should generate:

- Pass/fail status
- Detailed error messages
- Performance metrics
- Data verification results
- Cleanup confirmation

## Priority Order

1. **High Priority**: Mission system, equipment system, player state
2. **Medium Priority**: Store, lab, forge, boss systems
3. **Low Priority**: Tutorial, wallet, hibernation, work systems
4. **Infrastructure**: Data integrity, error handling, performance

## Next Steps

1. Create test infrastructure and utilities
2. Implement high-priority test scripts first
3. Establish automated test running
4. Create test result dashboard
5. Implement continuous testing in development workflow
