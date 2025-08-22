import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const area69Items: { [key: string]: Item } = {
  'area_69_laser_pistol': { id: 'area_69_laser_pistol', name: 'Laser Pistol', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 190, description: 'Pew pew!', icon: '🔫', forgeAttributes: { '5': 'power_t4', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'area_69_alien_exoskeleton': { id: 'area_69_alien_exoskeleton', name: 'Alien Exoskeleton', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 185, description: 'Lightweight, durable, and smells of cinnamon.', icon: '👽', forgeAttributes: { '5': 'power_t4', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'area_69_alien_probe_misc': { id: 'area_69_alien_probe_misc', name: 'Alien Probe', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 160, description: 'You really don\'t want to know where it\'s been.', icon: '🔬', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'area_69_mind_control_helmet': { id: 'area_69_mind_control_helmet', name: 'Mind Control Helmet', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 170, description: 'Makes others suggestible. Do not wear while shopping.', icon: '🧠', forgeAttributes: { '5': 'gold_t2', '10': 'xp_t2', '15': 'perm_perk_amulet' } },
};
