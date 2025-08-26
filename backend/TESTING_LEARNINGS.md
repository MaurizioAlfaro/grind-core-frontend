# Testing Learnings & Implementation Guide

## 🚨 **GOLDEN RULE: Think Twice, Code Once**

**Before using a method, check how it works, lol** - Always read the function signatures and understand the return types before implementing tests!

## Key Issues Encountered & Solutions

### 1. **Database Schema Mismatch**

**Problem**: Database has `user` field with unique index that's not in current PlayerModel schema
**Solution**: Use existing players instead of creating new ones, or add `user` field to TestPlayerState interface

### 2. **Zone ID Mismatch**

**Problem**: Zone constants use IDs like `"caffeteria"`, not `"01_cafeteria"`
**Solution**: Always check `constants/zones/` files for actual zone IDs

### 3. **Mission Timing in Tests**

**Problem**: Even dev mode (1 second) requires waiting for mission completion
**Solution**: Add `await new Promise(resolve => setTimeout(resolve, 1100))` after starting mission

### 4. **Import/Export Issues**

**Problem**: PlayerModel is default export, not named export
**Solution**: Use `import PlayerModel from './models/playerModel'`

### 5. **Inventory Structure**

**Problem**: Inventory is `InventoryItem[]` with `{itemId, quantity}`, not `string[]`
**Solution**: Update testUtils to handle proper inventory structure

### 6. **Equipment Function Signatures**

**Problem**: `equipItem(playerState, itemId)` only takes 2 params, not 3
**Solution**: Slot is determined by item data, don't pass slot parameter

### 7. **Unequip Return Type**

**Problem**: `unequipItem` returns `PlayerState`, not `EngineResult`
**Solution**: Handle return type correctly, no `.success` property

### 8. **Power Calculation is Automatic**

**Problem**: Manually setting `power: 50` overrides calculated power
**Solution**: Let system calculate power from level + equipment, don't set manually

### 9. **EquipmentSlot Enum Usage**

**Problem**: Using string literals like `"Weapon"` instead of `EquipmentSlot.Weapon`
**Solution**: Import and use `EquipmentSlot` enum values

## Correct Test Implementation Pattern

```typescript
// 1. Use existing player ID to avoid schema issues
const testPlayerId = "existing_player_id_from_database";

// 2. Reset player state instead of creating new player
await forceSetPlayerState(testPlayerId, {
  level: 1,
  gold: 100,
  xp: 0,
  unlockedZoneIds: ["caffeteria"], // Use actual zone IDs
});

// 3. Use dev mode for instant mission completion
const startResult = await startMissionAPI(testPlayerId, "caffeteria", "SHORT");

// 4. Wait for mission completion (even in dev mode)
await new Promise((resolve) => setTimeout(resolve, 1100));

// 5. Reset player to original state in cleanup
await forceSetPlayerState(testPlayerId, originalState);
```

## Required Test Setup

### Database Connection

```typescript
import connectDB from "../config/db";
import mongoose from "mongoose";

// In test runner
await connectDB();
// ... run tests ...
await mongoose.disconnect();
```

### Test Utilities Import

```typescript
import {
  forceSetPlayerState,
  getPlayerState,
  forceGiveItem,
  forceEquipItem,
} from "../testUtils";
```

## Zone IDs Reference

- `"caffeteria"` (not `"01_cafeteria"`)
- `"02_supermarket"`
- `"03_park"`
- Check `constants/zones/` files for exact IDs

## Mission Duration Keys

- `"SHORT"` | `"MEDIUM"` | `"LONG"`
- Dev mode sets duration to 1 second
- Always wait 1.1+ seconds after starting mission

## Inventory Structure

```typescript
inventory: [
  { itemId: "sword_001", quantity: 1 },
  { itemId: "potion_001", quantity: 3 },
];
```

## Equipment Testing Patterns

### Power Calculation Formula

```typescript
// Base power = level × POWER_PER_LEVEL (5)
const expectedBasePower = 5 * 5; // level 5 = 25 power

// Equipment power adds to base
const expectedPowerWithItem = expectedBasePower + itemPower; // 25 + 4 = 29

// Don't manually set power - let system calculate it!
await forceSetPlayerState(testPlayerId, {
  level: 5, // ✅ Correct
  // power: 50, // ❌ Wrong - overrides calculation
  inventory: [{ itemId: "cafeteria_spork", quantity: 1 }],
  equipment: {},
});
```

### Equipment Function Calls

```typescript
// ✅ Correct usage
const equipResult = await equipItem(playerState, "cafeteria_spork");
const unequipResult = unequipItem(playerState, EquipmentSlot.Weapon);

// ❌ Wrong usage
const equipResult = await equipItem(playerState, "cafeteria_spork", "weapon"); // Extra param
const unequipResult = unequipItem(playerState, "Weapon"); // String instead of enum
```

## Zone Testing Patterns

### Zone Unlocking Function Calls

```typescript
// ✅ Correct usage
const newPlayerState = unlockZone(playerState, "supermarket");

// ✅ Verify zone was unlocked
if (!newPlayerState.unlockedZoneIds.includes("supermarket")) {
  throw new Error("Zone not unlocked");
}

// ✅ Verify original state unchanged
if (playerState.unlockedZoneIds.includes("supermarket")) {
  throw new Error("Original state was mutated");
}
```

### Zone Completion Requirements

```typescript
// Get all items required for zone completion
const zone = ZONES.find((z) => z.id === "caffeteria");
const allRequiredItems = [
  ...zone.lootTable.map((l) => l.itemId),
  ...(zone.exclusiveLoot?.map((l) => l.itemId) || []),
];

// Verify all items are discovered
const allItemsDiscovered = allRequiredItems.every((itemId) =>
  playerState.discoveredItemIds.includes(itemId)
);

// Zone completion bonus is applied automatically
if (allItemsDiscovered && !playerState.completedZoneIds.includes(zone.id)) {
  // Zone should be marked as completed
  // Permanent power bonus should be applied
}
```

### Boss Testing Patterns

#### Boss Fight Function Calls

```typescript
// ✅ Correct usage (dev mode for testing)
const result = fightBoss(playerState, "caffeteria_boss", true);

// ✅ Verify fight outcome
if (result.success) {
  console.log("Outcome:", result.outcome);
  if (result.rewards) {
    console.log("Rewards:", result.rewards);
  }
  if (result.newlyUnlockedBadges) {
    console.log(
      "New badges:",
      result.newlyUnlockedBadges.map((b) => b?.id || "unknown")
    );
  }
}

// ❌ Wrong usage
const result = fightBoss(playerState, "caffeteria_boss"); // Missing isDevMode
```

#### Boss Win Chance Calculation

```typescript
// Calculate expected win chance
const winChance = calculateBossWinChance(playerPower, bossPower);
console.log(`Win chance: ${(winChance * 100).toFixed(1)}%`);

// Power ratio examples:
// 1.0x power (25 vs 25) = 50% chance
// 2.0x power (50 vs 25) = 90% chance (capped)
// 0.8x power (20 vs 25) = 0% chance (very steep curve)
```

#### Boss Cooldown Testing

```typescript
// Test cooldown blocking
const result = fightBoss(playerState, "boss_id", false);
if (!result.success) {
  console.log("Cooldown blocked fight:", result.message);
}

// Test dev mode bypass
const devResult = fightBoss(playerState, "boss_id", true);
if (devResult.success) {
  console.log("Dev mode bypassed cooldown");
}
```

## Common Pitfalls to Avoid

1. ❌ Don't create new players (use existing ones)
2. ❌ Don't use wrong zone IDs (check constants)
3. ❌ Don't forget to wait for mission completion
4. ❌ Don't use string[] for inventory (use InventoryItem[])
5. ❌ Don't forget database connection/disconnection
6. ❌ Don't use wrong import syntax for models
7. ❌ Don't manually set power (let system calculate it)
8. ❌ Don't pass extra parameters to equipItem (only 2 params)
9. ❌ Don't use string literals for EquipmentSlot (use enum)
10. ❌ Don't expect .success property on unequipItem result
11. ❌ Don't forget to include ALL items for zone completion (loot + exclusive)
12. ❌ Don't assume power requirements block zone unlocking (logic allows it)
13. ❌ Don't forget that unlockZone returns new state (doesn't mutate original)
14. ❌ Don't expect high win chances with low power (0.8x power = 0% chance)
15. ❌ Don't forget boss cooldown is global (8 hours between all boss fights)
16. ❌ Don't assume dev mode sets cooldown (it bypasses cooldown entirely)

## Test Success Criteria

### Mission Tests

- ✅ Database connects/disconnects properly
- ✅ Player state resets correctly
- ✅ Mission starts and completes
- ✅ Rewards are properly distributed
- ✅ Player returns to original state
- ✅ No data corruption (arrays remain arrays)
- ✅ Exit code 0 (success)

### Equipment Tests

- ✅ Power calculation is accurate (base + equipment)
- ✅ Equipment state persists correctly
- ✅ Inventory/equipment sync works
- ✅ Data types remain intact
- ✅ Equipment slots are managed correctly
- ✅ Power returns to base after unequip

### Zone Tests

- ✅ Zone unlocking works regardless of power requirements
- ✅ No duplicate zones are added
- ✅ Original player state is not mutated
- ✅ Zone completion requires all items (loot + exclusive)
- ✅ Completion bonuses are applied automatically
- ✅ Data integrity is maintained during operations

### Boss Tests

- ✅ Boss fights use power ratio with steep win chance curve
- ✅ Global cooldown system works (8-hour cooldown)
- ✅ Dev mode bypasses cooldown correctly
- ✅ Boss rewards scale with zone and multipliers
- ✅ First victory unlocks zone-specific badges
- ✅ Boss defeat tracking works for progression

## Equipment Testing Key Insights

### Power Calculation System

- **Base Power**: `level × POWER_PER_LEVEL` (5 × 5 = 25 for level 5)
- **Equipment Power**: Adds to base (25 + 4 = 29 with spork)
- **Automatic**: System calculates power automatically - don't override manually
- **Accurate**: Math is precise and reliable

### Equipment Management

- **Slot Determination**: Item defines its own slot (no need to specify)
- **State Persistence**: Equipment data saved correctly in database
- **Data Integrity**: Arrays remain arrays, objects remain objects
- **Clean Operations**: Equip/unequip cycle works perfectly

### Function Behavior

- **equipItem**: Takes 2 params, returns EngineResult with newPlayerState
- **unequipItem**: Takes 2 params, returns PlayerState directly
- **EquipmentSlot**: Use enum values, not string literals

## Zone Testing Key Insights

### Zone Unlocking System

- **No Power Check**: `unlockZone` logic allows unlocking regardless of power requirements
- **Immutable**: Returns new PlayerState, doesn't mutate original
- **No Duplicates**: Same zone can't be unlocked twice
- **Data Integrity**: All other player properties remain unchanged

### Zone Completion Requirements

- **All Items**: Must discover ALL loot table items + exclusive loot items
- **Cafeteria Example**: 5 loot table + 2 exclusive = 7 total items required
- **Automatic Bonus**: Completion bonuses applied automatically when conditions met
- **Permanent Power**: +5 permanent power bonus for completing zones

### Zone Progression Path

- **Cafeteria**: 1 power (Level 1)
- **Supermarket**: 10 power (Level 2)
- **Park**: 20 power (Level 4)
- **Gym**: 35 power (Level 7)
- **Post Office**: 50 power (Level 10)
- **Natural Scaling**: Power requirements increase exponentially

## Boss Testing Key Insights

### Boss Fight Mechanics

- **Win Chance Calculation**: Extremely steep power ratio curve (0.8x power = 0% chance)
- **Power Requirements**: Bosses scale from 25 power (cafeteria) to 150+ power (park)
- **Global Cooldown**: 8-hour cooldown between boss fights (dev mode bypasses)
- **Dev Mode**: Bypasses cooldown and allows instant testing

### Boss Rewards System

- **Base Rewards**: Scale with zone mission data (LONG mission duration)
- **Multipliers**: Boss-specific multipliers (20x-25x for XP/Gold)
- **Scaling**: Higher zones = higher rewards (cafeteria: 10k XP, supermarket: 15k XP)
- **Loot System**: Random chance items from boss loot tables

### Boss Progression & Badges

- **First Victory**: Unlocks zone-specific boss badge (e.g., `boss_caffeteria`)
- **Progression Badges**: Boss slayer badges for defeating multiple bosses
- **Defeat Tracking**: `defeatedBossIds` and `bossDefeatCounts` for Nemesis Protocol
- **Badge Unlocks**: Multiple badges can unlock in single fight (level, boss, misc)

## Forge Testing Key Insights

- **Slot-Based Upgrade System**: Upgrades are stored per equipment slot, not per item ID.
- **Upgrade Inheritance Problem**: Items inherit upgrade levels from slots they're equipped in.
- **Power Scaling Exploit**: Upgrading a common item then equipping a legendary gives massive power boost.
- **Attribute Mismatch**: Items can unlock forge attributes they don't have due to slot-based upgrades.
- **Permanent Perk Disconnect**: Permanent perks are tied to items, but upgrade levels are tied to slots.

## Forge Refactor Success - Key Improvements Confirmed

- **✅ ITEM-BASED UPGRADES**: Upgrades now stay with items, not slots
- **✅ UPGRADE PERSISTENCE**: Upgrades persist across equip/unequip cycles
- **✅ ATTRIBUTE ALIGNMENT**: Items only unlock attributes they actually have
- **✅ POWER CALCULATION**: No more power scaling exploits
- **✅ PERMANENT PERK LOGIC**: Perks properly tied to items
- **✅ REFACTOR SUCCESS**: Slot-based system completely replaced with item-based system

## Remaining Forge Issues to Fix

- **Power Calculation Precision**: Small rounding errors in upgrade bonus calculations
- **Test Display Issues**: Some upgrade levels not showing correctly in test output
- **Power Verification**: Need to verify exact power calculation formulas

## Boss-specific Success Criteria

- Boss fights with sufficient power succeed and grant rewards
- Boss fights with insufficient power fail and set cooldown
- Cooldown system prevents rapid boss farming
- Progression badges unlock at correct defeat counts
- Zone-specific badges unlock on first victory

## Forge-specific Success Criteria

- Upgrade attempts succeed/fail based on configured probabilities
- Power calculations correctly apply upgrade bonuses
- Forge attributes unlock at milestone levels (5, 10, 15)
- Permanent perks are granted at +15 level
- Safe upgrades prevent downgrades
- Enchantment safeguards and insurance work correctly

## Boss-specific Pitfalls

- **Cooldown Bypass**: Dev mode bypasses global cooldown, so test cooldown in non-dev mode
- **Win Chance Calculation**: Formula is extremely steep, test with exact power ratios
- **Badge Unlocking**: First victory badges only unlock once per zone

## Forge-specific Pitfalls

- **Slot vs Item Confusion**: Upgrades are stored in `equipmentUpgrades[slot]`, not per item ID
- **Power Calculation**: Upgrade bonus is `baseItemPower * level * 0.05`, scales with item power
- **Attribute Inheritance**: Items inherit upgrade levels from slots, not from their own upgrades
- **Permanent Perk Logic**: Perks unlock based on item's `forgeAttributes`, but level stored in slot
- **Upgrade Cost**: Costs scale with rarity multiplier and safe upgrade multiplier (3x)

## Boss Testing Patterns

```typescript
// Basic boss fight
const result = fightBoss(playerState, bossId, isDevMode);
if (result.success) {
  console.log("Boss defeated:", result.message);
  console.log("Rewards:", result.rewards);
  console.log("New badges:", result.newlyUnlockedBadges);
}

// Win chance calculation
const winChance = calculateBossWinChance(playerPower, bossPower);
console.log(`Win chance: ${(winChance * 100).toFixed(1)}%`);

// Cooldown testing
if (result.newPlayerState.globalBossCooldownEndTime > Date.now()) {
  console.log(
    "Cooldown set until:",
    new Date(result.newPlayerState.globalBossCooldownEndTime)
  );
}
```

## Forge Testing Patterns

```typescript
// Basic upgrade
const result = upgradeItem(playerState, EquipmentSlot.Weapon, isSafe);
if (result.success) {
  console.log("Upgrade result:", result.outcome);
  console.log(
    "New level:",
    result.newPlayerState.equipmentUpgrades[EquipmentSlot.Weapon]
  );
}

// Power calculation verification
const basePower = player.level * POWER_PER_LEVEL;
const itemPower = ITEMS[itemId].power;
const upgradeBonus = itemPower * level * FORGE_CONFIG.powerBonusPerLevel;
const expectedPower = basePower + itemPower + upgradeBonus;

// Attribute unlock check
const milestone = String(upgradeLevel) as "5" | "10" | "15";
if (item.forgeAttributes?.[milestone]) {
  console.log("Attribute unlocked:", item.forgeAttributes[milestone]);
}
```
