
import type { Item, FoodItem } from '../types';
import { utilityItems } from './items/utility';
import { consumableItems } from './items/consumables';
import { FOOD_ITEMS } from './items/food';
import { reptilianParts } from './items/reptilian_parts';
import { HOMUNCULUS_CLOTHING } from './items/homunculus_gear';
import { zoneItems } from './items/zone_items/_barrel';
import { bossItems } from './items/boss_items';

export { FOOD_ITEMS };

export const ITEMS: { [key: string]: Item } = {
  ...utilityItems,
  ...consumableItems,
  ...HOMUNCULUS_CLOTHING,
  ...reptilianParts,
  ...FOOD_ITEMS,
  ...zoneItems,
  ...bossItems,
};
