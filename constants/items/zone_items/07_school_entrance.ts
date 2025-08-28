import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const schoolEntranceItems: { [key: string]: Item } = {
  'school_textbook': { id: 'school_textbook', name: 'Heavy Textbook', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 22, description: 'The history section has been heavily redacted.', icon: '📚', image: 'images/zone-items/textbook.png', imageGenPrompt: 'A thick, heavy textbook being used as a blunt weapon.', forgeAttributes: { '5': 'power_t2', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'school_backpack': { id: 'school_backpack', name: 'Jansport Backpack', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 20, description: 'Protects your back and carries your secrets.', icon: '🎒', image: 'images/zone-items/backpack.png', imageGenPrompt: 'A classic Jansport backpack, worn and covered in patches.', forgeAttributes: { '5': 'power_t2', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'school_detention_slip': { id: 'school_detention_slip', name: 'Detention Slip', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 15, description: 'A powerful ward against authority figures.', icon: '📝', image: 'images/zone-items/detentionSlip.png', imageGenPrompt: 'A crumpled, official-looking school detention slip that glows with a faint, rebellious energy.', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'school_janitors_keyring': { id: 'school_janitors_keyring', name: 'Janitor\'s Keyring', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 18, description: 'Opens doors, both physical and metaphysical.', icon: '🔑', image: 'images/zone-items/janitorsKeyring.png', imageGenPrompt: 'A large, old-fashioned brass ring holding dozens of mysterious, ornate keys. It hangs from a chain and glows faintly.', forgeAttributes: { '5': 'gold_t2', '10': 'xp_t2', '15': 'perm_perk_amulet' } },
  'school_hall_pass': { id: 'school_hall_pass', name: 'Hall Pass', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 12,
    description: 'Grants temporary immunity to questioning.',
    icon: ' H ',
    image: 'images/zone-items/hallPass.png',
    imageGenPrompt: 'A wooden hall pass on a string.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'school_class_ring': { id: 'school_class_ring', name: 'Class Ring', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 16,
    description: 'A symbol of your allegiance. To the football team, of course.',
    icon: ' C ',
    image: 'images/zone-items/classRing.png',
    imageGenPrompt: 'A silver class ring with a large, ominous red gemstone.',
    forgeAttributes: { '5': 'power_t1', '10': 'loot_t1', '15': 'perm_perk_ring' } },
};
