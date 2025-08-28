import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const airportItems: { [key: string]: Item } = {
  'airport_cattle_prod': { id: 'airport_cattle_prod', name: 'Cattle Prod', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 120, description: 'Gets the herd moving.', icon: '🔱', forgeAttributes: { '5': 'power_t4', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'airport_pilot_uniform': { id: 'airport_pilot_uniform', name: 'Pilot Uniform', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 115, description: 'Grants an air of authority.', icon: '👨‍✈️', forgeAttributes: { '5': 'power_t4', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'airport_contraband': { id: 'airport_contraband', name: 'Contraband', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 90, description: 'A suspiciously heavy suitcase.', icon: '🧳', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'airport_black_box_amulet': { id: 'airport_black_box_amulet', name: 'Black Box Amulet', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 100, description: 'It has recorded many final words.', icon: '⬛', forgeAttributes: { '5': 'gold_t2', '10': 'xp_t2', '15': 'perm_perk_amulet' } },
  'airport_signal_wand': { id: 'airport_signal_wand', name: 'Signal Wand', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 110,
    description: 'For guiding planes or cracking skulls. It\'s versatile.',
    icon: ' S ',
    image: 'images/zone-items/signalWand.png',
    imageGenPrompt: 'An airport ground crew signal wand, glowing brightly.',
    forgeAttributes: { '5': 'power_t4', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'airport_security_vest': { id: 'airport_security_vest', name: 'Security Vest', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 118,
    description: 'A high-visibility vest that makes you look official.',
    icon: ' S ',
    image: 'images/zone-items/securityVest.png',
    imageGenPrompt: 'A bright yellow airport security vest.',
    forgeAttributes: { '5': 'power_t4', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'airport_first_class_ticket': { id: 'airport_first_class_ticket', name: 'First Class Ticket', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 95,
    description: 'Unlocks access to better snacks and deeper conspiracies.',
    icon: ' T ',
    image: 'images/zone-items/firstClassTicket.png',
    imageGenPrompt: 'A golden first-class airline ticket.',
    forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
};
