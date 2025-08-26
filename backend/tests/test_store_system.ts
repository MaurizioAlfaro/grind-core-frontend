import connectDB from "../config/db";
import mongoose from "mongoose";
import {
  ensureTestPlayer,
  forceSetPlayerState,
  getPlayerState,
} from "../testUtils";
import { purchaseStoreItem, useConsumableItem } from "../logic";
import { STORE, CACHES } from "../../constants/store";
import { ITEMS } from "../../constants/index";

// Test player ID
const playerId = "66a01123456789abcdef1234";

// Test 1: Basic consumable purchase
async function testConsumablePurchase() {
  console.log("🔧 Test 1: Basic Consumable Purchase");

  // Setup: Player with 1000 gold
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 1000,
    inventory: [],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    gold: initialState.gold,
    inventory: initialState.inventory,
  });

  // Purchase a gold buff potion (500 gold)
  const result = purchaseStoreItem(initialState, "buy_buff_gold_1");

  if (!result.success) {
    throw new Error(`Purchase failed: ${result.message}`);
  }

  // Verify currency deduction
  if (result.newPlayerState.gold !== 500) {
    throw new Error(`Expected gold 500, got ${result.newPlayerState.gold}`);
  }

  // Verify inventory update
  const goldPotion = result.newPlayerState.inventory.find(
    (i) => i.itemId === "consumable_buff_gold_1"
  );
  if (!goldPotion || goldPotion.quantity !== 1) {
    throw new Error(
      `Expected gold potion quantity 1, got ${goldPotion?.quantity}`
    );
  }

  console.log("✅ Consumable purchase successful!");
  console.log("✅ Currency deduction correct:", {
    before: 1000,
    after: result.newPlayerState.gold,
  });
  console.log("✅ Inventory updated:", result.newPlayerState.inventory);

  return { success: true, goldSpent: 500, itemAdded: "consumable_buff_gold_1" };
}

// Test 2: Currency validation
async function testCurrencyValidation() {
  console.log("🔧 Test 2: Currency Validation");

  // Setup: Player with 100 gold (not enough for 500 gold item)
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 100,
    dollars: 0,
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    gold: initialState.gold,
    dollars: initialState.dollars,
  });

  // Try to purchase expensive item
  const result = purchaseStoreItem(initialState, "buy_buff_gold_1");

  if (result.success) {
    throw new Error("Purchase should have failed due to insufficient gold");
  }

  if (!result.message.includes("Not enough Gold")) {
    throw new Error(
      `Expected 'Not enough Gold' message, got: ${result.message}`
    );
  }

  // Verify state unchanged
  if (result.newPlayerState) {
    throw new Error("Player state should not be modified on failed purchase");
  }

  console.log("✅ Currency validation working correctly!");
  console.log("✅ Purchase properly rejected:", result.message);

  return { success: true, validationWorking: true };
}

// Test 3: Cache opening mechanics
async function testCacheMechanics() {
  console.log("🔧 Test 3: Cache Opening Mechanics");

  // Setup: Player with 5000 gold for cache
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 5000,
    inventory: [],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    gold: initialState.gold,
    inventory: initialState.inventory,
  });

  // Purchase and open a forager's cache
  const result = purchaseStoreItem(initialState, "store_foragers_cache");

  if (!result.success) {
    throw new Error(`Cache purchase failed: ${result.message}`);
  }

  // Verify currency deduction
  const expectedGold = 5000 - CACHES.foragers_cache.cost.amount;
  if (result.newPlayerState.gold !== expectedGold) {
    throw new Error(
      `Expected gold ${expectedGold}, got ${result.newPlayerState.gold}`
    );
  }

  // Verify rewards received
  if (!result.rewards || result.rewards.items.length === 0) {
    throw new Error("No rewards received from cache");
  }

  // Verify inventory contains cache items
  const receivedItems = result.rewards.items;
  console.log("✅ Cache rewards received:", receivedItems);

  // Check that received items are in inventory
  for (const reward of receivedItems) {
    const inventoryItem = result.newPlayerState.inventory.find(
      (i) => i.itemId === reward.itemId
    );
    if (!inventoryItem || inventoryItem.quantity !== reward.quantity) {
      throw new Error(`Item ${reward.itemId} not properly added to inventory`);
    }
  }

  console.log("✅ Cache mechanics working correctly!");
  console.log("✅ Currency deduction:", {
    before: 5000,
    after: result.newPlayerState.gold,
  });
  console.log("✅ Items received:", receivedItems);
  console.log("✅ Inventory updated:", result.newPlayerState.inventory);

  return {
    success: true,
    goldSpent: CACHES.foragers_cache.cost.amount,
    itemsReceived: receivedItems.length,
  };
}

// Test 4: Upgrade purchase and persistence
async function testUpgradePurchase() {
  console.log("🔧 Test 4: Upgrade Purchase and Persistence");

  // Setup: Player with 15000 gold for upgrade
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 15000,
    purchasedStoreUpgradeIds: [],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    gold: initialState.gold,
    purchasedUpgrades: initialState.purchasedStoreUpgradeIds,
  });

  // Purchase XP upgrade (10000 gold)
  const result = purchaseStoreItem(initialState, "upgrade_xp_1");

  if (!result.success) {
    throw new Error(`Upgrade purchase failed: ${result.message}`);
  }

  // Verify currency deduction
  if (result.newPlayerState.gold !== 5000) {
    throw new Error(`Expected gold 5000, got ${result.newPlayerState.gold}`);
  }

  // Verify upgrade tracking
  if (
    !result.newPlayerState.purchasedStoreUpgradeIds.includes("upgrade_xp_1")
  ) {
    throw new Error("Upgrade not added to purchased list");
  }

  // Verify upgrade effect (should be permanent)
  const upgradeItem = STORE.upgrades.find((u) => u.id === "upgrade_xp_1");
  if (!upgradeItem) {
    throw new Error("Upgrade item not found in store");
  }

  console.log("✅ Upgrade purchase successful!");
  console.log("✅ Currency deduction:", {
    before: 15000,
    after: result.newPlayerState.gold,
  });
  console.log(
    "✅ Upgrade tracked:",
    result.newPlayerState.purchasedStoreUpgradeIds
  );
  // Type guard for UpgradeStoreItem
  if (upgradeItem.type !== "upgrade") {
    throw new Error("Expected upgrade item type");
  }
  console.log("✅ Upgrade effect:", upgradeItem.effect);

  return { success: true, goldSpent: 10000, upgradeId: "upgrade_xp_1" };
}

// Test 5: Consumable usage and buff effects
async function testConsumableUsage() {
  console.log("🔧 Test 5: Consumable Usage and Buff Effects");

  // Setup: Player with gold buff potion in inventory
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    inventory: [{ itemId: "consumable_buff_gold_1", quantity: 1 }],
    activeBoosts: [],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    inventory: initialState.inventory,
    activeBoosts: initialState.activeBoosts,
  });

  // Use the gold buff potion
  const result = useConsumableItem(initialState, "consumable_buff_gold_1");

  if (!result.success) {
    throw new Error(`Consumable usage failed: ${result.message}`);
  }

  // Verify item consumed
  const remainingItem = result.newPlayerState.inventory.find(
    (i) => i.itemId === "consumable_buff_gold_1"
  );
  if (remainingItem) {
    throw new Error(
      `Item should have been consumed, but ${remainingItem.quantity} remain`
    );
  }

  // Verify buff applied
  if (result.newPlayerState.activeBoosts.length !== 1) {
    throw new Error(
      `Expected 1 active boost, got ${result.newPlayerState.activeBoosts.length}`
    );
  }

  const goldBoost = result.newPlayerState.activeBoosts[0];
  if (goldBoost.boostType !== "gold") {
    throw new Error(`Expected gold boost type, got ${goldBoost.boostType}`);
  }

  console.log("✅ Consumable usage successful!");
  console.log("✅ Item consumed from inventory");
  console.log("✅ Buff applied:", goldBoost);
  console.log("✅ Active boosts:", result.newPlayerState.activeBoosts);

  return {
    success: true,
    buffApplied: goldBoost.boostType,
    boostValue: goldBoost.value,
  };
}

// Test 6: Cache special cases (shard hoard)
async function testShardHoard() {
  console.log("🔧 Test 6: Shard Hoard Special Case");

  // Setup: Player with 10000 gold for shard hoard
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 10000,
    inventory: [],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    gold: initialState.gold,
    inventory: initialState.inventory,
  });

  // Purchase shard hoard
  const result = purchaseStoreItem(initialState, "store_shard_hoard");

  if (!result.success) {
    throw new Error(`Shard hoard purchase failed: ${result.message}`);
  }

  // Verify currency deduction
  const expectedGold = 10000 - CACHES.shard_hoard.cost.amount;
  if (result.newPlayerState.gold !== expectedGold) {
    throw new Error(
      `Expected gold ${expectedGold}, got ${result.newPlayerState.gold}`
    );
  }

  // Verify shard hoard special logic (3-7 power shards)
  if (!result.rewards || result.rewards.items.length !== 1) {
    throw new Error("Shard hoard should give exactly 1 item type");
  }

  const powerShards = result.rewards.items[0];
  if (powerShards.itemId !== "power_shard") {
    throw new Error(`Expected power_shard, got ${powerShards.itemId}`);
  }

  if (powerShards.quantity < 3 || powerShards.quantity > 7) {
    throw new Error(`Expected 3-7 power shards, got ${powerShards.quantity}`);
  }

  console.log("✅ Shard hoard working correctly!");
  console.log("✅ Power shards received:", powerShards.quantity);
  console.log("✅ Currency deduction:", {
    before: 10000,
    after: result.newPlayerState.gold,
  });

  return {
    success: true,
    shardsReceived: powerShards.quantity,
    goldSpent: CACHES.shard_hoard.cost.amount,
  };
}

// Test 7: Duplicate upgrade prevention
async function testDuplicateUpgradePrevention() {
  console.log("🔧 Test 7: Duplicate Upgrade Prevention");

  // Setup: Player who already purchased an upgrade
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    gold: 20000,
    purchasedStoreUpgradeIds: ["upgrade_xp_1"],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    gold: initialState.gold,
    purchasedUpgrades: initialState.purchasedStoreUpgradeIds,
  });

  // Try to purchase the same upgrade again
  const result = purchaseStoreItem(initialState, "upgrade_xp_1");

  if (result.success) {
    throw new Error("Duplicate upgrade purchase should have failed");
  }

  if (!result.message.includes("already purchased")) {
    throw new Error(
      `Expected 'already purchased' message, got: ${result.message}`
    );
  }

  // Verify state unchanged
  if (result.newPlayerState) {
    throw new Error(
      "Player state should not be modified on duplicate purchase"
    );
  }

  console.log("✅ Duplicate upgrade prevention working!");
  console.log("✅ Purchase properly rejected:", result.message);

  return { success: true, preventionWorking: true };
}

// Test 8: Marketplace item purchase
async function testMarketplacePurchase() {
  console.log("🔧 Test 8: Marketplace Item Purchase");

  // Setup: Player with dollars for marketplace
  await ensureTestPlayer(playerId);
  await forceSetPlayerState(playerId, {
    dollars: 100,
    inventory: [],
  });

  const initialState = await getPlayerState(playerId);
  console.log("✅ Initial state:", {
    dollars: initialState.dollars,
    inventory: initialState.inventory,
  });

  // Find a marketplace item
  const marketplaceItem = STORE.marketplace[0];
  if (!marketplaceItem) {
    throw new Error("No marketplace items available for testing");
  }

  console.log("✅ Testing marketplace item:", marketplaceItem.name);

  // Purchase marketplace item
  const result = purchaseStoreItem(initialState, marketplaceItem.id);

  if (!result.success) {
    throw new Error(`Marketplace purchase failed: ${result.message}`);
  }

  // Verify currency deduction
  const expectedDollars = 100 - (marketplaceItem.cost.dollars || 0);
  if (result.newPlayerState.dollars !== expectedDollars) {
    throw new Error(
      `Expected dollars ${expectedDollars}, got ${result.newPlayerState.dollars}`
    );
  }

  // Verify item added to inventory
  // Type guard for MarketplaceStoreItem
  if (marketplaceItem.type !== "marketplace") {
    throw new Error("Expected marketplace item type");
  }
  const clothingItem = result.newPlayerState.inventory.find(
    (i) => i.itemId === marketplaceItem.clothingItemId
  );
  if (!clothingItem || clothingItem.quantity !== 1) {
    throw new Error(`Marketplace item not properly added to inventory`);
  }

  console.log("✅ Marketplace purchase successful!");
  console.log("✅ Currency deduction:", {
    before: 100,
    after: result.newPlayerState.dollars,
  });
  console.log("✅ Item added:", clothingItem);

  return {
    success: true,
    dollarsSpent: marketplaceItem.cost.dollars || 0,
    itemAdded: marketplaceItem.clothingItemId,
  };
}

// Test runner
async function runStoreSystemTests() {
  console.log("============================================================");
  console.log("🛒 TESTING STORE SYSTEM");
  console.log("============================================================");

  try {
    await connectDB();
    console.log("✅ Database connected");

    const results = [];

    // Run all tests
    results.push(await testConsumablePurchase());
    results.push(await testCurrencyValidation());
    results.push(await testCacheMechanics());
    results.push(await testUpgradePurchase());
    results.push(await testConsumableUsage());
    results.push(await testShardHoard());
    results.push(await testDuplicateUpgradePrevention());
    results.push(await testMarketplacePurchase());

    // Summary
    console.log(
      "\n============================================================"
    );
    console.log("📊 STORE SYSTEM TEST RESULTS");
    console.log("============================================================");
    console.log(`✅ Passed: ${results.filter((r) => r.success).length}`);
    console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`📊 Total: ${results.length}`);

    if (results.every((r) => r.success)) {
      console.log("🎉 ALL STORE SYSTEM TESTS PASSED!");
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
  runStoreSystemTests().catch(console.error);
}

export { runStoreSystemTests };
