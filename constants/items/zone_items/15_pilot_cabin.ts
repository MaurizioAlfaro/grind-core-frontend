import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const pilotCabinItems: { [key: string]: Item } = {
  'pilot_cabin_flare_gun': { id: 'pilot_cabin_flare_gun', name: 'Flare Gun', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 150, description: 'For signaling... or searing.', icon: '🔫', forgeAttributes: { '5': 'power_t4', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'pilot_cabin_flight_jacket': { id: 'pilot_cabin_flight_jacket', name: 'Flight Jacket', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 145, description: 'It has many cool patches.', icon: '🧥', forgeAttributes: { '5': 'power_t4', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'pilot_cabin_instrument_panel': { id: 'pilot_cabin_instrument_panel', name: 'Instrument Panel', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 120, description: 'So many blinking lights.', icon: '🎛️', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'pilot_cabin_altimeter_ring': { id: 'pilot_cabin_altimeter_ring', name: 'Altimeter Ring', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 130, description: 'Tells you how far you have to fall.', icon: '💍', forgeAttributes: { '5': 'power_t4', '10': 'loot_t2', '15': 'perm_perk_ring' } },
  'pilot_cabin_fire_extinguisher': { id: 'pilot_cabin_fire_extinguisher', name: 'Fire Extinguisher', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 140,
    description: 'For putting out fires or starting problems.',
    icon: ' F ',
    image: 'images/attributes/weapon/fireExtinguisher.jpeg',
    imageGenPrompt: 'A red fire extinguisher being held like a club.',
    forgeAttributes: { '5': 'power_t4', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'pilot_cabin_aviator_goggles': { id: 'pilot_cabin_aviator_goggles', name: 'Aviator Goggles', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 125,
    description: 'Makes you look cool and mysterious.',
    icon: ' G ',
    image: 'images/attributes/amulet/aviatorGoggles.jpeg',
    imageGenPrompt: 'A pair of vintage aviator goggles.',
    forgeAttributes: { '5': 'gold_t1', '10': 'xp_t1', '15': 'perm_perk_amulet' } },
  'pilot_cabin_oxygen_mask': { id: 'pilot_cabin_oxygen_mask', name: 'Oxygen Mask', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 135,
    description: 'Breathe easy at any altitude.',
    icon: ' O ',
    image: 'images/attributes/misc/oxygenMask.jpeg',
    imageGenPrompt: 'An airplane oxygen mask.',
    forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
};
