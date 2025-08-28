import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const darkAlleyItems: { [key: string]: Item } = {
  'dark_alley_broken_bottle': { id: 'dark_alley_broken_bottle', name: 'Broken Bottle', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 45, description: 'Classic. Effective. Unsanitary.', icon: '🍾', image: 'images/zone-items/brokenBottle.png', imageGenPrompt: 'The jagged neck of a broken green glass bottle, held as a weapon.', forgeAttributes: { '5': 'power_t2', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'dark_alley_trench_coat': { id: 'dark_alley_trench_coat', name: 'Trench Coat', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 42, description: 'Standard issue for spies and private eyes.', icon: '🧥', image: 'images/zone-items/trenchCoat.png', imageGenPrompt: 'A long, dark trench coat that conceals the wearer in shadows.', forgeAttributes: { '5': 'power_t2', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'dark_alley_rat_skull_ring': { id: 'dark_alley_rat_skull_ring', name: 'Rat Skull Ring', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 33, description: 'A trophy from the true king of the alley.', icon: '💀', image: 'images/zone-items/ratSkullRing.png', imageGenPrompt: 'A ring made from the skull of a giant rat.', forgeAttributes: { '5': 'power_t2', '10': 'loot_t1', '15': 'perm_perk_ring' } },
  'dark_alley_informants_watch': { id: 'dark_alley_informants_watch', name: 'Informant\'s Watch', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 38, description: 'Stopped at the exact time of their betrayal.', icon: '⌚', image: 'images/zone-items/informantsWatch.png', imageGenPrompt: 'A cracked, old-fashioned pocket watch hanging from a chain.', forgeAttributes: { '5': 'gold_t2', '10': 'xp_t2', '15': 'perm_perk_amulet' } },
  'dark_alley_cardboard_box': { id: 'dark_alley_cardboard_box', name: 'Cardboard Box', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 50,
    description: 'The ultimate in stealth technology.',
    icon: '📦',
    image: 'images/zone-items/cardboardBox.png',
    imageGenPrompt: 'A large cardboard box with eye holes cut out, used for stealth.',
    forgeAttributes: { '5': 'power_t2', '10': 'gold_t2', '15': 'perm_perk_armor' } },
  'dark_alley_graffiti_can': { id: 'dark_alley_graffiti_can', name: 'Graffiti Can', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 30,
    description: 'For leaving your mark.',
    icon: ' G ',
    image: 'images/zone-items/graffitiCan.png',
    imageGenPrompt: 'A can of spray paint, rattling ominously.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
};
