import type { Item } from '../../../types';
import { ItemRarity, ItemType, EquipmentSlot, ItemCategory } from '../../../types';

export const postOfficeItems: { [key: string]: Item } = {
  'post_office_opener': { id: 'post_office_opener', name: 'Letter Opener', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Weapon, power: 15, description: 'For opening mail and enemies.', icon: '🗡️', image: 'images/attributes/weapon/letterOpener.jpeg', imageGenPrompt: 'A sharp, metallic letter opener, held like a dagger.', forgeAttributes: { '5': 'power_t1', '10': 'xp_t1', '15': 'perm_perk_weapon' } },
  'post_office_uniform': { id: 'post_office_uniform', name: 'Mail Carrier Uniform', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Armor, power: 14, description: 'Neither rain, nor sleet, nor psychic assault...', icon: ' U ', image: 'images/attributes/armor/mailUniform.jpeg', imageGenPrompt: 'A classic blue postal worker shirt and shorts.', forgeAttributes: { '5': 'power_t1', '10': 'gold_t1', '15': 'perm_perk_armor' } },
  'post_office_rubber_band_ball': { id: 'post_office_rubber_band_ball', name: 'Rubber Band Ball', rarity: ItemRarity.Common, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 10, description: 'A dense sphere of potential energy and broken promises.', icon: ' B ', image: 'images/attributes/misc/rubberBandBall.jpeg', imageGenPrompt: 'A large, tightly wound ball of rubber bands.', forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'post_office_signet_ring': { id: 'post_office_signet_ring', name: 'Signet Ring', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Ring, power: 10, description: 'Bears a symbol you don\'t recognize, but others do.', icon: '💍', image: 'images/attributes/ring/signetRing.jpeg', imageGenPrompt: 'A gold ring with a strange, owl-like symbol.', forgeAttributes: { '5': 'power_t1', '10': 'loot_t1', '15': 'perm_perk_ring' } },
  'post_office_junk_mail': { id: 'post_office_junk_mail', name: 'Junk Mail', rarity: ItemRarity.Rare, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Misc, power: 8,
    description: 'You\'ve been pre-approved for a new credit card and a new world order.',
    icon: ' J ',
    image: 'images/attributes/misc/junkMail.jpeg',
    imageGenPrompt: 'A stack of glossy, colorful junk mail letters.',
    forgeAttributes: { '5': 'gold_t1', '10': 'loot_t1', '15': 'perm_perk_misc' } },
  'post_office_certified_locket': { id: 'post_office_certified_locket', name: 'Certified Locket', rarity: ItemRarity.Epic, type: ItemType.Equipable, category: ItemCategory.Standard, slot: EquipmentSlot.Amulet, power: 15,
    description: 'A locket that guarantees its secrets are delivered.',
    icon: ' C ',
    image: 'images/attributes/amulet/certifiedLocket.jpeg',
    imageGenPrompt: 'A locket with a certified mail sticker on it, hanging from a chain.',
    forgeAttributes: { '5': 'gold_t2', '10': 'xp_t2', '15': 'perm_perk_amulet' } },
};
