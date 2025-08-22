
import type { Item } from '../../types';
import { ItemRarity, ItemType, ItemCategory } from '../../types';

export const consumableItems: { [key: string]: Item } = {
  'consumable_buff_gold_1': { id: 'consumable_buff_gold_1', name: 'Gold Rush Potion', rarity: ItemRarity.Common, type: ItemType.Consumable, category: ItemCategory.Standard, description: 'Use to gain +25% Gold from missions for 10 minutes.', icon: '💰', effect: 'Gold Rush', buffEffect: { type: 'gold', value: 1.25, durationSeconds: 600 } },
  'consumable_buff_xp_1': { id: 'consumable_buff_xp_1', name: 'XP Surge Potion', rarity: ItemRarity.Common, type: ItemType.Consumable, category: ItemCategory.Standard, description: 'Use to gain +25% XP from missions for 10 minutes.', icon: '📈', effect: 'XP Surge', buffEffect: { type: 'xp', value: 1.25, durationSeconds: 600 } },
  'consumable_buff_loot_1': { id: 'consumable_buff_loot_1', name: 'Loot Luck Potion', rarity: ItemRarity.Rare, type: ItemType.Consumable, category: ItemCategory.Standard, description: 'Use to gain +10% Item Drop chance for 10 minutes.', icon: '🍀', effect: 'Loot Luck', buffEffect: { type: 'loot', value: 1.10, durationSeconds: 600 } },
  'consumable_buff_speed_1': { id: 'consumable_buff_speed_1', name: 'Haste Elixir', rarity: ItemRarity.Rare, type: ItemType.Consumable, category: ItemCategory.Standard, description: 'Use to make missions 10% faster for 10 minutes.', icon: '⏩', effect: 'Haste', buffEffect: { type: 'speed', value: 0.90, durationSeconds: 600 } },
  'consumable_buff_power_1': { id: 'consumable_buff_power_1', name: 'Giant\'s Strength Potion', rarity: ItemRarity.Epic, type: ItemType.Consumable, category: ItemCategory.Standard, description: 'Use to gain +20 temporary Power for 10 minutes.', icon: '💪', effect: 'Giant\'s Strength', buffEffect: { type: 'power', value: 20, durationSeconds: 600 } },
};
