import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const marsBaseItems: { [key: string]: Item } = {
  'mars_base_phaser': { id: 'mars_base_phaser', name: 'Phaser Rifle', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 550, description: 'Set to stun...ningly high damage.', icon: '🔫', forgeAttributes: { '5': 'power_t6', '10': 'xp_t2', '15': 'perm_perk_weapon' } },
  'mars_base_spacesuit': { id: 'mars_base_spacesuit', name: 'Exo-Spacesuit', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 530, description: 'Protects from the vacuum of space and bad vibes.', icon: '👩‍🚀', forgeAttributes: { '5': 'power_t6', '10': 'gold_t2', '15': 'perm_perk_armor' } },
  'mars_base_rover_wheel': { id: 'mars_base_rover_wheel', name: 'Rover Wheel', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 480, description: 'Has seen things you people wouldn\'t believe.', icon: '⚙️', forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
  'mars_base_red_dust_pendant': { id: 'mars_base_red_dust_pendant', name: 'Red Dust Pendant', rarity: ItemRarity.Legendary, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 500, description: 'A vial of Martian soil. It feels... angry.', icon: '🔴', forgeAttributes: { '5': 'gold_t3', '10': 'xp_t3', '15': 'perm_perk_amulet' } },
  'mars_base_rock_sample': { id: 'mars_base_rock_sample', name: 'Rock Sample', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 450,
    description: 'Just a plain old Martian rock. Or is it?',
    icon: ' R ',
    image: 'images/zone-items/marsRock.png',
    imageGenPrompt: 'A simple, reddish rock from the surface of Mars.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'mars_base_antenna': { id: 'mars_base_antenna', name: 'Antenna', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 510,
    description: 'For receiving signals or delivering shocks.',
    icon: ' A ',
    image: 'images/zone-items/marsAntenna.png',
    imageGenPrompt: 'A long, thin communications antenna from a Mars rover.',
    forgeAttributes: { '5': 'power_t6', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
};
