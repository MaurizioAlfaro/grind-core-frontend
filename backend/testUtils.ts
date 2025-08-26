import PlayerModel from "./models/playerModel";

// ============================================================================
// TESTING UTILITIES FOR BACKEND TESTING
// ============================================================================
// These functions are for testing purposes only and should not be used in production
// They allow direct manipulation of player state for comprehensive testing

export interface TestPlayerState {
  level?: number;
  xp?: number;
  gold?: number;
  dollars?: number;
  power?: number;
  inventory?: { itemId: string; quantity: number }[];
  equipment?: Record<string, string>;
  equipmentUpgrades?: Record<string, number>;
  equipmentEnchantments?: Record<string, string[]>;
  unlockedZoneIds?: string[];
  discoveredItemIds?: string[];
  completedZoneIds?: string[];
  completedLongMissionZoneIds?: string[];
  permanentPowerBonus?: number;
  powerMultiplier?: number;
  activeBoosts?: any[];
  purchasedStoreUpgradeIds?: string[];
  unlockedBadgeIds?: string[];
  defeatedBossIds?: string[];
  purchasedLabEquipmentIds?: string[];
  unlockedPermanentPerks?: string[];
  globalBossCooldownEndTime?: number;
  labLevel?: number;
  labXp?: number;
  homunculusCreatedCount?: number;
  homunculi?: any[];
  consecutiveCancels?: number;
  hasEquippedWeapon?: boolean;
  highChanceForgeFails?: number;
  consecutiveCommonCacheOpens?: number;
  missionsCompleted?: number;
  hasReceivedInitialBoost?: boolean;
  tutorialStep?: number;
  tutorialCompleted?: boolean;
  isWalletConnected?: boolean;
  ownsReptilianzNFT?: boolean;
  hasSeenWalletConnectPrompt?: boolean;
  bossDefeatCounts?: Record<string, number>;
  dailySafeguardUses?: Record<string, number>;
  lastSafeguardUseTimestamp?: number;
  user?: string; // Add user field for database compatibility
}

// ============================================================================
// PLAYER STATE MANIPULATION
// ============================================================================

/**
 * Force set player level and XP
 */
export async function forceSetPlayerLevel(
  playerId: string,
  level: number,
  xp: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.level = level;
  player.xp = xp;
  await player.save();
}

/**
 * Force set player currency
 */
export async function forceSetPlayerCurrency(
  playerId: string,
  gold?: number,
  dollars?: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (gold !== undefined) player.gold = gold;
  if (dollars !== undefined) player.dollars = dollars;
  await player.save();
}

/**
 * Force set player power
 */
export async function forceSetPlayerPower(
  playerId: string,
  power: number,
  permanentBonus?: number,
  multiplier?: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.power = power;
  if (permanentBonus !== undefined) player.permanentPowerBonus = permanentBonus;
  if (multiplier !== undefined) player.powerMultiplier = multiplier;
  await player.save();
}

// ============================================================================
// INVENTORY & ITEM MANAGEMENT
// ============================================================================

/**
 * Force give item to player inventory
 */
export async function forceGiveItem(
  playerId: string,
  itemId: string,
  quantity: number = 1
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  const existingItem = player.inventory.find((item) => item.itemId === itemId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    player.inventory.push({ itemId, quantity });
  }
  await player.save();
}

/**
 * Force give multiple items to player inventory
 */
export async function forceGiveItems(
  playerId: string,
  itemIds: { itemId: string; quantity: number }[]
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  for (const { itemId, quantity } of itemIds) {
    const existingItem = player.inventory.find(
      (item) => item.itemId === itemId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      player.inventory.push({ itemId, quantity });
    }
  }
  await player.save();
}

/**
 * Force remove item from player inventory
 */
export async function forceRemoveItem(
  playerId: string,
  itemId: string,
  quantity: number = 1
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  const index = player.inventory.findIndex((item) => item.itemId === itemId);
  if (index > -1) {
    if (player.inventory[index].quantity <= quantity) {
      player.inventory.splice(index, 1);
    } else {
      player.inventory[index].quantity -= quantity;
    }
    await player.save();
  }
}

/**
 * Force clear player inventory
 */
export async function forceClearInventory(playerId: string): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.inventory = [];
  await player.save();
}

/**
 * Force set player inventory
 */
export async function forceSetInventory(
  playerId: string,
  items: { itemId: string; quantity: number }[]
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.inventory = items;
  await player.save();
}

// ============================================================================
// EQUIPMENT MANAGEMENT
// ============================================================================

/**
 * Force equip item to slot
 */
export async function forceEquipItem(
  playerId: string,
  slot: string,
  itemId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.equipment[slot] = itemId;
  await player.save();
}

/**
 * Force unequip item from slot
 */
export async function forceUnequipItem(
  playerId: string,
  slot: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  delete player.equipment[slot];
  await player.save();
}

/**
 * Force clear all equipment
 */
export async function forceClearEquipment(playerId: string): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.equipment = {};
  await player.save();
}

/**
 * Force set equipment upgrades
 */
export async function forceSetEquipmentUpgrade(
  playerId: string,
  itemId: string,
  upgradeLevel: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.equipmentUpgrades[itemId] = upgradeLevel;
  await player.save();
}

/**
 * Force set equipment enchantments
 */
export async function forceSetEquipmentEnchantments(
  playerId: string,
  itemId: string,
  enchantments: string[]
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.equipmentEnchantments[itemId] = enchantments;
  await player.save();
}

// ============================================================================
// ZONE & PROGRESSION MANAGEMENT
// ============================================================================

/**
 * Force unlock zone
 */
export async function forceUnlockZone(
  playerId: string,
  zoneId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.unlockedZoneIds.includes(zoneId)) {
    player.unlockedZoneIds.push(zoneId);
    await player.save();
  }
}

/**
 * Force unlock multiple zones
 */
export async function forceUnlockZones(
  playerId: string,
  zoneIds: string[]
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  for (const zoneId of zoneIds) {
    if (!player.unlockedZoneIds.includes(zoneId)) {
      player.unlockedZoneIds.push(zoneId);
    }
  }
  await player.save();
}

/**
 * Force complete zone
 */
export async function forceCompleteZone(
  playerId: string,
  zoneId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.completedZoneIds.includes(zoneId)) {
    player.completedZoneIds.push(zoneId);
    await player.save();
  }
}

/**
 * Force discover item
 */
export async function forceDiscoverItem(
  playerId: string,
  itemId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.discoveredItemIds.includes(itemId)) {
    player.discoveredItemIds.push(itemId);
    await player.save();
  }
}

// ============================================================================
// LAB & HOMUNCULUS MANAGEMENT
// ============================================================================

/**
 * Force set lab level and XP
 */
export async function forceSetLabLevel(
  playerId: string,
  level: number,
  xp: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.labLevel = level;
  player.labXp = xp;
  await player.save();
}

/**
 * Force purchase lab equipment
 */
export async function forcePurchaseLabEquipment(
  playerId: string,
  equipmentId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.purchasedLabEquipmentIds.includes(equipmentId)) {
    player.purchasedLabEquipmentIds.push(equipmentId);
    await player.save();
  }
}

/**
 * Force set homunculus count
 */
export async function forceSetHomunculusCount(
  playerId: string,
  count: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.homunculusCreatedCount = count;
  await player.save();
}

// ============================================================================
// BADGE & ACHIEVEMENT MANAGEMENT
// ============================================================================

/**
 * Force unlock badge
 */
export async function forceUnlockBadge(
  playerId: string,
  badgeId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.unlockedBadgeIds.includes(badgeId)) {
    player.unlockedBadgeIds.push(badgeId);
    await player.save();
  }
}

/**
 * Force unlock permanent perk
 */
export async function forceUnlockPermanentPerk(
  playerId: string,
  perkId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.unlockedPermanentPerks.includes(perkId)) {
    player.unlockedPermanentPerks.push(perkId);
    await player.save();
  }
}

// ============================================================================
// BOSS & COMBAT MANAGEMENT
// ============================================================================

/**
 * Force defeat boss
 */
export async function forceDefeatBoss(
  playerId: string,
  bossId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.defeatedBossIds.includes(bossId)) {
    player.defeatedBossIds.push(bossId);
  }

  // Set defeat count
  if (!player.bossDefeatCounts) player.bossDefeatCounts = {};
  player.bossDefeatCounts[bossId] = (player.bossDefeatCounts[bossId] || 0) + 1;

  await player.save();
}

/**
 * Force set boss cooldown
 */
export async function forceSetBossCooldown(
  playerId: string,
  cooldownEndTime: number
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.globalBossCooldownEndTime = cooldownEndTime;
  await player.save();
}

// ============================================================================
// STORE & UPGRADE MANAGEMENT
// ============================================================================

/**
 * Force purchase store upgrade
 */
export async function forcePurchaseStoreUpgrade(
  playerId: string,
  upgradeId: string
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  if (!player.purchasedStoreUpgradeIds.includes(upgradeId)) {
    player.purchasedStoreUpgradeIds.push(upgradeId);
    await player.save();
  }
}

// ============================================================================
// TUTORIAL & WALLET MANAGEMENT
// ============================================================================

/**
 * Force set tutorial step
 */
export async function forceSetTutorialStep(
  playerId: string,
  step: number,
  completed: boolean = false
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.tutorialStep = step;
  player.tutorialCompleted = completed;
  await player.save();
}

/**
 * Force set wallet connection state
 */
export async function forceSetWalletState(
  playerId: string,
  isConnected: boolean,
  ownsNFT: boolean = false
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  player.isWalletConnected = isConnected;
  player.ownsReptilianzNFT = ownsNFT;
  await player.save();
}

// ============================================================================
// MISSION & TIMER MANAGEMENT
// ============================================================================

// Note: activeMission is not part of PlayerState, it's part of GameState
// These functions are removed as they don't apply to the current data model

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Force reset player to initial state
 */
export async function forceResetPlayer(playerId: string): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  // Reset to initial state
  player.level = 1;
  player.xp = 0;
  player.gold = 0;
  player.dollars = 0;
  player.power = 10;
  player.inventory = [];
  player.equipment = {};
  player.equipmentUpgrades = {};
  player.equipmentEnchantments = {};
  player.unlockedZoneIds = ["01_cafeteria"];
  player.discoveredItemIds = [];
  player.completedZoneIds = [];
  player.completedLongMissionZoneIds = [];
  player.permanentPowerBonus = 0;
  player.powerMultiplier = 1;
  player.activeBoosts = [];
  player.purchasedStoreUpgradeIds = [];
  player.unlockedBadgeIds = [];
  player.defeatedBossIds = [];
  player.purchasedLabEquipmentIds = [];
  player.unlockedPermanentPerks = [];
  player.globalBossCooldownEndTime = 0;
  player.labLevel = 1;
  player.labXp = 0;
  player.homunculusCreatedCount = 0;
  player.homunculi = [];
  player.consecutiveCancels = 0;
  player.hasEquippedWeapon = false;
  player.highChanceForgeFails = 0;
  player.consecutiveCommonCacheOpens = 0;
  player.missionsCompleted = 0;
  player.hasReceivedInitialBoost = false;
  player.tutorialStep = 0;
  player.tutorialCompleted = false;
  player.isWalletConnected = false;
  player.ownsReptilianzNFT = false;
  player.hasSeenWalletConnectPrompt = false;
  player.bossDefeatCounts = {};
  player.dailySafeguardUses = {};
  player.lastSafeguardUseTimestamp = 0;

  await player.save();
}

/**
 * Force set entire player state
 */
export async function forceSetPlayerState(
  playerId: string,
  state: TestPlayerState
): Promise<void> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  // Apply all state changes
  Object.assign(player, state);
  await player.save();
}

/**
 * Get player state for verification
 */
export async function getPlayerState(playerId: string): Promise<any> {
  const player = await PlayerModel.findById(playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  return player.toObject();
}

/**
 * Create test player if doesn't exist
 */
export async function ensureTestPlayer(
  playerId: string,
  initialState?: Partial<TestPlayerState>
): Promise<void> {
  let player = await PlayerModel.findById(playerId);

  if (!player) {
    player = new PlayerModel({
      _id: playerId,
      level: 1,
      xp: 0,
      gold: 0,
      dollars: 0,
      power: 10,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      equipmentEnchantments: {},
      unlockedZoneIds: ["01_cafeteria"],
      discoveredItemIds: [],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      permanentPowerBonus: 0,
      powerMultiplier: 1,
      activeBoosts: [],
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      purchasedLabEquipmentIds: [],
      unlockedPermanentPerks: [],
      globalBossCooldownEndTime: 0,
      labLevel: 1,
      labXp: 0,
      homunculusCreatedCount: 0,
      homunculi: [],
      consecutiveCancels: 0,
      hasEquippedWeapon: false,
      highChanceForgeFails: 0,
      consecutiveCommonCacheOpens: 0,
      missionsCompleted: 0,
      hasReceivedInitialBoost: false,
      tutorialStep: 0,
      tutorialCompleted: false,
      isWalletConnected: false,
      ownsReptilianzNFT: false,
      hasSeenWalletConnectPrompt: false,
      bossDefeatCounts: {},
      dailySafeguardUses: {},
      lastSafeguardUseTimestamp: 0,
      user: playerId, // Set user field to avoid duplicate key error
      ...initialState,
    });

    await player.save();
  } else if (initialState) {
    // Apply initial state to existing player
    Object.assign(player, initialState);
    await player.save();
  }
}

/**
 * Clean up test player
 */
export async function cleanupTestPlayer(playerId: string): Promise<void> {
  await PlayerModel.findByIdAndDelete(playerId);
}
