
import type { FoodItem } from '../../types';
import { ItemRarity, ItemType, ItemCategory, HomunculusTrait } from '../../types';

export const FOOD_ITEMS: { [key: string]: FoodItem } = {
  'brain_jelly': { id: 'brain_jelly', name: 'Brain Jelly', rarity: ItemRarity.Common, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Wiggles unnervingly. Smells of ozone. Boosts Intelligence.', icon: '🧠', trait: HomunculusTrait.Intelligence, value: 1 },
  'volt_cola': { id: 'volt_cola', name: 'Volt Cola', rarity: ItemRarity.Common, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Highly caffeinated and slightly radioactive. Boosts Speed.', icon: '⚡', trait: HomunculusTrait.Speed, value: 1 },
  'silver_tongue_taco': { id: 'silver_tongue_taco', name: 'Silver-Tongue Taco', rarity: ItemRarity.Rare, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Makes even the most outlandish lies sound plausible. Boosts Charisma.', icon: '🌮', trait: HomunculusTrait.Charisma, value: 1 },
  'peace_treaty_pie': { id: 'peace_treaty_pie', name: 'Peace Treaty Pie', rarity: ItemRarity.Rare, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'A slice of galactic harmony. Boosts Diplomacy.', icon: '🥧', trait: HomunculusTrait.Diplomacy, value: 1 },
  'power_bar_plus': { id: 'power_bar_plus', name: 'Power Bar+', rarity: ItemRarity.Common, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Chalky, but effective. Boosts Strength.', icon: '💪', trait: HomunculusTrait.Strength, value: 1 },
  'shadow_chips': { id: 'shadow_chips', name: 'Shadow Chips', rarity: ItemRarity.Rare, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Tastes like sneaking around at midnight. Boosts Stealth.', icon: '👻', trait: HomunculusTrait.Stealth, value: 1 },
  'lucky_charms_cereal': { id: 'lucky_charms_cereal', name: 'Lucky Charms Cereal', rarity: ItemRarity.Epic, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Magically delicious and statistically significant. Boosts Luck.', icon: '🍀', trait: HomunculusTrait.Luck, value: 1 },
  'conspiracy_cookie': { id: 'conspiracy_cookie', name: 'Conspiracy Cookie', rarity: ItemRarity.Rare, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'Connects all the dots, even the ones that aren\'t there. Boosts Cunning.', icon: '🍪', trait: HomunculusTrait.Cunning, value: 1 },
  'microchip_muffin': { id: 'microchip_muffin', name: 'Microchip Muffin', rarity: ItemRarity.Rare, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'A complete breakfast and a software update in one. Boosts Tech.', icon: '🧁', trait: HomunculusTrait.Tech, value: 1 },
  'psi_pop-rocks': { id: 'psi_pop-rocks', name: 'Psi Pop-Rocks', rarity: ItemRarity.Epic, type: ItemType.Food, category: ItemCategory.Sustenance, description: 'The candy that reads your mind. Boosts Psionics.', icon: '🍬', trait: HomunculusTrait.Psionics, value: 1 },
};
