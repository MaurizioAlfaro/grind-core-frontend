

export interface AttributeTier {
  level: number;
  description: string;
}

export interface GameAttribute {
  id: string;
  name: string;
  category: string;
  type: 'Trait' | 'Passive' | 'Consumable';
  baseDescription: string;
  tiers: AttributeTier[];
}

export const GAME_ATTRIBUTES: GameAttribute[] = [];