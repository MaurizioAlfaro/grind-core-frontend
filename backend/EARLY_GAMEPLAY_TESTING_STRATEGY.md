# 🎯 EARLY GAMEPLAY COMPREHENSIVE TESTING STRATEGY

## 🎮 **OVERVIEW**

This document outlines a comprehensive testing approach for early gameplay mechanics, focusing on the systems that matter most to new players: **zones, forge upgrades, loot tables, drop rates, store, and power progression**.

## 🧮 **CORE CALCULATION FORMULAS**

### **1. Power Calculation Formula**

```typescript
// Base Power Calculation
const basePower = (level - 1) * POWER_PER_LEVEL + 1;

// Equipment Power
const equipmentPower = Object.values(equipment).reduce((total, itemId) => {
  if (itemId && ITEMS[itemId]) {
    const item = ITEMS[itemId];
    let itemPower = item.power || 0;

    // Apply forge upgrades
    if (equipmentUpgrades[itemId]) {
      const upgradeLevel = equipmentUpgrades[itemId];
      itemPower += upgradeLevel * 2; // +2 power per upgrade level
    }

    return total + itemPower;
  }
  return total;
}, 0);

// Badge Bonuses
const badgePowerMultiplier = unlockedBadgeIds.reduce((multiplier, badgeId) => {
  const badge = BADGES[badgeId];
  if (badge?.bonus?.type === "MULTIPLY_POWER") {
    return multiplier * badge.bonus.value;
  }
  return multiplier;
}, 1.0);

const badgePermanentPower = unlockedBadgeIds.reduce((total, badgeId) => {
  const badge = BADGES[badgeId];
  if (badge?.bonus?.type === "ADD_PERMANENT_POWER") {
    return total + badge.bonus.value;
  }
  return total;
}, 0);

// Active Boost Bonuses
const activeBoostPower = activeBoosts.reduce((total, boost) => {
  if (boost.sourceId.startsWith("consumable_buff_power_")) {
    return total + boost.value;
  }
  return total;
}, 0);

// Final Power
const finalPower = Math.floor(
  (basePower + equipmentPower + badgePermanentPower + activeBoostPower) *
    badgePowerMultiplier
);
```

### **2. XP Calculation Formula**

```typescript
// Base XP from mission
const baseXp = zone.missionDurations[duration].baseXp;

// Badge XP Multipliers
const badgeXpMultiplier = unlockedBadgeIds.reduce((multiplier, badgeId) => {
  const badge = BADGES[badgeId];
  if (badge?.bonus?.type === "MULTIPLY_XP") {
    return multiplier * badge.bonus.value;
  }
  return multiplier;
}, 1.0);

// Store Upgrade XP Multipliers
const storeXpMultiplier = purchasedStoreUpgradeIds.reduce(
  (multiplier, upgradeId) => {
    const upgrade = STORE.upgrades.find((u) => u.id === upgradeId);
    if (upgrade?.effect?.type === "xp") {
      return multiplier + upgrade.effect.value;
    }
    return multiplier;
  },
  1.0
);

// Active Boost XP Multipliers
const activeBoostXpMultiplier = activeBoosts.reduce((multiplier, boost) => {
  if (boost.sourceId.startsWith("consumable_buff_xp_")) {
    return multiplier + boost.value;
  }
  return multiplier;
}, 1.0);

// Final XP
const finalXp = Math.floor(
  baseXp * badgeXpMultiplier * storeXpMultiplier * activeBoostXpMultiplier
);
```

### **3. Gold Calculation Formula**

```typescript
// Base Gold from mission
const baseGold = zone.missionDurations[duration].baseGold;

// Badge Gold Multipliers
const badgeGoldMultiplier = unlockedBadgeIds.reduce((multiplier, badgeId) => {
  const badge = BADGES[badgeId];
  if (badge?.bonus?.type === "MULTIPLY_GOLD") {
    return multiplier * badge.bonus.value;
  }
  return multiplier;
}, 1.0);

// Store Upgrade Gold Multipliers
const storeGoldMultiplier = purchasedStoreUpgradeIds.reduce(
  (multiplier, upgradeId) => {
    const upgrade = STORE.upgrades.find((u) => u.id === upgradeId);
    if (upgrade?.effect?.type === "gold") {
      return multiplier + upgrade.effect.value;
    }
    return multiplier;
  },
  1.0
);

// Active Boost Gold Multipliers
const activeBoostGoldMultiplier = activeBoosts.reduce((multiplier, boost) => {
  if (boost.sourceId.startsWith("consumable_buff_gold_")) {
    return multiplier + boost.value;
  }
  return multiplier;
}, 1.0);

// Final Gold
const finalGold = Math.floor(
  baseGold *
    badgeGoldMultiplier *
    storeGoldMultiplier *
    activeBoostGoldMultiplier
);
```

### **4. Drop Rate Calculation Formula**

```typescript
// Base drop rate from loot table
const baseDropRate = lootTableItem.chance;

// Badge Loot Chance Multipliers
const badgeLootMultiplier = unlockedBadgeIds.reduce((multiplier, badgeId) => {
  const badge = BADGES[badgeId];
  if (badge?.bonus?.type === "MULTIPLY_LOOT_CHANCE") {
    return multiplier * badge.bonus.value;
  }
  return multiplier;
}, 1.0);

// Store Upgrade Loot Chance
const storeLootBonus = purchasedStoreUpgradeIds.reduce((bonus, upgradeId) => {
  const upgrade = STORE.upgrades.find((u) => u.id === upgradeId);
  if (upgrade?.effect?.type === "loot") {
    return bonus + upgrade.effect.value;
  }
  return bonus;
}, 0);

// Active Boost Loot Chance
const activeBoostLootBonus = activeBoosts.reduce((bonus, boost) => {
  if (boost.sourceId.startsWith("consumable_buff_loot_")) {
    return bonus + boost.value;
  }
  return bonus;
}, 0);

// Final Drop Rate
const finalDropRate = Math.min(
  baseDropRate * badgeLootMultiplier + storeLootBonus + activeBoostLootBonus,
  1.0 // Cap at 100%
);
```

## 🧪 **COMPREHENSIVE TEST SCENARIOS**

### **Scenario 1: Level 5 Player with Stirbicks Mug +5**

```typescript
const testScenario1 = {
  name: "Level 5 Player with Stirbicks Mug +5",
  playerState: {
    level: 5,
    equipment: { Weapon: "cafeteria_spork" },
    equipmentUpgrades: { "cafeteria_spork": 5 },
    unlockedBadgeIds: ["level_5", "power_500"],
    activeBoosts: [],
    purchasedStoreUpgradeIds: [],
    permanentPowerBonus: 0
  },
  expectedCalculations: {
    basePower: (5 - 1) * 5 + 1 = 21,
    equipmentPower: 4 + (5 * 2) = 14, // base 4 + 5 upgrades * 2
    badgePowerMultiplier: 1.0, // no power multiplier badges
    badgePermanentPower: 0, // no permanent power badges
    activeBoostPower: 0, // no active power boosts
    finalPower: Math.floor((21 + 14 + 0 + 0) * 1.0) = 35
  }
};
```

### **Scenario 2: Level 10 Player with Multiple Badges and Store Upgrades**

```typescript
const testScenario2 = {
  name: "Level 10 Player with Multiple Badges and Store Upgrades",
  playerState: {
    level: 10,
    equipment: {
      Weapon: "cafeteria_spork",
      Head: "top_hat",
      Body: "trench_coat"
    },
    equipmentUpgrades: {
      "cafeteria_spork": 3,
      "top_hat": 2,
      "trench_coat": 1
    },
    unlockedBadgeIds: [
      "level_10",      // +0.5% XP
      "power_1k",      // +0.5% Power
      "gold_100k",     // +1% Gold
      "perm_power_100" // +100 Permanent Power
    ],
    activeBoosts: [
      { sourceId: "consumable_buff_power_1", value: 20, endTime: Date.now() + 600000 }
    ],
    purchasedStoreUpgradeIds: [
      "upgrade_xp_1",   // +2% XP
      "upgrade_gold_1", // +2% Gold
      "upgrade_loot_1"  // +1% Loot Chance
    ],
    permanentPowerBonus: 100
  },
  expectedCalculations: {
    basePower: (10 - 1) * 5 + 1 = 46,
    equipmentPower: (4 + 6) + (2 + 4) + (3 + 2) = 21, // weapon + hat + coat
    badgePowerMultiplier: 1.005, // power_1k badge
    badgePermanentPower: 100, // perm_power_100 badge
    activeBoostPower: 20, // power boost
    finalPower: Math.floor((46 + 21 + 100 + 20) * 1.005) = 187
  }
};
```

### **Scenario 3: Drop Rate Testing with Multiple Bonuses**

```typescript
const testScenario3 = {
  name: "Drop Rate Testing with Multiple Bonuses",
  playerState: {
    unlockedBadgeIds: [
      "collector_10", // +0.5% Loot Chance
      "misc_lucky", // +1% Loot Chance
    ],
    purchasedStoreUpgradeIds: [
      "upgrade_loot_1", // +1% Loot Chance
    ],
    activeBoosts: [
      {
        sourceId: "consumable_buff_loot_1",
        value: 0.1,
        endTime: Date.now() + 600000,
      },
    ],
  },
  testItem: "power_shard",
  baseDropRate: 0.005, // 0.5% from cafeteria zone
  expectedCalculations: {
    badgeLootMultiplier: 1.015, // collector_10 + misc_lucky
    storeLootBonus: 0.01, // upgrade_loot_1
    activeBoostLootBonus: 0.1, // loot boost
    finalDropRate: (Math.min(0.005 * 1.015 + 0.01 + 0.1, 1.0) = 0.115075),
  },
};
```

## 📊 **STATISTICAL TESTING APPROACHES**

### **1. Drop Rate Validation Testing**

```typescript
// Run mission 1000 times to validate drop rates
async function testDropRateValidation(
  zoneId: string,
  itemId: string,
  expectedRate: number
) {
  const results = [];
  const iterations = 1000;

  for (let i = 0; i < iterations; i++) {
    // Reset player state
    await resetPlayerState();

    // Start and complete mission
    const startResult = startMission(playerState, zoneId, "SHORT", true);
    const claimResult = claimMission(playerState, startResult.activeMission);

    // Check if item dropped
    const itemDropped = claimResult.newPlayerState.inventory.some(
      (item) => item.itemId === itemId
    );

    results.push(itemDropped);
  }

  // Calculate actual drop rate
  const actualRate = results.filter(Boolean).length / iterations;

  // Validate within acceptable range (±20% of expected)
  const acceptableRange = {
    min: expectedRate * 0.8,
    max: expectedRate * 1.2,
  };

  if (actualRate < acceptableRange.min || actualRate > acceptableRange.max) {
    throw new Error(
      `Drop rate validation failed: Expected ${expectedRate}, got ${actualRate} ` +
        `(range: ${acceptableRange.min}-${acceptableRange.max})`
    );
  }

  return { expectedRate, actualRate, acceptableRange };
}
```

### **2. Power Calculation Validation Testing**

```typescript
// Test power calculation with various combinations
async function testPowerCalculationValidation() {
  const testCases = [
    {
      name: "Level 1, No Equipment",
      playerState: { level: 1, equipment: {}, equipmentUpgrades: {} },
      expectedPower: 1,
    },
    {
      name: "Level 5, Stirbicks Mug +5",
      playerState: {
        level: 5,
        equipment: { Weapon: "cafeteria_spork" },
        equipmentUpgrades: { cafeteria_spork: 5 },
      },
      expectedPower: 35,
    },
    {
      name: "Level 10, Multiple Equipment + Badges",
      playerState: {
        level: 10,
        equipment: {
          Weapon: "cafeteria_spork",
          Head: "top_hat",
          Body: "trench_coat",
        },
        equipmentUpgrades: {
          cafeteria_spork: 3,
          top_hat: 2,
          trench_coat: 1,
        },
        unlockedBadgeIds: ["power_1k"],
        permanentPowerBonus: 50,
      },
      expectedPower: 137, // Calculated manually
    },
  ];

  for (const testCase of testCases) {
    await forceSetPlayerState(playerId, testCase.playerState);
    const playerState = await getPlayerState(playerId);

    const calculatedPower = calculatePlayerPower(playerState);

    if (calculatedPower !== testCase.expectedPower) {
      throw new Error(
        `${testCase.name}: Expected power ${testCase.expectedPower}, got ${calculatedPower}`
      );
    }
  }
}
```

### **3. Bonus Stacking Validation Testing**

```typescript
// Test how multiple bonuses stack together
async function testBonusStackingValidation() {
  const testCases = [
    {
      name: "XP Bonus Stacking",
      playerState: {
        unlockedBadgeIds: ["level_10"], // +0.5% XP
        purchasedStoreUpgradeIds: ["upgrade_xp_1"], // +2% XP
        activeBoosts: [
          {
            sourceId: "consumable_buff_xp_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          },
        ],
      },
      baseXp: 100,
      expectedXp: Math.floor(100 * 1.005 * 1.02 * 1.25),
    },
    {
      name: "Gold Bonus Stacking",
      playerState: {
        unlockedBadgeIds: ["gold_100k"], // +1% Gold
        purchasedStoreUpgradeIds: ["upgrade_gold_1"], // +2% Gold
        activeBoosts: [
          {
            sourceId: "consumable_buff_gold_1",
            value: 0.25,
            endTime: Date.now() + 600000,
          },
        ],
      },
      baseGold: 50,
      expectedGold: Math.floor(50 * 1.01 * 1.02 * 1.25),
    },
  ];

  for (const testCase of testCases) {
    await forceSetPlayerState(playerId, testCase.playerState);
    const playerState = await getPlayerState(playerId);

    // Simulate mission completion
    const missionResult = simulateMissionCompletion(
      playerState,
      testCase.baseXp,
      testCase.baseGold
    );

    if (missionResult.finalXp !== testCase.expectedXp) {
      throw new Error(
        `${testCase.name} XP: Expected ${testCase.expectedXp}, got ${missionResult.finalXp}`
      );
    }

    if (missionResult.finalGold !== testCase.expectedGold) {
      throw new Error(
        `${testCase.name} Gold: Expected ${testCase.expectedGold}, got ${missionResult.finalGold}`
      );
    }
  }
}
```

## 🔧 **TESTING IMPLEMENTATION PLAN**

### **Phase 1: Core Calculation Tests**

1. **Power Calculation Tests**

   - Basic level-based power
   - Equipment power with upgrades
   - Badge power multipliers
   - Active boost power
   - Complex combinations

2. **XP Calculation Tests**

   - Base mission XP
   - Badge XP multipliers
   - Store upgrade XP bonuses
   - Active boost XP bonuses
   - Multiplier stacking

3. **Gold Calculation Tests**
   - Base mission gold
   - Badge gold multipliers
   - Store upgrade gold bonuses
   - Active boost gold bonuses
   - Multiplier stacking

### **Phase 2: Drop Rate Validation Tests**

1. **Individual Item Drop Rates**

   - Test each zone's loot table
   - Validate drop rates within acceptable ranges
   - Test exclusive loot mechanics

2. **Bonus Drop Rate Effects**
   - Badge loot chance multipliers
   - Store upgrade loot bonuses
   - Active boost loot bonuses
   - Combined bonus effects

### **Phase 3: Complex Scenario Tests**

1. **Realistic Player Progression**

   - Level 1-20 progression paths
   - Equipment upgrade strategies
   - Badge unlock sequences
   - Store purchase optimization

2. **Edge Case Testing**
   - Maximum bonus stacking
   - Boundary conditions
   - Error handling
   - Performance under load

## 📈 **EXPECTED OUTCOMES**

### **1. Power Calculation Accuracy**

- All power calculations within ±1 point of expected values
- Proper handling of equipment upgrades
- Correct badge bonus application
- Accurate active boost integration

### **2. Drop Rate Reliability**

- Drop rates within ±20% of expected values
- Proper bonus application
- Consistent results across multiple runs
- No bias in random number generation

### **3. Bonus System Integrity**

- Multipliers stack correctly
- Bonuses apply to correct sources
- No double-counting or missing bonuses
- Proper order of operations

### **4. Early Gameplay Balance**

- Progression feels rewarding
- Equipment upgrades provide meaningful power increases
- Badges unlock at appropriate milestones
- Store purchases offer good value

## 🎯 **SUCCESS CRITERIA**

1. **100% Test Coverage**: All calculation formulas tested
2. **Statistical Validation**: Drop rates within acceptable ranges
3. **Edge Case Handling**: All bonus combinations work correctly
4. **Performance**: Tests complete within reasonable time
5. **Documentation**: All learnings captured for future reference

---

## 🚀 **NEXT STEPS**

1. **Implement Core Calculation Tests**
2. **Create Drop Rate Validation Framework**
3. **Build Complex Scenario Test Suite**
4. **Run Statistical Validation Tests**
5. **Document All Findings and Optimizations**

This comprehensive testing approach will ensure that early gameplay mechanics are bulletproof and provide a solid foundation for player progression.
