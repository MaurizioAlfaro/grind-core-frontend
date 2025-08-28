import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const moonRefineryItems: { [key: string]: Item } = {
  'moon_refinery_plasma_cutter': { id: 'moon_refinery_plasma_cutter', name: 'Plasma Cutter', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 1000, description: 'Cuts through rock, metal, and invading agents.', icon: '✂️', forgeAttributes: { '5': 'power_t6', '10': 'xp_t2', '15': 'perm_perk_weapon' } },
  'moon_refinery_lunar_regolith_armor': { id: 'moon_refinery_lunar_regolith_armor', name: 'Regolith Armor', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 950, description: 'Made from moon dust and sheer willpower.', icon: '🌕', forgeAttributes: { '5': 'power_t6', '10': 'gold_t2', '15': 'perm_perk_armor' } },
  'moon_refinery_helium3_canister': { id: 'moon_refinery_helium3_canister', name: 'Helium-3 Canister', rarity: ItemRarity.Legendary, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 850, description: 'A potent and unstable energy source.', icon: '☢️', forgeAttributes: { '5': 'gold_t3', '10': 'loot_t3', '15': 'perm_perk_misc' } },
  'moon_refinery_space_wrench': { id: 'moon_refinery_space_wrench', name: 'Space Wrench', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 900,
    description: 'For tightening bolts in zero-g.',
    icon: ' W ',
    image: 'images/zone-items/spaceWrench.png',
    imageGenPrompt: 'A large, futuristic, industrial wrench.',
    forgeAttributes: { '5': 'power_t6', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'moon_refinery_magnetic_boots': { id: 'moon_refinery_magnetic_boots', name: 'Magnetic Boots', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 880,
    description: 'Keeps you grounded when everything else is up in the air.',
    icon: ' B ',
    image: 'images/zone-items/magneticBoots.png',
    imageGenPrompt: 'A pair of heavy, metallic space boots.',
    forgeAttributes: { '5': 'power_t6', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'moon_refinery_mining_laser': { id: 'moon_refinery_mining_laser', name: 'Mining Laser', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 980,
    description: 'Not designed for combat, but it works.',
    icon: ' L ',
    image: 'images/zone-items/miningLaser.png',
    imageGenPrompt: 'A handheld industrial mining laser, repurposed as a weapon.',
    forgeAttributes: { '5': 'power_t6', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
};
