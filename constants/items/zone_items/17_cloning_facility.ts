import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const cloningFacilityItems: { [key: string]: Item } = {
  'cloning_facility_bone_saw': { id: 'cloning_facility_bone_saw', name: 'Bone Saw', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 240, description: 'For when things get messy.', icon: '🔪', forgeAttributes: { '5': 'power_t4', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'cloning_facility_reinforced_labcoat': { id: 'cloning_facility_reinforced_labcoat', name: 'Reinforced Lab Coat', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 230, description: 'Resists acid, lasers, and existential dread.', icon: '🥼', forgeAttributes: { '5': 'power_t4', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'cloning_facility_specimen_jar': { id: 'cloning_facility_specimen_jar', name: 'Specimen Jar', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 200, description: 'Contains something with way too many eyes.', icon: '🏺', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'cloning_facility_scalpel': { id: 'cloning_facility_scalpel', name: 'Genetic Scalpel', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 1100, description: 'Cuts not the flesh, but the code of life itself.', icon: '🔪', image: 'images/attributes/weapon/geneticScalpel.jpeg', imageGenPrompt: 'A scalpel that glows with a blue, digital light, humming with energy.', forgeAttributes: { '5': 'power_t6', '10': 'xp_t2', '15': 'perm_perk_weapon' } },
  'cloning_facility_test_tube': { id: 'cloning_facility_test_tube', name: 'Test Tube', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 180,
    description: 'Filled with a glowing green liquid. Probably best not to drink it.',
    icon: '🧪',
    image: 'images/attributes/misc/testTube.jpeg',
    imageGenPrompt: 'A glass test tube filled with a bubbling, glowing green liquid.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'cloning_facility_petri_dish': { id: 'cloning_facility_petri_dish', name: 'Petri Dish', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 170,
    description: 'Something is growing in here. It seems to be watching you.',
    icon: ' P ',
    image: 'images/attributes/amulet/petriDish.jpeg',
    imageGenPrompt: 'A petri dish containing a strange, pulsating culture, worn as an amulet.',
    forgeAttributes: { '5': 'gold_t1', '10': 'xp_t1', '15': 'perm_perk_amulet' } },
  'cloning_facility_dna_sequencer': { id: 'cloning_facility_dna_sequencer', name: 'DNA Sequencer', rarity: ItemRarity.Legendary, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 250,
    description: 'A handheld device that can map the genome of any living thing.',
    icon: ' D ',
    image: 'images/attributes/misc/dnaSequencer.jpeg',
    imageGenPrompt: 'A futuristic handheld DNA sequencing device.',
    forgeAttributes: { '5': 'gold_t3', '10': 'loot_t3', '15': 'perm_perk_misc' } },
};
