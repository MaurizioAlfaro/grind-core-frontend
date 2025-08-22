

export enum ItemRarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export enum ItemType {
  Equipable = 'Equipable',
  Stackable = 'Stackable',
  Consumable = 'Consumable',
  Food = 'Food',
  HomunculusClothing = 'HomunculusClothing',
}

export enum ItemCategory {
  Standard = 'Standard',
  Boss = 'Boss',
  Reptilian = 'Reptilian',
  Sustenance = 'Sustenance',
  HomunculusGear = 'HomunculusGear',
}

export enum EquipmentSlot {
  Weapon = 'Weapon',
  Armor = 'Armor',
  Ring = 'Ring',
  Amulet = 'Amulet',
  Misc = 'Misc',
}

export enum HomunculusEquipmentSlot {
  Tail = 'Tail',
  Head = 'Head',
  Mouth = 'Mouth',
  Eyes = 'Eyes',
  Outfit = 'Outfit',
}

export enum HomunculusTrait {
    Intelligence = 'Intelligence',
    Speed = 'Speed',
    Charisma = 'Charisma',
    Diplomacy = 'Diplomacy',
    Strength = 'Strength',
    Stealth = 'Stealth',
    Luck = 'Luck',
    Cunning = 'Cunning',
    Tech = 'Tech',
    Psionics = 'Psionics',
}

export type ForgeAttributeEffectType = 
    | 'ADD_POWER' 
    | 'ADD_PERMANENT_POWER'
    | 'MULTIPLY_XP' 
    | 'MULTIPLY_GOLD' 
    | 'MULTIPLY_LOOT_CHANCE';

export interface ForgeAttributeEffect {
    type: ForgeAttributeEffectType;
    value: number;
}

export interface ForgeAttribute {
    id: string;
    name: string;
    description: string;
    icon: string;
    effect: ForgeAttributeEffect;
}

export interface Enchantment {
    attributeId: string;
    tier: number; // 1-5
}

export interface EnchantmentTier {
    level: number;
    description: string;
    value: number | { [key: string]: number };
}

export interface EnchantmentDefinition {
    id: string;
    name: string;
    icon: string;
    category: string;
    type: string; // This will be the key for the logic, e.g., 'EXECUTIONERS_MIGHT'
    baseDescription: string;
    tiers: EnchantmentTier[];
}

export type EnchantmentType = 
    | 'ADD_POWER' 
    | 'MULTIPLY_GOLD' 
    | 'MULTIPLY_XP' 
    | 'MULTIPLY_LOOT_CHANCE'
    | 'POWER_VS_BOSS'
    | 'FORGE_SAFEGUARD_CHANCE'
    | 'GOLDEN_TOUCH_CHANCE'
    | 'NEMESIS_PROTOCOL'
    | 'MULTIPLY_EQUIPMENT_POWER'
    | 'ADD_POWER_PER_LEVEL'
    | 'MULTIPLY_REPTILIAN_PART_CHANCE'
    | 'MULTIPLY_USD_EARNINGS'
    | 'FORGE_GOLD_SAVE_CHANCE'
    | 'MULTIPLY_MISSION_SPEED'
    | 'MULTIPLY_LAB_XP'
    | 'MULTIPLY_FEEDING_EFFECTIVENESS';

export interface EnchantableAttribute {
    id: string;
    name: string;
    icon: string;
    type: EnchantmentType;
    category: string;
    baseDescription: string;
    tierValues: number[];
    effectDescription: (tier: number) => string;
}


export interface BaseItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  type: ItemType;
  category: ItemCategory;
  description: string;
  icon: string;
  image?: string;
  imageGenPrompt?: string;
}

export interface EquipableItem extends BaseItem {
  type: ItemType.Equipable;
  slot: EquipmentSlot;
  power: number;
  forgeAttributes?: {
      '5'?: string;
      '10'?: string;
      '15'?: string;
  };
}

export interface StackableItem extends BaseItem {
  type: ItemType.Stackable;
  powerBonus: number;
  powerMultiplier?: number;
}

export interface ConsumableItem extends BaseItem {
  type: ItemType.Consumable;
  effect: string; // For simplicity in MVP
  buffEffect?: {
      type: BoostType;
      value: number;
      durationSeconds: number;
  };
}

export interface FoodItem extends BaseItem {
  type: ItemType.Food;
  category: ItemCategory.Sustenance;
  trait: HomunculusTrait;
  value: number;
}

export interface HomunculusClothingItem extends BaseItem {
    type: ItemType.HomunculusClothing;
    category: ItemCategory.HomunculusGear;
    slot: HomunculusEquipmentSlot;
    powerBonus: number;
    wageBonus: number; // e.g., 0.05 for +5%
}


export type Item = EquipableItem | StackableItem | ConsumableItem | FoodItem | HomunculusClothingItem;

export type InventoryItem = {
  itemId: string;
  quantity: number;
};

export type Equipment = {
  [key in EquipmentSlot]?: string; // itemId
};

export interface Zone {
  id: string;
  name: string;
  image: string;
  lore: string;
  requiredPower: number;
  missionDurations: {
    [key in MissionDurationKey]: {
      seconds: number;
      baseXp: number;
      baseGold: number;
    };
  };
  lootTable: { itemId: string; chance: number }[]; // chance from 0 to 1
  exclusiveLoot?: { itemId: string; duration: MissionDurationKey }[];
  completionBonus: {
    description: string;
    apply: (state: PlayerState) => PlayerState;
  }
  jobName: string;
  workerLimit: number;
  workRequirements: { [key in HomunculusTrait]?: number };
  hourlyRate: number; // in USD
}

export interface Boss {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  lore: string;
  image: string;
  imageGenPrompt?: string;
  power: number;
  rewardMultiplier: {
    xp: number;
    gold: number;
  };
  lootTable: { itemId: string; chance: number }[];
  firstVictoryBadgeId: string;
}

export type MissionDurationKey = 'SHORT' | 'MEDIUM' | 'LONG';

export interface Rewards {
  xp: number;
  gold: number;
  dollars: number;
  items: InventoryItem[];
}

export interface ActiveMission {
  zoneId: string;
  startTime: number;
  endTime: number;
  durationKey: MissionDurationKey;
  preRolledRewards: Rewards;
}

export type BoostType = 'xp' | 'gold' | 'loot' | 'speed' | 'power';
export type PermanentUpgradeType = 'xp' | 'gold' | 'loot';

export interface ActiveBoost {
    type: BoostType;
    // For xp, gold, loot, speed this is a multiplier (e.g., 1.1 for +10%)
    // For power, this is an additive value.
    value: number; 
    endTime: number;
    sourceId: string; // ID of the store item that granted this buff
}

export type BadgeBonusType = 'MULTIPLY_POWER' | 'MULTIPLY_XP' | 'MULTIPLY_GOLD' | 'MULTIPLY_LOOT_CHANCE' | 'ADD_PERMANENT_POWER';

export interface BadgeBonus {
    type: BadgeBonusType;
    value: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    isHidden?: boolean;
    bonus: BadgeBonus;
    bonusDescription: string;
}

export type HomunculusTraits = {
    [key in HomunculusTrait]: number;
};

export interface Homunculus {
    id: number; // timestamp of creation
    rarity: ItemRarity;
    isAdult: boolean;
    hibernationEndTime: number | null;
    traits: HomunculusTraits;
    work: {
      zoneId: string;
      startTime: number;
    } | null;
    equipment: {
      [key in HomunculusEquipmentSlot]?: string; // itemId
    };
    fedFoodIds?: string[];
}

export interface PlayerState {
  level: number;
  xp: number;
  gold: number;
  dollars: number;
  power: number;
  inventory: InventoryItem[];
  equipment: Equipment;
  equipmentUpgrades: { [slot in EquipmentSlot]?: number };
  equipmentEnchantments?: { [slot in EquipmentSlot]?: Enchantment[] };
  unlockedZoneIds: string[];
  discoveredItemIds: string[];
  completedZoneIds: string[];
  completedLongMissionZoneIds: string[];
  permanentPowerBonus: number;
  powerMultiplier: number;
  activeBoosts: ActiveBoost[];
  purchasedStoreUpgradeIds: string[];
  unlockedBadgeIds: string[];
  defeatedBossIds: string[];
  globalBossCooldownEndTime: number;
  unlockedPermanentPerks: string[];
  // Lab related state
  labLevel: number;
  labXp: number;
  purchasedLabEquipmentIds: string[];
  homunculusCreatedCount: number;
  homunculi: Homunculus[];
  // Misc badge tracking
  consecutiveCancels?: number;
  hasEquippedWeapon?: boolean;
  highChanceForgeFails?: number;
  consecutiveCommonCacheOpens?: number;
  // Mission tracking
  missionsCompleted?: number;
  hasReceivedInitialBoost?: boolean;
  // Tutorial
  tutorialStep?: number;
  tutorialCompleted?: boolean;
  // Wallet
  isWalletConnected?: boolean;
  ownsReptilianzNFT?: boolean;
  hasSeenWalletConnectPrompt?: boolean;

  // Global Attributes / Enchantments
  bossDefeatCounts?: { [bossId: string]: number };
  dailySafeguardUses?: { [date: string]: number };
  lastSafeguardUseTimestamp?: number;
}

export type GameState = {
  player: PlayerState;
  activeMission: ActiveMission | null;
}

export type LootboxCost = {
    type: 'gold' | 'xp';
    amount: number;
}

export interface Lootbox {
    id: string;
    label: string;
    description: string;
    cost: LootboxCost;
    pool: {
        itemId: string;
        weight: number;
    }[];
}

export type StoreItemType = 'consumable' | 'upgrade' | 'cache' | 'marketplace';

export interface BaseStoreItem {
    id: string;
    type: StoreItemType;
    name: string;
    description: string;
    icon: string;
    cost: {
        gold?: number;
        dollars?: number;
    };
}

export interface ConsumableStoreItem extends BaseStoreItem {
    type: 'consumable';
    consumableItemId: string;
}

export interface UpgradeStoreItem extends BaseStoreItem {
    type: 'upgrade';
    effect: {
        type: PermanentUpgradeType;
        value: number; // e.g. 0.02 for +2%
    };
}

export interface CacheStoreItem extends BaseStoreItem {
    type: 'cache';
    cacheId: string;
}

export interface MarketplaceStoreItem extends BaseStoreItem {
    type: 'marketplace';
    clothingItemId: string;
}

export type StoreItem = ConsumableStoreItem | UpgradeStoreItem | CacheStoreItem | MarketplaceStoreItem;

export interface LabEquipment {
    id:string;
    name: string;
    description: string;
    icon: string;
    cost: number;
}

export type SlottedParts = {
    core: string;
    material1: string;
    material2: string;
};
