
import type { Item } from '../../types';
import { ItemRarity, ItemType, ItemCategory } from '../../types';

export const utilityItems: { [key: string]: Item } = {
  'power_shard': { id: 'power_shard', name: 'Power Shard', rarity: ItemRarity.Rare, type: ItemType.Stackable, category: ItemCategory.Standard, powerBonus: 1, description: 'A crystallized fragment of pure energy. It hums with potential. Permanently increases Power by 1.', icon: '💎' },
  'small_xp_potion': { id: 'small_xp_potion', name: 'Classified Document', rarity: ItemRarity.Common, type: ItemType.Consumable, category: ItemCategory.Standard, effect: '+100 XP', description: 'Instantly grants 100 XP worth of intel.', icon: '📄'},
  'small_gold_pouch': { id: 'small_gold_pouch', name: 'Offshore Account Key', rarity: ItemRarity.Common, type: ItemType.Consumable, category: ItemCategory.Standard, effect: '+100 Gold', description: 'Instantly grants 100 Gold from a numbered account.', icon: '🔑'},
};
