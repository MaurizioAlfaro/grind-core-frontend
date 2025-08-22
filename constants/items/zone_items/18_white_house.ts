import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const whiteHouseItems: { [key: string]: Item } = {
  'white_house_ceremonial_sword': { id: 'white_house_ceremonial_sword', name: 'Ceremonial Sword', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 300, description: 'Mostly for show, but still pointy.', icon: '🗡️', forgeAttributes: { '5': 'power_t5', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'white_house_kevlar_suit': { id: 'white_house_kevlar_suit', name: 'Kevlar Suit', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 290, description: 'Stylish and bulletproof.', icon: '🕴️', forgeAttributes: { '5': 'power_t5', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'white_house_red_phone': { id: 'white_house_red_phone', name: 'The Red Phone', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 260, description: 'It only calls one number.', icon: '☎️', forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
  'white_house_declaration_of_independence': { id: 'white_house_declaration_of_independence', name: 'Declaration of Independence', rarity: ItemRarity.Legendary, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 275, description: 'Contains a treasure map on the back.', icon: '📜', forgeAttributes: { '5': 'gold_t3', '10': 'xp_t3', '15': 'perm_perk_amulet' } },
  'white_house_flag_pin': { id: 'white_house_flag_pin', name: 'Flag Pin', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 240,
    description: 'A symbol of patriotism, or a listening device. Maybe both.',
    icon: ' F ',
    image: 'images/attributes/misc/flagPin.jpeg',
    imageGenPrompt: 'A small American flag lapel pin.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'white_house_briefcase': { id: 'white_house_briefcase', name: 'Briefcase', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 250,
    description: 'Contains... important documents. And a sandwich.',
    icon: '💼',
    image: 'images/attributes/armor/briefcase.jpeg',
    imageGenPrompt: 'A black leather briefcase, used as a shield.',
    forgeAttributes: { '5': 'power_t4', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'white_house_presidential_seal': { id: 'white_house_presidential_seal', name: 'Presidential Seal', rarity: ItemRarity.Legendary, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 320,
    description: 'The ring of the most powerful person in the world. For now.',
    icon: ' P ',
    image: 'images/attributes/ring/presidentialSeal.jpeg',
    imageGenPrompt: 'A large, golden signet ring bearing the Seal of the President of the United States.',
    forgeAttributes: { '5': 'power_t5', '10': 'loot_t3', '15': 'perm_perk_ring' } },
};
