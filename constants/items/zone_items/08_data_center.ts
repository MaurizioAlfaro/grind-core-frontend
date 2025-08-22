import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const dataCenterItems: { [key: string]: Item } = {
  'data_center_cat5_whip': { id: 'data_center_cat5_whip', name: 'CAT5 Cable Whip', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 28, description: 'Delivers high-speed pain.', icon: '〰️', image: 'images/attributes/weapon/cat5whip.jpeg', imageGenPrompt: 'A bundle of CAT5 ethernet cables braided together to form a whip.', forgeAttributes: { '5': 'power_t2', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'data_center_server_rack_panel': { id: 'data_center_server_rack_panel', name: 'Server Rack Panel', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 26, description: '1U of pure protection.', icon: '🖥️', image: 'images/attributes/armor/serverRackPanel.jpeg', imageGenPrompt: 'A 1U server rack blanking panel used as a shield or chestplate.', forgeAttributes: { '5': 'power_t2', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'data_center_coolant_ring': { id: 'data_center_coolant_ring', name: 'Coolant Ring', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 19, description: 'Keeps you cool under pressure.', icon: '💧', image: 'images/attributes/ring/coolantRing.jpeg', imageGenPrompt: 'A ring made of clear tubing filled with glowing blue liquid coolant.', forgeAttributes: { '5': 'power_t1', '10': 'loot_t1', '15': 'perm_perk_ring' } },
  'data_center_admin_keycard': { id: 'data_center_admin_keycard', name: 'Admin Keycard', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 22, description: 'Grants root access to reality.', icon: '🆔', image: 'images/attributes/misc/adminKeycard.jpeg', imageGenPrompt: 'A black keycard with "ADMIN" in gold letters, emitting a powerful aura.', forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
  'data_center_zip_tie': { id: 'data_center_zip_tie', name: 'Zip Tie', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 15,
    description: 'The ultimate tool for cable management and impromptu restraints.',
    icon: ' Z ',
    image: 'images/attributes/misc/zipTie.jpeg',
    imageGenPrompt: 'A single, sturdy black zip tie.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'data_center_firewall_charm': { id: 'data_center_firewall_charm', name: 'Firewall Charm', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 20,
    description: 'A small charm that seems to deflect malicious data packets.',
    icon: ' F ',
    image: 'images/attributes/amulet/firewallCharm.jpeg',
    imageGenPrompt: 'A small amulet shaped like a brick wall, glowing with a protective blue light.',
    forgeAttributes: { '5': 'gold_t1', '10': 'xp_t1', '15': 'perm_perk_amulet' } },
};
