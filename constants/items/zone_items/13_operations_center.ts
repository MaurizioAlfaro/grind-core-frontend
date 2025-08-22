import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const operationsCenterItems: { [key: string]: Item } = {
  'ops_center_taser': { id: 'ops_center_taser', name: 'Stun Baton', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 95, description: 'For non-lethal negotiations.', icon: '⚡', forgeAttributes: { '5': 'power_t3', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'ops_center_riot_shield': { id: 'ops_center_riot_shield', name: 'Riot Shield', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 90, description: 'Stops projectiles and harsh language.', icon: '🛡️', forgeAttributes: { '5': 'power_t3', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'ops_center_earpiece': { id: 'ops_center_earpiece', name: 'Surveillance Earpiece', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 70, description: 'Hear things you were not meant to hear.', icon: '👂', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'ops_center_master_keycard': { id: 'ops_center_master_keycard', name: 'Master Keycard', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 80, description: 'Opens all the doors. All of them.', icon: '🔑', forgeAttributes: { '5': 'gold_t2', '10': 'xp_t2', '15': 'perm_perk_amulet' } },
  'ops_center_handcuffs': { id: 'ops_center_handcuffs', name: 'Handcuffs', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 85,
    description: 'For detaining suspects. Can be used as a makeshift flail.',
    icon: ' H ',
    image: 'images/attributes/weapon/handcuffs.jpeg',
    imageGenPrompt: 'A pair of steel handcuffs being swung like a weapon.',
    forgeAttributes: { '5': 'power_t3', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'ops_center_flak_jacket': { id: 'ops_center_flak_jacket', name: 'Flak Jacket', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 92,
    description: 'Standard issue tactical vest. Smells like coffee and adrenaline.',
    icon: ' F ',
    image: 'images/attributes/armor/flakJacket.jpeg',
    imageGenPrompt: 'A black tactical flak jacket.',
    forgeAttributes: { '5': 'power_t3', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'ops_center_intel_folder': { id: 'ops_center_intel_folder', name: 'Intel Folder', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 75,
    description: 'Contains redacted information that could topple a government.',
    icon: ' I ',
    image: 'images/attributes/misc/intelFolder.jpeg',
    imageGenPrompt: 'A manila folder stamped with "TOP SECRET" in red.',
    forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
};
