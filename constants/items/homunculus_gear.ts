
import type { HomunculusClothingItem } from '../../types';
import { ItemRarity, ItemType, ItemCategory, HomunculusEquipmentSlot } from '../../types';

export const HOMUNCULUS_CLOTHING: { [key: string]: HomunculusClothingItem & { cost: number } } = {
  // Head
  'top_hat': { id: 'top_hat', name: 'Top Hat', rarity: ItemRarity.Common, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Head, description: 'A dapper choice for the discerning reptilian.', icon: '🎩', powerBonus: 5, wageBonus: 0.02, cost: 100 },
  'propeller_beanie': { id: 'propeller_beanie', name: 'Propeller Beanie', rarity: ItemRarity.Rare, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Head, description: 'It actually spins! Increases Speed trait slightly.', icon: '🧢', powerBonus: 15, wageBonus: 0.05, cost: 500 },
  'crown': { id: 'crown', name: 'Crown', rarity: ItemRarity.Legendary, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Head, description: 'For the true ruler of the conspiracy.', icon: '👑', powerBonus: 100, wageBonus: 0.15, cost: 5000 },

  // Eyes
  'sunglasses': { id: 'sunglasses', name: 'Sunglasses', rarity: ItemRarity.Common, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Eyes, description: 'Keeps a low profile. Or tries to.', icon: '😎', powerBonus: 5, wageBonus: 0.02, cost: 100 },
  'monocle': { id: 'monocle', name: 'Monocle', rarity: ItemRarity.Epic, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Eyes, description: 'For inspecting clues with a touch of class.', icon: '🧐', powerBonus: 50, wageBonus: 0.10, cost: 2000 },
  'laser_visor': { id: 'laser_visor', name: 'Laser Visor', rarity: ItemRarity.Legendary, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Eyes, description: 'Pew pew!', icon: '🤖', powerBonus: 120, wageBonus: 0.12, cost: 6000 },

  // Mouth
  'bubblegum': { id: 'bubblegum', name: 'Bubblegum', rarity: ItemRarity.Common, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Mouth, description: 'All out of bubblegum.', icon: '💭', powerBonus: 3, wageBonus: 0.03, cost: 80 },
  'vampire_fangs': { id: 'vampire_fangs', name: 'Vampire Fangs', rarity: ItemRarity.Rare, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Mouth, description: 'I vant to infiltrate your government.', icon: '🧛', powerBonus: 20, wageBonus: 0.04, cost: 600 },
  'golden_grill': { id: 'golden_grill', name: 'Golden Grill', rarity: ItemRarity.Epic, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Mouth, description: 'Bling for your bite.', icon: '😬', powerBonus: 60, wageBonus: 0.08, cost: 2500 },

  // Outfit
  'business_tie': { id: 'business_tie', name: 'Business Tie', rarity: ItemRarity.Common, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Outfit, description: 'Essential for corporate espionage.', icon: '👔', powerBonus: 8, wageBonus: 0.05, cost: 200 },
  'superhero_cape': { id: 'superhero_cape', name: 'Superhero Cape', rarity: ItemRarity.Rare, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Outfit, description: 'Not all heroes wear capes. This one does.', icon: '🦸', powerBonus: 25, wageBonus: 0.06, cost: 800 },
  'diamond_chain': { id: 'diamond_chain', name: 'Diamond Chain', rarity: ItemRarity.Legendary, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Outfit, description: 'The ultimate status symbol in the underworld.', icon: '💎', powerBonus: 150, wageBonus: 0.20, cost: 10000 },

  // Tail
  'tail_bow': { id: 'tail_bow', name: 'Tail Bow', rarity: ItemRarity.Common, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Tail, description: 'A cute little bow.', icon: '🎀', powerBonus: 2, wageBonus: 0.01, cost: 50 },
  'spiked_tail_cuff': { id: 'spiked_tail_cuff', name: 'Spiked Tail Cuff', rarity: ItemRarity.Rare, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Tail, description: 'Adds a punk rock vibe.', icon: '⛓️', powerBonus: 18, wageBonus: 0.03, cost: 550 },
  'rocket_tail': { id: 'rocket_tail', name: 'Rocket Tail', rarity: ItemRarity.Epic, type: ItemType.HomunculusClothing, category: ItemCategory.HomunculusGear, slot: HomunculusEquipmentSlot.Tail, description: 'For a quick getaway. Do not ignite indoors.', icon: '🚀', powerBonus: 75, wageBonus: 0.07, cost: 3000 },
};
