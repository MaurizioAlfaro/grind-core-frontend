import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const crashSiteItems: { [key: string]: Item } = {
  'crash_site_blaster': { id: 'crash_site_blaster', name: 'Alien Blaster', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 60, description: 'Confiscated from a "weather balloon" incident.', icon: '🔫', image: 'images/zone-items/alienBlaster.png', imageGenPrompt: 'A retro-futuristic ray gun with glowing green parts.', forgeAttributes: { '5': 'power_t3', '10': 'xp_t2', '15': 'perm_perk_weapon' } },
  'crash_site_plating': { id: 'crash_site_plating', name: 'UFO Plating', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 55, description: 'A piece of an alien ship\'s hull. Impossibly light and strong.', icon: '🛡️', image: 'images/zone-items/ufoPlating.png', imageGenPrompt: 'A piece of curved, metallic alien ship wreckage fashioned into a chestplate.', forgeAttributes: { '5': 'power_t3', '10': 'gold_t2', '15': 'perm_perk_armor' } },
  'crash_site_energy_core': { id: 'crash_site_energy_core', name: 'Energy Core', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 45, description: 'Warm to the touch and hums a strange tune.', icon: '💡', image: 'images/zone-items/energyCore.png', imageGenPrompt: 'A glowing, pulsating alien energy core.', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'crash_site_zero_point_module': { id: 'crash_site_zero_point_module', name: 'Zero-Point Module', rarity: ItemRarity.Legendary, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 50, description: 'An almost infinite power source in a pocket-sized package.', icon: '💠', image: 'images/zone-items/zeroPointModule.png', imageGenPrompt: 'A crystalline device that contains a miniature, swirling galaxy. It radiates immense power.', forgeAttributes: { '5': 'gold_t3', '10': 'xp_t3', '15': 'perm_perk_amulet' } },
  'crash_site_scrap_metal': { id: 'crash_site_scrap_metal', name: 'Scrap Metal', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 52,
    description: 'A sharp piece of wreckage.',
    icon: ' S ',
    image: 'images/zone-items/scrapMetal.png',
    imageGenPrompt: 'A jagged piece of twisted metal, sharp enough to be a weapon.',
    forgeAttributes: { '5': 'power_t3', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'crash_site_tattered_parachute': { id: 'crash_site_tattered_parachute', name: 'Tattered Parachute', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 48,
    description: 'Didn\'t work for the last guy, but it makes a decent cloak.',
    icon: ' P ',
    image: 'images/zone-items/tatteredParachute.png',
    imageGenPrompt: 'A torn and tattered parachute worn as a makeshift cloak.',
    forgeAttributes: { '5': 'power_t2', '10': 'gold_t1', '15': 'perm_perk_armor' } },
};
