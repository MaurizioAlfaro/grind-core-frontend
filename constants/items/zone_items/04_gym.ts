import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const gymItems: { [key: string]: Item } = {
  'gym_dumbbell': { id: 'gym_dumbbell', name: '5lb Dumbbell', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 12, description: 'It\'s not much, but it\'s heavier than a spork.', icon: '🏋️', image: 'images/attributes/weapon/dumbbell.jpeg', imageGenPrompt: 'A small, pink 5-pound dumbbell.', forgeAttributes: { '5': 'power_t1', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'gym_shorts': { id: 'gym_shorts', name: 'Sweaty Gym Shorts', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 11, description: 'The smell alone is a potent defense mechanism.', icon: '🩳', image: 'images/attributes/armor/gymShorts.jpeg', imageGenPrompt: 'A pair of smelly, grey athletic shorts.', forgeAttributes: { '5': 'power_t1', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'gym_sweatband': { id: 'gym_sweatband', name: 'Mysterious Sweatband', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 8, description: 'Absorbs sweat and psychic energy. Mostly sweat.', icon: ' S ', image: 'images/attributes/misc/sweatband.jpeg', imageGenPrompt: 'A 1980s style colorful sweatband for the head.', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'gym_towel': { id: 'gym_towel', name: 'Used Towel', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 15,
    description: 'It\'s seen things. Things you wouldn\'t want to see.',
    icon: ' T ',
    image: 'images/attributes/armor/usedTowel.jpeg',
    imageGenPrompt: 'A damp, used gym towel, worn like a cloak.',
    forgeAttributes: { '5': 'power_t1', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'gym_preworkout_ring': { id: 'gym_preworkout_ring', name: 'Pre-Workout Ring', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 12,
    description: 'A ring containing a single, highly concentrated dose of pre-workout. It makes your skin tingle.',
    icon: ' P ',
    image: 'images/attributes/ring/preworkoutRing.jpeg',
    imageGenPrompt: 'A ring with a small compartment on top, filled with a glowing, energetic powder.',
    forgeAttributes: { '5': 'power_t2', '10': 'loot_t2', '15': 'perm_perk_ring' } },
};
