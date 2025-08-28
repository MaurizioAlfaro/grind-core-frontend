import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const hospitalBedItems: { [key: string]: Item } = {
  'hospital_iv_stand': { id: 'hospital_iv_stand', name: 'IV Stand', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 35, description: 'A surprisingly effective polearm.', icon: '⚚', image: 'images/zone-items/ivStand.png', imageGenPrompt: 'An IV drip stand being wielded like a spear.', forgeAttributes: { '5': 'power_t2', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'hospital_patient_gown': { id: 'hospital_patient_gown', name: 'Patient Gown', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 32, description: 'Offers little protection and even less dignity.', icon: '🥋', image: 'images/zone-items/patientGown.png', imageGenPrompt: 'A standard-issue, light blue hospital gown with an open back.', forgeAttributes: { '5': 'power_t2', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'hospital_heart_monitor': { id: 'hospital_heart_monitor', name: 'Heart Monitor Amulet', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 25, description: 'Beeps in time with your own nervous heart.', icon: '💓', image: 'images/zone-items/heartMonitor.png', imageGenPrompt: 'A small, wearable heart monitor that displays a green ECG line, worn as a necklace.', forgeAttributes: { '5': 'gold_t1', '10': 'xp_t1', '15': 'perm_perk_amulet' } },
  'hospital_doctors_stethoscope': { id: 'hospital_doctors_stethoscope', name: 'Doctor\'s Stethoscope', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 28, description: 'Allows you to hear the secret heart of the world.', icon: '🩺', image: 'images/zone-items/stethoscope.png', imageGenPrompt: 'A doctor\'s stethoscope that glows with an inner light.', forgeAttributes: { '5': 'gold_t2', '10': 'loot_t2', '15': 'perm_perk_misc' } },
  'hospital_scalpel': { id: 'hospital_scalpel', name: 'Scalpel', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 45,
    description: 'For making precise incisions.',
    icon: ' S ',
    image: 'images/zone-items/scalpel.png',
    imageGenPrompt: 'A gleaming, sharp surgical scalpel.',
    forgeAttributes: { '5': 'power_t2', '10': 'xp_t2', '15': 'perm_perk_weapon' } },
  'hospital_heartbeat_ring': { id: 'hospital_heartbeat_ring', name: 'Heartbeat Ring', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 22,
    description: 'A ring that pulses with a steady, calming rhythm.',
    icon: ' H ',
    image: 'images/zone-items/heartbeatRing.png',
    imageGenPrompt: 'A ring with an embedded screen displaying a green ECG heartbeat.',
    forgeAttributes: { '5': 'power_t2', '10': 'loot_t1', '15': 'perm_perk_ring' } },
  'hospital_surgical_mask': { id: 'hospital_surgical_mask', name: 'Surgical Mask', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 18,
    description: 'Hides your identity and protects you from germs.',
    icon: ' M ',
    image: 'images/zone-items/surgicalMask.png',
    imageGenPrompt: 'A standard blue surgical mask.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
};
